# AI-EOS v3 — Model Assignment Configuration v1.0

**Status:** Proposed — part of EC-002
**Depends on:** `AI_Role_Specification_v1.0.md`, `Stage_Router_Design_v1.0.md`

---

## Purpose

Maps each AI Role to the model currently filling it. This is the single layer that changes when a model is swapped, upgraded, or replaced — Flows, Roles, and the Stage Router are untouched by a Model Assignment change.

## Schema

```yaml
# ai-eos.model-assignment.yaml
version: 1
roles:
  founder:
    model: human            # Founder is always human; not model-assignable
  product_ai:
    model: chatgpt
  research_ai:
    model: claude
  architect_ai:
    model: chatgpt
  implementation_ai:
    model: claude
  review_ai:
    model: chatgpt
  qa_ai:
    model: claude
  knowledge_ai:
    model: claude

fallback:
  # used if a role's primary model is unavailable
  product_ai: claude
  architect_ai: claude

overrides:
  # per-flow overrides, optional — takes precedence over the default mapping above
  flow.hotfix:
    implementation_ai: claude
    qa_ai: claude
```

## Example Mapping (matches the Founder's original request)

| Role | Model |
|---|---|
| Product AI | ChatGPT |
| Architect AI | ChatGPT |
| Implementation AI | Claude |
| Review AI | ChatGPT |
| QA AI | Claude |
| Research AI | *(unspecified in original request — recommend Claude or ChatGPT per project preference)* |
| Knowledge AI | *(unspecified — recommend Claude, consistent with Implementation AI's role as documentation-capable per v2.x §5.1)* |

## Rules

- **Every Role must resolve to exactly one model** at any point in time. No Role may be left unassigned when a Flow that uses it is active.
- **Founder is never model-assignable.** It is always the human Founder; this is enforced by the Stage Router, not just convention.
- **Fallback mappings are optional but recommended** for any Role used in a Flow with tight time constraints (e.g., Hotfix), so the Router has a defined path if a primary model is unavailable.
- **Overrides are scoped to a specific Flow ID** and take precedence over the default mapping only within that Flow's execution — they do not change the global default.
- **Changing a Model Assignment does not require re-approving the Flow or Role definitions.** It is a Capabilities-layer configuration change (§3 of `AI-EOS_Context_v2.1.md`), not an architectural one — unless the new model requires a materially different context-compilation approach, in which case it routes through an Architecture Review flow first.
- **A Model Assignment file is per-project**, not global to AI-EOS — different projects adopting v3 may assign different models to the same Role based on their own constraints (cost, availability, capability).

## Validation

A Model Assignment configuration is valid only if:
1. Every Role referenced by every active Flow has a resolvable model (default, fallback, or override).
2. `founder` is never reassigned away from `human`.
3. No two Roles required to review each other's independent output in the same Flow stage (e.g., an Architecture gate where both Architect AI and Review AI must weigh in independently) resolve to the same model instance for that stage, unless the project explicitly accepts the reduced independence — this preserves the value of having distinct Roles in the first place.
