# AI-EOS — Full Context Document
**Version:** 2.0  
**Date:** June 2026  
**Author:** Vybhav Kumar (Founder)  
**Supersedes:** AI-EOS_Context_v1.0.md  
**Purpose:** Complete context for all AI collaborators (ChatGPT, Claude Code, and any future agents) to consume and operate within.

---

## Changelog from v1.0

| # | Correction / Addition |
|---|----------------------|
| C-01 | **Critical:** AI-EOS is not associated with any company. It is independent and vendor-neutral. |
| C-02 | **Critical:** AI-EOS is an Operating System, not documentation. Documentation is one artifact it produces. |
| A-01 | Added: Four Knowledge Domains |
| A-02 | Added: Founder Knowledge Principle |
| A-03 | Added: Stable Core / Capabilities / Experiments architecture |
| A-04 | Added: Context Engineering as a first-class discipline |
| A-05 | Added: Multi-Agent Orchestration flow |
| A-06 | Added: Model-Agnostic Design principle |
| A-07 | Updated: Full Engineering Charter format |
| A-08 | Added: Knowledge Graph Mindset |
| A-09 | Added: Architecture Fitness Functions detail |
| A-10 | Added: Governance of AI-EOS (self-evolution model) |
| A-11 | Added: AI Collaboration Protocols |
| A-12 | Added: Documentation Evolution Strategy |
| A-13 | Added: Long-Term Vision |
| A-14 | Added: Canonical Workspace definition |

---

## 1. What is AI-EOS

AI-EOS (AI-Powered Engineering Operating System) is an independent, vendor-neutral Engineering Operating System. It is not owned by any company, team, or individual. It is designed to be adopted by any software project — individuals, startups, engineering teams, enterprises, or open source projects.

**Products adopt AI-EOS. Organizations do not own AI-EOS.**

AI-EOS is an Operating System. Documentation is one artifact it produces. The OS governs:

- Engineering philosophy
- Governance
- Architecture
- Decision making
- Reviews
- Documentation
- Release management
- Institutional memory
- AI collaboration

The core problem it solves: most engineering teams run on implicit rules that live in people's heads and erode when anyone leaves. AI-EOS makes those rules explicit, versioned, and shareable — in a form that both humans and AI agents can consume and act on.

**The crucial distinction from a standard engineering handbook:** AI is a first-class participant, not a tool bolted on. The OS is designed from the ground up with AI agents as active collaborators with defined roles, protocols, and accountability.

**Current state:** What exists today is a starter pack — a minimal set of seed documents. The full AI-EOS is envisioned as a dedicated repository of approximately 80–150 pages of high-quality documentation. We are in Phase 0: establishing the blueprint before anything is built.

---

## 2. Long-Term Vision

AI-EOS aims to become a reusable Engineering Operating System that any software project can adopt.

- Products inherit AI-EOS
- AI-EOS inherits from no product
- Engineering knowledge becomes portable, versioned, reviewable, and continuously improved

A team of any size should be able to adopt AI-EOS and immediately have a working governance layer, a structured way to collaborate with AI, and a living knowledge system — without rebuilding these from scratch.

---

## 3. Architecture Layers

Everything inside AI-EOS belongs to one of three layers. This determines how it is treated, how it evolves, and how stable it must be.

### Stable Core
The foundation. Changes rarely and requires the full governance process.
- Constitution
- Governance
- Engineering Philosophy
- Standards

### Capabilities
Active tooling. Evolves with the state of the art.
- Templates
- AI Agents
- Workflows
- MCP integrations
- Prompt libraries

### Experiments
Unproven. Must graduate to Capabilities before being relied on.
- Research
- Prototype agents
- New workflows
- Emerging AI techniques

Only mature capabilities graduate into the Stable Core.

---

## 4. Four Knowledge Domains

AI-EOS separates knowledge into four independent domains. These evolve independently but remain connected.

| Domain | Owned by | Contents |
|--------|----------|----------|
| Founder Knowledge | Founder | Vision, mission, values, project DNA, founder philosophy |
| Engineering Knowledge | AI-EOS + Team | Architecture, decisions, standards, ADRs, charters |
| Product Knowledge | Product + Founder | Features, roadmaps, user context, product decisions |
| Operational AI Knowledge | AI-EOS | Protocols, prompts, context packs, working agreements |

### Founder Knowledge Principle

AI must **never** invent:
- Vision
- Mission
- Values
- Project DNA
- Founder philosophy

AI should instead:
- Facilitate workshops
- Ask questions
- Expose inconsistencies
- Generate frameworks
- Document decisions

The Founder owns Founder Knowledge. AI captures and preserves it — it does not create it.

---

## 5. Working Model

### 5.1 Roles

**Founder (Vybhav Kumar)**
- Owns the vision, sets priorities, makes final approvals
- The human in the loop who provides context, judgment, and accountability
- No AI substitutes for the Founder's final say
- Owns all Founder Knowledge

**Strategic AI (currently: ChatGPT)**
- Default roles: CPO, CTO, Principal Architect
- Responsibilities: Strategy, Architecture, Governance, Reviews, Long-term thinking
- Operates across sessions; holds institutional memory on direction and architecture
- The canonical strategic workspace is the ChatGPT conversation (see Section 12)

**Implementation AI (currently: Claude Code)**
- Role: Senior Software Engineer
- Implements one Engineering Charter at a time
- Does not move to the next charter until the current one is fully complete, reviewed, and documented
- Operates within the philosophy and standards defined by AI-EOS

**Note on model-agnostic design:** These roles are currently filled by ChatGPT and Claude Code. AI-EOS is designed so that any capable model can fill any role. The roles are permanent; the models filling them may change.

### 5.2 Charter Workflow

Every piece of work — without exception — moves through this sequence:

```
Idea → Discussion → Engineering Charter → Implementation → Architecture Review → Documentation → Decision Log → Release Notes → Complete
```

No shortcuts. Documentation is part of the Definition of Done. A charter is not complete until the record is written.

### 5.3 Working Agreement Notes

- Implementation AI executes; Strategic AI reviews and advises on architecture
- The Founder approves before any charter is considered closed
- AI collaborators explain and recommend — they do not make final decisions unilaterally
- One active charter at a time across the entire system

---

## 6. Multi-Agent Orchestration

AI-EOS coordinates specialized collaborators. Roles may be fulfilled by different models and tools. The typical flow:

```
Founder
    ↓
Strategic AI        (ChatGPT — strategy, architecture, charter review)
    ↓
Architect AI        (may be same as Strategic AI)
    ↓
Implementation AI   (Claude Code — writes code and governance artifacts)
    ↓
Review AI           (may be same as Strategic AI)
    ↓
Documentation AI    (may be same as Implementation AI)
    ↓
Knowledge AI        (captures and indexes everything)
```

No single model is a dependency. The orchestration pattern is stable even when the models change.

---

## 7. Model-Agnostic Design

AI-EOS is intentionally vendor-neutral.

**Reasoning models:** ChatGPT, Claude, Gemini, and future reasoning models  
**Implementation agents:** Claude Code, Codex, Gemini CLI, Cursor, and future coding agents  
**Tooling:** MCP, GitHub, databases, documentation systems, issue trackers, and future integrations

No single model, tool, or vendor is a dependency. AI-EOS must function if any individual component is replaced.

---

## 8. Context Engineering

Prompt Engineering is insufficient.

AI-EOS treats **Context Engineering** as a first-class discipline. The quality of context provided to any AI collaborator directly determines the quality of its output.

Context includes:
- Engineering Charters
- ADRs
- Architecture history
- Release history
- Engineering journals
- Knowledge indices
- Repository structure
- Project memory
- Working agreements

High-quality context produces high-quality engineering.

This means AI-EOS invests in building, maintaining, and delivering context — not just writing prompts.

---

## 9. Core Principles

These are constraints, not aspirations. Every charter, decision, and review is subject to these.

| ID | Principle | Meaning |
|----|-----------|---------|
| P-01 | One milestone at a time | No parallel tracks. Complete a charter fully before starting the next. Breadth is the enemy of depth at this stage. |
| P-02 | Documentation is part of Done | A feature without documentation is a draft. A decision without a log is a rumor. The record is not optional. |
| P-03 | AI explains, never calculates | AI collaborators provide reasoning, strategy, and judgment. Final decisions require a human to own them. AI advice is input, not authority. |
| P-04 | Architect for tomorrow, build for today | Design with the future in mind; implement only what today requires. Refactor when tomorrow arrives. No speculative abstraction. |
| P-05 | Productize after feature completion | Build the thing first. Packaging, polish, and distribution come after the core works and is understood. |
| P-06 | Every meaningful decision leaves a trace | If it changed the direction of the product, the architecture, or the team — it lives in the ADR or Decision Log. Institutional memory is infrastructure. |

> **On P-04 (Evolutionary Architecture):** Architect for tomorrow. Build for today. Refactor when tomorrow arrives. Avoid speculative abstraction.

---

## 10. Engineering Charters

An Engineering Charter is the contract for a unit of work. It is written before implementation begins and must be approved by the Founder and reviewed by the Strategic AI.

### Full Charter Format

| Field | Description |
|-------|-------------|
| Charter ID | Sequential identifier (e.g., EC-001) |
| Title | Short, precise name for the work |
| Objective | What this charter achieves and why |
| Scope | What is included |
| Non-goals | What is explicitly excluded |
| Deliverables | Specific artifacts to be produced |
| Constraints | Rules that cannot be violated |
| Acceptance Criteria | How completion is verified |
| Dependencies | Other charters, documents, or systems this depends on |
| Risks | Known risks and mitigations |
| Review Checklist | What the reviewer must verify |
| Completion Evidence | Proof that the charter is done |

### Charter Lifecycle

1. Idea surfaces (Founder or AI)
2. Discussion between Founder and Strategic AI
3. Charter is written in full format
4. Strategic AI reviews charter before implementation begins
5. Founder approves
6. Implementation AI executes
7. Strategic AI conducts Architecture Review
8. Documentation written
9. Decision Log updated
10. Release Notes written
11. Charter marked Complete

---

## 11. Active Charter: EC-001

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

## 12. Canonical Workspace

The ChatGPT conversation with Vybhav is the canonical strategic workspace for AI-EOS.

Its purpose:
- Evolve the operating system
- Challenge architectural decisions
- Preserve long-term reasoning across sessions
- Review governance
- Refine principles
- Prepare Engineering Charters before implementation

Implementation may occur in other tools (Claude Code, etc.), but architectural direction originates in the canonical workspace.

Product repositories consume AI-EOS but do not redefine it.

---

## 13. Governance of AI-EOS

AI-EOS evolves through the same discipline it promotes. Every meaningful change to AI-EOS itself follows:

```
Proposal
→ Discussion
→ Architecture Review
→ Approval
→ Implementation
→ Documentation
→ Release
→ Changelog
→ Migration Notes
```

The operating system is not exempt from its own governance.

---

## 14. AI Collaboration Protocols

Beyond prompts, AI-EOS defines explicit protocols for every collaboration boundary:

| Protocol | Description |
|----------|-------------|
| Founder ↔ AI | How the Founder engages, delegates, and reviews |
| AI ↔ AI | How Strategic AI and Implementation AI hand off work |
| Human ↔ AI | General human-AI working patterns across all roles |
| AI ↔ Repository | How AI reads from and writes to the codebase and docs |
| AI ↔ Documentation | How AI produces, updates, and indexes documentation |
| AI ↔ MCP | How AI uses tool integrations within the OS |
| AI ↔ External Systems | How AI interfaces with GitHub, issue trackers, databases |

These protocols ensure consistent collaboration regardless of which model or tool fills a role.

---

## 15. Knowledge Graph Mindset

AI-EOS should be treated as a connected knowledge graph — not a folder hierarchy.

Relationships between decisions, architecture, implementation, reviews, and releases are first-class. An ADR connects to the charter that prompted it, the release that shipped it, and any future ADRs that supersede it.

This mindset shapes how documentation is written (always cross-referenced), how the Knowledge Index is built (relationship-aware), and how AI agents navigate the system (by following links, not just reading files).

---

## 16. Architecture Fitness Functions

Fitness Functions are continuous governance mechanisms that verify the architecture is holding over time.

Examples:
- Dependency validation
- Architectural layering compliance
- Documentation completeness
- ADR coverage (no undocumented architectural decisions)
- Technical debt thresholds
- Test health
- Architecture rule compliance

Fitness Functions live in the Capabilities layer until mature, then graduate to Stable Core.

---

## 17. Documentation Evolution Strategy

AI-EOS evolves like a software product — through modular documents with clear ownership, not through a single ever-growing context file.

### Document Types and Ownership

| Document Type | Stability | Ownership |
|---------------|-----------|-----------|
| Constitution | Stable Core — rarely changes | Founder + Strategic AI |
| Engineering Philosophy | Stable Core | Founder + Strategic AI |
| ADRs | Append-only — each is permanent | Implementation AI + Review |
| Engineering Charters | Per-unit — closed when done | Strategic AI + Founder |
| Working Agreements | Capabilities — model-specific | Strategic AI per tool |
| Standards & Templates | Capabilities | Strategic AI |
| Release Notes & Changelog | Append-only | Implementation AI |

### Versioning

- Context documents are versioned (v1.0, v2.0, etc.)
- Breaking changes increment the major version
- Clarifications and additions increment the minor version
- Migration notes are written for major version changes

---

## 18. Roadmap

### Phase 0 — AI-EOS Blueprint (Current)
Deliverables:
- Working Model document
- Roadmap document
- EC-001 Engineering Charter

Status: In progress. Starter pack exists.

### Phase 1 — Governance Foundation
- Repository Structure
- Constitution
- Engineering Philosophy
- Documentation Standards

### Phase 2 — Knowledge Infrastructure
- Knowledge Management
- Versioning
- Review Workflow

### Phase 3 — Tooling & Templates
- Engineering Charter Specification (full format)
- Templates

### Future (Post Phase 3)
- Founder OS
- Engineering Council
- Architecture Fitness Functions
- Project Bootstrap Kit

---

## 19. Full Vision — Complete AI-EOS Repository

The target state is 80–150 pages of high-quality documentation. Not all of these exist yet. This is the complete intended scope.

| Component | Description |
|-----------|-------------|
| Constitution | The unchanging law — values, operating principles, what is never compromised |
| Engineering Philosophy | How engineering decisions are made and what tradeoffs are valued |
| Governance | Decision rights, accountability structures, escalation paths |
| Architecture Principles | The structural constraints committed to across all systems |
| Knowledge Management | How learning accumulates and persists |
| Documentation Standards | What good documentation looks like — formats, depth, ownership |
| Templates | Reusable structure for all recurring work types |
| Working Agreements | Model- and tool-specific guidance (Claude Code, ChatGPT, Gemini, Codex, Cursor, etc.) |
| Engineering Council | Multi-AI governance — coordination, escalation, and disagreement protocols |
| Architecture Fitness Functions | Continuous checks that the architecture holds |
| Project Bootstrap Kit | Starting new projects from a known good state |
| Engineering Charters | Full charter specification, lifecycle, and closure criteria |
| Founder OS | How the Founder operates — routines, decision frameworks, journal practice |
| Project DNA Workshop | Structured process for capturing the soul of a project at inception |
| Multi-Agent Collaboration | Protocols for AI-to-AI and human-to-AI handoffs |
| Release Management | How work ships and what records it leaves |
| ADR Framework | Full Architecture Decision Record system — format, lifecycle, indexing, review |
| Review Workflow | Who reviews what, at what stage, using what criteria |
| Prompt Library | Curated reusable prompts for recurring AI-assisted tasks |
| Founder Journal | Qualitative record of the journey — decisions, doubts, pivots, learnings |
| Company Memory | Organizational knowledge layer — survives personnel and model changes |

---

## 20. Files in This Repository (Current State)

| File | Description |
|------|-------------|
| `README.md` | Minimal pointer |
| `AI-EOS_Working_Model_v1.0.md` | Roles, workflow, and core principles |
| `AI-EOS_Roadmap_v1.0.md` | Phase 0 through Future |
| `EC-001_Bootstrap_EOS_v1.0.md` | First Engineering Charter — bootstrap the OS |
| `AI-EOS vision.rtf` | Extended vision notes — source of the full 80–150 page scope |
| `AI-EOS_Context_v1.0.md` | Previous context document (superseded) |
| `AI-EOS_Context_Update_v2.1.md` | Source of v2.0 corrections and additions |
| `AI-EOS_Context_v2.0.md` | This file — current authoritative context |

---

## 21. Context for AI Collaborators

### For ChatGPT (Strategic AI — CPO / CTO / Principal Architect)

You are the strategic and architectural lead. Your job:
- Advise on the direction, sequencing, and design of AI-EOS components
- Review Engineering Charters before implementation begins
- Conduct Architecture Reviews after implementation completes
- Hold long-term memory on decisions, direction, and rationale across sessions
- Challenge the Founder when direction conflicts with established principles
- Evolve AI-EOS through the governance process, not unilaterally

The canonical strategic workspace is this ChatGPT conversation. When given a new context session, re-read this document before responding. Your continuity depends on it.

Do not invent Founder Knowledge. Facilitate, ask, and document — do not originate vision, mission, or values.

### For Claude Code (Implementation AI — Senior Software Engineer)

You implement one Engineering Charter at a time. Before beginning any charter:
- Read and confirm you understand all fields: Objective, Scope, Non-goals, Deliverables, Constraints, Acceptance Criteria
- Do not begin implementation without an approved charter
- Do not modify application code unless the charter explicitly includes it
- Documentation is part of your deliverable — you are not done until it is written
- When in doubt, surface the question rather than making an assumption
- You operate within the philosophy and standards defined by AI-EOS — you do not redefine them

### For any future AI collaborator

This document is your starting point. Read it in full before taking any action. The roles, principles, and protocols here govern how you operate regardless of your capabilities. If something in this document conflicts with your default behavior, this document wins.

---

## 22. Terminology Reference

| Term | Definition |
|------|------------|
| AI-EOS | AI-Powered Engineering Operating System — independent, vendor-neutral |
| Engineering Charter | A contract for a unit of work: scoped, approved, and traceable |
| ADR | Architecture Decision Record — a structured, permanent log of a significant decision |
| Definition of Done | A charter is only done when: implemented, reviewed, documented, and logged |
| Governance | The rules, roles, and processes by which the OS makes and enforces decisions |
| Constitution | The foundational document of non-negotiable values and operating principles |
| Fitness Function | A continuous check that verifies an architectural property is holding |
| Knowledge Index | A navigable, relationship-aware map of all documentation |
| Stable Core | The layer of AI-EOS that changes rarely and requires full governance |
| Capabilities | The active tooling layer — evolves with the state of the art |
| Experiments | Unproven work that must mature before graduating to Capabilities |
| Context Engineering | The discipline of building and maintaining high-quality context for AI agents |
| Founder Knowledge | Vision, mission, values, DNA — owned by the Founder, never invented by AI |
| Canonical Workspace | The ChatGPT conversation where architectural direction originates |

---

*This document is the authoritative context source for AI-EOS as of June 2026, version 2.0. It supersedes AI-EOS_Context_v1.0.md. Update this document whenever the working model, principles, roadmap, charter status, or architectural understanding changes. Follow the governance process for major version changes.*
