import assert from 'node:assert/strict';
import test from 'node:test';

import { greet } from './greeting.js';

test('returns the exact greeting for a supplied name', () => {
  assert.equal(greet('Ada'), 'Hello, Ada.');
});

test('returns the same result for repeated calls', () => {
  const first = greet('Grace');
  const second = greet('Grace');

  assert.equal(first, second);
  assert.equal(first, 'Hello, Grace.');
});

test('rejects the empty string', () => {
  assert.throws(() => greet(''), TypeError);
});

test('rejects non-string input instead of coercing it', () => {
  for (const value of [undefined, null, 42, true, {}, []]) {
    assert.throws(() => greet(value), TypeError);
  }
});

test('preserves supplied whitespace exactly', () => {
  assert.equal(greet(' Ada '), 'Hello,  Ada .');
  assert.equal(greet('   '), 'Hello,    .');
});
