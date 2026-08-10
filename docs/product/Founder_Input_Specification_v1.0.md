# Founder Input Specification

**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Proposed — part of EC-004

## Purpose

Allow Product Discovery to ask the Founder structured questions without
confusing answers with approval.

## Question Set

Each generated question set contains:

- `schemaVersion`
- `questionSetId`
- `runId`
- `round`
- `createdAt`
- `basedOnArtifactHashes`
- ordered questions

Each question contains:

- stable `questionId`
- prompt
- reason the answer is needed
- required or optional status
- answer type: text, boolean, single choice, or multiple choice
- choices when applicable

## Founder Response

Each response contains:

- `schemaVersion`
- `responseId`
- `questionSetId`
- `runId`
- `actor: founder`
- `submittedAt`
- answers keyed by `questionId`
- optional notes

The Runtime persists the submitted file byte-for-byte as the Founder response
artifact and separately stores the validated parsed form.

## CLI Contract

```text
aieos discovery questions <run-id>
aieos discovery respond <run-id> --file <answers-path>
```

`questions` prints the active question-set path. `respond` validates and
persists answers, then resumes the flow.

## Validation

The Runtime rejects:

- a response for another run,
- a stale question-set ID,
- missing required answers,
- unknown question IDs,
- invalid choice values,
- a fourth clarification round,
- an answer file outside the declared project root.

Invalid responses do not alter run state.

## Provenance

Each accepted answer receives a stable Founder input ID. Founder Intent claims
must reference one or more of these IDs. Suggestions introduced by AI must use
provenance `assumption` or `inference`, never `founder_input`.

## Privacy

- Founder response artifacts are local by default.
- Only declared Product stages receive them.
- Market Research receives a redacted Intent artifact, not raw answers, unless
  a specific answer is explicitly marked safe for research queries.
- No response is published or sent to an external system automatically.

