#!/usr/bin/env node
import { basename, resolve } from "node:path";
import { Command } from "commander";
import { CodexCliProvider } from "./providers/codex-cli.js";
import { FakeProvider } from "./providers/fake.js";
import { Runtime } from "./runtime.js";
import { FileStore } from "./store.js";
import type { DiscoveryMode } from "./domain.js";

const program = new Command();

program
  .name("aieos")
  .description("AI-EOS local governed engineering runtime")
  .version("0.1.0")
  .option("-p, --project <path>", "project root", process.cwd());

program
  .command("init")
  .argument("[name]", "project name")
  .action(async (name?: string) => {
    const root = projectRoot();
    const store = new FileStore(root);
    await store.initialize(name ?? basename(root));
    console.log(`Initialized AI-EOS in ${store.eosRoot}`);
  });

program.command("validate").action(async () => {
  const store = new FileStore(projectRoot());
  const config = await store.loadConfig();
  console.log(`Valid configuration for ${config.project.name}.`);
});

const run = program.command("run");
const discovery = program.command("discovery");

run
  .command("start")
  .argument("<charter-path>")
  .action(async (charterPath: string) => {
    const runtime = await createRuntime();
    const state = await runtime.start(resolve(projectRoot(), charterPath));
    printState(state);
  });

run
  .command("status")
  .argument("<run-id>")
  .action(async (runId: string) => {
    printState(await (await createRuntime()).status(runId));
  });

run
  .command("resume")
  .argument("<run-id>")
  .action(async (runId: string) => {
    printState(await (await createRuntime()).resume(runId));
  });

run
  .command("retry")
  .argument("<run-id>")
  .action(async (runId: string) => {
    printState(await (await createRuntime()).resume(runId));
  });

discovery
  .command("start")
  .argument("<idea-path>")
  .option(
    "--mode <mode>",
    "discovery depth: fast, standard, or deep",
    "fast"
  )
  .action(async (ideaPath: string, options: { mode: string }) => {
    if (!["fast", "standard", "deep"].includes(options.mode)) {
      throw new Error("Discovery mode must be fast, standard, or deep.");
    }
    const runtime = await createRuntime();
    printState(
      await runtime.startDiscovery(
        resolve(projectRoot(), ideaPath),
        options.mode as DiscoveryMode
      )
    );
  });

discovery
  .command("questions")
  .argument("<run-id>")
  .action(async (runId: string) => {
    const state = await (await createRuntime()).status(runId);
    if (!state.pendingInput) {
      throw new Error(`Run ${runId} is not awaiting Founder input.`);
    }
    console.log(Object.keys(state.pendingInput.artifactHashes)[0]);
  });

discovery
  .command("respond")
  .argument("<run-id>")
  .requiredOption("--file <answers-path>")
  .action(async (runId: string, options: { file: string }) => {
    printState(
      await (await createRuntime()).respond(
        runId,
        resolve(projectRoot(), options.file)
      )
    );
  });

discovery
  .command("revise")
  .argument("<run-id>")
  .requiredOption("--file <answers-path>")
  .action(async (runId: string, options: { file: string }) => {
    printState(
      await (await createRuntime()).reviseFounderResponse(
        runId,
        resolve(projectRoot(), options.file)
      )
    );
  });

discovery
  .command("revise-research")
  .argument("<run-id>")
  .requiredOption("--reason <reason>")
  .action(async (runId: string, options: { reason: string }) => {
    printState(
      await (await createRuntime()).reviseResearch(runId, options.reason)
    );
  });

program
  .command("approve")
  .argument("<run-id>")
  .option("--reason <reason>")
  .action(async (runId: string, options: { reason?: string }) => {
    printState(await (await createRuntime()).approve(runId, options.reason));
  });

program
  .command("reject")
  .argument("<run-id>")
  .requiredOption("--reason <reason>")
  .action(async (runId: string, options: { reason: string }) => {
    printState(await (await createRuntime()).reject(runId, options.reason));
  });

program
  .command("report")
  .argument("<run-id>")
  .action(async (runId: string) => {
    const store = new FileStore(projectRoot());
    console.log(`${store.runDir(runId)}/final-report.md`);
  });

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

function projectRoot(): string {
  return resolve(program.opts<{ project: string }>().project);
}

async function createRuntime(): Promise<Runtime> {
  const store = new FileStore(projectRoot());
  const config = await store.loadConfig();
  const reportProgress = (message: string): void => console.log(message);
  const provider = (() => {
    if (config.runtime.provider === "codex-cli") {
      return new CodexCliProvider(
        store.projectRoot,
        config.runtime.model,
        config.runtime.codexExecutable,
        300_000,
        reportProgress
      );
    }
    if (config.runtime.provider === "fake") {
      return new FakeProvider();
    }
    throw new Error(`Unsupported provider: ${config.runtime.provider}`);
  })();
  return new Runtime(store, provider, reportProgress);
}

function printState(state: {
  runId: string;
  status: string;
  stageIndex: number;
  pendingApproval?: { gateName: string; stageId: string };
  pendingInput?: { questionSetId: string; stageId: string };
  lastError?: string;
}): void {
  console.log(`Run: ${state.runId}`);
  console.log(`Status: ${state.status}`);
  console.log(`Stage index: ${state.stageIndex}`);
  if (state.pendingApproval) {
    console.log(
      `Gate: ${state.pendingApproval.gateName} (${state.pendingApproval.stageId})`
    );
  }
  if (state.pendingInput) {
    console.log(
      `Input: ${state.pendingInput.questionSetId} (${state.pendingInput.stageId})`
    );
  }
  if (state.lastError) {
    console.log(`Error: ${state.lastError}`);
  }
}
