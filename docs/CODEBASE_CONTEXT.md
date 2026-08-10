# AI-EOS Codebase Context

This document is an implementation-oriented companion to the root `AGENTS.md`. Governing status and approval authority remain defined by `AI-EOS_Context_v2.1.md` and `docs/INDEX.md`.

## Implemented system

AI-EOS 0.1.0 is a private TypeScript ESM package and local CLI. It runs as one Node.js 22+ process against a selected local project. There is no daemon, web UI, database, cloud service, CI configuration, or deployment automation in this repository.

The CLI entry point is `src/cli.ts`; the package binary maps `aieos` to compiled `dist/src/cli.js`. Commander parses commands and creates a `Runtime` with either a `FakeProvider` or `CodexCliProvider`. CLI code should remain a thin adapter without workflow policy.

The Runtime executes the hard-coded `feature-development` flow:

```text
research -> architecture -> Founder Architecture Approval
         -> documentation-alignment -> Founder Documentation Approval
         -> implementation -> review -> verification
         -> Founder Completion Approval -> knowledge-capture -> complete
```

Each stage has a stable ID, role, explicit context-source allowlist, retry bound, and optional Founder gate. A provider result must validate through Zod and declare one outcome: `completed`, `needs_changes`, or `failed`. Only `completed` advances. The Runtime, not the provider, owns state transitions.

## Module responsibilities

| Path | Responsibility |
|---|---|
| `src/domain.ts` | Stage, run, event, approval, context, and provider TypeScript contracts |
| `src/flow.ts` | The seven-stage Feature Development definition and three gates |
| `src/runtime.ts` | Start/resume/approve/reject logic, context compilation, validation, transitions, events, and final report |
| `src/store.ts` | YAML config loading plus filesystem persistence using temporary-file/rename atomic writes |
| `src/schemas.ts` | Runtime Zod schemas for project config, persisted state, and AI output |
| `src/providers/fake.ts` | Deterministic, offline provider used by automated tests |
| `src/providers/codex-cli.ts` | Authenticated local `codex exec` subprocess adapter with JSON-schema-constrained output |
| `tests/runtime.test.ts` | State flow, gates, tamper detection, recovery, context isolation, outcomes, and sandbox safety |
| `tests/cli.test.ts` | Compiled CLI initialization, validation, start, and status smoke test |

## Persistence and configuration

`aieos init` creates the following inside the target project, not this package's source tree unless this repository itself is selected:

```text
ai-eos/
  config/project.yaml
  flows/
  roles/
  charters/
  runs/<run-id>/
    state.json
    events.jsonl
    inputs/
    stages/<stage-id>/
      artifact.md
      attempt-<n>/
        invocation.json
        context-manifest.json
        output.json
        validation.json
    approvals/
    final-report.md
```

Configuration schema version 1 contains the project name and `runtime.provider`, `runtime.model`, and `runtime.maxAttempts`. Current CLI provider selection supports only `fake` and `codex-cli`. Note that stage retry bounds currently come from `src/flow.ts`; the config `maxAttempts` value is validated but is not wired into flow execution.

State and artifacts are local files. State/artifact writes use a sibling `.tmp` followed by rename; events are appended as JSONL. Attempts are preserved in numbered directories. Approval records bind the Founder decision to current artifact SHA-256 hashes. The original Charter must remain within the project root and unchanged during a run.

## External service and security boundary

The fake provider has no external dependency. The real adapter reuses an existing authenticated Codex CLI session; it does not read or store an API key. It invokes `codex exec --ephemeral`, passes bounded context through stdin, and requests a schema-constrained last-message file in a temporary directory that is removed afterward.

Research, Architecture, Documentation Alignment, Review, Verification, and Knowledge Capture use a read-only sandbox. Implementation alone uses `workspace-write` scoped by `--cd` to the selected project. Prompts prohibit source-control and deployment actions. No provider should receive credentials in compiled context or be allowed to choose transitions or approvals.

## Build, test, and operational commands

```bash
npm run check
npm run build
npm test
npm run verify
```

`npm run verify` is the canonical repository validation and should cover strict typechecking, compilation, and the runtime/CLI tests. Compilation emits ignored `dist/` output including declarations and source maps. There is no lint or formatting script.

Useful CLI operations after building:

```bash
node dist/src/cli.js --project /path/to/project init <project-name>
node dist/src/cli.js --project /path/to/project validate
node dist/src/cli.js --project /path/to/project run start <charter-path>
node dist/src/cli.js --project /path/to/project run status <run-id>
node dist/src/cli.js --project /path/to/project run resume <run-id>
node dist/src/cli.js --project /path/to/project run retry <run-id>
node dist/src/cli.js --project /path/to/project approve <run-id> [--reason ...]
node dist/src/cli.js --project /path/to/project reject <run-id> --reason ...
node dist/src/cli.js --project /path/to/project report <run-id>
```

`retry` currently delegates to the same Runtime operation as `resume`. `report` prints the expected report path; the final report exists only after completion. `cancelled` is represented in the state schema, but there is no cancellation command.

The fixtures have independent Node tests:

```bash
node --test fixtures/runtime-mvp/greeting.test.js
node --test fixtures/guided-test/test/toSlug.test.js
```

## Current status and known limits

EC-003 is completed and Founder-accepted. Product Discovery is next in DR-003 but has no active implementation charter. The current runtime intentionally supports one process, one flow, one real provider, file-backed state, and explicit manual gates. It has no cross-process locking, revision branch for `needs_changes`, cancellation command, source-control automation, publishing, or deployment.

The `v3/` directory describes proposed collaboration roles, flows, routing, model assignment, migration, and project structure. Some concepts informed the MVP, but those files are not a specification for unapproved implementation work.
