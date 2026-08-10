import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import type {
  ApprovalRecord,
  ContextDocument,
  DiscoveryMode,
  Provider,
  RunState,
  RuntimeEvent,
  StageDefinition,
  StageId
} from "./domain.js";
import { validateEvidence } from "./evidence.js";
import { featureDevelopmentFlow, flowById, productDiscoveryFlow } from "./flow.js";
import { newId, sha256 } from "./hash.js";
import { founderResponseSchema, stageOutputSchema } from "./schemas.js";
import { FileStore } from "./store.js";

export class Runtime {
  constructor(
    private readonly store: FileStore,
    private readonly provider: Provider,
    private readonly reportProgress: (message: string) => void = () => {}
  ) {}

  async start(charterPath: string): Promise<RunState> {
    return this.startFlow(charterPath, featureDevelopmentFlow.id);
  }

  async startDiscovery(
    ideaPath: string,
    mode: DiscoveryMode = "fast"
  ): Promise<RunState> {
    return this.startFlow(ideaPath, productDiscoveryFlow.id, mode);
  }

  private async startFlow(
    inputPath: string,
    flowId: RunState["flowId"],
    discoveryMode?: DiscoveryMode
  ): Promise<RunState> {
    const absoluteCharterPath = resolve(inputPath);
    this.assertInsideProject(absoluteCharterPath);
    const charter = await readFile(absoluteCharterPath, "utf8");
    const now = new Date().toISOString();
    const state: RunState = {
      schemaVersion: 1,
      runId: newId("run"),
      flowId,
      charterPath: absoluteCharterPath,
      charterHash: sha256(charter),
      status: "running",
      stageIndex: 0,
      completedStages: [],
      attemptByStage: {},
      ...(discoveryMode ? { discoveryMode } : {}),
      createdAt: now,
      updatedAt: now
    };
    await this.store.createRunDirectories(state.runId);
    await this.store.saveInput(state.runId, basename(absoluteCharterPath), charter);
    if (flowId === "product-discovery") {
      await this.store.saveIdeaBrief(
        state.runId,
        this.renderImmediateBrief(charter, discoveryMode ?? "fast")
      );
      this.progress(
        `Idea Brief ready · ${discoveryMode ?? "fast"} mode · starting clarification`
      );
    }
    await this.store.saveState(state);
    await this.event(state, "run.started", undefined, {
      charterPath: absoluteCharterPath,
      charterHash: state.charterHash
    });
    return this.runUntilHalt(state);
  }

  async resume(runId: string): Promise<RunState> {
    const state = await this.store.loadState(runId);
    if (
      state.status === "awaiting_approval" ||
      state.status === "awaiting_input"
    ) {
      return state;
    }
    if (state.status !== "running" && state.status !== "failed") {
      throw new Error(`Run ${runId} cannot resume from status ${state.status}.`);
    }
    state.status = "running";
    delete state.lastError;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    await this.event(state, "run.resumed", this.currentStage(state)?.id, {});
    return this.runUntilHalt(state);
  }

  async approve(runId: string, reason?: string): Promise<RunState> {
    const state = await this.store.loadState(runId);
    if (state.status !== "awaiting_approval" || !state.pendingApproval) {
      throw new Error(`Run ${runId} is not awaiting approval.`);
    }
    await this.assertApprovalArtifactsCurrent(state);
    const record = this.approvalRecord(state, "approved", reason);
    await this.store.saveApproval(record);
    await this.event(state, "gate.approved", record.stageId, {
      approvalId: record.approvalId,
      reason
    });
    state.stageIndex += 1;
    state.status = "running";
    delete state.pendingApproval;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    return this.runUntilHalt(state);
  }

  async reject(runId: string, reason: string): Promise<RunState> {
    const state = await this.store.loadState(runId);
    if (state.status !== "awaiting_approval" || !state.pendingApproval) {
      throw new Error(`Run ${runId} is not awaiting approval.`);
    }
    const record = this.approvalRecord(state, "rejected", reason);
    await this.store.saveApproval(record);
    state.status = "rejected";
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    await this.event(state, "gate.rejected", record.stageId, {
      approvalId: record.approvalId,
      reason
    });
    return state;
  }

  async status(runId: string): Promise<RunState> {
    return this.store.loadState(runId);
  }

  async respond(runId: string, responsePath: string): Promise<RunState> {
    const state = await this.store.loadState(runId);
    if (state.status !== "awaiting_input" || !state.pendingInput) {
      throw new Error(`Run ${runId} is not awaiting Founder input.`);
    }
    const absolutePath = resolve(responsePath);
    this.assertInsideProject(absolutePath);
    const raw = await readFile(absolutePath, "utf8");
    const response = founderResponseSchema.parse(JSON.parse(raw));
    if (response.runId !== runId) {
      throw new Error(`Founder response belongs to another run.`);
    }
    if (response.questionSetId !== state.pendingInput.questionSetId) {
      throw new Error(`Founder response uses a stale question set.`);
    }
    const questionPath = Object.keys(state.pendingInput.artifactHashes)[0];
    if (!questionPath) {
      throw new Error("Pending input has no question-set artifact.");
    }
    const questionSet = JSON.parse(await readFile(questionPath, "utf8")) as {
      questions: Array<{
        questionId: string;
        required: boolean;
        answerType: "text" | "boolean" | "single_choice" | "multiple_choice";
        choices?: string[];
      }>;
    };
    const known = new Set(questionSet.questions.map(({ questionId }) => questionId));
    for (const questionId of Object.keys(response.answers)) {
      if (!known.has(questionId)) {
        throw new Error(`Unknown Founder question ID: ${questionId}.`);
      }
    }
    for (const question of questionSet.questions) {
      if (question.required && !(question.questionId in response.answers)) {
        throw new Error(`Missing required answer: ${question.questionId}.`);
      }
      const answer = response.answers[question.questionId];
      if (answer === undefined) {
        continue;
      }
      const validType =
        (question.answerType === "text" && typeof answer === "string") ||
        (question.answerType === "boolean" && typeof answer === "boolean") ||
        (question.answerType === "single_choice" &&
          typeof answer === "string" &&
          (question.choices ?? []).includes(answer)) ||
        (question.answerType === "multiple_choice" &&
          Array.isArray(answer) &&
          answer.every((item) => (question.choices ?? []).includes(item)));
      if (!validType) {
        throw new Error(
          `Invalid answer type or choice for ${question.questionId}.`
        );
      }
    }
    await this.store.saveFounderResponse(response, raw);
    state.founderResponseId = response.responseId;
    state.stageIndex += 1;
    state.status = "running";
    delete state.pendingInput;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    await this.event(state, "founder.input_received", undefined, {
      responseId: response.responseId,
      questionSetId: response.questionSetId
    });
    return this.runUntilHalt(state);
  }

  async reviseFounderResponse(
    runId: string,
    responsePath: string
  ): Promise<RunState> {
    const state = await this.store.loadState(runId);
    if (
      state.status !== "awaiting_approval" ||
      state.pendingApproval?.stageId !== "founder-intent" ||
      !state.founderResponseId
    ) {
      throw new Error(
        `Run ${runId} is not awaiting Founder Intent Approval.`
      );
    }
    const absolutePath = resolve(responsePath);
    this.assertInsideProject(absolutePath);
    const raw = await readFile(absolutePath, "utf8");
    const response = founderResponseSchema.parse(JSON.parse(raw));
    const prior = founderResponseSchema.parse(
      JSON.parse(await this.store.readFounderResponse(runId))
    );
    if (
      response.runId !== runId ||
      response.questionSetId !== prior.questionSetId
    ) {
      throw new Error("Revised response does not match the active discovery run.");
    }
    await this.store.saveFounderResponse(response, raw);
    state.founderResponseId = response.responseId;
    state.completedStages = state.completedStages.filter(
      (stageId) => stageId !== "founder-intent"
    );
    state.status = "running";
    delete state.pendingApproval;
    delete state.lastError;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    await this.event(state, "founder.input_revised", "founder-intent", {
      responseId: response.responseId,
      invalidatedStage: "founder-intent"
    });
    return this.runUntilHalt(state);
  }

  async reviseResearch(runId: string, reason: string): Promise<RunState> {
    const state = await this.store.loadState(runId);
    if (
      state.status !== "awaiting_approval" ||
      state.pendingApproval?.stageId !== "opportunity-risk"
    ) {
      throw new Error(
        `Run ${runId} is not awaiting Research Evidence Approval.`
      );
    }
    const revisionId = newId("evidence_revision");
    const revisionDir = await this.store.archiveEvidence(runId, revisionId);
    state.completedStages = state.completedStages.filter(
      (stageId) =>
        stageId !== "market-research" && stageId !== "opportunity-risk"
    );
    state.stageIndex = flowById(state.flowId).stages.findIndex(
      ({ id }) => id === "market-research"
    );
    state.status = "running";
    delete state.pendingApproval;
    delete state.lastError;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    await this.event(state, "research.revision_requested", "market-research", {
      reason,
      revisionId,
      archivedEvidence: revisionDir
    });
    return this.runUntilHalt(state);
  }

  private async runUntilHalt(state: RunState): Promise<RunState> {
    while (state.status === "running") {
      await this.skipExcludedStages(state);
      const stage = this.currentStage(state);
      if (!stage) {
        state.status = "completed";
        state.updatedAt = new Date().toISOString();
        await this.store.saveState(state);
        await this.event(state, "run.completed", undefined, {});
        await this.store.saveReport(state.runId, this.renderReport(state));
        break;
      }

      try {
        await this.executeStage(state, stage);
      } catch (error) {
        state.status = "failed";
        state.lastError = error instanceof Error ? error.message : String(error);
        state.updatedAt = new Date().toISOString();
        await this.store.saveState(state);
        await this.event(state, "run.failed", stage.id, {
          error: state.lastError
        });
      }
    }
    return state;
  }

  private async executeStage(
    state: RunState,
    stage: StageDefinition
  ): Promise<void> {
    const stageStartedAt = Date.now();
    const attempt = (state.attemptByStage[stage.id] ?? 0) + 1;
    this.progress(this.stageProgress(stage, state.discoveryMode));
    state.attemptByStage[stage.id] = attempt;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    await this.event(state, "stage.started", stage.id, { attempt });

    const context = await this.compileContext(state, stage);
    const invocationId = newId("inv");
    let result: Awaited<ReturnType<Provider["invoke"]>>;
    const providerStartedAt = Date.now();
    try {
      result = await this.provider.invoke({
        invocationId,
        runId: state.runId,
        stage,
        roleInstructions: `Act only as ${stage.role}. Return the required structured output.`,
        context,
        ...(state.discoveryMode ? { discoveryMode: state.discoveryMode } : {})
      });
    } catch (error) {
      await this.event(state, "stage.provider_failed", stage.id, {
        attempt,
        invocationId,
        durationMs: Date.now() - stageStartedAt,
        providerDurationMs: Date.now() - providerStartedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
    const validation = stageOutputSchema.safeParse(result.output);
    const outputJson = `${JSON.stringify(result.output, null, 2)}\n`;
    const metrics = {
      durationMs: Date.now() - stageStartedAt,
      providerDurationMs: Math.max(
        0,
        Date.parse(result.completedAt) - Date.parse(result.startedAt)
      ),
      contextDocumentCount: context.length,
      contextBytes: context.reduce(
        (total, document) => total + Buffer.byteLength(document.content, "utf8"),
        0
      ),
      outputBytes: Buffer.byteLength(outputJson, "utf8")
    };

    await this.store.saveStageAttempt(state.runId, stage.id, attempt, {
      "invocation.json": `${JSON.stringify(
        {
          invocationId,
          provider: result.provider,
          model: result.model,
          stageId: stage.id,
          role: stage.role,
          startedAt: result.startedAt,
          completedAt: result.completedAt,
          ...metrics
        },
        null,
        2
      )}\n`,
      "context-manifest.json": `${JSON.stringify(
        context.map(({ path, hash }) => ({ path, hash })),
        null,
        2
      )}\n`,
      "output.json": outputJson,
      "validation.json": `${JSON.stringify(
        validation.success
          ? { valid: true }
          : { valid: false, errors: validation.error.flatten() },
        null,
        2
      )}\n`
    });

    if (!validation.success) {
      await this.event(state, "stage.validation_failed", stage.id, {
        attempt,
        ...metrics
      });
      if (attempt < stage.maxAttempts) {
        return;
      }
      throw new Error(
        `Stage ${stage.id} failed validation after ${attempt} attempt(s).`
      );
    }

    if (validation.data.outcome !== "completed") {
      await this.event(state, "stage.outcome_rejected", stage.id, {
        attempt,
        outcome: validation.data.outcome,
        ...metrics
      });
      throw new Error(
        `Stage ${stage.id} halted with outcome ${validation.data.outcome}: ${validation.data.summary}`
      );
    }

    if (stage.id === "founder-discovery-questions") {
      if (!validation.data.questions?.length) {
        throw new Error("Founder Discovery must produce at least one question.");
      }
    }
    if (stage.id === "market-research") {
      const evidence = validateEvidence(
        validation.data.sources ?? [],
        validation.data.claims ?? []
      );
      if (evidence.sources.length === 0 || evidence.claims.length === 0) {
        throw new Error("Market Research must produce sources and claims.");
      }
      await this.store.saveEvidence(
        state.runId,
        evidence.sources,
        evidence.claims
      );
    }

    const artifactPath = await this.store.saveCurrentStageArtifact(
      state.runId,
      stage.id,
      result
    );
    const artifact = await readFile(artifactPath, "utf8");
    if (stage.id === "engineering-charter-handoff") {
      await this.store.saveProductHandoff(
        state.runId,
        validation.data.summary,
        validation.data.findings,
        validation.data.decisions
      );
    }
    if (!state.completedStages.includes(stage.id)) {
      state.completedStages.push(stage.id);
    }
    await this.event(state, "stage.completed", stage.id, {
      attempt,
      artifactHash: sha256(artifact),
      ...metrics
    });

    if (stage.inputAfter) {
      const questionSetId = newId("questions");
      const questionSet = {
        schemaVersion: 1,
        questionSetId,
        runId: state.runId,
        round: 1,
        createdAt: new Date().toISOString(),
        basedOnArtifactHashes: { [artifactPath]: sha256(artifact) },
        questions: validation.data.questions
      };
      const questionPath = await this.store.saveQuestionSet(
        state.runId,
        questionSetId,
        questionSet
      );
      state.status = "awaiting_input";
      state.pendingInput = {
        stageId: stage.id,
        questionSetId,
        artifactHashes: { [questionPath]: sha256(await readFile(questionPath)) }
      };
      state.updatedAt = new Date().toISOString();
      await this.store.saveState(state);
      await this.event(state, "founder.input_awaiting", stage.id, {
        questionSetId,
        questionPath
      });
      return;
    }

    if (this.shouldOpenGate(state, stage)) {
      const artifactHashes: Record<string, string> = {
        [artifactPath]: sha256(artifact)
      };
      if (stage.id === "opportunity-risk") {
        const evidencePaths = this.store.evidencePaths(state.runId);
        artifactHashes[evidencePaths.sources] = sha256(
          await readFile(evidencePaths.sources)
        );
        artifactHashes[evidencePaths.claims] = sha256(
          await readFile(evidencePaths.claims)
        );
      }
      state.status = "awaiting_approval";
      state.pendingApproval = {
        stageId: stage.id,
        gateName: stage.gateName ?? `${stage.id} approval`,
        artifactHashes
      };
      state.updatedAt = new Date().toISOString();
      await this.store.saveState(state);
      await this.event(state, "gate.awaiting", stage.id, {
        gateName: state.pendingApproval.gateName,
        artifactHashes: state.pendingApproval.artifactHashes
      });
      return;
    }

    state.stageIndex += 1;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
  }

  private async compileContext(
    state: RunState,
    stage: StageDefinition
  ): Promise<ContextDocument[]> {
    const documents: ContextDocument[] = [];
    for (const source of this.contextSourcesFor(state, stage)) {
      if (source === "charter") {
        const content = await readFile(state.charterPath, "utf8");
        if (sha256(content) !== state.charterHash) {
          throw new Error("The Charter changed after the run started.");
        }
        documents.push({
          path: state.charterPath,
          hash: state.charterHash,
          content
        });
        continue;
      }
      if (source === "founder-response") {
        const content = await this.store.readFounderResponse(state.runId);
        documents.push({
          path: "founder-input/response.json",
          hash: sha256(content),
          content
        });
        continue;
      }
      const stageId = source as StageId;
      const content = await this.store.readStageArtifact(state.runId, stageId);
      documents.push({
        path: `stages/${stageId}/artifact.md`,
        hash: sha256(content),
        content
      });
    }
    return documents;
  }

  private approvalRecord(
    state: RunState,
    decision: ApprovalRecord["decision"],
    reason?: string
  ): ApprovalRecord {
    if (!state.pendingApproval) {
      throw new Error("No pending approval exists.");
    }
    return {
      schemaVersion: 1,
      approvalId: newId("approval"),
      runId: state.runId,
      stageId: state.pendingApproval.stageId,
      actor: "founder",
      decision,
      artifactHashes: state.pendingApproval.artifactHashes,
      timestamp: new Date().toISOString(),
      ...(reason ? { reason } : {})
    };
  }

  private async assertApprovalArtifactsCurrent(state: RunState): Promise<void> {
    if (!state.pendingApproval) {
      throw new Error("No pending approval exists.");
    }
    for (const [path, expectedHash] of Object.entries(
      state.pendingApproval.artifactHashes
    )) {
      const currentHash = sha256(await readFile(path));
      if (currentHash !== expectedHash) {
        throw new Error(
          `Approval invalidated because artifact changed: ${path}`
        );
      }
    }
  }

  private currentStage(state: RunState): StageDefinition | undefined {
    return flowById(state.flowId).stages[state.stageIndex];
  }

  private async skipExcludedStages(state: RunState): Promise<void> {
    while (true) {
      const stage = this.currentStage(state);
      if (!stage || !this.isStageExcluded(state, stage.id)) {
        return;
      }
      await this.event(state, "stage.skipped", stage.id, {
        mode: state.discoveryMode,
        reason: "Excluded by the selected Product Discovery mode."
      });
      state.stageIndex += 1;
      state.updatedAt = new Date().toISOString();
      await this.store.saveState(state);
    }
  }

  private isStageExcluded(state: RunState, stageId: StageId): boolean {
    if (state.flowId !== "product-discovery" || state.discoveryMode !== "fast") {
      return false;
    }
    return new Set<StageId>([
      "product-strategy",
      "product-requirements",
      "user-journey",
      "engineering-charter-handoff",
      "product-knowledge-capture"
    ]).has(stageId);
  }

  private contextSourcesFor(
    state: RunState,
    stage: StageDefinition
  ): string[] {
    if (
      state.flowId === "product-discovery" &&
      state.discoveryMode === "fast" &&
      stage.id === "product-readiness-review"
    ) {
      return ["founder-intent", "market-research", "opportunity-risk"];
    }
    return stage.contextSources;
  }

  private async event(
    state: RunState,
    type: string,
    stageId: StageId | undefined,
    details: Record<string, unknown>
  ): Promise<void> {
    const event: RuntimeEvent = {
      schemaVersion: 1,
      eventId: newId("event"),
      runId: state.runId,
      type,
      timestamp: new Date().toISOString(),
      details,
      ...(stageId ? { stageId } : {})
    };
    await this.store.appendEvent(event);
  }

  private assertInsideProject(path: string): void {
    const root = `${this.store.projectRoot}/`;
    if (path !== this.store.projectRoot && !path.startsWith(root)) {
      throw new Error("Charter path must be inside the project root.");
    }
  }

  private renderReport(state: RunState): string {
    return [
      "# AI-EOS Run Report",
      "",
      `- Run: \`${state.runId}\``,
      `- Flow: \`${state.flowId}\``,
      `- Status: **${state.status}**`,
      `- Charter: \`${state.charterPath}\``,
      `- Charter SHA-256: \`${state.charterHash}\``,
      "",
      "## Completed Stages",
      "",
      ...state.completedStages.map((stage) => `- ${stage}`),
      "",
      "No commit, push, merge, deploy, or publication action was performed.",
      ""
    ].join("\n");
  }

  private progress(message: string): void {
    this.reportProgress(`[AI-EOS] ${message}`);
  }

  private stageProgress(
    stage: StageDefinition,
    mode?: DiscoveryMode
  ): string {
    const labels: Partial<Record<StageId, string>> = {
      "founder-discovery-questions": "Clarifying the idea",
      "founder-intent": "Synthesizing Founder intent",
      "market-research": `Checking competitors and evidence (${mode ?? "fast"} budget)`,
      "opportunity-risk": "Testing the opportunity and risks",
      "product-strategy": "Building the MVP recommendation",
      "product-requirements": "Defining product requirements",
      "user-journey": "Mapping the primary customer journey",
      "product-readiness-review": "Challenging product readiness",
      "engineering-charter-handoff": "Preparing the Engineering handoff",
      "product-knowledge-capture": "Finalizing the Product Brief"
    };
    return labels[stage.id] ?? `Running ${stage.id}`;
  }

  private renderImmediateBrief(
    idea: string,
    mode: DiscoveryMode
  ): string {
    const summary = idea
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .slice(0, 4)
      .join(" ");
    return [
      "# Immediate Idea Brief",
      "",
      `**Mode:** ${mode}`,
      "**Status:** Directional — research has not completed",
      "",
      "## What AI-EOS received",
      "",
      summary,
      "",
      "## What happens next",
      "",
      "- Clarify Founder intent",
      "- Identify assumptions and unknowns",
      "- Apply the selected research budget",
      "- Return progressive findings before final recommendation",
      "",
      "This brief is immediate orientation, not a market conclusion.",
      ""
    ].join("\n");
  }

  private shouldOpenGate(
    state: RunState,
    stage: StageDefinition
  ): boolean {
    if (!stage.gateAfter || state.flowId !== "product-discovery") {
      return stage.gateAfter;
    }
    // Runs created before DR-004 retain their original four-gate contract.
    if (!state.discoveryMode) {
      return true;
    }
    const gatesByMode: Record<DiscoveryMode, StageId[]> = {
      fast: ["founder-intent", "product-readiness-review"],
      standard: [
        "founder-intent",
        "product-strategy",
        "product-readiness-review"
      ],
      deep: [
        "founder-intent",
        "opportunity-risk",
        "product-strategy",
        "product-readiness-review"
      ]
    };
    return gatesByMode[state.discoveryMode].includes(stage.id);
  }
}
