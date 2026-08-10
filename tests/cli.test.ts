import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execute = promisify(execFile);

test("compiled CLI initializes, validates, starts, and reports status", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "aieos-cli-"));
  const charter = join(projectRoot, "charter.md");
  const cli = join(process.cwd(), "dist", "src", "cli.js");
  await writeFile(charter, "# CLI Fixture Charter\n", "utf8");

  const initialized = await execute(process.execPath, [
    cli,
    "--project",
    projectRoot,
    "init",
    "cli-fixture"
  ]);
  assert.match(initialized.stdout, /Initialized AI-EOS/);
  const configPath = join(projectRoot, "ai-eos", "config", "project.yaml");
  const config = await import("node:fs/promises").then(({ readFile }) =>
    readFile(configPath, "utf8")
  );
  await writeFile(
    configPath,
    config
      .replace("provider: codex-cli", "provider: fake")
      .replace("model: default", "model: deterministic-fixture"),
    "utf8"
  );

  const validated = await execute(process.execPath, [
    cli,
    "--project",
    projectRoot,
    "validate"
  ]);
  assert.match(validated.stdout, /Valid configuration for cli-fixture/);

  const started = await execute(process.execPath, [
    cli,
    "--project",
    projectRoot,
    "run",
    "start",
    "charter.md"
  ]);
  assert.match(started.stdout, /Status: awaiting_approval/);
  assert.match(started.stdout, /Founder Architecture Approval/);

  const runId = started.stdout.match(/Run: (run_[^\n]+)/)?.[1];
  assert.ok(runId);

  const status = await execute(process.execPath, [
    cli,
    "--project",
    projectRoot,
    "run",
    "status",
    runId
  ]);
  assert.match(status.stdout, /Status: awaiting_approval/);
});

test("compiled CLI starts Product Discovery and reports the question set", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "aieos-discovery-cli-"));
  const idea = join(projectRoot, "idea.md");
  const cli = join(process.cwd(), "dist", "src", "cli.js");
  await writeFile(idea, "# Idea\n\nHelp founders validate product ideas.\n", "utf8");
  await execute(process.execPath, [
    cli,
    "--project",
    projectRoot,
    "init",
    "discovery-fixture"
  ]);
  const configPath = join(projectRoot, "ai-eos", "config", "project.yaml");
  const config = await import("node:fs/promises").then(({ readFile }) =>
    readFile(configPath, "utf8")
  );
  await writeFile(
    configPath,
    config.replace("provider: codex-cli", "provider: fake"),
    "utf8"
  );

  const started = await execute(process.execPath, [
    cli,
    "--project",
    projectRoot,
    "discovery",
    "start",
    "idea.md"
  ]);
  assert.match(started.stdout, /Status: awaiting_input/);
  assert.match(started.stdout, /founder-discovery-questions/);
  const runId = started.stdout.match(/Run: (run_[^\n]+)/)?.[1];
  assert.ok(runId);
  const questions = await execute(process.execPath, [
    cli,
    "--project",
    projectRoot,
    "discovery",
    "questions",
    runId
  ]);
  assert.match(questions.stdout, /\.questions\.json/);
});
