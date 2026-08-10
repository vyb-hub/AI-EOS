# Product Discovery MVP Quickstart

**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Implementation guide

## Purpose

Run one local Product Discovery flow from an idea file to a proposed
Engineering Charter.

## Prepare

Build and verify AI-EOS:

```text
npm run verify
```

Initialize the target project if it does not already contain `ai-eos`:

```text
node dist/src/cli.js --project <project-path> init <project-name>
```

The project configuration may use `fake` for deterministic testing or
`codex-cli` for a live run. Codex CLI uses the existing ChatGPT login; no
OpenAI API key is required.

## Start Discovery

```text
node dist/src/cli.js --project <project-path> discovery start <idea-path> --mode fast --preview
```

`--preview` opens the local Living Product Brief as soon as the run starts. The
page refreshes itself while work is active, displays the current stage and an
elapsed timer, and becomes static whenever the Runtime pauses for Founder input
or approval. Omit the flag in headless or automated environments.

Re-render and reopen any persisted run with the current dashboard renderer
without repeating provider work:

```text
node dist/src/cli.js --project <project-path> discovery preview <run-id>
```

The run stops at `awaiting_input`. Print the generated question-set path:

```text
node dist/src/cli.js --project <project-path> discovery questions <run-id>
```

Discovery modes:

- `fast` — default; up to 3 competitors, 5 sources, and two Founder gates
- `standard` — up to 5 competitors, 10 sources, and three Founder gates
- `deep` — up to 10 competitors, 20 sources, and all four Founder gates

The CLI prints meaningful stage changes and a timed heartbeat during longer
Codex work so the Founder is never left with a silent terminal.

## Answer Founder Questions

Create a JSON response matching the question set. It must contain the exact
run ID, question-set ID, and required question IDs.

```text
node dist/src/cli.js --project <project-path> discovery respond <run-id> --file <response-path>
```

Founder responses are data, not approval. After the response, the Runtime
continues to Founder Intent Approval.

## Review the Four Gates

The flow stops in this order:

1. Founder Intent Approval
2. Research Evidence Approval
3. MVP Scope Approval
4. Product Readiness Approval

Inspect the current run directory before each approval:

```text
<project-path>/ai-eos/runs/<run-id>/
```

Approve only when the artifacts represent the intended decision:

```text
node dist/src/cli.js --project <project-path> approve <run-id> --reason "<reason>"
```

## Outputs

After completion:

```text
<run-dir>/handoff/product-definition.md
<run-dir>/handoff/product-definition.json
<run-dir>/handoff/engineering-charter.md
<run-dir>/final-report.md
```

The Engineering Charter remains proposed. Product Discovery does not start
Feature Development, modify application source, commit, push, publish, or
deploy.

## Live-Run Safety

- Only Market Research receives web-research capability.
- Every Product stage is read-only against the project.
- Personal Codex configuration, plugins, browser control, and Computer Use are
  disabled for governed invocations.
- Source metadata and claim mappings are persisted locally.
- Research Evidence Approval is invalidated if the evidence files change.
