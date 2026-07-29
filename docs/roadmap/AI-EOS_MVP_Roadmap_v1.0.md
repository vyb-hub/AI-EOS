# AI-EOS MVP Roadmap

**Version:** 1.0
**Date:** 29 July 2026
**Status:** Completed MVP roadmap
**Authority:** DR-001

## North Star

Prove that an approved Engineering Charter can be executed through a governed, role-based AI workflow with bounded context, persisted artifacts, human approval gates, verification, and knowledge capture.

## Milestone 0 — Documentation Alignment

**Status:** Complete

- Record MVP priority decision
- Amend EC-001
- Review EC-002
- Approve MVP charter
- Approve MVP architecture
- Establish documentation index

**Exit:** Founder approves the MVP charter and architecture.

## Milestone 1 — Deterministic Runtime Kernel

**Status:** Complete

- Local CLI shell
- Configuration validation
- Run state machine
- File-backed artifact store
- Approval records
- Pause, resume, retry, and failure behavior
- Event and decision log

**Exit:** A provider-free simulated flow can advance, halt, resume, fail, and complete deterministically.

## Milestone 2 — Role and Provider Execution

**Status:** Complete — live Codex CLI smoke test passed

- Provider-neutral interface
- Initial provider adapter
- Role-to-provider assignment
- Context compiler
- Structured output validation
- Provider error and retry handling
- Secret redaction

**Exit:** A single role can execute through the provider interface with auditable input and output artifacts.

## Milestone 3 — Feature Development Flow

**Status:** Complete

- Research
- Architecture approval gate
- Documentation Alignment approval gate
- Implementation
- Review
- Verification
- Founder completion approval
- Knowledge Capture

**Exit:** One approved Charter completes the full flow without any implicit source-control action.

## Milestone 4 — Real-Project Validation

**Status:** Complete for controlled fixture; live product repository deferred

- Controlled example repository
- Interrupted-run recovery
- Rejected approval path
- Malformed AI output path
- Provider failure path
- Context isolation review
- Artifact completeness review
- Provider-replacement demonstration

**Exit:** MVP acceptance criteria pass with recorded evidence.

## Milestone 5 — MVP Release Readiness

**Status:** Complete — EC-003 closed; source control remains unauthorized

- Installation and quick-start documentation
- Example Charter and project
- Known limitations
- Architecture and security notes
- Completion report
- Release notes
- Post-MVP backlog

**Exit:** Founder approves release readiness. Commit, push, tag, publish, and deploy remain separate actions.

## Post-MVP Order

1. Test and evaluate the Engineering Runtime MVP
2. Product Discovery MVP
3. Idea-to-Engineering-Charter pilot
4. Runtime hardening required by pilot findings
5. Bug Fix and Documentation flows
6. Additional provider adapters
7. Capability Registry
8. Context and memory retrieval
9. Broader Product OS
10. Web UI, collaboration, cloud, and signed marketplace

## Deferred from MVP

Product OS, web UI, cloud hosting, collaboration, marketplace, automatic provider ranking, multi-agent swarms, multiple flow types, autonomous source control, and a bespoke knowledge graph.
