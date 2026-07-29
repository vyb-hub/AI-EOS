/**
 * Return a deterministic greeting for a supplied name.
 *
 * @param {string} name
 * @returns {string}
 * @throws {TypeError} When name is not a string or is the empty string.
 */
export function greet(name) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('name must be a non-empty string');
  }

  return `Hello, ${name}.`;
}
