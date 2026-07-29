import { z } from "zod";
import { stageIds } from "./domain.js";

export const stageOutputSchema = z.object({
  outcome: z.enum(["completed", "needs_changes", "failed"]),
  summary: z.string().min(1),
  findings: z.array(z.string()),
  decisions: z.array(z.string()),
  nextActions: z.array(z.string())
});

export const projectConfigSchema = z.object({
  schemaVersion: z.literal(1),
  project: z.object({
    name: z.string().min(1)
  }),
  runtime: z.object({
    provider: z.string().min(1),
    model: z.string().min(1),
    maxAttempts: z.number().int().min(1).max(5).default(2)
  })
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

export const runStateSchema = z.object({
  schemaVersion: z.literal(1),
  runId: z.string().min(1),
  flowId: z.literal("feature-development"),
  charterPath: z.string().min(1),
  charterHash: z.string().length(64),
  status: z.enum([
    "running",
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
  lastError: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
