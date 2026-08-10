# EC-004 Product Discovery MVP Architecture Review

**Version:** 1.0  
**Date:** 30 July 2026  
**Reviewer:** Strategic AI  
**Status:** Passed for Founder approval; implementation not yet authorized

## Review Scope

- EC-004 Product Discovery MVP Charter
- Product Discovery MVP Architecture v1.0
- Product Role Specification v1.0
- Product Discovery Flow Specification v1.0
- Founder Input Specification v1.0
- Product Discovery Evidence Specification v1.0
- Product-to-Engineering Handoff Specification v1.0
- Compatibility with the completed EC-003 Runtime

## Verdict

The proposed architecture is sufficiently narrow, testable, and compatible
with the current Runtime to proceed to Founder approval.

It preserves the essential governance boundary: Product Discovery can gather
input, research, recommend, and prepare a handoff, but it cannot approve its
own work or begin product implementation.

## Findings

### 1. Founder input needs a distinct Runtime state

`awaiting_input` is necessary. Treating answers as approvals would destroy
provenance and make it unclear whether the Founder supplied information or
authorized advancement.

### 2. Evidence validation is a release-critical control

The source and claim registries are mandatory MVP behavior. Product Strategy
must not consume unsupported external facts or silently convert assumptions
into evidence.

### 3. Network access is correctly isolated

Only Market Research requires web access. Every later stage should consume
persisted evidence so the resulting strategy and handoff remain reproducible
and reviewable.

### 4. Handoff is correctly separated from Engineering

The generated Engineering Charter remains proposed. Product Readiness Approval
authorizes creation of the handoff package, not Feature Development or source
modification.

### 5. Codex invocation must be verified, not assumed

The implementation must test the exact flags supported by the installed Codex
CLI. It must preserve ChatGPT authentication while excluding unrelated personal
plugins, Computer Use, AppleScript, and dangerous bypass behavior.

### 6. Product Definition is sufficiently specified for MVP

The handoff specification defines the required Product Definition fields and
traceability rules. A separate broader Product OS schema is not required for
this MVP.

## Conditions Carried into Implementation

1. Add automated tests for every `awaiting_input` transition and invalid input.
2. Reject dangling citations and unsourced external facts.
3. Prove only Market Research receives network capability.
4. Prove every Product role is read-only against application source.
5. Test Codex executable resolution through explicit configuration, `PATH`, and
   the ChatGPT application bundle.
6. Confirm governed invocation does not trigger Computer Use or unrelated
   personal integrations.
7. Do not start the generated Engineering Charter automatically.
8. Use a Founder-selected controlled idea for the live end-to-end test.

## Approval Recommendation

Founder may approve the EC-004 documentation package. Implementation should
begin only after that explicit approval and selection of the controlled test
idea.
