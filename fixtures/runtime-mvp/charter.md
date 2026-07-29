# Fixture Engineering Charter

## Objective

Add a deterministic greeting function to the controlled fixture project.

## Scope

- Return a greeting for a supplied name.
- Preserve deterministic behavior.

## Non-goals

- Network calls
- Persistence
- User interfaces

## Acceptance Criteria

- A name produces `Hello, <name>.`
- Empty input is rejected.
