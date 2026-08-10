# Engineering Charter EC-004

**Title:** Build the AI-EOS Product Discovery MVP  
**Version:** 1.0  
**Date:** 30 July 2026  
**Status:** Founder-approved — implementation authorized  
**Depends on:** DR-003, EC-003, Product Discovery MVP Architecture v1.0

## Objective

Extend the local AI-EOS Runtime so a Founder can submit a raw product idea,
answer structured discovery questions, review evidence-backed market research,
approve a bounded MVP definition, and receive an engineering-ready Product
Definition plus a draft Engineering Charter.

## Primary User

A Founder with an early product idea who wants a governed path from intent to
an engineering-ready MVP without allowing AI to invent vision or begin
implementation prematurely.

## In Scope

- One Product Discovery flow
- Raw idea intake from a Markdown file
- Iterative Founder Discovery questions and recorded answers
- Deterministic `awaiting_input` Runtime state
- Problem, customer, and use-case definition
- Web-backed market and competitor research
- Structured sources, claims, inferences, assumptions, and confidence
- Opportunity and risk assessment
- Product strategy
- Prioritized MVP scope and explicit non-goals
- Product requirements and acceptance framing
- Initial user journey specification
- Independent Product Readiness Review
- Four artifact-bound Founder gates
- Product Definition package
- Draft Engineering Charter handoff
- Knowledge Capture and final report
- Automated and controlled live validation

## Non-Goals

- Product implementation
- Source-code modification during Product Discovery
- Primary customer interviews or surveys
- Legal, regulatory, financial, or investment advice
- Full business plan or financial model
- Pixel-perfect UX or UI design
- Production analytics
- Automated publication or outreach
- Additional Product OS flows
- Web UI, cloud, multi-user operation, or marketplace
- Automatic execution of the generated Engineering Charter

## Deliverables

1. Product Discovery flow specification
2. Product Role specification
3. Founder input and response schemas
4. Evidence and citation schema
5. Product Definition schema
6. Product Readiness Review schema
7. Product-to-Engineering handoff schema
8. Runtime `awaiting_input` state and response command
9. Evidence-aware structured-output validation
10. Safe Codex CLI research mode
11. Product Discovery CLI commands
12. Automated unit, integration, and end-to-end tests
13. Controlled live idea-to-Charter fixture
14. Quick-start and Founder testing guide
15. Traceability matrix, completion report, and release notes

## Constraints

- Founder Knowledge may only come from Founder-provided input.
- AI may clarify and synthesize Founder intent but may not invent it.
- Every external market claim must reference a persisted source.
- Artifacts must distinguish fact, inference, assumption, and Founder input.
- Source retrieval date and URL must be recorded.
- Unsupported claims must not silently become Product Strategy.
- Product Discovery runs read-only against the project workspace.
- Network use is allowed only for the Market Research stage.
- Personal Codex plugins and unrelated integrations must not load.
- Founder answers and approvals are separate artifact types.
- Changed evidence invalidates downstream approval derived from it.
- Product Readiness Approval authorizes handoff, not implementation.
- The generated Engineering Charter remains proposed until separately approved.
- No commit, push, merge, deploy, publication, or external outreach is implicit.

## Acceptance Criteria

1. `aieos discovery start <idea-path>` creates one Product Discovery run.
2. The Runtime produces bounded Founder Discovery questions and enters
   `awaiting_input`.
3. `aieos discovery respond <run-id> --file <answers-path>` persists the exact
   Founder answers and resumes without repeating completed work.
4. Founder intent synthesis cites Founder input IDs and contains no unsupported
   Founder claims.
5. The Runtime halts at Founder Intent Approval.
6. Market Research records sources, claim-to-source links, retrieval dates,
   and confidence.
7. Every market fact has at least one valid source reference.
8. Inferences and assumptions are explicitly labeled.
9. The Runtime halts at Research Evidence Approval.
10. Product Strategy and MVP Scope consume only approved intent and evidence.
11. The Runtime halts at MVP Scope Approval.
12. Product Requirements include prioritized scope, non-goals, user journeys,
    risks, assumptions, and acceptance framing.
13. Independent Product Readiness Review halts on missing evidence,
    contradictions, or unresolved critical assumptions.
14. The Runtime halts at Product Readiness Approval only when Review outcome is
    `completed`.
15. Handoff generates an inspectable Product Definition and proposed
    Engineering Charter.
16. Product Discovery never modifies product source code.
17. The handoff does not automatically start Feature Development.
18. Interrupted runs resume from persisted state.
19. Negative outcomes halt without opening the next gate.
20. Tests, type checking, build, controlled web research, and live end-to-end
    validation pass.

## Verification Strategy

- Unit tests for input, evidence, claim, approval, and handoff schemas
- State-machine tests for `awaiting_input`
- Input-hash and downstream-approval invalidation tests
- Evidence completeness and dangling-citation tests
- Provider tests proving only Market Research has network capability
- Tests proving every Product Discovery stage is workspace read-only
- Resume and retry tests
- End-to-end fake-provider discovery flow
- Controlled live discovery run with attributable sources
- Manual Founder review at every gate
- Architecture and privacy review

## Dependencies

- Completed EC-003 Runtime
- Installed and authenticated Codex CLI
- Explicit Codex executable resolution
- Controlled web-research capability
- Founder-supplied idea and discovery answers
- Approved Product Discovery architecture and specifications

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| AI invents Founder intent | Source every intent statement to Founder input IDs |
| Market hallucination | Claim-source schema, URL validation, evidence review gate |
| Stale or weak sources | Retrieval dates, confidence, source-quality field |
| Research scope explosion | Bounded questions, competitors, geography, and time budget |
| Premature implementation | All Product stages read-only; handoff requires separate approval |
| Personal integration prompts | Controlled Codex invocation ignoring unrelated user config |
| Research changes after approval | Content hashes invalidate downstream approvals |
| Product definition is too broad | Explicit MVP priority, non-goals, and readiness criteria |

## Review Checklist

- [x] Strategic AI architecture review passed
- [x] Founder approves EC-004
- [x] Founder approves Product Discovery MVP Architecture v1.0
- [x] Founder approves Product Roles and Flow specifications
- [x] Evidence model is sufficient for attributable market claims
- [x] Product-to-Engineering handoff is compatible with EC-003
- [ ] Controlled live test idea is selected

## Completion Evidence

- Passing verification suite
- Completed controlled Product Discovery run
- Recorded Founder answers and four approvals
- Attributable research package
- Approved Product Definition
- Proposed Engineering Charter handoff
- Architecture and privacy review
- Traceability matrix
- Founder acceptance

Completion does not authorize commit, push, merge, publication, implementation
of the generated product, or deployment.
