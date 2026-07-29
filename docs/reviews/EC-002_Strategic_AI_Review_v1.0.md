# EC-002 Strategic AI Architecture Review

**Version:** 1.0
**Date:** 29 July 2026
**Reviewer:** Strategic AI
**Status:** Review complete — conditionally approved
**Founder disposition:** Approved 29 July 2026

## Verdict

EC-002 is directionally sound and should be **conditionally approved as the conceptual foundation for the Runtime MVP**, subject to the clarifications in this review.

The proposal correctly separates permanent Roles from replaceable models, centralizes orchestration, scopes context by role, persists artifacts, and preserves Founder gates. These are appropriate foundations.

EC-002 should not be adopted unchanged as a mandate to build every proposed component or support v2 and v3 as two indefinitely parallel products.

## Findings

### 1. Component boundaries are over-separated for the MVP

The Runtime, Workflow Engine, Stage Router, Role Engine, Context Engine, and Approval Engine describe useful responsibilities, but they do not need to be separate services or packages initially.

**Required disposition:** Implement one local Runtime with cohesive internal modules. Preserve boundaries through interfaces only where an external dependency or likely replacement warrants one.

### 2. “v2 and v3 in parallel” conflicts with one active track

Supporting two long-lived product modes before one works increases configuration and migration complexity without validating user value.

**Required disposition:** Treat v2.1 as the governing specification baseline and the reviewed EC-002 concepts as the MVP's additive execution model. Defer dual-version scaffolding and migration commands.

### 3. Role-to-model is too narrow for future capability routing

The Model Assignment file is sufficient for the MVP, but the Runtime vision correctly anticipates capability-based provider selection.

**Required disposition:** Keep the MVP mapping explicit and simple. Do not implement the Capability Registry yet, but ensure the provider interface does not make capability routing impossible later.

### 4. Multi-agent swarms are unnecessary

The existing single-role-per-stage model is easier to audit and validate.

**Required disposition:** One active Role invocation per stage in the MVP. Parallel councils, swarms, and debate flows are post-MVP capabilities.

### 5. File-backed memory is the correct starting point

The prior-art scan shows that portable Markdown and linked files can support useful institutional memory without a graph database.

**Required disposition:** Use structured files and Markdown for MVP state and artifacts. Defer database and knowledge-graph decisions until usage demonstrates a need.

### 6. Approval semantics need immutable evidence

An approval must identify the run, stage, artifact versions or hashes being approved, actor, decision, timestamp, and optional rationale.

**Required disposition:** The Runtime must invalidate or supersede an approval when an approved input materially changes.

### 7. Independent review is a role boundary, not automatically model independence

Requiring separate model instances for every reviewer may prevent useful low-cost operation and does not guarantee genuine independence.

**Required disposition:** Record the model/provider used for every invocation. Warn when author and reviewer resolve to the same provider/model; do not block the MVP unless project policy explicitly requires separation.

### 8. Source-control separation is correct

EC-002 correctly excludes implicit source-control actions.

**Required disposition:** The MVP CLI must not expose commit, push, merge, or deploy commands.

## Conditional Approval Scope

Recommended for adoption:

- Permanent role definitions
- Feature Development flow
- Deterministic central routing
- Bounded context compilation
- Provider-neutral model assignment
- Persisted stage artifacts
- Explicit Founder gates
- Knowledge Capture

Deferred:

- Dual v2/v3 initialization
- Migration commands
- All non-Feature Development flows
- Capability Registry and ranking
- Multi-agent stages
- Product OS
- Web, cloud, team, and marketplace layers

## Founder Decision

The Founder conditionally approved EC-002 under this review on 29 July 2026. The Runtime MVP may use the adopted concepts and must honor the required dispositions and deferrals above.
