# AI-EOS v3 — CLI Proposal v1.0

**Status:** Proposed — part of EC-002 (proposal only; no CLI has been built — see Non-goals in EC-002)
**Depends on:** `Model_Assignment_Configuration_v1.0.md`, `Project_Folder_Structure_v3.md`

---

## Purpose

Sketches the command surface a future `aieos` CLI would need to let a project explicitly select and operate under either AI-EOS version. This is a proposal for what such a tool should do — not an implementation.

## Version Selection

```
aieos init --version=v2      # Engineering Operating System only (current behavior)
aieos init --version=v3      # Engineering Operating System + AI Collaboration Framework
```

If `--version` is omitted, `aieos init` should prompt rather than default silently — version selection is a material decision and should never be implicit (consistent with P-07, Documentation First: the project's own configuration is itself documentation of an architectural choice).

## Project Configuration File

Version selection and, for v3, Model Assignment, live in a single project-level config file rather than only as CLI flags, so the choice is durable and reviewable in version control:

```yaml
# aieos.config.yaml
version: v3
model_assignment: ./ai-eos.model-assignment.yaml   # only meaningful under v3
flows_dir: ./ai-eos/flows                            # only meaningful under v3
```

A v2 project's config file is simply:

```yaml
# aieos.config.yaml
version: v2
```

## Proposed Command Surface

| Command | Behavior |
|---|---|
| `aieos init --version=<v2|v3>` | Scaffold a new project under the chosen version's recommended folder structure |
| `aieos status` | Show active version, and under v3, the active Flow (if any) and its current stage |
| `aieos flow start <flow-id>` | (v3 only) Start an Engineering Flow |
| `aieos flow list` | (v3 only) List available Flow definitions for this project |
| `aieos role show <role>` | (v3 only) Show a Role's spec and currently assigned model |
| `aieos model assign <role> <model>` | (v3 only) Update the Model Assignment configuration for a Role |
| `aieos approve <flow-id> <stage>` | (v3 only) Record a Founder approval artifact at a gated stage — the only way a gate is satisfied |
| `aieos charter new` | Scaffold a new Engineering Charter (both versions) |
| `aieos migrate v2-to-v3` | Guided migration per `Migration_Guide_v2_to_v3.md` — does not delete or alter existing v2 artifacts |

## Design Constraints Carried from the Charter (EC-002)

- `aieos init --version=v2` must produce a project identical in behavior to today's unversioned AI-EOS — v2 is not a degraded mode of v3, it is the same thing, just explicitly labeled.
- No command performs a Source Control action (commit/push/merge/deploy) implicitly. If a future `aieos release` command is added, each of those steps requires its own explicit confirmation, per the Source Control Rule.
- `aieos approve` is the only command that can satisfy a Flow gate. No other command, flag, or automation path may substitute for it.

## Open Questions for Founder / Strategic AI Review

- Should `aieos migrate v2-to-v3` be reversible via an equivalent `aieos migrate v3-to-v2`, or is migration intended to be one-directional with manual rollback (see `Migration_Guide_v2_to_v3.md` §Rollback)?
- Should Model Assignment be editable only via `aieos model assign`, or also by hand-editing `ai-eos.model-assignment.yaml` directly? (Proposal defaults to allowing both, since the file is the source of truth and the command is a convenience wrapper.)
