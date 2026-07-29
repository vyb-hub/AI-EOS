# Guided Test Engineering Charter

## Objective

Implement a deterministic function that converts a supplied title into a
URL-safe slug.

## Scope

- Export a function named `toSlug`.
- Accept one string argument.
- Trim leading and trailing whitespace.
- Convert letters to lowercase.
- Replace one or more spaces with a single hyphen.
- Preserve letters and numbers.
- Reject the empty string and non-string input.
- Include focused automated tests.

## Non-goals

- Transliteration
- Locale-specific casing
- Network calls
- Persistence
- User interface
- Package publication

## Acceptance Criteria

1. `toSlug("Hello World")` returns `hello-world`.
2. `toSlug("  AI EOS  MVP  ")` returns `ai-eos-mvp`.
3. Letters and numbers are preserved.
4. Empty and non-string inputs are rejected.
5. Identical inputs always return identical outputs.
6. All focused tests pass.
