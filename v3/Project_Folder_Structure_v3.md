# AI-EOS v3 — Recommended Project Folder Structure

**Status:** Proposed — part of EC-002
**Scope:** This describes the recommended layout for a *project that adopts* AI-EOS v3 (e.g., a product repository), not the AI-EOS meta-repository itself.

---

## Recommended Layout

```
project-root/
├── aieos.config.yaml                  # version: v3, points to model assignment + flows dir
├── ai-eos/
│   ├── model-assignment.yaml          # Role -> Model mapping (Model_Assignment_Configuration_v1.0)
│   ├── flows/                         # Engineering Flow definitions (built-in + project-specific)
│   │   ├── feature-development.yaml
│   │   ├── bug-fix.yaml
│   │   ├── architecture-review.yaml
│   │   ├── research.yaml
│   │   ├── documentation.yaml
│   │   ├── release.yaml
│   │   └── hotfix.yaml
│   ├── charters/                      # Engineering Charters (EC-NNN), one per unit of work
│   │   └── EC-001_....md
│   ├── adr/                           # Architecture Decision Records, append-only
│   │   └── ADR-001_....md
│   ├── knowledge/
│   │   ├── knowledge-index.md
│   │   ├── milestone-history.md
│   │   ├── calibration-log.md
│   │   └── founder-journal.md
│   ├── artifacts/                     # Persisted Stage Router outputs, per flow run
│   │   └── <flow-id>/<run-id>/<stage>.md
│   └── standards/
│       ├── engineering-philosophy.md
│       ├── architecture-standards.md
│       └── documentation-standards.md
└── (application source, unaffected)
```

## Design Notes

- **`aieos.config.yaml` at the root** is the single source of truth for which version a project runs — never inferred from folder presence alone.
- **`ai-eos/artifacts/`** is what makes Flows auditable: every Stage Router output (research findings, architecture decisions, implementation reports, review findings, QA results, Founder approvals) is persisted here, scoped by flow run, so a Flow's full history can be reconstructed without re-deriving it.
- **`ai-eos/charters/` and `ai-eos/adr/`** carry over directly from the v2.x discipline — nothing about how charters or ADRs work changes under v3; only the surrounding orchestration does.
- **`ai-eos/flows/`** lets a project override or extend the seven standard Flows, or define new ones, as long as they follow the format in `Engineering_Flow_Specification_v1.0.md`.
- A v2.x project has no `ai-eos/` directory or `aieos.config.yaml` requirement today; adopting v3 is additive to a project's structure, not a rewrite of it (see `Migration_Guide_v2_to_v3.md`).

## Minimal v2.x Structure (for contrast — unchanged by this proposal)

```
project-root/
├── aieos.config.yaml   # version: v2  (optional — v2 behavior is also the implicit default)
└── docs/               # whatever governance docs the project has chosen to keep, per EC-001-style bootstrap
```
