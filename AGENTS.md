# Codex Project Guidance

AI-EOS is a local-first governed engineering runtime and its governing documentation. Read this file before making changes, then use [`docs/CODEBASE_CONTEXT.md`](docs/CODEBASE_CONTEXT.md) for implementation detail.

## Authority and workflow

- Start with `AI-EOS_Context_v2.1.md` and `docs/INDEX.md`. The former is the governing baseline; the latter distinguishes approved documents from proposals and historical material.
- Treat `v3/` as proposed long-term direction, not current implementation authority. The implemented Runtime MVP is governed by EC-003, its approved architecture, and DR-002.
- No implementation charter is currently active. Product Discovery is the next approved priority, but implementation requires a new Founder-approved Engineering Charter.
- Follow the documentation-first lifecycle: research, architecture, documentation alignment, implementation, verification, documentation completion. Pause and align governing docs before material scope or architecture changes.
- Preserve human authority: AI may recommend and explain, but must not invent Founder knowledge, claim Founder approval, or bypass an approval gate.
- Commit, push, merge, tag, publish, deploy, and other external mutations require separate explicit authorization. Runtime completion grants none of these permissions.

## Project map

- `src/cli.ts`: Commander CLI entry point and provider selection.
- `src/runtime.ts`, `src/flow.ts`, `src/domain.ts`: deterministic run orchestration, the only implemented flow, and domain contracts.
- `src/store.ts`: atomic local-filesystem persistence under a target project's `ai-eos/` directory.
- `src/schemas.ts`: Zod validation for config, state, and provider output.
- `src/providers/`: deterministic fake provider and the real `codex exec` adapter.
- `tests/`: Node test-runner coverage for the runtime and compiled CLI.
- `fixtures/`: controlled example projects; their `ai-eos/runs/` contents are generated evidence.
- `docs/`: governing decisions, architecture, charters, reports, reviews, guides, and roadmap.
- `v3/`: proposals only. Do not implement them without new authority.

## Canonical commands

Requires Node.js 22+ and installed npm dependencies. Do not install dependencies or change the lockfile unless explicitly asked.

```bash
npm run check       # strict TypeScript typecheck, no emit
npm run build       # compile src/ and tests/ to ignored dist/
npm test            # build, then run dist/tests/*.test.js
npm run verify      # canonical check + test validation
```

Focused dependency-free fixture checks:

```bash
node --test fixtures/runtime-mvp/greeting.test.js
node --test fixtures/guided-test/test/toSlug.test.js
```

The local CLI is `node dist/src/cli.js --project <path> <command>` after a build. Prefer the fake provider for deterministic/non-networked validation. Running a real Codex-backed flow can invoke an external service and lets only the Implementation stage write within the target project; do not run it without task-specific authorization.

## Coding and validation conventions

- Keep the runtime ESM/NodeNext and strict TypeScript. Relative TypeScript imports use `.js` suffixes.
- Keep workflow policy in the runtime/flow layer, not the CLI or providers. Only the Runtime advances state; providers return structured evidence.
- Preserve declared stage context allowlists, schema validation, explicit `completed | needs_changes | failed` outcomes, artifact-hash-bound approvals, append-only events, and atomic state/artifact writes.
- Never auto-approve, silently repair invalid provider output, overwrite retry history, read credentials into context, or allow paths outside the selected project root.
- Only Implementation may use `workspace-write`; every other Codex stage stays `read-only`. Never add dangerous sandbox bypass flags or implicit source-control/deployment behavior.
- Add or update `node:test` coverage for behavior changes. Validate the narrowest relevant tests and finish with `npm run verify` when dependencies are available. Report unavailable tooling distinctly from test failures.
- Keep documentation consistent with implementation and record meaningful architectural/product direction changes in the appropriate charter/decision/report documents.

## Paths and boundaries

- Do not edit generated or local-only paths: `node_modules/`, `dist/`, `coverage/`, `.env`, `*.log`, or `fixtures/*/ai-eos/runs/`.
- Do not hand-edit `package-lock.json`; update it only as the result of an explicitly authorized dependency change.
- Do not treat historical root context versions, HTML renderings, or `v3/` proposals as current behavior.
- The repository has no deployed service, database, CI workflow, or supported release pipeline. The current release is a local, unpublished `0.1.0` milestone.
