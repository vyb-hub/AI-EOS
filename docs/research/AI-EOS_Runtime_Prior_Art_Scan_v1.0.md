# AI-EOS Runtime — Prior-Art Scan v1.0

**Status:** Informational — research artifact. Not a proposal, not canonical, and adopts nothing. No AI-EOS document is altered by this scan; it is a companion read.
**Origin:** Six trending repositories the Founder flagged (2026-07-22), studied against the AI-EOS Runtime Vision and Roadmap for relevance.
**Depends on:** `docs/vision/AI-EOS_Runtime_Vision_v1.0.md`, `docs/roadmap/AI-EOS_Runtime_Roadmap_v1.0.html` (referenced throughout by section/phase number, neither file is modified)
**Date:** July 2026

> This is a research artifact, not a decision. Every mapping below connects an external project to a specific AI-EOS section or phase so the mapping can be checked, not taken on faith. Nothing here commits AI-EOS to using, integrating, or licensing any named tool. See §6.

---

## 1. Purpose

The Runtime Vision (`docs/vision/AI-EOS_Runtime_Vision_v1.0.md` §10, item 4) already flags a risk: the Runtime's component boundaries — Workflow Engine, Stage Router, Role Engine, Capability Registry, Context Engine, Provider SDK, Conversation Manager, Approval Engine, Prompt Compiler, Memory, CLI, Web UI, REST API — were "drawn by inference from existing v3 documents, not by a fresh architectural pass." This scan is that missing outside reference point: six shipping, real-world projects that independently arrived at similar problems (multi-model orchestration, vendor-neutral tool routing, agent memory, agent behavioral guardrails), so AI-EOS's design can be checked against working prior art before Phase 1 (Runtime Kernel) is chartered.

This is not a buy/build evaluation and not a license or security audit. It is a mapping exercise: *what does each project do, and which AI-EOS section does that resemble or inform.*

## 2. Method

Each repo was resolved from the Founder's (partially truncated) links via `gh search repos`, then confirmed with `gh api repos/{owner}/{repo}` directly against the GitHub REST API — star counts below are cross-verified, not taken from a single source, because the raw numbers are large enough to warrant a sanity check.

| Repo | Verified stars | One-line description |
|---|---|---|
| [`obra/superpowers`](https://github.com/obra/superpowers) | 258,663 | An agentic skills framework & software development methodology for coding agents |
| [`affaan-m/ECC`](https://github.com/affaan-m/ECC) | 231,817 | Cross-harness agent operator system — skills, instincts, memory, security scanning |
| [`ruvnet/ruflo`](https://github.com/ruvnet/ruflo) (formerly Claude Flow) | 65,397 | Agent meta-harness — router, swarms, adaptive memory, 35 categorized plugins |
| [`nexu-io/open-design`](https://github.com/nexu-io/open-design) | 80,332 | Open-source "Claude Design" alternative — coding agent as design engine |
| [`pablo-mano/Obsidian-CLI-skill`](https://github.com/pablo-mano/Obsidian-CLI-skill) | 395 | Claude Code skill giving an agent full CLI control of an Obsidian vault |
| [`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills) | 195,001 | A single `CLAUDE.md` of four behavioral principles distilled from an Andrej Karpathy post |

## 3. Per-Tool Findings

### 3.1 `obra/superpowers`

**What it is:** A complete development methodology packaged as composable, auto-triggering "skills," distributed as a plugin across nine coding-agent harnesses (Claude Code, Antigravity, Codex App/CLI, Cursor, Factory Droid, GitHub Copilot CLI, Kimi Code, OpenCode).

**How it works:** The agent doesn't jump straight into code. It steps back, asks what the user is really trying to do, produces a spec in digestible chunks, gets sign-off, writes an implementation plan (TDD, YAGNI, DRY), then runs a "subagent-driven-development" process — subagents work through each task, get inspected and reviewed, and the flow continues, often unattended for hours.

**Mapping to AI-EOS:**
- The stated sequence (clarify → spec → plan → subagent execution → review) is a working implementation of the same discipline the Mandatory Development Lifecycle already names conceptually, and of the Workflow Engine / Role Engine pair in Vision §4.
- "Skills trigger automatically" — the user never manually invokes a role — is direct prior art for how Capability resolution (Vision §5.1) should feel in practice: the Founder states intent, the Runtime resolves the Capability and Role without being told which one by name.
- The nine-harness plugin marketplace is a working precedent for Provider-SDK-style vendor neutrality (Vision §4, §5) — distribution-as-plugin rather than distribution-as-fork, across nearly every major coding-agent harness.

### 3.2 `affaan-m/ECC`

**What it is:** A cross-harness (Codex, Claude Code, Cursor, OpenCode, Gemini, Zed, GitHub Copilot) "operator system": skills, "instincts," memory optimization, continuous learning, and security scanning, plus a companion product, AgentShield — an AI agent security scanner for agent configs, MCP servers, and tool permissions.

**How it works:** Ships as reusable skills/hooks/rules/MCP configs refined over sustained daily use; documented via a "shortform," "longform," and "security" guide rather than a single README.

**Mapping to AI-EOS:**
- AgentShield is a concrete, already-built instance of the "Security Review" Capability listed in Vision §5.2's illustrative Capability Registry — worth knowing this category already has working tooling in the wild, not just a name on a list.
- **Caution, not just pickup:** ECC's own README carries an explicit warning — "Official sources only... Third-party re-uploads and unofficial mirrors... may contain malware." That warning is directly relevant to Roadmap Phase 8 (Marketplace): if AI-EOS ever builds a plugin/provider marketplace, supply-chain integrity (signed sources, an official registry, mirror warnings) needs to be designed in from the start, not bolted on after the fact. ECC is the cautionary example, not just the positive one.
- The three-tier guide structure (shortform / longform / security) is a reasonable documentation pattern to keep in mind for whatever eventually explains the Runtime to a new adopter — one on-ramp document, one deep-dive, one security-specific document, rather than one document trying to do all three.

### 3.3 `ruvnet/ruflo` (formerly Claude Flow)

**What it is:** An "agent meta-harness" — the execution layer around Claude Code/Codex that adds specialized agents, coordinated "swarms," self-learning memory, and cross-machine federation, shipped as 35 categorized plugins (Core & Orchestration, Memory & Knowledge, Intelligence & Learning, Code Quality & Testing, Security & Compliance, Architecture & Methodology, DevOps & Observability).

**How it works, per its own diagram:**
```
User --> Ruflo (CLI/MCP) --> Router --> Swarm --> Agents --> Memory --> LLM Providers
                          ^                           |
                          +---- Learning Loop <-------+
```

**Mapping to AI-EOS:**
- This is the closest existing implementation of Vision §5.1's Decision Hierarchy (Founder Intent → Workflow → Role → Capability → ... → Provider → Model → Execution). Router ≈ Role Engine/Stage Router, Memory ≈ the Runtime's Memory component, LLM Providers ≈ Provider SDK, Learning Loop ≈ the automatic Provider evaluation described in Vision §5.7 (Future Vision) — a working system already occupies roughly this shape, which is a reasonable validation signal for the design.
- Two named plugins are unusually direct prior art: `ruflo-adr` (ADR tracking as a plugin, not a manual habit) and `ruflo-sparc` ("guided 5-phase development methodology with quality gates") — both worth a closer read once Engineering OS tooling is actually chartered, since AI-EOS already requires ADRs (P-06) and a phase-gated lifecycle but has never shipped either as working tooling.
- **Open question, not an assumed adoption:** Ruflo's "Swarm" — multiple agents coordinating on one task — has no equivalent in AI-EOS's current design, which assigns exactly one Role per stage (`v3/Stage_Router_Design_v1.0.md`). Whether AI-EOS's Role Engine should ever support a multi-agent stage is a real design question this scan surfaces but does not answer (see §7).

### 3.4 `nexu-io/open-design`

**What it is:** A local-first desktop app billed as "the open-source Claude Design alternative" — the coding agent already on a developer's machine becomes the design engine, producing prototypes, dashboards, decks, images, and video as real exportable files (HTML/PDF/PPTX/MP4), shaped by a project's `DESIGN.md`.

**How it works:** Composable skills read a `DESIGN.md` "brand contract," plus a plugin system and 20+ CLI/BYOK integrations (Claude Code, Codex, Cursor, Gemini CLI, and others) via a proxy endpoint that accepts any OpenAI-compatible provider.

**Mapping to AI-EOS:**
- Fills the "UI Design" / "UI Generation" rows of Vision §5.3's Example Capability Mapping with a real, working, open-source option — a concrete alternative to the illustrative Fable/Lovable/v0 example already in that table.
- `DESIGN.md` as a persistent "brand contract" that shapes every generated artifact is a close analog to what a Product OS artifact from UX Discovery or Product Architecture (Vision §3.1) would need to hand to Engineering OS — a compact, durable design-system document rather than a one-off brief.
- The BYOK proxy (`/api/proxy/{anthropic,openai,azure,google,ollama,...}`) is a concrete, working reference for exactly the kind of vendor-adapter layer the Provider SDK (Vision §4) is specified to be.

### 3.5 `pablo-mano/Obsidian-CLI-skill`

**What it is:** A Claude Code (and Cursor, Cortex Code) skill giving an agent full CLI control of an Obsidian vault — 130+ commands spanning notes, daily notes, full-text search, properties, tags, tasks, backlinks/links, templates, and sync.

**How it works:** Activates on natural-language requests that clearly involve a vault, or via an explicit `$obsidian-cli` prefix; talks to the Obsidian desktop app over IPC through the official Obsidian CLI (v1.12+).

**Mapping to AI-EOS:**
- Obsidian's vault — plain markdown notes connected by backlinks and tags — is a working, portable, human-readable knowledge graph. That is a concrete, already-built candidate for what Vision §4's Memory component and Roadmap Phase 3's "Knowledge Graph" / "ADR Retrieval" items are currently only named, not designed. Worth studying before building a bespoke graph store from scratch.
- The three-tier activation pattern (implicit natural-language trigger → explicit prefix → "strict mode" always-on) is a reusable reference for how any AI-EOS Capability might be invoked without the Founder needing to know Role or Capability names.

### 3.6 `multica-ai/andrej-karpathy-skills`

**What it is:** A single `CLAUDE.md` distilling four behavioral principles from an Andrej Karpathy post on LLM coding pitfalls: **Think Before Coding** (surface assumptions, don't guess silently), **Simplicity First** (no speculative abstraction), **Surgical Changes** (touch only what the task requires), **Goal-Driven Execution** (turn instructions into verifiable success criteria).

**How it works:** Installed as a Claude Code plugin or a per-project `CLAUDE.md`; also ships a Cursor rule. Its README points to a sibling project, `multica-ai/multica` — "an open-source platform for running and managing coding agents with reusable skills," i.e. a hosted/managed agent operations product.

**Mapping to AI-EOS:**
- The four principles are a candidate default behavioral layer for the Prompt Compiler (Vision §4) — a small, reusable prompt fragment that could be compiled into every Implementation AI (and arguably every Role's) invocation, independent of which Capability or Provider is resolved for that stage.
- `multica-ai/multica` itself (not one of the six links, but the org's flagship product referenced from this repo) is a rough analog to what Roadmap Phase 7 ("AI-EOS Cloud" — hosted runtime, team dashboards, shared memory) describes, and is worth a glance if that phase is ever scoped in earnest.

## 4. Cross-Cutting Patterns

Three things recur across independently-built projects, which is a stronger signal than any one of them alone:

1. **Multi-harness plugin/marketplace distribution is the dominant vendor-neutrality mechanism in practice.** Four of six projects ship as an installable plugin across many coding-agent harnesses rather than as a fork or a harness-specific tool. This is external validation for the Provider SDK's premise (Vision §4, §5.6: "adding a Provider is a configuration change, never an architectural one") — the market has already converged on plugin-based neutrality as the way to achieve it.
2. **Automatic, implicit activation is the dominant UX for invoking specialized behavior.** Superpowers' auto-triggering skills and the Obsidian skill's natural-language activation both avoid making the user name a role or tool explicitly. This favors Capability-based routing (Vision §5.1) over any design that would require the Founder to know Role or Capability names up front.
3. **ADR-tracking and staged-methodology tooling already exists as shipping code** (`ruflo-adr`, `ruflo-sparc`), not just as AI-EOS's own specification. AI-EOS already mandates ADRs (P-06) and a phase-gated lifecycle in principle; these plugins are concrete implementations worth reading closely whenever Engineering OS tooling moves from specification to an actual Engineering Charter.

## 5. Recommendations Table

| AI-EOS reference | Tool studied | Specific pickup |
|---|---|---|
| Vision §5.1 Decision Hierarchy | `ruvnet/ruflo` | Router → Swarm → Agents → Memory → Providers + Learning Loop is a working shape close to the Decision Hierarchy already specified — a validation reference, not a template to copy verbatim |
| Vision §5.2 Capability Registry ("Security Review") | `affaan-m/ECC` (AgentShield) | Confirms this Capability category already has real, working tooling — useful when the Capability Registry schema (Vision §10 item 3) is eventually written |
| Vision §5.3 Example Capability Mapping ("UI Design") | `nexu-io/open-design` | A real open-source option to consider alongside the illustrative Fable/Lovable/v0 row, plus its BYOK proxy as a Provider SDK reference |
| Vision §4 Memory / Roadmap Phase 3 (Knowledge Graph, ADR Retrieval) | `pablo-mano/Obsidian-CLI-skill` | Plain-markdown, backlink/tag-based vault as a candidate backing store instead of a bespoke graph database |
| Vision §4 Prompt Compiler | `multica-ai/andrej-karpathy-skills` | Four-principle behavioral layer as a candidate default injected into every Role invocation |
| Vision §4 Workflow Engine / §5.1 Capability activation | `obra/superpowers` | Clarify → spec → plan → subagent execution as working prior art for the auto-triggering, no-manual-role-naming activation pattern |
| Roadmap Phase 8 (Marketplace) | `affaan-m/ECC` (README warning) | Cautionary: design supply-chain integrity (official sources, signed registry) into the Marketplace phase from the outset, not after |
| Roadmap Phase 7 (AI-EOS Cloud) | `multica-ai/multica` | Rough shape reference for a hosted/managed runtime with team dashboards |

## 6. What This Document Does Not Do

- It does not recommend adopting, installing, licensing, or integrating any named tool. Every mapping above is descriptive, not prescriptive.
- It does not perform a security, license, or supply-chain review of any repo. The ECC warning is quoted because the repo itself states it, not because an independent audit was performed here.
- It does not alter, supersede, or contradict `AI-EOS_Runtime_Vision_v1.0.md` or `AI-EOS_Runtime_Roadmap_v1.0.html`. Every cross-reference points at those documents' existing content as of this scan; neither file was changed.
- It does not open, or imply the need to open, any Engineering Charter. Per the Founder's explicit scope for this scan, it stops at research and recommendations.
- It is not an endorsement of, or affiliation claim with, any named project, author, or company. All six are independent third parties; AI-EOS has no relationship with any of them.

## 7. Open Questions for Strategic AI / Founder Review

1. Should the Role Engine ever support a multi-agent "swarm" per stage (per `ruflo`), or does AI-EOS deliberately stay single-Role-per-stage, per the existing Stage Router design (`v3/Stage_Router_Design_v1.0.md`)?
2. Should the Runtime's Memory component (Vision §4) be specified against a vault-like, markdown/backlink model (per the Obsidian skill), or a database/graph model — and does that choice belong in the Capability Registry data model recommended in Vision §10, item 3?
3. If Roadmap Phase 8 (Marketplace) is ever chartered, should its acceptance criteria include supply-chain integrity measures from the start, given the explicit warning already present in `affaan-m/ECC`'s own documentation?
