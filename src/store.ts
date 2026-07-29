import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import type {
  ApprovalRecord,
  ProviderResult,
  RunState,
  RuntimeEvent,
  StageId
} from "./domain.js";
import { projectConfigSchema, runStateSchema, type ProjectConfig } from "./schemas.js";

export class FileStore {
  readonly projectRoot: string;
  readonly eosRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = resolve(projectRoot);
    this.eosRoot = join(this.projectRoot, "ai-eos");
  }

  async initialize(projectName: string): Promise<void> {
    await Promise.all([
      mkdir(join(this.eosRoot, "config"), { recursive: true }),
      mkdir(join(this.eosRoot, "flows"), { recursive: true }),
      mkdir(join(this.eosRoot, "roles"), { recursive: true }),
      mkdir(join(this.eosRoot, "charters"), { recursive: true }),
      mkdir(join(this.eosRoot, "runs"), { recursive: true })
    ]);

    const config: ProjectConfig = {
      schemaVersion: 1,
      project: { name: projectName },
      runtime: { provider: "codex-cli", model: "default", maxAttempts: 2 }
    };
    await this.atomicWrite(
      join(this.eosRoot, "config", "project.yaml"),
      stringifyYaml(config)
    );
  }

  async loadConfig(): Promise<ProjectConfig> {
    const content = await readFile(
      join(this.eosRoot, "config", "project.yaml"),
      "utf8"
    );
    return projectConfigSchema.parse(parseYaml(content));
  }

  runDir(runId: string): string {
    return join(this.eosRoot, "runs", runId);
  }

  async createRunDirectories(runId: string): Promise<void> {
    const base = this.runDir(runId);
    await Promise.all([
      mkdir(join(base, "inputs"), { recursive: true }),
      mkdir(join(base, "stages"), { recursive: true }),
      mkdir(join(base, "approvals"), { recursive: true })
    ]);
  }

  async saveState(state: RunState): Promise<void> {
    await this.atomicWrite(
      join(this.runDir(state.runId), "state.json"),
      `${JSON.stringify(state, null, 2)}\n`
    );
  }

  async loadState(runId: string): Promise<RunState> {
    const content = await readFile(join(this.runDir(runId), "state.json"), "utf8");
    return runStateSchema.parse(JSON.parse(content)) as RunState;
  }

  async appendEvent(event: RuntimeEvent): Promise<void> {
    const path = join(this.runDir(event.runId), "events.jsonl");
    await appendFile(path, `${JSON.stringify(event)}\n`, "utf8");
  }

  async saveInput(runId: string, name: string, content: string): Promise<string> {
    const path = join(this.runDir(runId), "inputs", name);
    await this.atomicWrite(path, content);
    return path;
  }

  async saveStageAttempt(
    runId: string,
    stageId: StageId,
    attempt: number,
    files: Record<string, string>
  ): Promise<void> {
    const dir = join(this.runDir(runId), "stages", stageId, `attempt-${attempt}`);
    await mkdir(dir, { recursive: true });
    await Promise.all(
      Object.entries(files).map(([name, content]) =>
        this.atomicWrite(join(dir, name), content)
      )
    );
  }

  async saveCurrentStageArtifact(
    runId: string,
    stageId: StageId,
    result: ProviderResult
  ): Promise<string> {
    const dir = join(this.runDir(runId), "stages", stageId);
    await mkdir(dir, { recursive: true });
    const markdown = [
      `# ${stageId}`,
      "",
      `**Outcome:** ${result.output.outcome}`,
      "",
      result.output.summary,
      "",
      "## Findings",
      ...result.output.findings.map((item) => `- ${item}`),
      "",
      "## Decisions",
      ...result.output.decisions.map((item) => `- ${item}`),
      "",
      "## Next Actions",
      ...result.output.nextActions.map((item) => `- ${item}`),
      ""
    ].join("\n");
    const path = join(dir, "artifact.md");
    await this.atomicWrite(path, markdown);
    return path;
  }

  async readStageArtifact(runId: string, stageId: StageId): Promise<string> {
    return readFile(
      join(this.runDir(runId), "stages", stageId, "artifact.md"),
      "utf8"
    );
  }

  async saveApproval(record: ApprovalRecord): Promise<void> {
    const path = join(
      this.runDir(record.runId),
      "approvals",
      `${record.stageId}-${record.approvalId}.json`
    );
    await this.atomicWrite(path, `${JSON.stringify(record, null, 2)}\n`);
  }

  async saveReport(runId: string, content: string): Promise<void> {
    await this.atomicWrite(join(this.runDir(runId), "final-report.md"), content);
  }

  async atomicWrite(path: string, content: string): Promise<void> {
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.tmp`;
    await writeFile(temporary, content, "utf8");
    await rename(temporary, path);
  }
}
