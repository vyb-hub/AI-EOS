import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type {
  InvocationRequest,
  Provider,
  ProviderResult,
  StageId
} from "../src/domain.js";
import { buildCodexArgs, CodexCliProvider } from "../src/providers/codex-cli.js";
import { validateEvidence } from "../src/evidence.js";
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

  assert.deepEqual(args.slice(0, 6), [
    "exec",
    "--ephemeral",
    "--ignore-user-config",
    "--sandbox",
    "read-only",
    "--color"
  ]);
  assert.ok(args.includes("--output-schema"));
  assert.ok(args.includes("--output-last-message"));
  assert.ok(!args.includes("--dangerously-bypass-approvals-and-sandbox"));
  assert.ok(!args.includes("danger-full-access"));
  assert.ok(!args.includes("--model"));
  assert.ok(args.includes("computer_use"));
  assert.equal(
    args[args.lastIndexOf("standalone_web_search") - 1],
    "--disable"
  );
});

test("Codex CLI provider returns schema-invalid output as-is instead of validating it", async () => {
  const root = await mkdtemp(join(tmpdir(), "aieos-codex-fixture-"));
  const scriptPath = join(root, "fake-codex");
  await writeFile(
    scriptPath,
    [
      "#!/usr/bin/env node",
      "const fs = require('fs');",
      "const args = process.argv.slice(2);",
      "const outPath = args[args.indexOf('--output-last-message') + 1];",
      "fs.writeFileSync(outPath, JSON.stringify({",
      "  outcome: 'completed',",
      "  summary: '',", // violates stageOutputSchema's summary.min(1)
      "  findings: [],",
      "  decisions: [],",
      "  nextActions: [],",
      "  questions: [],",
      "  sources: [],",
      "  claims: []",
      "}));",
      ""
    ].join("\n"),
    "utf8"
  );
  await chmod(scriptPath, 0o755);

  const provider = new CodexCliProvider(root, "default", scriptPath, 5_000);
  const result = await provider.invoke({
    invocationId: "inv_test",
    runId: "run_test",
    stage: {
      id: "research",
      role: "research_ai",
      contextSources: ["charter"],
      gateAfter: false,
      maxAttempts: 2
    },
    roleInstructions: "Act only as research_ai.",
    context: []
  });

  assert.equal(result.output.summary, "");
});

test("persists every failed attempt and retries automatically up to maxAttempts on schema-invalid output", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new InvalidOutputProvider());

  const state = await runtime.start(charter);

  assert.equal(state.status, "failed");
  assert.equal(state.attemptByStage.research, 2);
  assert.match(state.lastError ?? "", /failed validation after 2 attempt\(s\)/);

  for (const attempt of [1, 2]) {
    const validation = JSON.parse(
      await readFile(
        join(
          store.runDir(state.runId),
          "stages",
          "research",
          `attempt-${attempt}`,
          "validation.json"
        ),
        "utf8"
      )
    ) as { valid: boolean };
    assert.equal(validation.valid, false);

    const output = JSON.parse(
      await readFile(
        join(
          store.runDir(state.runId),
          "stages",
          "research",
          `attempt-${attempt}`,
          "output.json"
        ),
        "utf8"
      )
    ) as { summary: string };
    assert.equal(output.summary, "");
  }
});

test("Product Discovery waits for Founder input and completes four gates", async () => {
  const { root, charter: idea, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());
  let state = await runtime.startDiscovery(idea, "deep");

  assert.equal(state.status, "awaiting_input");
  assert.equal(
    state.pendingInput?.stageId,
    "founder-discovery-questions"
  );
  const responsePath = join(root, "founder-response.json");
  await writeFile(
    responsePath,
    `${JSON.stringify({
      schemaVersion: 1,
      responseId: "response_001",
      questionSetId: state.pendingInput?.questionSetId,
      runId: state.runId,
      actor: "founder",
      submittedAt: new Date().toISOString(),
      answers: { "Q-001": "Independent software founders" }
    })}\n`,
    "utf8"
  );

  state = await runtime.respond(state.runId, responsePath);
  assert.equal(state.pendingApproval?.stageId, "founder-intent");
  state = await runtime.approve(state.runId);
  assert.equal(state.pendingApproval?.stageId, "opportunity-risk");
  state = await runtime.approve(state.runId);
  assert.equal(state.pendingApproval?.stageId, "product-strategy");
  state = await runtime.approve(state.runId);
  assert.equal(state.pendingApproval?.stageId, "product-readiness-review");
  state = await runtime.approve(state.runId);
  assert.equal(state.status, "completed");
  assert.equal(state.flowId, "product-discovery");
  assert.equal(state.completedStages.length, 10);

  const sources = JSON.parse(
    await readFile(
      join(store.runDir(state.runId), "evidence", "sources.json"),
      "utf8"
    )
  ) as unknown[];
  assert.equal(sources.length, 1);
  assert.match(
    await readFile(
      join(
        store.runDir(state.runId),
        "handoff",
        "engineering-charter.md"
      ),
      "utf8"
    ),
    /Proposed — pending Strategic AI review and Founder approval/
  );
});

test("Fast discovery persists an immediate brief and uses two Founder gates", async () => {
  const { root, charter: idea, store } = await fixture();
  const progress: string[] = [];
  const provider = new RecordingProvider();
  const runtime = new Runtime(
    store,
    provider,
    (message) => progress.push(message)
  );
  let state = await runtime.startDiscovery(idea);
  assert.equal(state.discoveryMode, "fast");
  assert.match(
    await readFile(join(store.runDir(state.runId), "idea-brief.md"), "utf8"),
    /Immediate Idea Brief/
  );
  assert.ok(progress.some((message) => message.includes("Idea Brief ready")));
  const responsePath = join(root, "fast-response.json");
  await writeFile(
    responsePath,
    `${JSON.stringify({
      schemaVersion: 1,
      responseId: "response_fast",
      questionSetId: state.pendingInput?.questionSetId,
      runId: state.runId,
      actor: "founder",
      submittedAt: new Date().toISOString(),
      answers: { "Q-001": "Founders" }
    })}\n`,
    "utf8"
  );
  state = await runtime.respond(state.runId, responsePath);
  assert.equal(state.pendingApproval?.stageId, "founder-intent");
  state = await runtime.approve(state.runId);
  assert.equal(state.pendingApproval?.stageId, "product-readiness-review");
  state = await runtime.approve(state.runId);
  assert.equal(state.status, "completed");
  assert.deepEqual(state.completedStages, [
    "founder-discovery-questions",
    "founder-intent",
    "market-research",
    "opportunity-risk",
    "product-readiness-review"
  ]);
  assert.deepEqual(provider.stageIds, state.completedStages);
  assert.equal(provider.stageIds.length, 5);

  const events = await readFile(
    join(store.runDir(state.runId), "events.jsonl"),
    "utf8"
  );
  for (const skipped of [
    "product-strategy",
    "product-requirements",
    "user-journey",
    "engineering-charter-handoff",
    "product-knowledge-capture"
  ]) {
    assert.match(
      events,
      new RegExp(`"type":"stage.skipped".*"stageId":"${skipped}"`)
    );
  }
  await assert.rejects(
    readFile(join(store.runDir(state.runId), "handoff", "engineering-charter.md")),
    /ENOENT/
  );
});

test("persists stage performance metrics for successful provider attempts", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());

  const state = await runtime.start(charter);
  const invocation = JSON.parse(
    await readFile(
      join(
        store.runDir(state.runId),
        "stages",
        "research",
        "attempt-1",
        "invocation.json"
      ),
      "utf8"
    )
  ) as Record<string, unknown>;

  assert.equal(typeof invocation.startedAt, "string");
  assert.equal(typeof invocation.completedAt, "string");
  assert.equal(typeof invocation.durationMs, "number");
  assert.equal(typeof invocation.providerDurationMs, "number");
  assert.equal(invocation.contextDocumentCount, 1);
  assert.equal(typeof invocation.contextBytes, "number");
  assert.equal(typeof invocation.outputBytes, "number");

  const events = (await readFile(
    join(store.runDir(state.runId), "events.jsonl"),
    "utf8"
  ))
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as { type: string; details: object });
  const completed = events.find((event) => event.type === "stage.completed");
  assert.ok(completed);
  assert.equal(
    typeof (completed.details as { durationMs?: unknown }).durationMs,
    "number"
  );
});

test("records provider failure duration before halting a run", async () => {
  const { charter, store } = await fixture();
  const runtime = new Runtime(store, new AlwaysFailProvider());

  const state = await runtime.start(charter);
  assert.equal(state.status, "failed");

  const events = (await readFile(
    join(store.runDir(state.runId), "events.jsonl"),
    "utf8"
  ))
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as { type: string; details: object });
  const providerFailure = events.find(
    (event) => event.type === "stage.provider_failed"
  );
  assert.ok(providerFailure);
  assert.equal(
    typeof (providerFailure.details as { providerDurationMs?: unknown })
      .providerDurationMs,
    "number"
  );
});

test("Research Evidence Approval is invalidated when evidence changes", async () => {
  const { root, charter: idea, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());
  let state = await runtime.startDiscovery(idea, "deep");
  const responsePath = join(root, "founder-response.json");
  await writeFile(
    responsePath,
    `${JSON.stringify({
      schemaVersion: 1,
      responseId: "response_evidence",
      questionSetId: state.pendingInput?.questionSetId,
      runId: state.runId,
      actor: "founder",
      submittedAt: new Date().toISOString(),
      answers: { "Q-001": "Founders" }
    })}\n`,
    "utf8"
  );
  state = await runtime.respond(state.runId, responsePath);
  state = await runtime.approve(state.runId);
  assert.equal(state.pendingApproval?.stageId, "opportunity-risk");
  await writeFile(
    store.evidencePaths(state.runId).claims,
    "[]\n",
    "utf8"
  );
  await assert.rejects(
    runtime.approve(state.runId),
    /Approval invalidated because artifact changed/
  );
});

test("rejects stale or incomplete Founder responses without changing state", async () => {
  const { root, charter: idea, store } = await fixture();
  const runtime = new Runtime(store, new FakeProvider());
  const state = await runtime.startDiscovery(idea, "deep");
  const responsePath = join(root, "invalid-response.json");
  await writeFile(
    responsePath,
    `${JSON.stringify({
      schemaVersion: 1,
      responseId: "response_bad",
      questionSetId: "questions_stale",
      runId: state.runId,
      actor: "founder",
      submittedAt: new Date().toISOString(),
      answers: {}
    })}\n`,
    "utf8"
  );
  await assert.rejects(runtime.respond(state.runId, responsePath), /stale/);
  assert.equal((await runtime.status(state.runId)).status, "awaiting_input");
});

test("evidence validator rejects unsupported facts and dangling citations", () => {
  const source = {
    sourceId: "S-001",
    title: "Source",
    url: "https://example.com",
    publisher: "Example",
    retrievedAt: new Date().toISOString(),
    sourceType: "official",
    quality: "high",
    qualityJustification: "Primary source."
  };
  const claim = {
    claimId: "C-001",
    statement: "Claim",
    provenance: "external_fact",
    sourceIds: ["S-404"],
    founderInputIds: [],
    derivedFromClaimIds: [],
    confidence: "medium",
    status: "active"
  };
  assert.throws(
    () => validateEvidence([source], [claim]),
    /missing source S-404/
  );
});

test("only Market Research enables Codex web research", () => {
  const args = buildCodexArgs({
    projectRoot: "/project",
    model: "default",
    schemaPath: "/tmp/schema.json",
    outputPath: "/tmp/output.json",
    sandbox: "read-only",
    networkAccess: true
  });
  assert.equal(
    args[args.lastIndexOf("standalone_web_search") - 1],
    "--enable"
  );
  assert.ok(args.includes("--ignore-user-config"));
  assert.ok(!args.includes("--dangerously-bypass-approvals-and-sandbox"));
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

class InvalidOutputProvider implements Provider {
  readonly name = "invalid-output";

  async invoke(request: InvocationRequest): Promise<ProviderResult> {
    const now = new Date().toISOString();
    return {
      provider: this.name,
      model: "fixture",
      output: {
        outcome: "completed",
        summary: "", // violates stageOutputSchema's summary.min(1)
        findings: [],
        decisions: [],
        nextActions: []
      } as unknown as ProviderResult["output"],
      raw: {},
      startedAt: now,
      completedAt: now
    };
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

class AlwaysFailProvider implements Provider {
  readonly name = "always-fail";

  async invoke(_request: InvocationRequest): Promise<ProviderResult> {
    throw new Error("Simulated persistent provider failure.");
  }
}

class RecordingProvider implements Provider {
  readonly name = "recording";
  readonly stageIds: StageId[] = [];
  private readonly delegate = new FakeProvider();

  async invoke(request: InvocationRequest): Promise<ProviderResult> {
    this.stageIds.push(request.stage.id);
    return this.delegate.invoke(request);
  }
}
