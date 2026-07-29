# AI-EOS Runtime — Vision v1.0

**Status:** Proposed — pending Founder approval and Strategic AI (ChatGPT) architecture review
**Origin:** Strategic AI architecture discussion, extending Charter EC-002's scope
**Depends on:** `AI-EOS_Context_v2.1.md` (Stable Core, unchanged), `v3/AI-EOS_v3_Architecture_Proposal.md`, `v3/AI_Role_Specification_v1.0.md`, `v3/Stage_Router_Design_v1.0.md`, `v3/Model_Assignment_Configuration_v1.0.md`
**Date:** July 2026

> This is a vision document, not canonical context and not an implementation commitment. It becomes canonical only when the Founder and Strategic AI approve it. Nothing in this document authorizes building the Runtime — that requires its own Engineering Charter, opened after this vision and its companion roadmap are approved. See `AI-EOS_Runtime_Roadmap_v1.0.html`.

---

## 1. What Changes

AI-EOS has, to this point, been positioned as an **Engineering Operating System** — a discipline for turning an approved unit of work into production software (`AI-EOS_Context_v2.1.md`; `v3/AI-EOS_v3_Architecture_Proposal.md`).

That discipline does not change. What changes is scope: engineering work has always assumed an idea already arrived at the engineering boundary — approved, scoped, ready for a Charter. AI-EOS has never described what happens *before* that boundary, or what closes the loop *after* release. This document extends AI-EOS's positioning to cover the full arc, and names the execution engine — the **AI-EOS Runtime** — that carries work across both halves.

Nothing here revises the Stable Core. Founder Knowledge remains the source of truth, Engineering Charters remain mandatory, ADRs remain mandatory, Documentation-First (P-07) remains mandatory, and AI-EOS remains vendor-agnostic. This document adds a wider frame around the existing discipline; it does not replace any principle inside it.

## 2. Vision Statement

> **AI-EOS is an AI-native Operating System for transforming ideas into products and products into production software.**
>
> It combines **Product Operating System**, **Engineering Operating System**, **Runtime Orchestration**, and **Institutional Knowledge** through a unified execution platform.

This supersedes the narrower "Engineering Operating System" framing as AI-EOS's ceiling — not by retracting it, but by naming it as one of two domains AI-EOS now spans.

## 3. Two Domains

AI-EOS is organized into two complementary domains, sequenced by a single non-negotiable boundary: **no implementation occurs until Product Readiness Review is passed.**

### 3.1 Product OS

**Responsible for transforming an idea into an engineering-ready product.**

| Stage | Purpose |
|---|---|
| Founder Discovery | Surface the Founder's vision, constraints, and non-negotiables before any market or user framing is applied |
| Market Discovery | Establish who the product is for and why now |
| Product Strategy | Define what the product must become to win in that market |
| Business Strategy | Define how the product sustains itself — model, positioning, constraints |
| Validation | Test strategy and assumptions against real signal before committing engineering effort |
| Product Definition | Convert validated strategy into a concrete, scoped product description |
| UX Discovery | Define how the product is experienced, independent of how it is built |
| Product Architecture | Define the product's structural shape at a level engineering can receive without re-deriving intent |
| Product Readiness Review | The gate. Founder-held. Nothing crosses into Engineering OS without an explicit pass here |

**No implementation occurs in Product OS.** Every stage above produces decisions, definitions, and artifacts — never code. This is the same discipline the Mandatory Development Lifecycle already applies inside Engineering OS (research and architecture before implementation); Product OS is that discipline applied one layer earlier, to the product itself rather than to a unit of engineering work.

### 3.2 Engineering OS

**Responsible for transforming an approved product into production software.**

Engineering OS is unchanged from its existing definition and **continues following the existing AI-EOS governance model** — the Stable Core, the Mandatory Development Lifecycle, Engineering Charters, ADRs, and the v3 Role/Flow/Stage Router architecture where a project has adopted v3:

- Engineering Charters
- Architecture
- Implementation
- Reviews
- Testing
- Documentation
- Releases
- Knowledge Capture

Engineering OS begins only after Product Readiness Review passes and an Engineering Charter is opened against the approved product. Everything already specified in `v3/AI-EOS_v3_Architecture_Proposal.md`, `v3/AI_Role_Specification_v1.0.md`, `v3/Engineering_Flow_Specification_v1.0.md`, and `v3/Stage_Router_Design_v1.0.md` describes this domain; none of it is superseded by this document.

## 4. The Runtime

The **AI-EOS Runtime** is the execution engine that carries work through both domains. Where the v3 Architecture Proposal named the Stage Router as the coordination point inside an Engineering Flow, the Runtime is the broader process that hosts the Stage Router alongside the other components needed to run Product OS, Engineering OS, and the handoff between them.

| Component | Responsibility |
|---|---|
| Workflow Engine | Sequences a Product Workflow or Engineering Flow through its defined stages, including the Product OS → Engineering OS handoff at Product Readiness Review |
| Stage Router | As specified in `v3/Stage_Router_Design_v1.0.md` — selects the Role for the current stage, compiles context, resolves and invokes the assigned model, persists the artifact, evaluates gates |
| Role Engine | Resolves the permanent Role definitions from `v3/AI_Role_Specification_v1.0.md` (Product AI, Research AI, Architect AI, Implementation AI, Review AI, QA AI, Knowledge AI, and the Product OS roles this vision implies — e.g., Market Discovery AI, UX Discovery AI) to the **Capability** the current stage requires — never directly to a Model. See §5, Capability-Driven Orchestration |
| Capability Registry | Tracks the set of Capabilities AI-EOS recognizes (Research, Architecture, Coding, etc.) and which registered Providers advertise support for each — the lookup the Role Engine and Provider SDK query. See §5.2 |
| Context Engine | Performs the context compilation described in `v3/Stage_Router_Design_v1.0.md` §Context Compilation — bounding what each Role receives to what its current stage requires |
| Provider SDK | Given a required Capability, queries the Capability Registry for eligible Providers, applies Provider Ranking and the active Selection Strategy, and resolves to a specific Provider and Model — the vendor-neutral adapter layer, per `v3/Model_Assignment_Configuration_v1.0.md` and §5 below |
| Conversation Manager | Maintains the turn-by-turn state of a Role's active session with its assigned provider across a stage, independent of how that stage's artifact is later persisted |
| Approval Engine | Enforces Founder approval gates — halts a flow indefinitely at a gate until a recorded approval artifact exists, per the halt behavior already specified for the Stage Router |
| Prompt Compiler | Renders a Role's compiled context and stage's expected output shape into the concrete prompt sent to the resolved provider |
| Memory | Institutional knowledge storage — project memory, ADRs, Knowledge Capture summaries — that the Context Engine draws on when compiling context for future stages |
| CLI | Command-line interface for initializing, running, and inspecting a project's Runtime state, extending the `aieos init --version=` concept in `v3/CLI_Proposal_v1.0.md` |
| Web UI | Visual interface for the same Runtime state — flow progress, pending approvals, artifact history |
| REST API | Programmatic interface for the same Runtime state, for integration with external tooling (e.g., GitHub, IDEs) |

**The Runtime executes the Specification. The Specification remains the source of truth.** Every component above is a mechanism for carrying out what is already defined in `AI-EOS_Context_v2.1.md` and the v3 specification set — the Stable Core, the Role definitions, the Flow definitions, the Stage Router design. None of these components introduces new authority, new philosophy, or a new approval path. A Runtime that behaved differently from the Specification would be a bug in the Runtime, not a second source of truth.

## 5. Capability-Driven Orchestration

AI-EOS Runtime never orchestrates a specific AI model directly. It orchestrates **Capabilities**, and resolves a Capability to a Provider and Model only at the last step, according to the active configuration. This is a core architectural principle of the Runtime, not an implementation detail of the Provider SDK: **models are interchangeable; the Capability a Role requires is stable.**

### 5.1 Decision Hierarchy

```
Founder Intent
    ↓
Workflow
    ↓
Role
    ↓
Capability
    ↓
Available Providers
    ↓
Provider Ranking
    ↓
Selection Strategy
    ↓
Provider
    ↓
Model
    ↓
Execution
```

This is the detailed expansion of the Role Engine → Provider SDK step in the Long-Term Architecture chain (§6) — it does not replace that chain, it explains what happens inside it. At each stage, the Runtime asks:

- **What Capability is required?** — resolved from the Role active for the current stage.
- **Which Providers advertise that Capability?** — resolved from the Capability Registry (§5.2).
- **Which Provider is ranked highest for it?** — resolved from Provider Ranking (§5.4), a configuration input, not Runtime logic.
- **Which Selection Strategy is active?** — resolved from project or Founder configuration (§5.5).
- **Which Model should ultimately execute the task?** — the final resolution, handed to the Provider SDK's vendor adapter for invocation.

### 5.2 Capability Registry

The Capability Registry is a conceptual registry of the Capabilities AI-EOS recognizes, and of which Providers have registered support for each. It is data the Runtime queries, not logic the Runtime hardcodes — adding a Provider is a registry update, never an architecture change.

Illustrative capabilities (not exhaustive, not fixed):

Research · Product Strategy · Market Analysis · Architecture · Coding · Code Review · Documentation · Knowledge Management · Testing · QA · Security Review · UX Design · UI Generation · Diagram Generation · Data Analysis

### 5.3 Example Capability Mapping

The following is illustrative only. **The Runtime must not hardcode providers** — this table is what a populated registry might look like at a point in time, not a specification of which providers AI-EOS supports.

| Capability | Example Providers |
|---|---|
| Research | OpenAI, Gemini, Claude, Perplexity |
| Architecture | OpenAI, Claude |
| Implementation | Claude Code, Codex, Gemini CLI, Cursor |
| UI Design | Fable, Lovable, v0 |
| Documentation | Claude, OpenAI |

### 5.4 Provider Ranking

Providers may be ranked per Capability. Ranking is configuration, not Runtime logic — the Runtime reads a ranking, it does not compute one.

| Capability | Provider | Illustrative Score |
|---|---|---|
| Architecture | OpenAI | 97 |
| Architecture | Claude | 92 |
| Implementation | Claude Code | 98 |
| Implementation | Codex | 95 |
| UI Design | Fable | 96 |
| UI Design | Lovable | 93 |

### 5.5 Selection Strategies

The active Selection Strategy determines how the Runtime chooses among ranked, eligible Providers for a Capability. Strategies are configurable per project, and potentially per Role, per Founder policy:

- Best Quality
- Fastest
- Lowest Cost
- Balanced
- Local Only
- Privacy First
- Custom

```
Capability
    ↓
Available Providers
    ↓
Ranking
    ↓
Selection Strategy
    ↓
Selected Provider
    ↓
Selected Model
```

### 5.6 Architectural Principle

> **AI-EOS is Capability-Driven, not Model-Driven.**
>
> Models evolve rapidly. Capabilities remain stable. The Runtime therefore depends on Capabilities rather than specific AI models — this is what keeps AI-EOS permanently vendor-neutral, and what makes adding a new Provider a configuration change, never an architectural one.

This extends, rather than revises, the "Models are interchangeable. Roles are permanent." principle already established in `v3/AI-EOS_v3_Architecture_Proposal.md` §4 — Capabilities are the mechanism by which that interchangeability is actually resolved at runtime.

### 5.7 Future Vision

Future versions of AI-EOS may evaluate Providers automatically against Quality, Cost, Latency, Availability, Privacy, Project Policy, and Team Preferences, and adjust Provider Ranking or the active Selection Strategy accordingly — without requiring any change to a Workflow, Role, or Charter. Only Provider configuration changes. The Workflow Engine, Stage Router, and Role Engine remain unchanged; automatic evaluation is additive within the Provider SDK and Capability Registry, not a new decision-making layer above them.

## 6. Long-Term Architecture

```
Founder
    ↓
AI-EOS Runtime
    ↓
Workflow Engine
    ↓
Stage Router
    ↓
Role Engine
    ↓
Provider SDK
    ↓
Underlying AI Providers
(OpenAI, Anthropic, Gemini, future providers)
```

The Founder interacts with AI-EOS. AI-EOS interacts with AI systems. At no point does the Founder address a provider directly, and at no point does a provider address another provider — every step of the chain is mediated by the Runtime, preserving the same no-direct-AI-to-AI-invocation guarantee already established in `v3/AI-EOS_v3_Architecture_Proposal.md` §5. The Role Engine → Provider SDK step shown here is expanded in full in §5, Capability-Driven Orchestration — Capability resolution, Provider Ranking, and Selection Strategy all happen inside that single arrow.

## 7. Product Workflow

```
Idea
    ↓
Founder Discovery
    ↓
Market Discovery
    ↓
Product Strategy
    ↓
Business Strategy
    ↓
Validation
    ↓
Product Definition
    ↓
UX Discovery
    ↓
Product Architecture
    ↓
Product Readiness Review  ← Founder-held gate; boundary of Product OS
    ↓
Engineering Charter
    ↓
Engineering OS
    ↓
Release
    ↓
Analytics
    ↓
Customer Feedback
    ↓
Product Discovery  ⟲
```

**Product Discovery is not an endpoint.** It feeds back into Founder Discovery and Market Discovery, making the full workflow a continuous loop rather than a linear pipeline: what a release teaches, through Analytics and Customer Feedback, becomes the next cycle's Product Discovery input. Engineering OS is a bounded segment of this loop, not the loop's destination.

## 8. Relationship to Existing Specification

This document does not fork or restate the v3 specification set — it places it inside a larger frame:

| Existing document | Position under this vision |
|---|---|
| `AI-EOS_Context_v2.1.md` | Stable Core — unchanged, governs both domains |
| `v3/AI-EOS_v3_Architecture_Proposal.md` | Describes the Founder → Runtime → Engineering Flow → Stage Router → AI Roles → Models chain — now understood as the Engineering OS instance of the Runtime chain in §6 above, with the Role → Model resolution detailed by §5 |
| `v3/AI_Role_Specification_v1.0.md` | Defines the Engineering OS roles the Role Engine resolves to a Capability (§5.1); Product OS roles are a future companion specification, not yet written |
| `v3/Engineering_Flow_Specification_v1.0.md` | Defines the Engineering Flows the Workflow Engine sequences after Product Readiness Review |
| `v3/Stage_Router_Design_v1.0.md` | Defines the Stage Router component named in §4 above — unchanged |
| `v3/Model_Assignment_Configuration_v1.0.md` | Defines the Role → Model mapping now expanded into the Capability, Provider Ranking, and Selection Strategy resolution in §5 |
| `v3/CLI_Proposal_v1.0.md` | Precursor to the CLI component in §4 above |

A **Product Workflow Specification** and **Product Role Specification** (mirroring the existing Engineering Flow and AI Role specifications, but for the nine Product OS stages in §3.1), and a **Capability Registry Specification** (a data model for §5.2–§5.5), are the natural next companion documents, and are called out as a recommendation in §10.

## 9. What This Vision Does Not Do

- It does not stand up a working Runtime, Workflow Engine, Stage Router, Role Engine, Capability Registry, Context Engine, Provider SDK, Conversation Manager, Approval Engine, Prompt Compiler, Memory store, CLI, Web UI, or REST API. All of these remain design concepts pending their own Engineering Charter(s).
- It does not alter, deprecate, or override any Stable Core principle, any existing v2.x file, or any existing v3 specification. Existing documents are extended, not superseded.
- It does not commit AI-EOS to a specific Product OS role structure, model assignment, or provider — those follow the same model-agnostic, configuration-driven pattern already established for Engineering OS.
- It does not hardcode which Providers support which Capabilities, fix a Provider Ranking, or mandate a Selection Strategy. The Capability Registry, rankings, and strategies in §5 are illustrative and configuration-driven — none of the named Providers (OpenAI, Claude, Fable, etc.) are a commitment.
- It does not implement automatic Provider evaluation (§5.7). That remains future work layered on the same Capability Registry and Provider SDK, not a new component.
- It does not remove or dilute Founder authority. Product Readiness Review is explicitly Founder-held, matching the Founder's existing approval authority over every gate in Engineering OS.

## 10. Recommendations Before Runtime Implementation Begins

1. **Open a scoping charter before any Runtime code.** This vision and its companion roadmap (`AI-EOS_Runtime_Roadmap_v1.0.html`) are design artifacts. Per the existing charter discipline, no Runtime component in §4 or §5 should be implemented without an Engineering Charter analogous to EC-002, scoped to Phase 1 of the roadmap only.
2. **Write the Product Role and Product Workflow specifications next.** §3.1 names nine Product OS stages but does not yet assign them Role definitions, inputs/outputs, or decision authority the way `v3/AI_Role_Specification_v1.0.md` does for Engineering OS. This is the highest-value next documentation step, and should precede Runtime Kernel work (Phase 1) even though it is scheduled later (Phase 4) on the roadmap — a Role Engine built without Product Roles to resolve against will need rework.
3. **Specify the Capability Registry data model before Phase 1.** §5.2–§5.5 name the concepts (Capabilities, Provider registration, Ranking, Selection Strategy) but not a schema — how a Provider declares a Capability, how a Ranking is stored and versioned, how a Selection Strategy is expressed as configuration. The Provider SDK in Phase 1 of the roadmap depends on this schema existing first.
4. **Have Strategic AI review the Runtime component list in §4, and the Capability-Driven model in §5, for redundancy against the Stage Router before Phase 1 is chartered.** The Workflow Engine, Stage Router, Role Engine, Capability Registry, and Context Engine boundaries are drawn here by inference from existing v3 documents plus this session's discussion, not by a fresh architectural pass — confirm the boundaries hold before code depends on them.
5. **Resolve the Product Readiness Review gate's mechanics before Phase 4.** Every other Founder gate in the existing specification (`v3/Stage_Router_Design_v1.0.md` §Failure and Halt Behavior) halts indefinitely pending a recorded approval artifact. Product Readiness Review should be specified the same way, in its own future document, before Product OS is implemented.
6. **Do not let "Runtime" and "Specification" drift.** §4's closing statement — the Runtime executes the Specification — is the load-bearing claim of this whole document, and §5's Capability-Driven principle is subordinate to it: a Capability Registry entry or Provider Ranking is configuration data, never a second source of truth. Any future Runtime implementation charter should include an explicit acceptance criterion that Runtime behavior is traceable to a Specification clause, the same discipline P-06 already requires for engineering decisions.
