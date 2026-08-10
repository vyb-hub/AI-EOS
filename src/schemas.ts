import { z } from "zod";
import { stageIds } from "./domain.js";

export const stageOutputSchema = z.object({
  outcome: z.enum(["completed", "needs_changes", "failed"]),
  summary: z.string().min(1),
  findings: z.array(z.string()),
  decisions: z.array(z.string()),
  nextActions: z.array(z.string()),
  questions: z
    .array(
      z.object({
        questionId: z.string().min(1),
        prompt: z.string().min(1),
        reason: z.string().min(1),
        required: z.boolean(),
        answerType: z.enum([
          "text",
          "boolean",
          "single_choice",
          "multiple_choice"
        ]),
        choices: z.array(z.string().min(1)).optional()
      })
    )
    .optional(),
  sources: z.array(z.lazy(() => evidenceSourceSchema)).optional(),
  claims: z.array(z.lazy(() => evidenceClaimSchema)).optional()
});

export const evidenceSourceSchema = z.object({
  sourceId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url().refine((url) => url.startsWith("https://"), {
    message: "Evidence URLs must use HTTPS."
  }),
  publisher: z.string().min(1),
  publishedAt: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? undefined),
  retrievedAt: z
    .string()
    .refine(
      (value) =>
        z.string().date().safeParse(value).success ||
        z.string().datetime({ offset: true }).safeParse(value).success,
      { message: "retrievedAt must be an ISO date (YYYY-MM-DD) or datetime." }
    )
    .transform((value) =>
      z.string().date().safeParse(value).success ? `${value}T00:00:00Z` : value
    ),
  sourceType: z.enum([
    "official",
    "primary_research",
    "government",
    "academic",
    "reputable_secondary",
    "vendor",
    "community",
    "unknown"
  ]),
  quality: z.enum(["low", "medium", "high"]),
  qualityJustification: z.string().min(1)
});

export const evidenceClaimSchema = z.object({
  claimId: z.string().min(1),
  statement: z.string().min(1),
  provenance: z.enum([
    "founder_input",
    "external_fact",
    "inference",
    "assumption",
    "decision"
  ]),
  sourceIds: z.array(z.string().min(1)),
  founderInputIds: z.array(z.string().min(1)),
  derivedFromClaimIds: z.array(z.string().min(1)),
  confidence: z.enum(["low", "medium", "high"]),
  status: z.enum(["active", "rejected", "superseded"])
});

export const founderResponseSchema = z.object({
  schemaVersion: z.literal(1),
  responseId: z.string().min(1),
  questionSetId: z.string().min(1),
  runId: z.string().min(1),
  actor: z.literal("founder"),
  submittedAt: z.string().datetime(),
  answers: z.record(
    z.union([z.string(), z.boolean(), z.array(z.string())])
  ),
  notes: z.string().optional()
});

export const projectConfigSchema = z.object({
  schemaVersion: z.literal(1),
  project: z.object({
    name: z.string().min(1)
  }),
  runtime: z.object({
    provider: z.string().min(1),
    model: z.string().min(1),
    maxAttempts: z.number().int().min(1).max(5).default(2),
    codexExecutable: z.string().min(1).optional()
  })
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

export const runStateSchema = z.object({
  schemaVersion: z.literal(1),
  runId: z.string().min(1),
  flowId: z.enum(["feature-development", "product-discovery"]),
  charterPath: z.string().min(1),
  charterHash: z.string().length(64),
  status: z.enum([
    "running",
    "awaiting_input",
    "awaiting_approval",
    "completed",
    "failed",
    "rejected",
    "cancelled"
  ]),
  stageIndex: z.number().int().min(0),
  completedStages: z.array(z.enum(stageIds)),
  attemptByStage: z.record(z.number().int().min(1)).default({}),
  pendingApproval: z
    .object({
      stageId: z.enum(stageIds),
      gateName: z.string().min(1),
      artifactHashes: z.record(z.string().length(64))
    })
    .optional(),
  pendingInput: z
    .object({
      stageId: z.enum(stageIds),
      questionSetId: z.string().min(1),
      artifactHashes: z.record(z.string().length(64))
    })
    .optional(),
  founderResponseId: z.string().min(1).optional(),
  discoveryMode: z.enum(["fast", "standard", "deep"]).optional(),
  lastError: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
