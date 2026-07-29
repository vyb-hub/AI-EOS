/**
 * Convert a title to its supported slug representation.
 *
 * @param {string} title
 * @returns {string}
 * @throws {TypeError} When title is not a string or is empty after trimming.
 */
export function toSlug(title) {
  if (typeof title !== "string") {
    throw new TypeError("title must be a string");
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    throw new TypeError("title must not be empty");
  }

  return trimmedTitle.toLowerCase().replace(/ +/g, "-");
}
