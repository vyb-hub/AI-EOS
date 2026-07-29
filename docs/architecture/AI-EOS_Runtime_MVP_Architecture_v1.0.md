# AI-EOS Runtime MVP Architecture

**Version:** 1.0
**Date:** 29 July 2026
**Status:** Approved — 29 July 2026
**Charter:** EC-003

## Architecture Goal

Create the smallest inspectable execution engine that can enforce an AI-EOS Feature Development flow locally. Optimize for correctness, recovery, and traceability before scale or distribution.

## System Boundary

The MVP is one local CLI application and one local project workspace.

```text
Founder
   │ CLI commands and approval decisions
   ▼
AI-EOS Runtime
   ├── Configuration
   ├── Flow State Machine
   ├── Context Compiler
   ├── Role Executor
   ├── Approval Policy
   ├── Output Validator
   └── Event Recorder
        │
        ├── Provider Port ── Initial AI Provider
        └── Artifact Port ── Local Filesystem
```

“Workflow Engine,” “Stage Router,” “Role Engine,” “Context Engine,” and “Approval Engine” are responsibilities inside this Runtime, not separate deployed systems in the MVP.

## Technology Baseline

- TypeScript
- Supported Node.js LTS runtime
- CLI-first, single local process
- Versioned YAML configuration
- JSON for machine state, manifests, events, and approvals
- Markdown for human-readable stage artifacts and reports
- JSON Schema or equivalent runtime validation for external and AI-produced data

Exact libraries are implementation choices only when they do not change these boundaries.

## Core Modules

### CLI

Parses commands and renders status. It contains no workflow policy.

Minimum command surface:

```text
aieos init
aieos validate
aieos run start <charter-path>
aieos run status [run-id]
aieos run resume <run-id>
aieos run retry <run-id>
aieos approve <run-id> <stage> [--reason]
aieos reject <run-id> <stage> --reason
aieos report <run-id>
```

No MVP command performs source-control or deployment actions.

### Configuration

Loads and validates project, flow, role, provider, and retry configuration. Configuration is versioned and persisted in the project.

### Flow State Machine

Owns legal stages and transitions. It is the only module allowed to advance run state.

States:

```text
created
→ running
→ awaiting_approval
→ running
→ completed
```

Terminal or recoverable alternatives:

```text
rejected
failed
cancelled
```

A failed run may resume only through an explicit retry transition. A rejected run does not advance unless a future documented revision flow supersedes it.

### Context Compiler

Builds a stage-specific immutable invocation package from declared sources. It records a manifest containing paths, content hashes, exclusions, and the final prompt hash.

It must not read credentials into the package.

### Role Executor

Resolves the stage's Role to the configured provider and model, invokes the Provider Port, and returns the raw response plus invocation metadata. It does not advance state.

### Output Validator

Validates AI output against the stage schema. It returns success or structured validation errors. It cannot repair or reinterpret output silently.

### Approval Policy

Creates and validates approval or rejection records. Approval records include:

- run ID
- stage ID
- actor
- decision
- approved artifact hashes
- timestamp
- optional rationale

An approval is valid only while its referenced artifact hashes remain current.

### Event Recorder

Writes append-only events for state transitions, invocations, validation, retries, approvals, rejections, failures, and completion.

### Artifact Store

Persists run state and artifacts atomically through an interface. The MVP adapter uses the local filesystem.

## Project Layout

```text
ai-eos/
  config/
    project.yaml
    roles.yaml
    providers.yaml
  flows/
    feature-development.yaml
  roles/
  charters/
  runs/
    <run-id>/
      state.json
      events.jsonl
      inputs/
      stages/
        <stage-id>/
          invocation.json
          context-manifest.json
          output.json
          artifact.md
          validation.json
      approvals/
      final-report.md
```

Writes use temporary files followed by atomic rename where supported. The event trail is append-only.

## Feature Development Flow

```text
Research
→ Architecture
→ Founder Architecture Approval
→ Documentation Alignment
→ Founder Documentation Approval
→ Implementation
→ Review
→ Verification
→ Founder Completion Approval
→ Knowledge Capture
→ Complete
```

Planning is represented by the already approved Engineering Charter and is not a separate AI stage in the MVP.

## Stage Contract

Every stage declares:

- stable stage ID
- required Role
- allowed context sources
- expected output schema
- retry policy
- approval requirement
- legal next stage
- artifacts produced
- explicit outcome: `completed`, `needs_changes`, or `failed`

The Flow State Machine rejects a definition with missing or ambiguous transitions.

The Runtime advances only on `completed`. A `needs_changes` or `failed`
outcome safely halts the run and cannot open the next Founder gate.

## Provider Port

The provider interface accepts:

- provider and model identifier
- system/role instructions
- bounded context
- expected output schema
- timeout and retry metadata

It returns:

- raw provider response
- parsed candidate output
- provider request identifier when available
- usage metadata when available
- model identifier
- timing and error metadata

Provider-specific SDK objects must not escape the adapter.

## Reliability Rules

- Persist intent before invoking an external provider.
- Persist provider results before attempting a transition.
- Use idempotency identifiers for invocations where supported.
- Never advance on missing or invalid output.
- Never auto-approve.
- Never infer approval from conversational text.
- Resume from persisted state, not reconstructed model memory.
- A retry creates a new attempt artifact; it never overwrites history.

## Security and Privacy

- Credentials come from environment variables or an OS credential facility.
- Credentials are never written to configuration, prompts, manifests, events, or reports.
- Context inclusion is allowlist-based.
- Files outside declared project roots are rejected.
- Logs redact configured sensitive fields.
- Provider transmission is visible in the invocation manifest before execution.

For the Codex CLI adapter, Research, Architecture, Documentation Alignment,
Review, Verification, and Knowledge Capture run in a read-only sandbox. Only
Implementation runs with `workspace-write`, scoped to the project root.
Dangerous sandbox bypass flags are prohibited.

## Traceability

Every requirement in EC-003 must map to:

- a configuration or schema rule,
- a Runtime module behavior,
- and at least one verification case.

A traceability matrix will be produced during implementation and included in completion evidence.

## Deferred Architecture

The following are intentionally not decided by the MVP:

- distributed execution
- relational or graph database
- vector retrieval
- web authentication and authorization
- multi-user concurrency
- marketplace packaging
- automatic capability evaluation
- Product OS orchestration

## Approval Record

On 29 July 2026, the Founder:

1. conditionally approved EC-002 under its Strategic AI review,
2. approved EC-003,
3. approved this architecture,
4. confirmed OpenAI as the initial provider,
5. selected a local fixture inside AI-EOS as the controlled validation repository.

Implementation is authorized. Source-control and deployment permissions remain unchanged.
