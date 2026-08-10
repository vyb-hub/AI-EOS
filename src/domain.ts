export const stageIds = [
  "research",
  "architecture",
  "documentation-alignment",
  "implementation",
  "review",
  "verification",
  "knowledge-capture",
  "founder-discovery-questions",
  "founder-intent",
  "market-research",
  "opportunity-risk",
  "product-strategy",
  "product-requirements",
  "user-journey",
  "product-readiness-review",
  "engineering-charter-handoff",
  "product-knowledge-capture"
] as const;

export type StageId = (typeof stageIds)[number];
export type RunStatus =
  | "running"
  | "awaiting_input"
  | "awaiting_approval"
  | "completed"
  | "failed"
  | "rejected"
  | "cancelled";
export type DiscoveryMode = "fast" | "standard" | "deep";

export interface StageDefinition {
  id: StageId;
  role: string;
  contextSources: string[];
  gateAfter: boolean;
  gateName?: string;
  inputAfter?: boolean;
  maxAttempts: number;
  networkAccess?: boolean;
}

export interface FlowDefinition {
  id: "feature-development" | "product-discovery";
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
  pendingInput?: {
    stageId: StageId;
    questionSetId: string;
    artifactHashes: Record<string, string>;
  };
  founderResponseId?: string;
  discoveryMode?: DiscoveryMode;
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
  discoveryMode?: DiscoveryMode;
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
    questions?: DiscoveryQuestion[] | undefined;
    sources?: EvidenceSource[] | undefined;
    claims?: EvidenceClaim[] | undefined;
  };
  raw: unknown;
  startedAt: string;
  completedAt: string;
}

export interface DiscoveryQuestion {
  questionId: string;
  prompt: string;
  reason: string;
  required: boolean;
  answerType: "text" | "boolean" | "single_choice" | "multiple_choice";
  choices?: string[] | undefined;
}

export interface FounderResponse {
  schemaVersion: 1;
  responseId: string;
  questionSetId: string;
  runId: string;
  actor: "founder";
  submittedAt: string;
  answers: Record<string, string | boolean | string[]>;
  notes?: string | undefined;
}

export interface EvidenceSource {
  sourceId: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt?: string | undefined;
  retrievedAt: string;
  sourceType:
    | "official"
    | "primary_research"
    | "government"
    | "academic"
    | "reputable_secondary"
    | "vendor"
    | "community"
    | "unknown";
  quality: "low" | "medium" | "high";
  qualityJustification: string;
}

export interface EvidenceClaim {
  claimId: string;
  statement: string;
  provenance:
    | "founder_input"
    | "external_fact"
    | "inference"
    | "assumption"
    | "decision";
  sourceIds: string[];
  founderInputIds: string[];
  derivedFromClaimIds: string[];
  confidence: "low" | "medium" | "high";
  status: "active" | "rejected" | "superseded";
}

export interface Provider {
  readonly name: string;
  invoke(request: InvocationRequest): Promise<ProviderResult>;
}
