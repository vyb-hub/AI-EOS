import assert from "node:assert/strict";
import test from "node:test";

import { toSlug } from "../src/toSlug.js";

test("converts a title to lowercase and separates words with hyphens", () => {
  assert.equal(toSlug("Hello World"), "hello-world");
});

test("trims surrounding whitespace and collapses runs of spaces", () => {
  assert.equal(toSlug("  AI EOS  MVP  "), "ai-eos-mvp");
});

test("preserves letters and numbers", () => {
  assert.equal(toSlug("Release 2026 Version 2"), "release-2026-version-2");
});

test("rejects empty and whitespace-only strings", () => {
  assert.throws(() => toSlug(""), TypeError);
  assert.throws(() => toSlug("   "), TypeError);
});

test("rejects non-string inputs", () => {
  for (const value of [undefined, null, 42, true, {}, []]) {
    assert.throws(() => toSlug(value), TypeError);
  }
});

test("returns the same result for repeated calls with identical input", () => {
  const input = "Deterministic 123 Title";
  const expected = toSlug(input);

  for (let call = 0; call < 10; call += 1) {
    assert.equal(toSlug(input), expected);
  }
});

test("does not add normalization rules for internal non-space whitespace", () => {
  assert.equal(toSlug("One\tTwo\nThree"), "one\ttwo\nthree");
});
