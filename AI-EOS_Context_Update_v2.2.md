# AI-EOS — Context Update for v2.1
**Title:** Documentation-First Development & Lifecycle Governance
**Date:** July 2026
**Author:** Vybhav Kumar (Founder)

> This document captures architectural understanding that has evolved
> since `AI-EOS_Context_v2.0.md`. It is intended to be merged into the
> canonical AI-EOS documentation as `AI-EOS_Context_v2.1.md`.

---

# Context

As PCFO has evolved into a large, architecture-driven platform, documentation is no longer a passive artifact produced after implementation.

**Documentation is the architectural contract that implementation must satisfy.**

Therefore, whenever the scope, roadmap, architecture, milestone definition, feature boundaries, engineering approach, or product vision changes, documentation must become the source of truth before implementation begins.

This rule applies to every future milestone and every future project built using AI-EOS.

---

# Engineering Principle 16 — Documentation First

Whenever a material change is made to:

- Product scope
- Milestone scope
- Roadmap
- Architecture
- Layering
- Domain model
- Data model
- Feature ownership
- Platform boundaries
- Engineering philosophy
- Product direction
- Integration strategy
- AI strategy
- Deployment strategy

implementation must pause until documentation has been updated.

Documentation becomes the approved design. Implementation becomes the execution of that design.

**No implementation should begin against stale documentation.**

---

# Mandatory Development Lifecycle

Every milestone, feature, architectural change, or enhancement must follow the lifecycle below.

## Phase 0 — Research (when required)

- Explore the existing codebase.
- Identify overlaps.
- Validate assumptions.
- Avoid duplicate platforms.
- Understand existing abstractions.

**Output:** Research findings, architectural observations, known constraints.

## Phase 1 — Architecture

Resolve all architectural decisions before implementation. This includes:

- Layer placement
- Ownership
- Dependency direction
- Extension points
- Naming
- Reuse vs new abstractions
- Future scalability
- Trade-offs
- Explicitly rejected alternatives

No code should be written until these decisions are complete.

## Phase 2 — Documentation Alignment (Mandatory)

Whenever architecture or scope changes, update all affected documentation first. This may include (where applicable):

- MILESTONE_HISTORY
- PROJECT_TIMELINE
- CURRENT_ARCHITECTURE
- KNOWLEDGE_INDEX
- LAYERING_RULES
- Architecture Decision Records (ADR)
- Product Vision
- Product Roadmap
- Engineering Philosophy
- Calibration Logs
- Deployment Documentation
- Sequence Diagrams
- Architecture Diagrams
- Dependency Diagrams
- Vision Documents
- Release Planning
- Any milestone-specific documentation

Documentation must become internally consistent before implementation begins.

## Phase 3 — Implementation

Implementation should faithfully follow the documented architecture. Every abstraction must justify its existence. The implementation should:

- remain deterministic where possible
- preserve architectural boundaries
- avoid unnecessary complexity
- remain additive
- avoid breaking existing behavior
- follow existing project conventions

## Phase 4 — Verification

Before implementation is considered complete:

- Typecheck
- Tests
- Production build
- Real-data validation (where applicable)
- Manual product validation
- Performance review
- Architecture review
- Calibration review

The implementation is not complete until verification succeeds.

## Phase 5 — Documentation Completion

After implementation:

- Update milestone history
- Produce implementation report
- Update calibration log
- Update knowledge index
- Update architecture documentation
- Update deployment documentation
- Update release notes (if applicable)

Documentation should accurately describe the final implemented system.

## Phase 6 — Source Control

- Git operations occur only when explicitly requested.
- Commit only when instructed.
- Push only when instructed.
- Merge only when instructed.
- Deploy only when instructed.

AI-EOS must never assume permission for source control operations.

---

# Prompt Generation Rule

Whenever AI-EOS generates an implementation prompt for any project, it must automatically produce work in the following order:

```
Research
    ↓
Architecture Decisions
    ↓
Documentation Alignment
    ↓
Implementation
    ↓
Verification
    ↓
Documentation Completion
    ↓
Commit (explicit approval)
    ↓
Push (explicit approval)
    ↓
Merge (explicit approval)
    ↓
Deploy (explicit approval)
```

---

# Architecture Rule

Documentation is not an output. Documentation is an input to implementation.

The implementation must satisfy the documented architecture.

If implementation requires changing the architecture, documentation must be updated first before implementation continues.

---

# Scope Change Rule

Whenever new ideas emerge during implementation:

- New milestone
- New platform
- New architectural layer
- New dependency
- New engineering rule
- New product capability

AI-EOS must:

1. Pause implementation.
2. Evaluate architectural impact.
3. Update roadmap.
4. Update architecture documentation.
5. Update milestone definitions.
6. Resume implementation only after documentation alignment.

---

# Source Control Rule

Implementation completion does not imply commit, push, merge, or deploy. Each requires explicit user approval.

AI-EOS should always stop after successful verification and wait for instructions.

---

# AI-EOS Philosophy

Documentation defines the architecture.

Architecture defines the implementation.

Implementation validates the architecture.

Verification proves the implementation.

Documentation records the outcome.

Source control and deployment happen only with explicit approval.
