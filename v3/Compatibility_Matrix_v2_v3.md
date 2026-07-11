# AI-EOS — Compatibility Matrix: v2.x vs v3

**Status:** Proposed — part of EC-002

---

## Shared (identical in both versions — Stable Core, unaffected by version choice)

| Item | v2.x | v3 |
|---|---|---|
| Founder Knowledge Principle | Yes | Yes |
| Founder final approval authority | Yes | Yes |
| Engineering Charter requirement | Yes | Yes |
| ADR requirement | Yes | Yes |
| P-01–P-06 (original Core Principles) | Yes | Yes |
| P-07 Documentation First | Yes | Yes |
| Mandatory Development Lifecycle (Phases 0–6) | Yes, as the Charter's internal Implementation discipline | Yes, expressed explicitly as Flow stages |
| Source Control Rule (no implied commit/push/merge/deploy) | Yes | Yes |
| Vendor-neutral / model-agnostic principle | Yes (informal — roles filled by named tools) | Yes (formal — Model Assignment configuration) |
| Knowledge Graph mindset, Fitness Functions, Documentation Evolution Strategy | Yes | Yes (unchanged, still Capabilities-layer concerns) |

## v2.x Only

| Item | Notes |
|---|---|
| Manual context relay between Strategic AI and Implementation AI sessions | Human-mediated; no Stage Router |
| Two named roles (Strategic AI, Implementation AI) | Informal, fixed pairing to ChatGPT/Claude Code |
| Single, linear Charter Workflow | Idea → Discussion → Charter → Implementation → Architecture Review → Documentation → Decision Log → Release Notes → Complete |

## v3 Only

| Item | Notes |
|---|---|
| Eight named Roles (Founder, Product AI, Research AI, Architect AI, Implementation AI, Review AI, QA AI, Knowledge AI) | Explicit, each with its own spec |
| Model Assignment configuration layer | Role → Model mapping, swappable independently |
| Named, reusable Engineering Flows (7 defined) | Feature Development, Bug Fix, Architecture Review, Research, Documentation, Release, Hotfix |
| Stage Router (design only at this stage) | Mediates all Role handoffs; no direct AI-to-AI invocation |
| Configurable per-flow approval gates | Explicit gate placement per Flow, not just "Founder approves at the end" |
| Explicit Context Compilation per Role | Bounded, role-scoped context instead of full knowledge base access |
| CLI version selection (`aieos init --version=`) | v2.x has no CLI concept defined at all today |
| Project configuration file (`aieos.config.yaml`) | Declares which version + (for v3) Model Assignment / Flows location |

## Interoperability Notes

- A v2.x project's Charters and ADRs are readable and reusable as-is by a v3 project — the formats did not change, only the surrounding orchestration.
- A v3 project can be operated exactly like a v2.x project (single Strategic-AI-equivalent, single Implementation-AI-equivalent) simply by assigning most Roles to one model and Implementation-related Roles to another — v3 is a superset of v2.x's working model, not a divergent one.
- There is no v3 feature that requires abandoning any v2.x artifact. The Compatibility direction is strictly additive: v2.x → v3 adds; nothing in this matrix has a "Yes in v2.x, No in v3" row, because nothing is removed.

## Version Selection Guidance

| If your project... | Recommended version |
|---|---|
| Has one human relaying context between one Strategic AI and one Implementation AI | v2.x is sufficient — v3's orchestration overhead buys little |
| Runs multiple concurrent Charters/Flows or multiple AI collaborators per Role type | v3's explicit Roles and Stage Router design (once implemented) reduce coordination error |
| Wants auditable, persisted artifacts per stage rather than chat-log history | v3 |
| Is not ready to adopt a new vocabulary/structure yet | Stay on v2.x — there is no penalty for waiting |
