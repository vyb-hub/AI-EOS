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

export const productDiscoveryFlow: FlowDefinition = {
  id: "product-discovery",
  version: 1,
  stages: [
    {
      id: "founder-discovery-questions",
      role: "product_discovery_ai",
      contextSources: ["charter"],
      gateAfter: false,
      inputAfter: true,
      maxAttempts: 2
    },
    {
      id: "founder-intent",
      role: "product_discovery_ai",
      contextSources: ["charter", "founder-discovery-questions", "founder-response"],
      gateAfter: true,
      gateName: "Founder Intent Approval",
      maxAttempts: 2
    },
    {
      id: "market-research",
      role: "market_research_ai",
      contextSources: ["charter", "founder-intent"],
      gateAfter: false,
      networkAccess: true,
      maxAttempts: 2
    },
    {
      id: "opportunity-risk",
      role: "product_strategy_ai",
      contextSources: ["founder-intent", "market-research"],
      gateAfter: true,
      gateName: "Research Evidence Approval",
      maxAttempts: 2
    },
    {
      id: "product-strategy",
      role: "product_strategy_ai",
      contextSources: ["founder-intent", "market-research", "opportunity-risk"],
      gateAfter: true,
      gateName: "MVP Scope Approval",
      maxAttempts: 2
    },
    {
      id: "product-requirements",
      role: "product_definition_ai",
      contextSources: ["founder-intent", "product-strategy"],
      gateAfter: false,
      maxAttempts: 2
    },
    {
      id: "user-journey",
      role: "product_definition_ai",
      contextSources: ["product-strategy", "product-requirements"],
      gateAfter: false,
      maxAttempts: 2
    },
    {
      id: "product-readiness-review",
      role: "product_review_ai",
      contextSources: [
        "founder-intent",
        "market-research",
        "opportunity-risk",
        "product-strategy",
        "product-requirements",
        "user-journey"
      ],
      gateAfter: true,
      gateName: "Product Readiness Approval",
      maxAttempts: 2
    },
    {
      id: "engineering-charter-handoff",
      role: "knowledge_ai",
      contextSources: [
        "founder-intent",
        "product-strategy",
        "product-requirements",
        "user-journey",
        "product-readiness-review"
      ],
      gateAfter: false,
      maxAttempts: 2
    },
    {
      id: "product-knowledge-capture",
      role: "knowledge_ai",
      contextSources: ["engineering-charter-handoff"],
      gateAfter: false,
      maxAttempts: 2
    }
  ]
};

export function flowById(id: FlowDefinition["id"]): FlowDefinition {
  return id === "product-discovery"
    ? productDiscoveryFlow
    : featureDevelopmentFlow;
}
