# AI-EOS v3 — Architecture Proposal

**Status:** Proposed — pending Founder approval and Strategic AI (ChatGPT) architecture review
**Charter:** EC-002
**Depends on:** `AI-EOS_Context_v2.1.md` (core philosophy and principles carry forward unchanged)
**Date:** July 2026

> This document is a proposal, not canonical context. It becomes canonical only when the Founder and Strategic AI approve it, at which point it is expected to be re-issued as `AI-EOS_Context_v3.0.md` alongside (not instead of) `AI-EOS_Context_v2.1.md`.

---

## 1. What AI-EOS v3 Is

AI-EOS v3 is an optional evolution of AI-EOS that transforms it from an **Engineering Operating System** into an **AI-Native Engineering Operating System** — one capable of orchestrating multiple AI models as first-class, role-based collaborators, while remaining fully vendor-neutral.

AI-EOS v3 does not replace AI-EOS v2.x. It exists **alongside** it. A project chooses one version explicitly; both are fully supported.

| | AI-EOS v2.x | AI-EOS v3.0 |
|---|---|---|
| What it is | Engineering Operating System | Engineering Operating System **+ AI Collaboration Framework** |
| Roles | Founder, Strategic AI, Implementation AI (fixed, informal) | Founder + configurable set of AI Roles (Product, Research, Architect, Implementation, Review, QA, Knowledge) |
| Coordination | Human relays context between ChatGPT and Claude Code manually | Stage Router compiles context and invokes the assigned model per role, automatically |
| Model-to-role mapping | Implicit (ChatGPT = Strategic, Claude Code = Implementation) | Explicit, configurable Model Assignment layer |
| Workflow | Charter Workflow (Idea → Discussion → Charter → Implementation → ... → Complete) | Engineering Flows: reusable, staged, role-mapped versions of the same discipline |

## 2. Why This Exists

The v2.x working model already separates **roles** (Founder, Strategic AI, Implementation AI) from the **models** filling them (§5.1, §7 of `AI-EOS_Context_v2.1.md`) — model-agnostic design is already a core principle. AI-EOS v3 takes that separation and makes it structural: instead of a human manually copying context between a ChatGPT conversation and a Claude Code session, AI-EOS itself becomes the router that assigns work to roles, compiles the right context for each role, and passes control along a defined flow.

Nothing about the *philosophy* changes. What changes is that the coordination between AI collaborators becomes a designed, inspectable system rather than an informal habit.

## 3. Core Philosophy Carries Forward Unchanged

AI-EOS v3 adds orchestration on top of the existing foundation. It does not touch:

- **Founder Knowledge is the source of truth** — AI must never invent vision, mission, values, or project DNA (§4 Founder Knowledge Principle).
- **Engineering Charters remain mandatory** — every unit of work still requires an approved charter.
- **ADRs remain mandatory** — every meaningful architectural decision still leaves a trace (P-06).
- **Documentation-First remains mandatory** — P-07 and the Mandatory Development Lifecycle (§10 of `AI-EOS_Context_v2.1.md`) apply identically inside every v3 Engineering Flow.
- **AI-EOS remains vendor-agnostic** — v3 makes this *more* explicit, not less, via the Model Assignment layer (§6 below).

## 4. The New Architecture

```
Founder
    ↓
AI-EOS Runtime
    ↓
Engineering Flow
    ↓
Stage Router
    ↓
AI Roles
    ↓
Underlying Models
```

**Founder** — sets objectives, owns Founder Knowledge, holds every approval gate. Unchanged from v2.x.

**AI-EOS Runtime** — the governing process: loads the project's configuration (which Engineering Flow applies, which Model Assignment is active, which approval gates are configured), and hands control to the Stage Router. This is a conceptual/process layer in this proposal, not a claim that a running software runtime exists yet (see `Migration_Guide_v2_to_v3.md` and the Non-goals in EC-002 — building the runtime is future, separately chartered work).

**Engineering Flow** — a named, reusable sequence of stages (e.g., Feature Development, Bug Fix, Hotfix). See `Engineering_Flow_Specification_v1.0.md`.

**Stage Router** — the component that, for each stage in the flow, determines the required Role, compiles that Role's scoped context, invokes the Model currently assigned to that Role, collects the output, persists it as an artifact, and advances to the next stage. See `Stage_Router_Design_v1.0.md`.

**AI Roles** — permanent, vendor-neutral job descriptions (Product AI, Research AI, Architect AI, Implementation AI, Review AI, QA AI, Knowledge AI). See `AI_Role_Specification_v1.0.md`.

**Underlying Models** — the actual AI systems (ChatGPT, Claude, Gemini, etc.) currently assigned to each Role. See `Model_Assignment_Configuration_v1.0.md`.

**The central distinction:** AI-EOS routes work to Roles, not directly to models. Models are interchangeable. Roles are permanent. Swapping the model behind "Architect AI" from ChatGPT to a different reasoning model changes nothing about the Engineering Flow, the Stage Router, or any other Role.

## 5. No Direct AI-to-AI Invocation

No AI model invokes another AI model directly under this architecture. All coordination — deciding what happens next, what context to hand over, and which model receives it — happens through the Stage Router. This preserves auditability (every handoff is a persisted artifact) and keeps the system model-agnostic (a model never needs to "know about" another model, only about the Role boundary it operates within).

## 6. Context Compilation Principle

AI models never receive the complete AI-EOS knowledge base. The Stage Router compiles only the context required for the current Role's current stage (e.g., Architect Role receives Founder Knowledge + Engineering Principles + Architecture Standards + relevant ADRs + current milestone; Implementation Role receives the approved Charter + Architecture + Coding Standards + current milestone). This keeps prompts efficient and keeps each Role's output traceable to a known, bounded input. Full detail in `Stage_Router_Design_v1.0.md` §Context Compilation.

## 7. Human Approval Gates

Engineering Flows carry configurable Founder approval checkpoints (e.g., architecture approval, major refactors, production releases, breaking changes). A flow cannot cross an approval gate without explicit Founder sign-off — this is the v3 structural equivalent of the v2.x Source Control Rule and "Founder approves before any charter is considered closed" (§5.3). See gate definitions inside `Engineering_Flow_Specification_v1.0.md`.

## 8. Knowledge Capture

At the completion of every Engineering Flow: update ADRs if required, update project memory, capture lessons learned, record an implementation summary, and persist engineering decisions. This is the v3 equivalent of v2.x Phase 5 (Documentation Completion) and P-06 (every meaningful decision leaves a trace), applied uniformly at the end of every flow rather than only at charter close.

## 9. Relationship to the Mandatory Development Lifecycle (§10, v2.1)

The Phase 0–6 lifecycle (Research → Architecture → Documentation Alignment → Implementation → Verification → Documentation Completion → Source Control) is not replaced by Engineering Flows — it is the discipline each stage of a Flow is expected to honor. A Flow's "Implementation" stage, for instance, is still gated by Documentation Alignment having happened first, and still never assumes commit/push/merge/deploy permission.

## 10. What This Proposal Does Not Do

- It does not stand up a working Stage Router, CLI, or runtime. Those require their own implementation charter(s) after this proposal is approved.
- It does not change how v2.x projects operate. A v2.x project is unaffected by any of this unless it explicitly opts in (see `Migration_Guide_v2_to_v3.md`).
- It does not remove the human from the loop. The Founder role's authority is identical to v2.x; approval gates are, if anything, more explicit.

## 11. Companion Documents

| Document | Covers |
|---|---|
| `AI_Role_Specification_v1.0.md` | Each Role's responsibilities, inputs, outputs, decision authority, success criteria |
| `Engineering_Flow_Specification_v1.0.md` | Feature Development, Bug Fix, Architecture Review, Research, Documentation, Release, Hotfix flows |
| `Stage_Router_Design_v1.0.md` | Router responsibilities, context compilation, artifact persistence, stage transitions |
| `Model_Assignment_Configuration_v1.0.md` | Role-to-model mapping schema and example |
| `CLI_Proposal_v1.0.md` | `aieos init --version=v2|v3` and project config file |
| `Migration_Guide_v2_to_v3.md` | How an existing v2.x project opts into v3, and how to roll back |
| `Compatibility_Matrix_v2_v3.md` | Feature-by-feature comparison of v2.x and v3 |
| `Project_Folder_Structure_v3.md` | Recommended repository layout for projects adopting v3 |
