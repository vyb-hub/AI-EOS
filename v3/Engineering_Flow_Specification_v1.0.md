# AI-EOS v3 — Engineering Flow Specification v1.0

**Status:** Proposed — part of EC-002
**Depends on:** `AI_Role_Specification_v1.0.md`

---

## Purpose

An Engineering Flow is a named, reusable sequence of stages. Each stage names the Role required, not the model — the Stage Router resolves Role → Model at invocation time via the active Model Assignment configuration. Every Flow implicitly honors the Mandatory Development Lifecycle (§10 of `AI-EOS_Context_v2.1.md`); Flows are how that lifecycle is expressed as a concrete, repeatable sequence per work type.

## Flow Definition Format

| Field | Description |
|---|---|
| Flow ID | Stable identifier, e.g. `flow.feature-development` |
| Trigger | What starts this flow |
| Stages | Ordered list of (Stage name → Role required → Approval gate? Y/N) |
| Exit criteria | What must be true for the flow to reach Complete |
| Knowledge Capture | What gets recorded at close (defaults to the standard set unless overridden) |

---

## Feature Development

**Trigger:** A new feature or milestone is approved for work.

```
Planning            → Product AI                          
    ↓
Research            → Research AI                          (Phase 0)
    ↓
Architecture        → Architect AI               [gate]    (Phase 1)
    ↓
Documentation Align → Architect AI + Knowledge AI [gate]    (Phase 2)
    ↓
Implementation      → Implementation AI                     (Phase 3)
    ↓
Review              → Review AI                             
    ↓
Testing             → QA AI                                 (Phase 4)
    ↓
Founder Approval    → Founder                    [gate]    
    ↓
Knowledge Capture   → Knowledge AI                           (Phase 5)
```

Source Control (Phase 6) is not a stage in the Flow itself — per the Source Control Rule, it is never implied by Flow completion. It is always a separate, explicit Founder-triggered action.

**Exit criteria:** Founder Approval stage passed; Knowledge Capture recorded.

---

## Bug Fix

**Trigger:** A defect is reported or discovered.

```
Research      → Research AI              (reproduce, isolate root cause)
    ↓
Architecture  → Architect AI   [gate, only if fix touches architecture]
    ↓
Implementation → Implementation AI
    ↓
Review        → Review AI
    ↓
Testing       → QA AI (regression + fix verification)
    ↓
Founder Approval → Founder     [gate]
    ↓
Knowledge Capture → Knowledge AI
```

The Architecture stage's gate is conditional — most bug fixes do not require it. If Implementation AI or Review AI determines a fix requires an architectural change, the Flow routes back to Architecture before continuing (this is the Scope Change Rule enacted as a Flow transition, not a manual pause).

---

## Architecture Review

**Trigger:** A standalone request to evaluate existing or proposed architecture (not tied to shipping a feature).

```
Research     → Research AI
    ↓
Architecture → Architect AI
    ↓
Review       → Review AI
    ↓
Founder Approval → Founder [gate]
    ↓
Knowledge Capture → Knowledge AI (ADR update mandatory)
```

**Exit criteria:** ADR written or updated; Founder has explicitly accepted or rejected the reviewed architecture.

---

## Research

**Trigger:** An open question needs investigation before any commitment to build.

```
Research → Research AI
    ↓
Founder Approval → Founder [gate] (accept findings / request more research)
    ↓
Knowledge Capture → Knowledge AI
```

**Exit criteria:** Findings delivered and either accepted (may seed a future Feature Development or Architecture Review flow) or explicitly closed with no action.

---

## Documentation

**Trigger:** Documentation-only work — no code/architecture change (e.g., filling a knowledge gap, writing a guide).

```
Planning → Product AI (or Founder directly)
    ↓
Implementation → Knowledge AI (drafts documentation)
    ↓
Review → Review AI
    ↓
Founder Approval → Founder [gate]
    ↓
Knowledge Capture → Knowledge AI (index update)
```

---

## Release

**Trigger:** A set of completed Feature Development / Bug Fix flows is ready to ship together.

```
Review        → Review AI (aggregate review across included flows)
    ↓
Testing       → QA AI (release-level verification)
    ↓
Founder Approval → Founder [gate — production release]
    ↓
Source Control → (Commit / Push / Merge / Deploy — each a separate, explicit Founder-triggered action, never implied)
    ↓
Knowledge Capture → Knowledge AI (release notes, changelog)
```

---

## Hotfix

**Trigger:** A production-affecting defect requires an expedited fix.

```
Research       → Research AI (fast root-cause only)
    ↓
Implementation → Implementation AI
    ↓
Testing        → QA AI (targeted verification — full regression may follow post-fix)
    ↓
Founder Approval → Founder [gate — always required, never skipped even under time pressure]
    ↓
Source Control → Founder-triggered, explicit
    ↓
Knowledge Capture → Knowledge AI (must include why this was a hotfix and what full-regression follow-up is owed)
```

Hotfix compresses stages for speed but does **not** remove the Founder Approval gate or Knowledge Capture — those are non-negotiable in every Flow, matching the Source Control Rule and P-06.

---

## Rules Common to All Flows

- Every Flow honors Phases 0–6 of the Mandatory Development Lifecycle; a Flow may skip a phase only when that phase is inapplicable (e.g., no Research needed for a one-line documentation fix), never when it's merely inconvenient.
- Every Flow ends in Knowledge Capture. A Flow is not "Complete" without it (mirrors P-02 and P-06).
- Approval gates marked `[gate]` require explicit Founder sign-off recorded as an artifact — the Stage Router cannot advance past a gate on its own authority.
- Source Control actions are never a Flow stage that completes automatically; they are always a distinct, explicitly Founder-triggered action per the Source Control Rule (§10.5 of `AI-EOS_Context_v2.1.md`).
- New Flows may be defined by projects adopting v3; they must follow this same format (Trigger, Stages, Exit criteria, Knowledge Capture) to remain interoperable with the Stage Router.
