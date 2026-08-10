# AI-EOS Product Discovery Flow Specification

**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Proposed — part of EC-004

## Flow Definition

**Flow ID:** `flow.product-discovery`  
**Trigger:** Founder supplies a raw idea file.  
**Exit:** Product Definition and proposed Engineering Charter are generated
after Product Readiness Approval.

## Stages

| # | Stage | Role | Capability | Gate |
|---|---|---|---|---|
| 1 | Idea Intake | Runtime | Local read | — |
| 2 | Founder Discovery Questions | Product Discovery AI | Read-only | Input |
| 3 | Founder Intent Synthesis | Product Discovery AI | Read-only | Founder Intent Approval |
| 4 | Market and Competitor Research | Market Research AI | Read-only + bounded web | — |
| 5 | Opportunity and Risk Assessment | Product Strategy AI | Read-only | Research Evidence Approval |
| 6 | Product Strategy and MVP Scope | Product Strategy AI | Read-only | MVP Scope Approval |
| 7 | Product Requirements | Product Definition AI | Read-only | — |
| 8 | Initial User Journey | Product Definition AI | Read-only | — |
| 9 | Product Readiness Review | Product Review AI | Read-only | Product Readiness Approval |
| 10 | Engineering Charter Handoff | Knowledge AI | Read-only | — |
| 11 | Knowledge Capture | Knowledge AI | Read-only | — |

## Founder Discovery Questions

Questions must be bounded and individually identified. The first round covers:

- problem and urgency
- intended customer
- desired outcome
- Founder motivation
- constraints
- geography or market
- known alternatives
- success definition
- non-negotiables
- initial scope instinct

The Runtime allows a maximum of three clarification rounds in the MVP.

## Founder Intent Approval Criteria

- Every intent statement references Founder input.
- Unknowns are labeled.
- Contradictions are surfaced.
- AI-generated suggestions are separated from Founder intent.

## Research Evidence Approval Criteria

- Research bounds are recorded.
- Sources and retrieval dates exist.
- External facts link to sources.
- Inferences and assumptions are labeled.
- Material contradictions and gaps are visible.

## MVP Scope Approval Criteria

- One target customer and primary problem are explicit.
- MVP outcome is measurable.
- Included capabilities are prioritized.
- Non-goals are explicit.
- Critical assumptions and validation needs are recorded.
- Scope does not imply implementation.

## Product Readiness Criteria

- Founder Intent is approved.
- Research Evidence is approved.
- MVP Scope is approved.
- Requirements trace to approved scope.
- User journey covers the primary use case.
- Critical contradictions are resolved.
- Unresolved risks and assumptions are visible.
- The proposed product is bounded enough for one Engineering Charter.

## Common Rules

- Only `completed` advances.
- `needs_changes` and `failed` halt.
- Founder input and Founder approval are never inferred from conversation text.
- Every gate references current artifact hashes.
- Changed upstream evidence invalidates derived approvals.
- No stage performs implementation, source control, publication, or outreach.

