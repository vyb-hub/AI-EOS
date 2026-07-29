# AI-EOS

## What It Is

AI-EOS is an **AI-powered Engineering Operating System**: a vendor-neutral framework for organizing how humans and AI collaborate to turn ideas into reliable software.

It is not an AI model, coding assistant, prompt library, or documentation wiki. It is the governance layer around engineering—the shared rules, roles, workflows, decisions, and knowledge that guide how work gets done.

AI-EOS is designed to be adopted by any software project. Products adopt AI-EOS; no company or AI vendor owns it.

## What It Governs

AI-EOS provides a structured system for:

- Product and engineering decisions
- Architecture and implementation
- Human and AI responsibilities
- Research, reviews, testing, and releases
- Documentation and institutional memory
- Approval gates and source-control actions

## How It Works

Every meaningful unit of work begins with an **Engineering Charter**. The charter defines the objective, scope, non-goals, constraints, deliverables, risks, and acceptance criteria before implementation begins.

Work then follows this lifecycle:

```text
Idea
  → Discussion
  → Engineering Charter
  → Research
  → Architecture
  → Documentation Alignment
  → Implementation
  → Verification
  → Documentation Completion
  → Founder Approval
```

Commit, push, merge, and deployment are separate actions and require explicit approval.

## Collaboration Model

- **Founder:** Owns vision, priorities, and final approvals.
- **Strategic AI:** Supports product strategy, architecture, governance, and review.
- **Implementation AI:** Implements an approved charter against the documented architecture.
- **Review and QA roles:** Evaluate architectural alignment, quality, tests, and readiness.
- **Knowledge role:** Preserves decisions, outcomes, and lessons for future work.

The roles are permanent concepts, but the AI models filling them are interchangeable. This keeps AI-EOS vendor-neutral.

## Core Principles

1. Work on one approved milestone or charter at a time.
2. Documentation is part of the definition of done.
3. AI advises and explains; humans retain final authority.
4. Architect for tomorrow, but build only what is needed today.
5. Every meaningful decision must leave a trace.
6. Documentation is an input to implementation—not an afterthought.
7. If scope or architecture changes, implementation pauses until the documentation is aligned.

## Current State

AI-EOS is currently in the **Blueprint and Specification phase**. Its governance model, development lifecycle, and proposed multi-model architecture are being documented.

The proposed future direction includes:

- **Product OS:** Turns an idea into an approved, engineering-ready product.
- **Engineering OS:** Turns the approved product into production software.
- **AI-EOS Runtime:** Coordinates workflows, roles, context, approvals, artifacts, and interchangeable AI providers.

The Runtime, CLI, Stage Router, and related orchestration components are proposals; they have not yet been implemented.

## Intended Outcome

AI-EOS aims to make engineering knowledge explicit, portable, versioned, and usable by both humans and AI. A project adopting it should gain a repeatable way to move from intent to implementation without losing architectural discipline, accountability, or institutional memory.
