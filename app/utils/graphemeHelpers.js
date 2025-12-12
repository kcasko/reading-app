// Helpers for working with graphemes in word objects
// Follows the word data model in .github/copilot-instructions.md

/**
 * Return a Set of tricky graphemes from a word object.
 * @param {object} wordObj
 * @returns {Set<string>}
 */
export function getTrickySet(wordObj) {
  if (!wordObj || !Array.isArray(wordObj.tricky)) return new Set();
  return new Set(wordObj.tricky.map((g) => String(g)));
}

/**
 * Map a word object into an array of grapheme descriptors:
 * [{ text: string, isTricky: boolean }]
 * Preserves order from `wordObj.graphemes`.
 * @param {object} wordObj
 * @returns {Array<{text:string,isTricky:boolean}>}
 */
export function mapWordToGraphemes(wordObj) {
  const graphemes = Array.isArray(wordObj && wordObj.graphemes) ? wordObj.graphemes : [];
  const tricky = getTrickySet(wordObj);
  return graphemes.map((g) => ({ text: String(g), isTricky: tricky.has(String(g)) }));
}

export default {
  getTrickySet,
  mapWordToGraphemes,
};
