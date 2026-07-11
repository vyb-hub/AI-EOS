# AI-EOS — Migration Guide: v2.x → v3

**Status:** Proposed — part of EC-002
**Applies to:** Projects currently operating under AI-EOS v2.x that choose to opt into v3.

---

## Before You Migrate

Migration is **optional and per-project**. A v2.x project that never migrates continues to work exactly as it does today, indefinitely. Nothing in this guide is a countdown.

Migrate when the coordination overhead of manually relaying context between a Strategic AI conversation and an Implementation AI session becomes the bottleneck — not because v3 is newer.

## What Carries Over Unchanged

- Founder Knowledge, Founder authority, and every approval expectation.
- Engineering Charter format and requirement (§11 of `AI-EOS_Context_v2.1.md`).
- ADR requirement and format.
- Core Principles P-01 through P-07, including Documentation-First and the Mandatory Development Lifecycle (Phases 0–6) — v3 Engineering Flows are this same lifecycle, expressed as explicit stages.
- Existing charters, ADRs, and knowledge documents — none are rewritten or reformatted by migration.

## What's New

- A `Role` vocabulary (Product AI, Research AI, Architect AI, Implementation AI, Review AI, QA AI, Knowledge AI) replaces the informal "Strategic AI / Implementation AI" split — with an explicit mapping so nothing is lost (see table below).
- A Model Assignment configuration file makes the Role→Model mapping explicit and swappable.
- Named, reusable Engineering Flows replace ad hoc charter-by-charter coordination.
- A Stage Router concept — coordination happens through defined stages and persisted artifacts rather than manual copy-paste between chat sessions. (Note: as of this proposal, the Stage Router is a design, not shipped software — see EC-002 Non-goals. Migrating today means adopting the *vocabulary and structure*; automated routing is future work.)

## Role Mapping from v2.x

| v2.x concept | v3 Role(s) |
|---|---|
| Strategic AI (ChatGPT) — CPO/CTO/Principal Architect | Product AI + Architect AI + Review AI (may all still be one model, per Model Assignment) |
| Implementation AI (Claude Code) | Implementation AI (+ optionally QA AI, Knowledge AI) |
| *(informal, not previously named)* | Research AI — v2.x charters already imply a research step; v3 makes it a distinct Role |
| Founder | Founder (unchanged) |

Nothing requires splitting these across different models immediately — a project can migrate to v3's vocabulary and Flow structure while still assigning, say, ChatGPT to Product AI + Architect AI + Review AI and Claude to Implementation AI + Research AI + QA AI + Knowledge AI, mirroring its current v2.x working model exactly. Splitting Roles across more models is a later, separate decision.

## Migration Steps

1. **Do not touch existing v2.x files.** Leave charters, ADRs, and context docs exactly as they are.
2. **Add `aieos.config.yaml`** at the project root with `version: v3`.
3. **Add the `ai-eos/` directory** per `Project_Folder_Structure_v3.md`, seeded with the standard seven Flow definitions from `Engineering_Flow_Specification_v1.0.md`.
4. **Write a Model Assignment file** (`ai-eos/model-assignment.yaml`) that mirrors current practice (see mapping table above) — this should be a no-op change in who does what, only in how it's declared.
5. **Run the next unit of work as a Flow** (e.g., start the next feature as `flow.feature-development`) rather than an ad hoc charter conversation. Compare: does the Flow's stage sequence match what actually happened? Adjust the Flow definition, not the discipline, if not.
6. **Continue writing Charters and ADRs exactly as before** — Flows wrap the same discipline, they do not replace Charters or ADRs.
7. **Knowledge Capture at the end of each Flow** should update the same knowledge documents v2.x already uses (`AI-EOS_Working_Model_v1.0.md`-equivalent, roadmap, knowledge index) — v3 does not introduce a separate knowledge store philosophy, only a per-flow discipline for updating the existing one.

## Rollback

Because migration is additive (nothing in v2.x is altered), rollback is simple: set `aieos.config.yaml` back to `version: v2` and stop using the `ai-eos/` directory. No data is lost, because every v3 artifact (Flow runs, Model Assignment) lives alongside, not instead of, the v2.x knowledge documents. There is no destructive step anywhere in this guide.

## Recommended Order of Adoption

Do not migrate an entire project's workflow in one step. Recommended sequence:

1. Migrate one low-risk Flow type first — Documentation or Research (lowest blast radius, no Source Control implications).
2. Once the team is comfortable with Flow structure and artifact persistence, migrate Bug Fix and Feature Development.
3. Migrate Release and Hotfix last, only once approval-gate behavior has been exercised and trusted on lower-risk flows.

This mirrors P-01 (One milestone at a time) applied to the migration itself.
