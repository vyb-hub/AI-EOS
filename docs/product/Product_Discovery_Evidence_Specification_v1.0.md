# Product Discovery Evidence Specification

**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Proposed — part of EC-004

## Purpose

Make market and competitor research attributable, reviewable, and safe to use
in Product Strategy.

## Source Record

```text
sourceId
title
url
publisher
publishedAt? 
retrievedAt
sourceType
quality
notes?
```

`sourceType` is one of:

- official
- primary_research
- government
- academic
- reputable_secondary
- vendor
- community
- unknown

`quality` is `low`, `medium`, or `high`, with a short justification.

## Claim Record

```text
claimId
statement
provenance
sourceIds[]
founderInputIds[]
derivedFromClaimIds[]
confidence
status
```

`provenance` is:

- founder_input
- external_fact
- inference
- assumption
- decision

`confidence` is `low`, `medium`, or `high`.

`status` is `active`, `rejected`, or `superseded`.

## Validation Rules

1. `external_fact` requires at least one source ID.
2. `founder_input` requires at least one Founder input ID.
3. `inference` requires supporting claim IDs or source IDs.
4. `assumption` must not present source IDs as proof.
5. `decision` requires a Founder approval or approved upstream decision ID.
6. Every referenced ID must exist.
7. Every URL must use HTTPS unless the source is explicitly marked legacy.
8. Retrieval timestamps must be present.
9. Duplicate canonical URLs are normalized to one source record.
10. Superseded claims identify their replacement when one exists.

## Research Package

The Market Research stage produces:

- research bounds
- source registry
- claim registry
- competitor comparison
- market observations
- contradictions
- evidence gaps
- assumptions requiring validation
- research limitations

## Citation in Human-Readable Artifacts

Human-readable findings cite stable source IDs:

```text
The market has adopted X pattern. [S-003]
```

The source registry resolves `S-003` to its title, publisher, URL, and retrieval
date.

## Strategy Consumption

Product Strategy may consume:

- approved Founder input,
- active external facts,
- labeled inferences,
- visible assumptions.

It may not silently promote an assumption to fact or use a rejected claim.

## Copyright and Data Handling

- Store short notes and paraphrased findings, not full articles.
- Quotations must be minimal and attributed.
- Do not bypass authentication, paywalls, robots controls, or access policies.
- Do not collect personal data unnecessary for Product Discovery.

## Evidence Approval

Research Evidence Approval binds to:

- research bounds hash,
- source registry hash,
- claim registry hash,
- research artifact hash.

Changing any bound artifact invalidates Research Evidence Approval and all
downstream approvals derived from it.

