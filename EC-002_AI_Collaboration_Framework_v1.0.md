# Engineering Charter EC-002

**Charter ID:** EC-002
**Title:** Introduce AI-EOS v3 — AI Collaboration Framework (Multi-Model Orchestration)
**Status:** Proposed — pending Founder approval and Strategic AI (ChatGPT) architecture review
**Author:** Claude Code (Implementation AI), from a request by Vybhav Kumar (Founder)
**Date:** July 2026

---

## Objective

Extend AI-EOS with an optional orchestration framework — AI-EOS v3 — that lets multiple AI models collaborate through AI-EOS as distinct, role-based participants, while remaining fully vendor-neutral. AI-EOS v3 transforms AI-EOS from an Engineering Operating System into an **AI-Native Engineering Operating System**: one capable of routing work to permanent roles (Founder, Product AI, Research AI, Architect AI, Implementation AI, Review AI, QA AI, Knowledge AI) that are filled by interchangeable, configurable models.

## Scope

- Definition of AI Roles (responsibilities, inputs, outputs, decision authority, success criteria)
- Definition of reusable Engineering Flows (staged sequences of role invocations)
- Design of a Stage Router (selects roles, compiles role-scoped context, invokes models, persists artifacts, advances the flow)
- Design of a Model Assignment configuration layer (maps roles to models, replaceable independently of flows)
- Configurable Founder approval gates within flows
- Knowledge capture at flow completion (ADR updates, project memory, lessons learned)
- A CLI proposal (`aieos init --version=v2|v3`) and project configuration file concept
- A migration guide and compatibility matrix between v2 and v3
- A recommended folder structure for projects that adopt v3

## Non-goals

- This charter does **not** replace, deprecate, or alter AI-EOS v2.x. v2.x remains the default and fully supported.
- This charter does not implement a working CLI binary, runtime, or orchestration code. Deliverables are architecture, specification, and documentation artifacts (Phase 0–2 of the Mandatory Development Lifecycle, per `AI-EOS_Context_v2.1.md` §10). Actual implementation of the Stage Router, CLI, and model adapters is future work, gated on Founder approval and its own charter(s).
- This charter does not change Founder Knowledge, the Founder role's authority, or any Stable Core principle (P-01–P-07). It adds a new Capabilities-layer framework on top of them.
- This charter does not mandate that any existing or future AI-EOS project adopt v3. Adoption is opt-in, per project.

## Deliverables

1. `v3/AI-EOS_v3_Architecture_Proposal.md` — architecture proposal
2. Updated `README.md` — v3 referenced as a parallel, opt-in track
3. `v3/AI_Role_Specification_v1.0.md` — AI role specification
4. `v3/Engineering_Flow_Specification_v1.0.md` — engineering flow specification
5. `v3/Stage_Router_Design_v1.0.md` — Stage Router design
6. `v3/Model_Assignment_Configuration_v1.0.md` — model assignment configuration
7. `v3/CLI_Proposal_v1.0.md` — CLI proposal
8. `v3/Migration_Guide_v2_to_v3.md` — migration guide
9. `v3/Compatibility_Matrix_v2_v3.md` — compatibility matrix
10. `v3/Project_Folder_Structure_v3.md` — recommended project folder structure

## Constraints

- Do not remove, rename, or alter any existing AI-EOS v2.x file or its content.
- Do not modify application code (no application code exists in this repository; this constraint carries over from EC-001).
- All v3 artifacts must be additive and isolated under `v3/` plus this charter file, except for the README, which may only gain new references — no existing README content is removed or reworded beyond what's needed to introduce v3 as a parallel option.
- Core philosophy is non-negotiable and carries forward unchanged: Founder Knowledge is the source of truth; Engineering Charters remain mandatory; ADRs remain mandatory; Documentation-First (P-07) remains mandatory; AI-EOS remains vendor-agnostic.
- No AI model may directly invoke another AI model in the proposed architecture — all coordination routes through AI-EOS (the Stage Router).

## Acceptance Criteria

- All 10 deliverables exist, are internally consistent with each other and with `AI-EOS_Context_v2.1.md`, and use terminology consistently (Role, Flow, Stage, Stage Router, Model Assignment).
- v2.x remains loadable and usable exactly as before — no cross-references were broken, no v2.x file was edited except the README's additive changes.
- The proposal is explicitly marked as pending approval, not canonical, until the Founder and Strategic AI sign off.
- A reader unfamiliar with v3 can, from the Architecture Proposal alone, understand the Founder → AI-EOS Runtime → Engineering Flow → Stage Router → AI Roles → Underlying Models chain and why models are interchangeable but roles are permanent.

## Dependencies

- `AI-EOS_Context_v2.1.md` (core philosophy, principles P-01–P-07, Mandatory Development Lifecycle) — v3 builds on top of this, does not fork it.
- EC-001 (bootstrap charter) — precedent for charter format and constraints style.

## Risks

| Risk | Mitigation |
|------|------------|
| v3 scope creep into implying a build commitment | All deliverables explicitly scoped as proposal/specification, not implementation; charter Non-goals section states this directly. |
| Divergence between v2 and v3 philosophy over time | Compatibility Matrix (deliverable 9) and shared Stable Core principles are the enforcement mechanism — reviewed at every future v3 change. |
| Confusion about which version a project is running | CLI proposal and per-project configuration file make version selection explicit and machine-readable, never implicit. |
| Architecture approved by Founder without Strategic AI review | Charter status stays "Proposed" until both approvals are recorded; recommended before any implementation charter is opened. |

## Review Checklist

- [ ] Strategic AI (ChatGPT) has reviewed the architecture for soundness and alignment with AI-EOS's long-term vision (§2, §19 of `AI-EOS_Context_v2.1.md`)
- [ ] Founder has approved the proposal
- [ ] No v2.x file content was altered beyond the README's additive references
- [ ] Terminology is consistent across all 10 deliverables

## Completion Evidence

This charter is complete when all 10 deliverables are written and this charter's status is updated to reflect Founder + Strategic AI approval (or requested revisions). Implementation of the Stage Router, CLI, and model adapters requires a new, separate Engineering Charter (e.g., EC-003) opened only after this proposal is approved.
