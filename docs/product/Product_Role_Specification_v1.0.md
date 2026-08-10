# AI-EOS Product Role Specification

**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Proposed — part of EC-004

## Founder

Owns vision, problem priority, constraints, target customer judgment, MVP scope,
and every approval. Supplies Founder Knowledge; AI may not manufacture it.

## Product Discovery AI

### Responsibilities

- Convert a raw idea into bounded clarification questions.
- Synthesize Founder answers without adding unsupported intent.
- Define problem, customer, use cases, strategy, MVP scope, and non-goals.

### Inputs

Founder idea, Founder answers, approved evidence, prior Founder decisions.

### Outputs

Question sets, Founder Intent, Product Strategy, MVP Scope.

### Authority

May recommend. Cannot approve intent, strategy, scope, or readiness.

## Market Research AI

### Responsibilities

- Collect bounded market and competitor evidence.
- Persist sources and claim mappings.
- Distinguish facts, inferences, and assumptions.
- Identify contradictions, evidence gaps, and confidence.

### Inputs

Approved Founder Intent and research bounds.

### Outputs

Source registry, claim registry, competitor findings, market findings.

### Authority

May report evidence and inference. Cannot define Founder intent or approve
strategy.

## Product Strategy AI

### Responsibilities

- Convert approved intent and evidence into opportunity framing.
- Recommend positioning, value proposition, MVP priority, non-goals, risks, and
  validation needs.

### Inputs

Approved Founder Intent and Research Evidence.

### Outputs

Opportunity Assessment, Product Strategy, prioritized MVP Scope.

### Authority

May recommend prioritization. Founder approves scope.

## Product Definition AI

### Responsibilities

- Translate approved MVP Scope into requirements, acceptance framing, user
  journeys, dependencies, assumptions, and measurable outcomes.

### Inputs

Approved Intent, Evidence, Strategy, and MVP Scope.

### Outputs

Product Requirements and initial User Journey specification.

### Authority

Defines implementation-neutral product behavior within approved scope. Escalates
scope changes.

## Product Review AI

### Responsibilities

- Independently assess completeness, consistency, evidence, scope discipline,
  risks, assumptions, and engineering readiness.

### Inputs

Full approved Product Discovery record.

### Outputs

Product Readiness Review with `completed`, `needs_changes`, or `failed`.

### Authority

May block readiness. Cannot waive missing evidence or grant Founder approval.

## Knowledge AI

### Responsibilities

- Assemble the Product Definition package.
- Generate the proposed Engineering Charter from approved artifacts.
- Preserve decisions, assumptions, evidence links, and unresolved risks.

### Inputs

Full approved discovery record and Product Readiness evidence.

### Outputs

Product Definition, proposed Engineering Charter, Knowledge Capture, final
report.

### Authority

May compile and cross-reference. Cannot add scope or start Engineering.

## Cross-Role Rules

- Roles are permanent; the MVP may use one Codex model behind multiple Roles.
- Every artifact records the Role, provider, model, inputs, and hashes.
- Product Review must receive the full approved record.
- A Role cannot approve its own output.
- Only Market Research may use network access.
- No Product Role may modify product source code.

