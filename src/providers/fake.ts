import type { InvocationRequest, Provider, ProviderResult } from "../domain.js";

export class FakeProvider implements Provider {
  readonly name = "fake";

  async invoke(request: InvocationRequest): Promise<ProviderResult> {
    const startedAt = new Date().toISOString();
    const contextNames = request.context.map((item) => item.path).join(", ");
    const discoveryExtras =
      request.stage.id === "founder-discovery-questions"
        ? {
            questions: [
              {
                questionId: "Q-001",
                prompt: "Who is the primary customer?",
                reason: "The MVP needs one bounded target customer.",
                required: true,
                answerType: "text" as const
              }
            ]
          }
        : request.stage.id === "market-research"
          ? {
              sources: [
                {
                  sourceId: "S-001",
                  title: "Controlled fixture source",
                  url: "https://example.com/research",
                  publisher: "Example",
                  retrievedAt: new Date().toISOString(),
                  sourceType: "reputable_secondary" as const,
                  quality: "medium" as const,
                  qualityJustification: "Deterministic test fixture."
                }
              ],
              claims: [
                {
                  claimId: "C-001",
                  statement: "A controlled fixture claim.",
                  provenance: "external_fact" as const,
                  sourceIds: ["S-001"],
                  founderInputIds: [],
                  derivedFromClaimIds: [],
                  confidence: "medium" as const,
                  status: "active" as const
                }
              ]
            }
          : {};
    const output = {
      outcome: "completed" as const,
      summary: `Deterministic ${request.stage.id} output for run ${request.runId}.`,
      findings: [`Received ${request.context.length} bounded context document(s).`],
      decisions: [
        `Executed only the ${request.stage.role} role.`,
        `Context sources: ${contextNames || "none"}.`
      ],
      nextActions: request.stage.gateAfter
        ? [`Await ${request.stage.gateName}.`]
        : ["Advance according to the deterministic flow."],
      ...discoveryExtras
    };
    return {
      provider: this.name,
      model: "deterministic-fixture",
      requestId: request.invocationId,
      output,
      raw: output,
      startedAt,
      completedAt: new Date().toISOString()
    };
  }
}
