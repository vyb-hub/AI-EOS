export const stageIds = [
  "research",
  "architecture",
  "documentation-alignment",
  "implementation",
  "review",
  "verification",
  "knowledge-capture"
] as const;

export type StageId = (typeof stageIds)[number];
export type RunStatus =
  | "running"
  | "awaiting_approval"
  | "completed"
  | "failed"
  | "rejected"
  | "cancelled";

export interface StageDefinition {
  id: StageId;
  role: string;
  contextSources: string[];
  gateAfter: boolean;
  gateName?: string;
  maxAttempts: number;
}

export interface FlowDefinition {
  id: "feature-development";
  version: 1;
  stages: StageDefinition[];
}

export interface RunState {
  schemaVersion: 1;
  runId: string;
  flowId: FlowDefinition["id"];
  charterPath: string;
  charterHash: string;
  status: RunStatus;
  stageIndex: number;
  completedStages: StageId[];
  attemptByStage: Partial<Record<StageId, number>>;
  pendingApproval?: {
    stageId: StageId;
    gateName: string;
    artifactHashes: Record<string, string>;
  };
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeEvent {
  schemaVersion: 1;
  eventId: string;
  runId: string;
  type: string;
  timestamp: string;
  stageId?: StageId;
  details: Record<string, unknown>;
}

export interface ApprovalRecord {
  schemaVersion: 1;
  approvalId: string;
  runId: string;
  stageId: StageId;
  actor: "founder";
  decision: "approved" | "rejected";
  artifactHashes: Record<string, string>;
  timestamp: string;
  reason?: string;
}

export interface ContextDocument {
  path: string;
  hash: string;
  content: string;
}

export interface InvocationRequest {
  invocationId: string;
  runId: string;
  stage: StageDefinition;
  roleInstructions: string;
  context: ContextDocument[];
}

export interface ProviderResult {
  provider: string;
  model: string;
  requestId?: string;
  output: {
    outcome: "completed" | "needs_changes" | "failed";
    summary: string;
    findings: string[];
    decisions: string[];
    nextActions: string[];
  };
  raw: unknown;
  startedAt: string;
  completedAt: string;
}

export interface Provider {
  readonly name: string;
  invoke(request: InvocationRequest): Promise<ProviderResult>;
}
