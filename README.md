# AI-EOS

**AI-Powered Engineering Operating System**

Independent. Vendor-neutral. Adoptable by any software project.

> Products adopt AI-EOS. Organizations do not own AI-EOS.

---

## What it is

AI-EOS is not a documentation project. It is an Operating System for how engineering gets done.

Documentation is one artifact it produces. The OS governs:

- Engineering philosophy
- Governance and decision-making
- Architecture
- Reviews
- Release management
- Institutional memory
- AI collaboration protocols

It is the layer beneath the code — the system that tells every collaborator, human or AI, how to operate.

---

## What it is not

- It is not owned by Hatio or any other company
- It is not a wiki or a folder of markdown files
- It is not a prompt library
- It is not finished

---

## Current state

**Phase 0 — Blueprint.**

The files here are a deliberate starter pack. The full AI-EOS is envisioned as 80–150 pages of governance, philosophy, and tooling. Nothing has been built against a charter yet. That is correct. The blueprint comes first.

**Active charter:** EC-001 — Bootstrap the Engineering Operating System.

**Proposed charter (pending approval):** EC-002 — Introduce AI-EOS v3, an optional AI Collaboration Framework. See [Parallel track: AI-EOS v3](#parallel-track-ai-eos-v3) below.

---

## Working model

| Role | Currently | Responsibility |
|------|-----------|----------------|
| Founder | Vybhav Kumar | Vision, priorities, final approval |
| Strategic AI | ChatGPT | CPO / CTO / Principal Architect — strategy, architecture, reviews |
| Implementation AI | Claude Code | Senior Software Engineer — one charter at a time |

**Roles are permanent. Models are not.** AI-EOS is model-agnostic by design.

**Workflow:** Idea → Discussion → Charter → Implementation → Architecture Review → Documentation → Decision Log → Release Notes → Complete

---

## Files

| File | Purpose |
|------|---------|
| [`AI-EOS_Context_v2.1.md`](./AI-EOS_Context_v2.1.md) | **Canonical context. Start here.** Load into any AI session. |
| [`AI-EOS_Context_v2.0.md`](./AI-EOS_Context_v2.0.md) | Previous version. Superseded. Preserved for reference. |
| [`AI-EOS_Context_v1.0.md`](./AI-EOS_Context_v1.0.md) | Original version. Superseded. Preserved for reference. |
| [`AI-EOS_Context_Update_v2.2.md`](./AI-EOS_Context_Update_v2.2.md) | Source update that produced v2.1 (Documentation-First development & lifecycle governance). |
| [`AI-EOS_Context_Update_v2.1.md`](./AI-EOS_Context_Update_v2.1.md) | Source update that produced v2.0. |
| [`AI-EOS_Working_Model_v1.0.md`](./AI-EOS_Working_Model_v1.0.md) | Roles, workflow, and principles. |
| [`AI-EOS_Roadmap_v1.0.md`](./AI-EOS_Roadmap_v1.0.md) | Phase 0 through Future. |
| [`EC-001_Bootstrap_EOS_v1.0.md`](./EC-001_Bootstrap_EOS_v1.0.md) | Active Engineering Charter. |
| [`AI-EOS vision.rtf`](./AI-EOS%20vision.rtf) | Extended vision notes — source of the full scope. |

---

## For AI collaborators

Load `AI-EOS_Context_v2.1.md` at the start of every session.

It contains: what AI-EOS is, the working model, roles and workflow, core principles, active charter status, the full vision scope, and operating instructions specific to your role.

**If something in the context document conflicts with your default behavior, the context document wins.**

---

## Core principles

| ID | Principle |
|----|-----------|
| P-01 | One milestone at a time |
| P-02 | Documentation is part of Done |
| P-03 | AI explains, never calculates |
| P-04 | Architect for tomorrow, build for today. Refactor when tomorrow arrives. |
| P-05 | Productize after feature completion |
| P-06 | Every meaningful decision leaves a trace |
| P-07 | Documentation First — implementation pauses until docs reflect any material scope/architecture change |

---

## Roadmap

| Phase | Name | Status |
|-------|------|--------|
| 0 | AI-EOS Blueprint | **Active** |
| 1 | Governance Foundation | Upcoming |
| 2 | Knowledge Infrastructure | Upcoming |
| 3 | Tooling & Templates | Upcoming |
| — | Advanced Systems | Future |

---

## Parallel track: AI-EOS v3

AI-EOS v3 is a **proposed, optional** evolution — an AI Collaboration Framework layered on top of everything above. It does not replace AI-EOS v2.x. Both versions are fully supported; a project explicitly selects one (e.g., `aieos init --version=v2` or `--version=v3`, per the CLI proposal).

**Status:** Proposal only, under Charter EC-002. Nothing here is canonical until the Founder and Strategic AI approve it. No v2.x file is altered by this track beyond this README's additive references.

| File | Purpose |
|------|---------|
| [`EC-002_AI_Collaboration_Framework_v1.0.md`](./EC-002_AI_Collaboration_Framework_v1.0.md) | Proposed Engineering Charter for v3 |
| [`v3/AI-EOS_v3_Architecture_Proposal.md`](./v3/AI-EOS_v3_Architecture_Proposal.md) | Architecture overview — Founder → AI-EOS Runtime → Engineering Flow → Stage Router → AI Roles → Underlying Models |
| [`v3/AI_Role_Specification_v1.0.md`](./v3/AI_Role_Specification_v1.0.md) | Founder, Product AI, Research AI, Architect AI, Implementation AI, Review AI, QA AI, Knowledge AI |
| [`v3/Engineering_Flow_Specification_v1.0.md`](./v3/Engineering_Flow_Specification_v1.0.md) | Feature Development, Bug Fix, Architecture Review, Research, Documentation, Release, Hotfix |
| [`v3/Stage_Router_Design_v1.0.md`](./v3/Stage_Router_Design_v1.0.md) | Coordination component — design only, not yet implemented |
| [`v3/Model_Assignment_Configuration_v1.0.md`](./v3/Model_Assignment_Configuration_v1.0.md) | Role → Model mapping schema |
| [`v3/CLI_Proposal_v1.0.md`](./v3/CLI_Proposal_v1.0.md) | `aieos init --version=` and project config file |
| [`v3/Migration_Guide_v2_to_v3.md`](./v3/Migration_Guide_v2_to_v3.md) | Optional, additive, fully reversible migration path |
| [`v3/Compatibility_Matrix_v2_v3.md`](./v3/Compatibility_Matrix_v2_v3.md) | What's shared, v2-only, and v3-only |
| [`v3/Project_Folder_Structure_v3.md`](./v3/Project_Folder_Structure_v3.md) | Recommended repo layout for projects adopting v3 |

---

## Canonical workspace

The ChatGPT conversation with the Founder is the canonical strategic workspace for AI-EOS. Architectural direction originates there. Implementation happens via Claude Code. This repository is the record.

---

*AI-EOS · v2.1 · July 2026 · Independent*
