import type { EvidenceClaim, EvidenceSource } from "./domain.js";
import {
  evidenceClaimSchema,
  evidenceSourceSchema
} from "./schemas.js";

export function validateEvidence(
  rawSources: unknown[],
  rawClaims: unknown[]
): { sources: EvidenceSource[]; claims: EvidenceClaim[] } {
  const sources = rawSources.map((source) => evidenceSourceSchema.parse(source));
  const claims = rawClaims.map((claim) => evidenceClaimSchema.parse(claim));
  const sourceIds = uniqueIds(sources.map(({ sourceId }) => sourceId), "source");
  const claimIds = uniqueIds(claims.map(({ claimId }) => claimId), "claim");

  for (const claim of claims) {
    for (const sourceId of claim.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(
          `Claim ${claim.claimId} references missing source ${sourceId}.`
        );
      }
    }
    for (const claimId of claim.derivedFromClaimIds) {
      if (!claimIds.has(claimId)) {
        throw new Error(
          `Claim ${claim.claimId} references missing claim ${claimId}.`
        );
      }
    }
    if (claim.provenance === "external_fact" && claim.sourceIds.length === 0) {
      throw new Error(`External fact ${claim.claimId} requires a source.`);
    }
    if (
      claim.provenance === "founder_input" &&
      claim.founderInputIds.length === 0
    ) {
      throw new Error(
        `Founder-input claim ${claim.claimId} requires a Founder input ID.`
      );
    }
    if (
      claim.provenance === "inference" &&
      claim.sourceIds.length === 0 &&
      claim.derivedFromClaimIds.length === 0
    ) {
      throw new Error(
        `Inference ${claim.claimId} requires supporting evidence.`
      );
    }
  }
  return { sources, claims };
}

function uniqueIds(ids: string[], kind: string): Set<string> {
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    throw new Error(`Evidence contains a duplicate ${kind} ID.`);
  }
  return unique;
}
