# AI-EOS v3 — Stage Router Design v1.0

**Status:** Proposed — part of EC-002 (design only; no implementation yet — see Non-goals in EC-002)
**Depends on:** `AI_Role_Specification_v1.0.md`, `Engineering_Flow_Specification_v1.0.md`

---

## Purpose

The Stage Router is the single coordination point in AI-EOS v3. It is what makes "AI-EOS routes work to roles, not directly to models" true in practice. No AI model invokes another AI model — every handoff is mediated by the Stage Router.

## Responsibilities

1. **Select the correct AI Role** for the current stage of the active Engineering Flow.
2. **Compile role-specific context** — never the full knowledge base (see Context Compilation below).
3. **Resolve Role → Model** using the active Model Assignment configuration.
4. **Invoke the assigned model** with the compiled context and the stage's expected output format.
5. **Collect the output** and validate it against the stage's expected shape (e.g., an Architecture stage must produce decisions + rejected alternatives, not just prose).
6. **Persist the artifact** — every stage's output is written to the project's knowledge store (ADRs, charters, reports, logs — see `Project_Folder_Structure_v3.md`) before the flow advances.
7. **Evaluate approval gates** — if the next transition is gated, halt and wait for a recorded Founder approval artifact before proceeding.
8. **Advance the flow** to the next stage, or halt/branch (e.g., Bug Fix's conditional return to Architecture) per the Flow's defined transitions.

## What the Stage Router Is Not

- It is not itself an AI model. It holds no opinions and makes no architectural or product decisions — it is a deterministic coordinator.
- It does not grant itself authority over approval gates. A missing Founder approval artifact means the flow stays halted, indefinitely if necessary.
- It does not skip Phase 2 (Documentation Alignment) or Phase 4 (Verification) to save time — Flow definitions that omit these phases must do so explicitly and only when a phase is genuinely inapplicable (see Engineering Flow Specification, "Rules Common to All Flows").

## Context Compilation

For each stage, the Stage Router compiles a bounded context package scoped to that stage's Role — never the complete AI-EOS knowledge base. The general rule: a Role receives what it needs to do its job and nothing else, so that prompts stay efficient and every output stays traceable to a known, bounded input.

Representative compilations (informative, not exhaustive — a full mapping is a Model Assignment / Flow configuration concern):

| Role | Typical compiled context |
|---|---|
| Product AI | Founder Knowledge (vision/priorities), existing roadmap, current milestone |
| Research AI | Current milestone scope, repository/codebase access, existing architecture docs, ADRs |
| Architect AI | Founder Knowledge, Engineering Principles, Architecture Standards, relevant ADRs, current milestone, Research AI's findings |
| Implementation AI | Approved Charter, Architecture decisions, coding/documentation standards, current milestone |
| Review AI | Implementation output, Charter, relevant ADRs, Acceptance Criteria |
| QA AI | Implementation output, Acceptance Criteria, existing verification conventions |
| Knowledge AI | Full record of the completed flow (Charter, findings, decisions, implementation, review, QA results) — this Role is the one exception that receives the broadest context, because its job is to index and connect, not to decide |

Compiled context is itself persisted as an artifact alongside the stage's output, so any handoff can be audited later — what a Role saw is as recorded as what it produced.

## Stage Transition Logic

```
for each stage in flow.stages:
    role      = stage.role
    context   = compile_context(role, flow, project_state)
    model     = resolve_model(role, active_model_assignment)
    output    = invoke(model, context, stage.expected_output_shape)
    validate(output, stage.expected_output_shape)     # reject / retry on shape mismatch
    persist(output, artifact_store)
    if stage.gate:
        wait_for(founder_approval_artifact)           # halts here until recorded
    advance_or_branch(flow, stage, output)             # e.g. Bug Fix's conditional Architecture return
```

This is descriptive pseudocode for the design, not an implementation commitment (per EC-002 Non-goals).

## Artifact Persistence

Every stage produces a persisted artifact: research findings, architecture decisions/ADRs, documentation-alignment updates, implementation output, review findings, verification results, Founder approval records, and the Knowledge Capture summary. Persistence is what makes Knowledge Capture (Phase 5) possible without re-deriving history, and what lets a Flow resume after a halt (e.g., waiting on a Founder gate) without losing state.

## Failure and Halt Behavior

- **Shape/validation failure:** the Stage Router does not silently accept malformed output. It re-invokes the Role (with the validation failure appended to context) up to a configured retry limit, then halts and surfaces the failure — it never guesses at intent on the Role's behalf.
- **Missing approval:** the Flow halts indefinitely at a gate. There is no timeout that auto-approves.
- **QA failure:** the Flow halts at Testing. Only Founder (or an explicitly delegated Review AI, if the Flow configuration allows it) can accept a known-failing check forward — the Router itself never waives a failure.

## Relationship to Model Assignment

The Stage Router never hardcodes a Role-to-Model mapping. It always resolves the model at invocation time from the active Model Assignment configuration (`Model_Assignment_Configuration_v1.0.md`), so that changing which model fills a Role requires a configuration change only — no change to the Router, the Flow definitions, or the Role specifications.
