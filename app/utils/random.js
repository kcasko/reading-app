// Simple random helpers used by WordEngine
export function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom(array, count) {
  if (!Array.isArray(array)) return [];
  if (count >= array.length) return array.slice();
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

export default { shuffle, pickRandom };
// Utility helpers for randomization
// shuffle(array): shuffle elements
// pickRandom(array, count): select count unique items
// Copilot: implement both functions cleanly
