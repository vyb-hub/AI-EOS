# Decision Record DR-002

**Title:** Explicit Stage Outcomes and Controlled Implementation Writes
**Version:** 1.0
**Date:** 29 July 2026
**Status:** Adopted as corrective Runtime safety behavior
**Charter:** EC-003

## Context

The first live Codex-backed flow produced schema-valid Review and Verification
artifacts that explicitly stated the implementation was not verified. The
Runtime nevertheless opened Founder Completion Approval because the original
generic schema validated document shape but did not encode stage success or
failure.

The same run demonstrated that a read-only Implementation stage can produce
only an implementation plan or narrative, not implementation evidence.

## Decision

1. Every stage output declares `completed`, `needs_changes`, or `failed`.
2. The Runtime advances only on `completed`.
3. `needs_changes` and `failed` halt the run and never open the next gate.
4. The Implementation stage invokes Codex with `workspace-write`.
5. Every other MVP stage invokes Codex with `read-only`.
6. No stage receives dangerous sandbox bypass or source-control authority.
7. Review and Verification receive the approved Documentation Alignment artifact.

## Consequences

- Schema validity is no longer confused with successful stage completion.
- Negative Review or QA findings cannot open Founder Completion Approval.
- Implementation can produce actual repository evidence.
- Write authority remains scoped to one stage and one project root.
- The first live run remains defect evidence and must not receive Completion Approval.
