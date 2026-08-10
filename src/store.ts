import {
  appendFile,
  copyFile,
  mkdir,
  readFile,
  rename,
  writeFile
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import type {
  ApprovalRecord,
  FounderResponse,
  ProviderResult,
  RunState,
  RuntimeEvent,
  StageId
} from "./domain.js";
import { projectConfigSchema, runStateSchema, type ProjectConfig } from "./schemas.js";
import { renderProductBrief, type ProductBriefModel } from "./product-brief.js";

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
      mkdir(join(base, "founder-input"), { recursive: true }),
      mkdir(join(base, "evidence"), { recursive: true }),
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

  async saveIdeaBrief(runId: string, content: string): Promise<string> {
    const path = join(this.runDir(runId), "idea-brief.md");
    await this.atomicWrite(path, content);
    return path;
  }

  async saveProductBrief(model: ProductBriefModel): Promise<string> {
    const jsonPath = join(this.runDir(model.runId), "product-brief.json");
    const htmlPath = join(this.runDir(model.runId), "product-brief.html");
    await this.atomicWrite(jsonPath, `${JSON.stringify(model, null, 2)}\n`);
    await this.atomicWrite(htmlPath, renderProductBrief(model));
    return htmlPath;
  }

  async loadProductBrief(runId: string): Promise<ProductBriefModel> {
    return JSON.parse(
      await readFile(join(this.runDir(runId), "product-brief.json"), "utf8")
    ) as ProductBriefModel;
  }

  async saveDecisionDossier(runId: string): Promise<string> {
    const model = await this.loadProductBrief(runId);
    const path = join(this.runDir(runId), "decision-dossier.html");
    await this.atomicWrite(path, renderProductBrief(model));
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

  async saveQuestionSet(
    runId: string,
    questionSetId: string,
    content: unknown
  ): Promise<string> {
    const path = join(
      this.runDir(runId),
      "founder-input",
      `${questionSetId}.questions.json`
    );
    await this.atomicWrite(path, `${JSON.stringify(content, null, 2)}\n`);
    return path;
  }

  async saveFounderResponse(
    response: FounderResponse,
    raw: string
  ): Promise<string> {
    const rawPath = join(
      this.runDir(response.runId),
      "founder-input",
      `${response.responseId}.raw.json`
    );
    const parsedPath = join(
      this.runDir(response.runId),
      "founder-input",
      `${response.responseId}.json`
    );
    await this.atomicWrite(rawPath, raw);
    await this.atomicWrite(parsedPath, `${JSON.stringify(response, null, 2)}\n`);
    return parsedPath;
  }

  async readFounderResponse(runId: string): Promise<string> {
    const state = await this.loadState(runId);
    const responseId = (state as RunState & { founderResponseId?: string })
      .founderResponseId;
    if (!responseId) {
      throw new Error(`Run ${runId} has no Founder response.`);
    }
    return readFile(
      join(this.runDir(runId), "founder-input", `${responseId}.json`),
      "utf8"
    );
  }

  async saveEvidence(
    runId: string,
    sources: unknown[],
    claims: unknown[],
    competitors: unknown[] = []
  ): Promise<void> {
    await this.atomicWrite(
      join(this.runDir(runId), "evidence", "sources.json"),
      `${JSON.stringify(sources, null, 2)}\n`
    );
    await this.atomicWrite(
      join(this.runDir(runId), "evidence", "claims.json"),
      `${JSON.stringify(claims, null, 2)}\n`
    );
    await this.atomicWrite(
      join(this.runDir(runId), "evidence", "competitors.json"),
      `${JSON.stringify(competitors, null, 2)}\n`
    );
  }

  evidencePaths(runId: string): {
    sources: string;
    claims: string;
    competitors: string;
  } {
    return {
      sources: join(this.runDir(runId), "evidence", "sources.json"),
      claims: join(this.runDir(runId), "evidence", "claims.json"),
      competitors: join(this.runDir(runId), "evidence", "competitors.json")
    };
  }

  async archiveEvidence(runId: string, revisionId: string): Promise<string> {
    const current = this.evidencePaths(runId);
    const revisionDir = join(
      this.runDir(runId),
      "evidence",
      "revisions",
      revisionId
    );
    await mkdir(revisionDir, { recursive: true });
    await copyFile(current.sources, join(revisionDir, "sources.json"));
    await copyFile(current.claims, join(revisionDir, "claims.json"));
    await copyFile(current.competitors, join(revisionDir, "competitors.json"));
    await copyFile(
      join(this.runDir(runId), "stages", "market-research", "artifact.md"),
      join(revisionDir, "market-research.md")
    );
    await copyFile(
      join(this.runDir(runId), "stages", "opportunity-risk", "artifact.md"),
      join(revisionDir, "opportunity-risk.md")
    );
    return revisionDir;
  }

  async saveProductHandoff(
    runId: string,
    summary: string,
    findings: string[],
    decisions: string[]
  ): Promise<void> {
    const handoff = join(this.runDir(runId), "handoff");
    const productDefinition = [
      "# Product Definition",
      "",
      "**Status:** Generated after Product Readiness Approval",
      "",
      "## Summary",
      "",
      summary,
      "",
      "## Requirements and Findings",
      "",
      ...findings.map((item) => `- ${item}`),
      "",
      "## Approved Decisions",
      "",
      ...decisions.map((item) => `- ${item}`),
      "",
      "Evidence, stage artifacts, and Founder approvals remain authoritative.",
      ""
    ].join("\n");
    const charter = [
      "# Proposed Engineering Charter",
      "",
      "**Status:** Proposed — pending Strategic AI review and Founder approval",
      "",
      "## Objective",
      "",
      summary,
      "",
      "## Product Context",
      "",
      ...findings.map((item) => `- ${item}`),
      "",
      "## Constraints",
      "",
      "- Trace implementation scope to the approved Product Definition.",
      "- Preserve unresolved assumptions as risks.",
      "- Do not begin implementation without separate Founder approval.",
      "",
      "## Completion Evidence",
      "",
      "- Passing verification",
      "- Architecture review",
      "- Product acceptance evidence",
      ""
    ].join("\n");
    await this.atomicWrite(
      join(handoff, "product-definition.md"),
      productDefinition
    );
    await this.atomicWrite(
      join(handoff, "product-definition.json"),
      `${JSON.stringify({ summary, findings, decisions }, null, 2)}\n`
    );
    await this.atomicWrite(
      join(handoff, "engineering-charter.md"),
      charter
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
      ...(result.output.dossierSections ?? []).flatMap((section) => [
        "",
        `## Dossier: ${section.sectionId}`,
        "",
        section.summary,
        "",
        "### Findings",
        ...section.findings.map((item) => `- ${item}`),
        "",
        "### Decisions",
        ...section.decisions.map((item) => `- ${item}`),
        "",
        "### Next Actions",
        ...section.nextActions.map((item) => `- ${item}`)
      ]),
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
