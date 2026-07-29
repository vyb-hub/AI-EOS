import type { FlowDefinition } from "./domain.js";

export const featureDevelopmentFlow: FlowDefinition = {
  id: "feature-development",
  version: 1,
  stages: [
    {
      id: "research",
      role: "research_ai",
      contextSources: ["charter"],
      gateAfter: false,
      maxAttempts: 2
    },
    {
      id: "architecture",
      role: "architect_ai",
      contextSources: ["charter", "research"],
      gateAfter: true,
      gateName: "Founder Architecture Approval",
      maxAttempts: 2
    },
    {
      id: "documentation-alignment",
      role: "knowledge_ai",
      contextSources: ["charter", "research", "architecture"],
      gateAfter: true,
      gateName: "Founder Documentation Approval",
      maxAttempts: 2
    },
    {
      id: "implementation",
      role: "implementation_ai",
      contextSources: ["charter", "architecture", "documentation-alignment"],
      gateAfter: false,
      maxAttempts: 2
    },
    {
      id: "review",
      role: "review_ai",
      contextSources: [
        "charter",
        "architecture",
        "documentation-alignment",
        "implementation"
      ],
      gateAfter: false,
      maxAttempts: 2
    },
    {
      id: "verification",
      role: "qa_ai",
      contextSources: [
        "charter",
        "architecture",
        "documentation-alignment",
        "implementation",
        "review"
      ],
      gateAfter: true,
      gateName: "Founder Completion Approval",
      maxAttempts: 2
    },
    {
      id: "knowledge-capture",
      role: "knowledge_ai",
      contextSources: [
        "charter",
        "research",
        "architecture",
        "documentation-alignment",
        "implementation",
        "review",
        "verification"
      ],
      gateAfter: false,
      maxAttempts: 2
    }
  ]
};
