# AI-EOS Product Discovery MVP Architecture

**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Founder-approved  
**Charter:** EC-004

## Architecture Goal

Extend the proven local Runtime with the smallest capabilities required to turn
a raw Founder idea into an attributable, decision-ready Product Definition and
a proposed Engineering Charter.

## System Boundary

```text
Founder Idea File
      │
      ▼
AI-EOS Runtime
  ├── Product Discovery Flow
  ├── Founder Input Gate
  ├── Evidence Validator
  ├── Existing Approval Policy
  ├── Existing Context Compiler
  └── Existing Artifact/Event Store
      │
      ├── Codex CLI ── Product Roles
      ├── Controlled Web Research ── Market Research only
      └── Local Files ── Product package and proposed Charter
```

The MVP remains one local process with file-backed state. It extends EC-003;
it does not introduce a second Runtime.

## New Runtime Capability: Founder Input

Approval answers “may the flow advance?” Founder Input answers discovery
questions. These are separate concepts.

New status:

```text
awaiting_input
```

New transition:

```text
running
→ awaiting_input
→ founder response artifact persisted
→ running
```

The input gate declares:

- stable question-set ID
- question IDs
- required or optional status
- answer schema
- maximum clarification rounds
- prior input artifacts in scope
- legal next stage

The Runtime must reject missing required answers, unknown question IDs, and
answers for a stale question set.

## Product Discovery Flow

```text
Idea Intake
→ Founder Discovery Questions
→ Founder Input
→ Founder Intent Synthesis
→ Founder Intent Approval
→ Market and Competitor Research
→ Opportunity and Risk Assessment
→ Research Evidence Approval
→ Product Strategy and MVP Scope
→ MVP Scope Approval
→ Product Requirements
→ Initial User Journey
→ Product Readiness Review
→ Product Readiness Approval
→ Engineering Charter Handoff
→ Knowledge Capture
→ Complete
```

## Approval Gates

### Founder Intent Approval

Confirms that the synthesized problem, audience, desired outcome, constraints,
and priorities accurately represent the Founder.

### Research Evidence Approval

Confirms that the evidence package is sufficient to inform strategy. It does
not assert that every external claim is permanently true.

### MVP Scope Approval

Confirms priority, included capabilities, non-goals, and validation assumptions.

### Product Readiness Approval

Confirms that the Product Definition is ready to produce a proposed
Engineering Charter. It does not authorize implementation.

## Evidence Architecture

Product artifacts use five provenance types:

| Type | Meaning |
|---|---|
| `founder_input` | Directly supplied by the Founder |
| `external_fact` | Claim supported by one or more external sources |
| `inference` | Reasoned conclusion derived from cited evidence |
| `assumption` | Unverified statement requiring validation |
| `decision` | Founder-approved choice |

Every claim has:

- stable claim ID
- statement
- provenance type
- source or Founder input IDs
- confidence: low, medium, or high
- status: active, rejected, or superseded

Every external source has:

- stable source ID
- title
- canonical URL
- publisher
- publication date when available
- retrieval timestamp
- source-quality note

The Evidence Validator rejects dangling source IDs and `external_fact` claims
without sources.

## Research Boundary

Only Market and Competitor Research may access the internet. All other stages
consume persisted evidence and run without network access.

Research must be bounded by configuration:

- market or geography
- target customer
- maximum competitor count
- maximum source count
- freshness preference
- time budget

Research stores source metadata and claim mappings, not complete copyrighted
articles.

## Performance Observability

Every provider attempt records enough local metadata to explain Product
Discovery latency without inspecting provider logs:

- stage and attempt identifiers,
- invocation, provider-start, and provider-completion timestamps,
- provider and total stage duration in milliseconds,
- context document count and UTF-8 byte size,
- structured output byte size,
- validation result or provider failure reason.

The same duration fields are included in stage completion, validation-failure,
negative-outcome, and provider-failure events. Metrics contain sizes and timing,
not additional prompt content or credentials. DR-004 service targets are
evaluated from persisted events and attempt manifests.

## Living Product Brief

Product Discovery creates `product-brief.html` and its structured
`product-brief.json` model at run start. The Runtime updates both atomically
after every completed stage and whenever it pauses for Founder input or
approval. Rendering is deterministic and never invokes an AI provider.

The primary view prioritizes current status, progress, the next Founder action,
latest findings, decisions, and structured competitor profiles. Detailed stage
history remains available as an expandable audit view. The file path remains
stable throughout the run. While a stage is active, the HTML shows the current
activity and elapsed time and refreshes itself every three seconds so persisted
stage changes appear without Founder action. The optional CLI preview flag opens
this local file as soon as it is created; rendering remains deterministic and
requires no HTTP service or additional dependency.

The Founder view uses a decision-dashboard hierarchy rather than presenting the
audit trail first. Its visual metrics are derived only from persisted Runtime
state: stage progress, verified competitor count, recorded decision count, and
the latest stage's open-action count. `needs_changes` is labeled as a Founder
decision checkpoint in the view even though the current Runtime state remains
the governed terminal `failed` state until a revision branch is implemented.

The dashboard uses the Nature palette by default with a dark forest-green
recommendation surface. Founder-selectable Earth, Indigo, and Midnight palettes
change presentation only and persist locally across automatic refreshes. Theme
selection never changes evidence, approvals, Runtime state, or generated metric
values.

### Fast dossier completeness

Discovery modes vary evidence breadth and latency budget, not the set of
Founder-facing decisions. Fast mode retains five provider calls, but its
Opportunity and Risk invocation must return five additional structured dossier
sections: Product Strategy, detailed MVP Scope, Product Requirements, User
Journey, and Pilot Economics. The Runtime rejects incomplete combined output.

Product Readiness output is persisted even when its outcome is `needs_changes`.
The Runtime then adds explicit Engineering Handoff Status, Knowledge Capture,
and Final Decision sections and writes `decision-dossier.html`. An incomplete
readiness result continues to block Engineering handoff and material capital;
it no longer removes the review or final dossier from Founder view.

## Codex CLI Hardening

Before EC-004 implementation:

1. Resolve the Codex executable from:
   - explicit project configuration,
   - `PATH`,
   - known ChatGPT application bundle paths.
2. Invoke governed stages with unrelated personal configuration disabled.
3. Explicitly enable only capabilities needed by the current stage.
4. Preserve existing Codex authentication.
5. Prohibit Computer Use, AppleScript, dangerous sandbox bypass, and unrelated
   MCP/plugin activation.
6. Record executable version and invocation policy in the stage manifest.

Exact supported CLI flags must be verified against the installed Codex version
during implementation rather than assumed.

## Workspace Permissions

Every Product Discovery stage is workspace read-only from the AI provider's
perspective. The deterministic Runtime alone writes Product Discovery artifacts
under the run directory.

No Product Discovery stage may modify application source code.

## Product Package

```text
ai-eos/
  product/
    runs/<run-id>/
      idea/
      founder-input/
      evidence/
        sources.json
        claims.json
      strategy/
      scope/
      requirements/
      journeys/
      readiness/
      handoff/
        product-definition.md
        product-definition.json
        engineering-charter.md
      approvals/
      events.jsonl
      state.json
      final-report.md
```

## Failure and Revision

- Missing Founder input: remain `awaiting_input`.
- Invalid input: reject without changing the active question set.
- Weak research evidence: `needs_changes`; halt at Research.
- Contradictory critical claims: halt before Strategy.
- Rejected scope: run status becomes `rejected`.
- Failed Readiness Review: halt with specific gaps.
- Changed approved input/evidence: invalidate affected downstream approvals.
- Provider or network failure: preserve state and allow bounded retry.

Automatic branching back to an earlier stage is deferred unless required for
the controlled MVP test. The safe MVP behavior is to halt with a revision
instruction.

## Privacy

- Founder answers may contain sensitive business information.
- Founder input is local by default and included only in declared contexts.
- Each provider transmission is recorded in a manifest.
- Secrets and credentials are excluded.
- Research queries must not include unnecessary confidential details.
- No product artifact is published automatically.

## Handoff Boundary

The handoff produces:

1. approved Product Definition,
2. proposed Engineering Charter,
3. evidence and decision references,
4. unresolved assumptions and risks.

The handoff never invokes `feature-development` automatically. The Founder and
Strategic AI must separately review and approve the Engineering Charter.

## Deferred Architecture

- Primary research integrations
- Survey and interview tools
- Automated market sizing
- Financial modeling
- UI prototyping
- Product analytics
- Multiple Product Discovery flow types
- Cloud collaboration

## Approval Gate

EC-004 implementation may begin only after Founder approval of:

1. EC-004,
2. this architecture,
3. Product Role Specification v1.0,
4. Product Discovery Flow Specification v1.0,
5. Product-to-Engineering Handoff Specification v1.0.
