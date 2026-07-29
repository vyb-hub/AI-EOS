# EC-003 Milestone 1 Implementation Report

**Version:** 1.0
**Date:** 29 July 2026
**Status:** Implementation and verification complete

## Outcome

The deterministic Runtime Kernel is implemented and verified. The compiled CLI can initialize a project, validate configuration, start a Feature Development run, halt at gates, accept or reject explicit Founder decisions, resume after failure, preserve all attempts, complete the flow, and produce a final report.

The real-provider path uses the installed Codex CLI behind the provider interface. It reuses saved Codex authentication and constrains each invocation with an ephemeral session, a read-only sandbox, and a strict JSON Schema.

## Implemented

- TypeScript CLI and build
- Versioned project configuration
- Feature Development flow
- Deterministic state machine
- Atomic filesystem persistence
- Append-only event stream
- Bounded context compiler and manifests
- Provider-neutral interface
- Deterministic fake provider
- Codex CLI adapter
- Structured output validation
- Configured retry limits and safe failure
- Artifact-hash approval binding
- Approval invalidation on artifact change
- Reject, pause, resume, and completion behavior
- Local controlled fixture
- Final run report

## Verification Evidence

`npm run verify` passed:

- Type checking
- Production build
- Nine automated Runtime, CLI, provider-safety, and outcome tests
- Dependency audit with no known vulnerabilities

The tests cover:

1. compiled CLI initialization, validation, start, and status,
2. deterministic halt at Architecture approval,
3. full flow completion through three approvals,
4. invalidation of stale approval after artifact modification,
5. recovery from a provider outage without losing completed work,
6. declared context isolation per Role.
7. Codex CLI invocations remain ephemeral, read-only, schema-constrained, and free of bypass flags.
8. Codex Implementation alone receives workspace-write without bypass flags.
9. A `needs_changes` outcome halts without opening an approval gate.

Manual compiled-CLI validation also passed against `fixtures/runtime-mvp`:

- initialization,
- configuration validation,
- run start,
- all three approval gates,
- seven completed stages,
- final completion.

Live Codex CLI validation passed for run
`run_501cbe68-df18-4500-9fff-fc2b3db022e8`:

- existing ChatGPT-backed Codex authentication reused,
- Research completed with schema-valid output,
- Architecture completed with schema-valid output,
- invocation remained ephemeral and read-only,
- stage inputs and outputs were persisted,
- persisted artifacts contained no detected credential material,
- Runtime halted at Founder Architecture Approval as required.

After Architecture and Documentation approvals, the live run exposed a
correctness defect: schema-valid negative Review and Verification results were
treated as successful stage completion. DR-002 corrects this by requiring an
explicit stage outcome and halting on `needs_changes` or `failed`. It also
authorizes project-scoped workspace writes only for Implementation.

## Security Review

- Credentials are environment-only.
- Context inclusion is allowlist-based.
- Charter paths must remain within the project root.
- Context and artifact hashes are recorded.
- Codex invocations use ephemeral sessions and stage-scoped sandboxes.
- No source-control or deployment commands exist.
- Local execution artifacts are ignored from source control.

## Known Limitations

- The first live Codex-backed flow is retained at its invalid Completion gate as defect evidence and must not be approved.
- Only Feature Development is supported.
- The fake provider is used for deterministic tests.
- Configuration is project-level; separate role/provider files are deferred.
- No cancellation command is exposed yet.
- No automatic stale-Charter recovery flow exists; a changed Charter safely fails the run.
- File locking for concurrent processes is not implemented; the MVP assumes one local Runtime process per project.

## Next Work

The corrected live run `run_75489d3a-5dad-4786-b3cd-4c756744adc3`
completed Research, Architecture, Documentation Alignment, Implementation,
Review, and Verification:

- Codex created `greeting.js` and `greeting.test.js` only inside the controlled fixture.
- Implementation used workspace-write; Review and Verification remained read-only.
- Review outcome: `completed`.
- Verification outcome: `completed`.
- Manual test rerun: 5 passed, 0 failed.
- Syntax validation passed.
- Credential and prohibited-action marker scan passed.
- Runtime halted at Founder Completion Approval.

Next:

1. Obtain Founder acceptance of the EC-003 Architecture Review.
2. Close EC-003.
3. Open a post-MVP hardening charter before live product adoption.
4. Add concurrent-process locking under that charter.

No commit, push, merge, tag, publish, or deploy action was performed.
