import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import type {
  ApprovalRecord,
  ContextDocument,
  Provider,
  RunState,
  RuntimeEvent,
  StageDefinition,
  StageId
} from "./domain.js";
import { featureDevelopmentFlow } from "./flow.js";
import { newId, sha256 } from "./hash.js";
import { stageOutputSchema } from "./schemas.js";
import { FileStore } from "./store.js";

export class Runtime {
  constructor(
    private readonly store: FileStore,
    private readonly provider: Provider
  ) {}

  async start(charterPath: string): Promise<RunState> {
    const absoluteCharterPath = resolve(charterPath);
    this.assertInsideProject(absoluteCharterPath);
    const charter = await readFile(absoluteCharterPath, "utf8");
    const now = new Date().toISOString();
    const state: RunState = {
      schemaVersion: 1,
      runId: newId("run"),
      flowId: featureDevelopmentFlow.id,
      charterPath: absoluteCharterPath,
      charterHash: sha256(charter),
      status: "running",
      stageIndex: 0,
      completedStages: [],
      attemptByStage: {},
      createdAt: now,
      updatedAt: now
    };
    await this.store.createRunDirectories(state.runId);
    await this.store.saveInput(state.runId, basename(absoluteCharterPath), charter);
    await this.store.saveState(state);
    await this.event(state, "run.started", undefined, {
      charterPath: absoluteCharterPath,
      charterHash: state.charterHash
    });
    return this.runUntilHalt(state);
  }

  async resume(runId: string): Promise<RunState> {
    const state = await this.store.loadState(runId);
    if (state.status === "awaiting_approval") {
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

  private async runUntilHalt(state: RunState): Promise<RunState> {
    while (state.status === "running") {
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
    const attempt = (state.attemptByStage[stage.id] ?? 0) + 1;
    state.attemptByStage[stage.id] = attempt;
    state.updatedAt = new Date().toISOString();
    await this.store.saveState(state);
    await this.event(state, "stage.started", stage.id, { attempt });

    const context = await this.compileContext(state, stage);
    const invocationId = newId("inv");
    const result = await this.provider.invoke({
      invocationId,
      runId: state.runId,
      stage,
      roleInstructions: `Act only as ${stage.role}. Return the required structured output.`,
      context
    });
    const validation = stageOutputSchema.safeParse(result.output);

    await this.store.saveStageAttempt(state.runId, stage.id, attempt, {
      "invocation.json": `${JSON.stringify(
        {
          invocationId,
          provider: result.provider,
          model: result.model,
          stageId: stage.id,
          role: stage.role
        },
        null,
        2
      )}\n`,
      "context-manifest.json": `${JSON.stringify(
        context.map(({ path, hash }) => ({ path, hash })),
        null,
        2
      )}\n`,
      "output.json": `${JSON.stringify(result.output, null, 2)}\n`,
      "validation.json": `${JSON.stringify(
        validation.success
          ? { valid: true }
          : { valid: false, errors: validation.error.flatten() },
        null,
        2
      )}\n`
    });

    if (!validation.success) {
      await this.event(state, "stage.validation_failed", stage.id, { attempt });
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
        outcome: validation.data.outcome
      });
      throw new Error(
        `Stage ${stage.id} halted with outcome ${validation.data.outcome}: ${validation.data.summary}`
      );
    }

    const artifactPath = await this.store.saveCurrentStageArtifact(
      state.runId,
      stage.id,
      result
    );
    const artifact = await readFile(artifactPath, "utf8");
    if (!state.completedStages.includes(stage.id)) {
      state.completedStages.push(stage.id);
    }
    await this.event(state, "stage.completed", stage.id, {
      attempt,
      artifactHash: sha256(artifact)
    });

    if (stage.gateAfter) {
      state.status = "awaiting_approval";
      state.pendingApproval = {
        stageId: stage.id,
        gateName: stage.gateName ?? `${stage.id} approval`,
        artifactHashes: { [artifactPath]: sha256(artifact) }
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
    for (const source of stage.contextSources) {
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
    return featureDevelopmentFlow.stages[state.stageIndex];
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
}
