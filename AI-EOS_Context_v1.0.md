# AI-EOS — Full Context Document
**Version:** 1.0  
**Date:** June 2026  
**Author:** Vybhav Kumar (Founder, Hatio)  
**Purpose:** Complete context for AI collaborators (ChatGPT, Claude Code) to consume and operate within.

---

## 1. What is AI-EOS

AI-EOS (AI-Powered Engineering Operating System) is the governance layer that defines how engineering is done at Hatio. It is not application code. It is the system beneath the code — the philosophy, processes, roles, documentation standards, templates, and decision frameworks that govern how every collaborator (human or AI) operates.

The core premise: most engineering teams run on implicit rules that live in people's heads and erode when anyone leaves. AI-EOS makes those rules explicit, versioned, and shareable — in a form that both humans and AI agents can consume and act on.

**The crucial distinction from a standard engineering handbook:** AI is a first-class participant in this operating system, not a tool bolted onto an existing workflow. The OS is designed from the ground up with AI agents as active collaborators with defined roles, responsibilities, and working protocols.

**Current state:** What exists today is a starter pack — a minimal set of seed documents. The full AI-EOS is envisioned as a dedicated repository of approximately 80–150 pages of high-quality documentation. We are in Phase 0: establishing the blueprint before anything is built.

---

## 2. Working Model

### 2.1 Roles

**Founder (Vybhav Kumar)**
- Owns the vision, sets priorities, makes final approvals
- The human in the loop who provides context, judgment, and accountability
- No AI substitutes for the Founder's final say

**ChatGPT**
- Default roles: CPO, CTO, Principal Architect
- Responsibilities: Strategy, Architecture, Governance, Reviews, Long-term thinking
- Operates across sessions; holds institutional memory on direction and architecture

**Claude Code**
- Role: Senior Software Engineer
- Implements one Engineering Charter at a time
- Does not move to the next charter until the current one is fully complete, reviewed, and documented
- Operates within the philosophy and standards defined by AI-EOS

### 2.2 Workflow

Every piece of work — without exception — moves through this sequence:

```
Idea → Discussion → Engineering Charter → Claude Implementation → Architecture Review → Documentation → Decision Log → Release Notes → Complete
```

No shortcuts. Documentation is part of the Definition of Done. A charter is not complete until the record is written.

### 2.3 Working Agreement Notes

- Claude Code implements; ChatGPT reviews and advises on architecture
- The Founder approves before any charter is considered closed
- AI collaborators explain and recommend — they do not make final decisions unilaterally
- One active charter at a time across the entire system

---

## 3. Core Principles

These are constraints, not aspirations. Every charter, decision, and review is subject to these.

| ID | Principle | Meaning |
|----|-----------|---------|
| P-01 | One milestone at a time | No parallel tracks. Complete a charter fully before starting the next. Breadth is the enemy of depth at this stage. |
| P-02 | Documentation is part of Done | A feature without documentation is a draft. A decision without a log is a rumor. The record is not optional. |
| P-03 | AI explains, never calculates | AI collaborators provide reasoning, strategy, and judgment. Final decisions require a human to own them. AI advice is input, not authority. |
| P-04 | Architect for tomorrow, build for today | Design with the future in mind; implement only what today requires. No speculative features, no premature abstraction. |
| P-05 | Productize after feature completion | Build the thing first. Packaging, polish, and distribution come after the core works and is understood. |
| P-06 | Every meaningful decision leaves a trace | If it changed the direction of the product, the architecture, or the team — it lives in the ADR or Decision Log. Institutional memory is infrastructure. |

---

## 4. Roadmap

### Phase 0 — AI-EOS Blueprint (Current)
Deliverables:
- Working Model document
- Roadmap document
- EC-001 Engineering Charter

Status: In progress. Files exist as a starter pack.

### Phase 1 — Governance Foundation
Deliverables:
- Repository Structure
- Constitution
- Engineering Philosophy
- Documentation Standards

### Phase 2 — Knowledge Infrastructure
Deliverables:
- Knowledge Management
- Versioning
- Review Workflow

### Phase 3 — Tooling & Templates
Deliverables:
- Engineering Charter Specification
- Templates

### Future (Post Phase 3)
- Founder OS
- Engineering Council
- Architecture Fitness Functions
- Project Bootstrap Kit

---

## 5. Engineering Charters

An Engineering Charter is the unit of work for Claude Code. It is a scoped, written specification that defines what to build, the deliverables, and the constraints. Claude Code implements one charter at a time.

### Charter Format (current minimal)
- Charter ID (e.g., EC-001)
- Title
- Deliverables list
- Constraints

### Charter Lifecycle
1. Idea surfaces (Founder or AI)
2. Discussion between Founder and ChatGPT
3. Charter is written and approved
4. Claude Code implements
5. ChatGPT conducts Architecture Review
6. Documentation written
7. Decision Log updated
8. Release Notes written
9. Charter marked Complete

---

## 6. Active Charter: EC-001

**Charter ID:** EC-001  
**Title:** Bootstrap the Engineering Operating System  
**Status:** Active

**Objective:** Build the foundational structure of AI-EOS itself — the repository skeleton, core governance documents, and all scaffolding that future charters will depend on.

**Deliverables:**
- `/docs` directory structure
- Constitution
- Engineering Philosophy
- Documentation Standards
- ADR (Architecture Decision Record) framework
- Knowledge Management system
- Versioning approach
- Templates
- Release Notes format
- Founder Journal
- Engineering Journal
- Knowledge Index

**Constraints:**
- Do not modify application code
- Build governance only

---

## 7. Full Vision — Complete AI-EOS Repository

The target state is 80–150 pages of high-quality documentation across the following areas. Not all of these exist yet. This is the complete intended scope.

| Component | Description |
|-----------|-------------|
| Constitution | The unchanging law of the organization — what we stand for, how we operate, what we never compromise |
| Engineering Philosophy | How we think about building software — principles, tradeoffs, what good looks like |
| Governance | Decision rights, accountability structures, escalation paths |
| Architecture Principles | The structural constraints we commit to across all systems |
| Knowledge Management | How learning accumulates and persists — capturing, organizing, surfacing institutional knowledge |
| Documentation Standards | What good documentation looks like here — formats, depth, templates, ownership |
| Templates | Reusable structure for all recurring work types |
| Claude Working Agreement | Specific protocols for how we engage with Claude Code — how to write charters, what context to provide, how to handle disagreements |
| Engineering Council | Multi-AI governance — how ChatGPT and Claude Code coordinate, escalate, and disagree |
| Architecture Fitness Functions | Automated or manual checks that verify the architecture is holding over time |
| Project Bootstrap Kit | A kit for starting new projects from a known good state, pre-loaded with AI-EOS standards |
| Engineering Charters | The full specification for what a charter is, how to write one, and how to close one |
| Founder OS | How the Founder operates within the system — routines, decision frameworks, journal practice |
| Project DNA Workshop | A structured process for capturing the soul of a new project at inception |
| Multi-Agent Collaboration | Protocols for AI-to-AI and human-to-AI handoffs, context sharing, and role disambiguation |
| Release Management | How work ships, what records it creates, how versions are named and tracked |
| ADR Framework | The full Architecture Decision Record system — format, lifecycle, indexing, review |
| Review Workflow | Who reviews what, at what stage, using what criteria |
| Prompt Library | A curated library of reusable prompts for recurring AI-assisted tasks |
| Founder Journal | The qualitative record of the journey — decisions, doubts, pivots, learnings |
| Company Memory | The organizational knowledge layer — everything that should survive a personnel or AI model change |

---

## 8. Files in This Repository (Current State)

| File | Description |
|------|-------------|
| `README.md` | Minimal pointer — "See included markdown files" |
| `AI-EOS_Working_Model_v1.0.md` | Roles, workflow, and core principles |
| `AI-EOS_Roadmap_v1.0.md` | Phase 0 through Future |
| `EC-001_Bootstrap_EOS_v1.0.md` | First Engineering Charter — bootstrap the OS |
| `AI-EOS vision.rtf` | Extended vision notes — source of the full 80–150 page scope |
| `AI-EOS_Context_v1.0.md` | This file — full context for AI consumption |

---

## 9. Context for AI Collaborators

### For ChatGPT (CPO / CTO / Principal Architect)
You are the strategic and architectural lead on this project. Your job is to:
- Advise on the direction, sequencing, and design of AI-EOS components
- Review Engineering Charters before Claude Code begins
- Conduct Architecture Reviews after Claude Code completes implementation
- Hold long-term memory on decisions, direction, and rationale across sessions
- Challenge the Founder when direction conflicts with established principles

When given a new context session, re-read this document before responding. Your continuity depends on it.

### For Claude Code (Senior Software Engineer)
You implement one Engineering Charter at a time. Before beginning any charter:
- Read and confirm you understand the deliverables and constraints
- Do not begin implementation without an approved charter
- Do not modify application code (during Phase 0 and EC-001 scope)
- Documentation is part of your deliverable — you are not done until it is written
- When in doubt, surface the question rather than making an assumption

---

## 10. Terminology Reference

| Term | Definition |
|------|------------|
| AI-EOS | AI-Powered Engineering Operating System — this project |
| Engineering Charter | A scoped unit of work assigned to Claude Code, with defined deliverables and constraints |
| ADR | Architecture Decision Record — a structured log of a significant architectural decision |
| Definition of Done | A charter is only done when: implemented, reviewed, documented, and logged |
| Governance | The rules, roles, and processes by which the organization makes and enforces decisions |
| Constitution | The foundational document defining the organization's non-negotiable values and operating principles |
| Fitness Function | A test or check that verifies an architectural property is holding over time |
| Knowledge Index | A navigable map of all documentation in the AI-EOS repository |

---

*This document is the authoritative context source for AI-EOS as of June 2026. It should be updated whenever the working model, principles, roadmap, or active charter changes.*
