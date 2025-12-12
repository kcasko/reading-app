// WordEngine (engine/WordEngine.js)
// Provides simple in-memory word loading and SRS-aware helpers.
// Exports: loadWords(), getWordByValue(word), getDueWords(todayString), updateWord(wordObj)

import AsyncStorage from '@react-native-async-storage/async-storage';
import baseWords from '../../data/words.json';

const WORDS_KEY = '@readingApp:words';
let wordsCache = null;

async function loadWords() {
  if (wordsCache) return wordsCache;
  try {
    const raw = await AsyncStorage.getItem(WORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      wordsCache = Array.isArray(parsed) ? parsed.map((w) => ({ ...w })) : [];
      return wordsCache;
    }
  } catch (e) {
    console.warn('WordEngine.loadWords - AsyncStorage read error', e);
  }
  // fallback to bundled words
  wordsCache = Array.isArray(baseWords) ? baseWords.map((w) => ({ ...w })) : [];
  return wordsCache;
}

function getWordByValue(word) {
  if (!wordsCache) {
    // synchronous fallback: initialize cache
    wordsCache = Array.isArray(baseWords) ? baseWords.map((w) => ({ ...w })) : [];
  }
  return wordsCache.find((w) => String(w.word).toLowerCase() === String(word).toLowerCase()) || null;
}

async function getDueWords(todayString) {
  const list = await loadWords();
  const now = todayString ? Date.parse(todayString) : Date.now();
  return list.filter((w) => {
    // If nextReview is null/undefined -> treat as due
    if (!w.nextReview) return true;
    const t = Date.parse(w.nextReview);
    if (isNaN(t)) return true;
    return t <= now;
  });
}

async function updateWord(wordObj) {
  await loadWords();
  const idx = wordsCache.findIndex((w) => String(w.word).toLowerCase() === String(wordObj.word).toLowerCase());
  const newObj = { ...wordObj };
  if (idx >= 0) {
    wordsCache[idx] = newObj;
  } else {
    wordsCache.push(newObj);
  }

  // persist updated word list to AsyncStorage
  try {
    await AsyncStorage.setItem(WORDS_KEY, JSON.stringify(wordsCache));
  } catch (e) {
    console.warn('WordEngine.updateWord - AsyncStorage save error', e);
  }

  // Return a shallow copy of the updated words array
  return wordsCache.slice();
}

export { getDueWords, getWordByValue, loadWords, updateWord };

export default {
  loadWords,
  getWordByValue,
  getDueWords,
  updateWord,
};
