import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type {
  InvocationRequest,
  Provider,
  ProviderResult
} from "../src/domain.js";
import { buildCodexArgs } from "../src/providers/codex-cli.js";
import { FakeProvider } from "../src/providers/fake.js";
import { Runtime } from "../src/runtime.js";
import { FileStore } from "../src/store.js";

async function fixture(): Promise<{
  root: string;
  charter: string;
  store: FileStore;
}> {
  const root = await mkdtemp(join(tmpdir(), "aieos-test-"));
  const store = new FileStore(root);
  await store.initialize("test-project");
  const charter = join(root, "charter.md");
  await writeFile(charter, "# Approved Charter\n\nBuild the fixture.\n", "utf8");
  return { root, charter, store };
}

test("starts deterministically and halts at architecture approval", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());

  const state = await runtime.start(charter);

  assert.equal(state.status, "awaiting_approval");
  assert.equal(state.pendingApproval?.stageId, "architecture");
  assert.deepEqual(state.completedStages, ["research", "architecture"]);

  const events = await readFile(
    join(store.runDir(state.runId), "events.jsonl"),
    "utf8"
  );
  assert.match(events, /"type":"gate.awaiting"/);
});

test("completes the full flow through three explicit approvals", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());

  let state = await runtime.start(charter);
  assert.equal(state.pendingApproval?.stageId, "architecture");

  state = await runtime.approve(state.runId, "Architecture accepted.");
  assert.equal(state.pendingApproval?.stageId, "documentation-alignment");

  state = await runtime.approve(state.runId, "Documentation aligned.");
  assert.equal(state.pendingApproval?.stageId, "verification");

  state = await runtime.approve(state.runId, "MVP flow verified.");
  assert.equal(state.status, "completed");
  assert.equal(state.completedStages.length, 7);

  const report = await readFile(
    join(store.runDir(state.runId), "final-report.md"),
    "utf8"
  );
  assert.match(report, /Status: \*\*completed\*\*/);
  assert.match(report, /No commit, push, merge, deploy/);
});

test("invalidates approval when a gated artifact changes", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());
  const state = await runtime.start(charter);
  const artifact = join(
    store.runDir(state.runId),
    "stages",
    "architecture",
    "artifact.md"
  );
  await writeFile(artifact, "# Tampered\n", "utf8");

  await assert.rejects(
    runtime.approve(state.runId),
    /Approval invalidated because artifact changed/
  );
  assert.equal((await runtime.status(state.runId)).status, "awaiting_approval");
});

test("resumes a failed provider invocation without losing prior stages", async () => {
  const { charter, store } = await fixture();
  const provider = new FailOnceProvider();
  const runtime = new Runtime(store, provider);

  let state = await runtime.start(charter);
  assert.equal(state.status, "failed");
  assert.equal(state.stageIndex, 0);

  state = await runtime.resume(state.runId);
  assert.equal(state.status, "awaiting_approval");
  assert.equal(state.pendingApproval?.stageId, "architecture");
  assert.deepEqual(state.completedStages, ["research", "architecture"]);
  assert.equal(state.attemptByStage.research, 2);
});

test("persists only declared context sources for each stage", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());
  const state = await runtime.start(charter);

  const researchManifest = JSON.parse(
    await readFile(
      join(
        store.runDir(state.runId),
        "stages",
        "research",
        "attempt-1",
        "context-manifest.json"
      ),
      "utf8"
    )
  ) as Array<{ path: string }>;
  const architectureManifest = JSON.parse(
    await readFile(
      join(
        store.runDir(state.runId),
        "stages",
        "architecture",
        "attempt-1",
        "context-manifest.json"
      ),
      "utf8"
    )
  ) as Array<{ path: string }>;

  assert.equal(researchManifest.length, 1);
  assert.equal(researchManifest[0]?.path, charter);
  assert.equal(architectureManifest.length, 2);
  assert.match(architectureManifest[1]?.path ?? "", /stages\/research/);
});

test("Codex CLI invocation is ephemeral, read-only, and schema constrained", () => {
  const args = buildCodexArgs({
    projectRoot: "/project",
    model: "default",
    schemaPath: "/tmp/schema.json",
    outputPath: "/tmp/output.json",
    sandbox: "read-only"
  });

  assert.deepEqual(args.slice(0, 5), [
    "exec",
    "--ephemeral",
    "--sandbox",
    "read-only",
    "--color"
  ]);
  assert.ok(args.includes("--output-schema"));
  assert.ok(args.includes("--output-last-message"));
  assert.ok(!args.includes("--dangerously-bypass-approvals-and-sandbox"));
  assert.ok(!args.includes("danger-full-access"));
  assert.ok(!args.includes("--model"));
});

test("Codex Implementation uses workspace-write without bypass flags", () => {
  const args = buildCodexArgs({
    projectRoot: "/project",
    model: "default",
    schemaPath: "/tmp/schema.json",
    outputPath: "/tmp/output.json",
    sandbox: "workspace-write"
  });
  const sandboxIndex = args.indexOf("--sandbox");
  assert.equal(args[sandboxIndex + 1], "workspace-write");
  assert.ok(!args.includes("--dangerously-bypass-approvals-and-sandbox"));
  assert.ok(!args.includes("danger-full-access"));
});

test("halts instead of opening a gate when a stage reports needs_changes", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new NeedsChangesProvider());

  const state = await runtime.start(charter);

  assert.equal(state.status, "failed");
  assert.equal(state.stageIndex, 0);
  assert.match(state.lastError ?? "", /outcome needs_changes/);
  assert.equal(state.pendingApproval, undefined);
});

class FailOnceProvider implements Provider {
  readonly name = "fail-once";
  private failed = false;
  private readonly delegate = new FakeProvider();

  async invoke(request: InvocationRequest): Promise<ProviderResult> {
    if (!this.failed) {
      this.failed = true;
      throw new Error("Simulated provider outage.");
    }
    return this.delegate.invoke(request);
  }
}

class NeedsChangesProvider implements Provider {
  readonly name = "needs-changes";

  async invoke(request: InvocationRequest): Promise<ProviderResult> {
    const now = new Date().toISOString();
    return {
      provider: this.name,
      model: "fixture",
      output: {
        outcome: "needs_changes",
        summary: "Required evidence is missing.",
        findings: [],
        decisions: [],
        nextActions: ["Revise the prior stage."]
      },
      raw: {},
      startedAt: now,
      completedAt: now
    };
  }
}
