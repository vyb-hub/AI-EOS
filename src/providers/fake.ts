import type { InvocationRequest, Provider, ProviderResult } from "../domain.js";

export class FakeProvider implements Provider {
  readonly name = "fake";

  async invoke(request: InvocationRequest): Promise<ProviderResult> {
    const startedAt = new Date().toISOString();
    const contextNames = request.context.map((item) => item.path).join(", ");
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
        : ["Advance according to the deterministic flow."]
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
