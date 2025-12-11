import words from '../data/words.json';
import { pickRandom, shuffle } from '../utils/random';
import ProgressTracker from './ProgressTracker';

// helper: levenshtein distance
function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function bigramOverlap(a, b) {
  const bigrams = (s) => {
    const res = new Set();
    for (let i = 0; i < s.length - 1; i++) res.add(s.substr(i, 2));
    return res;
  };
  const A = bigrams(a);
  const B = bigrams(b);
  let count = 0;
  A.forEach((g) => { if (B.has(g)) count++; });
  return count;
}

// WordEngine for orthographic mapping lessons
// Returns { targetWord: string, choices: string[], imageKey: string }
const WordEngine = {
  async getNextLesson() {
    const pool = Array.isArray(words) ? words.slice() : [];
    if (pool.length === 0) return null;

    const progress = await ProgressTracker.getProgress();
    const now = Date.now();

    // find due words: nextDue <= now or not scheduled
    const due = pool.filter((w) => {
      const meta = (progress.words && progress.words[w]) || null;
      return !meta || (meta.nextDue && meta.nextDue <= now);
    });

    // choose target: prefer due, else lowest level
    let target = null;
    if (due.length > 0) {
      target = pickRandom(due, 1)[0];
    } else {
      // find lowest level words
      const withMeta = pool.map((w) => ({ w, lvl: (progress.words && progress.words[w] && progress.words[w].level) || 0 }));
      withMeta.sort((a, b) => a.lvl - b.lvl);
      target = withMeta[0].w;
    }

    // generate distractors using look-alike rules
    const candidates = pool.filter((w) => w !== target);
    // score candidates by: same length, small edit distance, bigram overlap
    const scored = candidates.map((c) => {
      const lenScore = c.length === target.length ? 2 : 0;
      const ed = editDistance(target, c);
      const editScore = ed <= 2 ? (2 - ed) + 1 : 0; // higher for smaller distance
      const bigramScore = bigramOverlap(target, c);
      const score = lenScore * 2 + editScore * 3 + bigramScore;
      return { c, score };
    });
    scored.sort((a, b) => b.score - a.score);
    let distractors = scored.filter(s => s.score > 0).map(s => s.c).slice(0, 2);
    if (distractors.length < 2) {
      const remaining = candidates.filter((w) => !distractors.includes(w));
      const extra = pickRandom(remaining, 2 - distractors.length);
      distractors = distractors.concat(extra);
    }

    const choices = shuffle([target, ...distractors]);

    return {
      targetWord: target,
      choices,
      imageKey: target,
    };
  },
};

export default WordEngine;
