# Engineering Charter EC-003

**Title:** Build the AI-EOS Runtime MVP
**Version:** 1.0
**Date:** 29 July 2026
**Status:** Complete — Founder accepted 29 July 2026
**Depends on:** DR-001, EC-001 MVP Amendment, EC-002 conditional approval, Runtime MVP Architecture v1.0

## Objective

Build a local-first CLI Runtime that proves AI-EOS can execute one approved Engineering Charter through a governed Feature Development flow using role-based AI execution, bounded context, persisted artifacts, explicit Founder approval gates, verification, and knowledge capture.

## Primary User

The initial user is a Founder operating a software project locally with an
authenticated Codex CLI session and an approved Engineering Charter.

## In Scope

- TypeScript-based local CLI
- Project initialization and configuration
- One Feature Development flow
- Deterministic run-state machine
- Role definitions and explicit role-to-provider assignment
- Provider-neutral interface and one initial provider adapter
- Role-scoped context compilation
- Structured output validation
- File-backed run state and Markdown/JSON artifacts
- Approval, rejection, pause, resume, retry, and failure handling
- Research, Architecture, Documentation Alignment, Implementation, Review, Verification, Founder Approval, and Knowledge Capture stages
- Final execution report
- Automated tests and controlled end-to-end validation

## Non-Goals

- Product OS
- Web UI, REST API, IDE extension, or GitHub integration
- Cloud or multi-user operation
- Marketplace or plugin distribution
- Capability Registry, provider ranking, or automatic model selection
- Multi-agent swarms or parallel role execution
- Additional flow types
- Autonomous commit, push, merge, deploy, or publication
- Database, vector store, or bespoke knowledge graph
- Complete EC-001 governance corpus

## Deliverables

1. Installable local `aieos` CLI
2. Versioned project and flow configuration schemas
3. Deterministic Runtime state machine
4. File-backed artifact and event store
5. Approval record and invalidation mechanism
6. Provider interface and initial provider adapter
7. Context compiler and invocation manifest
8. Structured stage-output schemas and validation
9. Feature Development flow
10. Automated unit, integration, and end-to-end tests
11. Example project and approved example Charter
12. Quick-start, architecture, security, and limitations documentation
13. MVP completion report and release notes

## Constraints

- Runtime behavior must be traceable to an approved specification clause.
- The orchestrator is deterministic; AI models do not choose the next stage or waive a gate.
- Every invocation records the provider, model, bounded inputs, output, validation result, and transition.
- Secrets must never be persisted in run artifacts or logs.
- A changed approved artifact invalidates or supersedes its prior approval.
- Failed validation may retry only to a configured limit, then must halt.
- A validated `needs_changes` or `failed` outcome must halt and must not open a subsequent approval gate.
- Missing Founder approval halts indefinitely.
- No source-control or deployment action may occur implicitly or through the MVP CLI.
- Existing user changes in the repository must be preserved.

## Acceptance Criteria

1. `aieos init` creates a valid local project structure and configuration.
2. `aieos run start <charter>` starts exactly one Feature Development run.
3. `aieos status` reports current stage, gate, and last transition.
4. The Runtime halts at every required Founder gate.
5. Only an explicit approval record referencing the current artifacts advances a gate.
6. Rejection records a reason and leaves the run safely halted.
7. A terminated process can resume without repeating completed stages.
8. Malformed AI output is rejected, retried within policy, and halted after exhaustion.
9. Provider errors do not corrupt run state.
10. Negative Review or Verification outcomes halt without opening Founder Completion Approval.
11. Each Role receives only its declared context inputs.
12. All stages produce inspectable artifacts and an append-only event trail.
13. The initial provider can be replaced through configuration and an adapter without changing flow logic.
14. A controlled example completes end-to-end and produces a final report.
15. Only Implementation receives project-scoped workspace-write permission.
16. No test or runtime path performs commit, push, merge, deploy, or publication.
17. Tests, type checking, build, and end-to-end validation pass.

## Verification Strategy

- Unit tests for schemas, transitions, approvals, hashing, redaction, and retry policy
- Integration tests for filesystem persistence, restart recovery, and provider adapters
- Contract tests for provider and artifact-store interfaces
- End-to-end tests with deterministic fake provider responses
- One live Codex CLI smoke test with the initial provider
- Manual review of context isolation and generated artifacts
- Architecture review against the approved MVP specification

## Dependencies

- Supported Node.js runtime and package manager
- Installed and authenticated Codex CLI
- A controlled example repository
- Founder approval artifacts at required gates

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| AI output is inconsistent | Structured schemas, validation, bounded retries, safe halt |
| Context leaks across roles | Declarative context manifests and isolation tests |
| Approval applies to stale content | Content hashes and approval invalidation |
| Provider lock-in | Provider port, contract tests, configuration-based assignment |
| Runtime becomes a platform too early | One process, file-backed state, one flow, one adapter |
| Secrets enter artifacts | Environment-only credentials, redaction tests, manifest filtering |
| User repository is changed unexpectedly | Explicit stage scope, working-tree checks, no implicit git operations |

## Review Checklist

- [x] Founder conditionally approves EC-002 under the Strategic AI review
- [x] Founder approves this Charter
- [x] Founder approves Runtime MVP Architecture v1.0
- [x] Scope and non-goals are understood
- [x] Initial provider confirmed: Codex CLI
- [x] Controlled validation repository: local fixture inside AI-EOS

## Completion Evidence

- Passing verification results
- Completed example run with full artifact trail
- Architecture review
- Security and secret-handling review
- MVP completion report
- Founder acceptance

All completion evidence is recorded in
`docs/reports/EC-003_Completion_Record_v1.0.md`. EC-003 was closed on
29 July 2026.

Completion does not imply permission to commit, push, merge, tag, publish, or deploy.
