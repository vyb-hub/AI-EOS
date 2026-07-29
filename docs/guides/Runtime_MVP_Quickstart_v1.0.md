# AI-EOS Runtime MVP Quick Start

**Version:** 1.0
**Status:** Implementation guide

## Requirements

- Node.js 22 or later
- npm
- An Engineering Charter stored inside the target project
- An authenticated Codex CLI session

## Install and Build

```bash
npm install
npm run build
```

The compiled CLI is `dist/src/cli.js`.

## Initialize a Project

```bash
node dist/src/cli.js --project /path/to/project init my-project
```

This creates a local `ai-eos/` directory with configuration, flows, roles, charters, and run storage.

The generated configuration uses the Codex CLI provider and reuses the user's existing Codex authentication.

## Validate Configuration

```bash
node dist/src/cli.js --project /path/to/project validate
```

## Start a Feature Development Run

```bash
node dist/src/cli.js --project /path/to/project run start charter.md
```

The Runtime executes Research and Architecture, then halts at Founder Architecture Approval.

## Inspect and Approve

Review the current artifact under:

```text
ai-eos/runs/<run-id>/stages/<stage-id>/artifact.md
```

Then explicitly approve:

```bash
node dist/src/cli.js --project /path/to/project approve <run-id> --reason "Reviewed and accepted."
```

The flow has three gates:

1. Founder Architecture Approval
2. Founder Documentation Approval
3. Founder Completion Approval

## Reject

```bash
node dist/src/cli.js --project /path/to/project reject <run-id> --reason "Required revision."
```

A rejection is persisted and the run does not advance.

## Resume or Retry

```bash
node dist/src/cli.js --project /path/to/project run resume <run-id>
node dist/src/cli.js --project /path/to/project run retry <run-id>
```

Completed stages are not repeated. A new attempt never overwrites prior attempt evidence.

## Codex Authentication

Check the existing CLI session:

```bash
codex login status
```

If needed, authenticate interactively:

```bash
codex login
```

AI-EOS invokes `codex exec` with an ephemeral session, a read-only sandbox, and a strict output schema. It does not require or store an API key.

To use the model configured by Codex, retain:

```yaml
runtime:
  provider: codex-cli
  model: default
  maxAttempts: 2
```

Set a model ID in `model` only when the project intentionally pins one.

For deterministic, non-networked tests, change the provider to `fake` and the model to `deterministic-fixture`.

## Verify the Runtime

```bash
npm run verify
```

Verification includes type checking, build, deterministic flow tests, approval invalidation, provider-failure recovery, and context-isolation checks.

## Important Boundary

The Runtime MVP has no commit, push, merge, deploy, or publication command. Flow completion never implies source-control or deployment permission.
