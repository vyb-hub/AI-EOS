# AI-EOS Product Discovery MVP Roadmap

**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Active  
**Authority:** DR-003 and approved EC-004 when granted

## North Star

Prove that AI-EOS can turn a raw Founder idea into an evidence-backed,
Founder-approved Product Definition and a proposed Engineering Charter without
inventing Founder intent or starting implementation.

## Milestone 0 — Product Documentation Approval

**Status:** Complete

- Approve EC-004
- Approve Product Discovery MVP Architecture
- Approve Product Roles and Flow
- Approve Founder Input and Evidence contracts
- Approve Product-to-Engineering handoff
- Select one controlled test idea

**Exit:** Founder explicitly approves the complete EC-004 documentation package.

## Milestone 1 — Runtime Extensions

**Status:** Complete

- Add `awaiting_input` state
- Add question-set and Founder-response persistence
- Add input validation, resume, and invalidation behavior
- Add evidence and citation schemas
- Harden Codex executable resolution and governed invocation
- Enforce network access only for Market Research

**Exit:** Automated tests prove input, evidence, permissions, and recovery
behavior without a live provider.

## Milestone 2 — Product Discovery Flow

**Status:** Complete in deterministic validation

- Implement the Product roles and stage definitions
- Produce Founder Intent and enforce its approval
- Produce attributable Market Research and enforce Evidence Approval
- Produce Product Strategy and bounded MVP Scope
- Enforce MVP Scope Approval

**Exit:** A fake-provider run reaches approved MVP Scope with complete
traceability and no workspace writes by Product roles.

## Milestone 3 — Product Definition and Handoff

**Status:** Complete in deterministic validation

- Generate requirements and the primary user journey
- Run independent Product Readiness Review
- Enforce Product Readiness Approval
- Assemble Product Definition
- Generate a proposed Engineering Charter
- Prove that handoff does not start Feature Development

**Exit:** The generated Charter traces to approved Product requirements and
remains proposed.

## Milestone 4 — Controlled Live Validation

**Status:** Awaiting Founder-selected idea

- Run the Founder-selected idea through Codex CLI
- Answer discovery questions as Founder
- Review all four approval gates
- Validate source URLs, citations, and research limitations
- Interrupt and resume the run
- Confirm that no application source is modified

**Exit:** One attributable idea-to-Charter run completes with recorded Founder
acceptance.

## Milestone 5 — MVP Release Readiness

**Status:** In progress

- Complete type checking and automated verification
- Complete architecture and privacy review
- Publish local quick-start and Founder testing guide
- Produce traceability matrix and completion report
- Record limitations and post-MVP backlog

**Exit:** Founder accepts EC-004 completion. Commit, push, publication, and
execution of the generated Engineering Charter remain separately authorized.

## Recommended Build Order

1. Runtime state and schema work
2. Invocation and permission hardening
3. Product stages through MVP Scope
4. Product Definition and handoff
5. Controlled live validation
6. Documentation and release readiness

## Explicitly Deferred

Product implementation, primary customer research, financial modeling, UI
design, analytics, multiple discovery flows, cloud collaboration, autonomous
source control, and automatic execution of generated Charters.
