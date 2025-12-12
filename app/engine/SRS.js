// Simplified SRS helpers for the reading app
// Exports: getNextReviewDate(level, todayString), updateSRSOnCorrect(wordObj, todayString), updateSRSOnWrong(wordObj, todayString)

import { addDays, getTodayISO } from '../utils/dateUtils';

const INTERVALS = {
  1: 1,
  2: 7,
  3: 16,
  4: 35,
};

export function getNextReviewDate(level, todayString) {
  const lvl = Math.max(1, Math.min(4, Number(level) || 1));
  const days = INTERVALS[lvl] || 1;
  const baseDate = todayString || getTodayISO();
  return addDays(baseDate, days);
}

function cloneWordObj(wordObj) {
  if (!wordObj || typeof wordObj !== 'object') return {};
  return {
    ...wordObj,
    graphemes: Array.isArray(wordObj.graphemes) ? [...wordObj.graphemes] : wordObj.graphemes,
    phonemes: Array.isArray(wordObj.phonemes) ? [...wordObj.phonemes] : wordObj.phonemes,
    tricky: Array.isArray(wordObj.tricky) ? [...wordObj.tricky] : wordObj.tricky,
    similarWords: Array.isArray(wordObj.similarWords) ? [...wordObj.similarWords] : wordObj.similarWords,
  };
}

export function updateSRSOnCorrect(wordObj, todayString) {
  const todayISO = new Date().toISOString();
  const src = cloneWordObj(wordObj);
  const current = Number(src.srsLevel) || 1;
  const nextLevel = Math.min(4, current + 1);
  src.srsLevel = nextLevel;
  src.lastReviewed = todayISO;
  src.nextReview = getNextReviewDate(nextLevel, todayString || getTodayISO());
  return src;
}

export function updateSRSOnWrong(wordObj, todayString) {
  const todayISO = new Date().toISOString();
  const src = cloneWordObj(wordObj);
  const nextLevel = 1;
  src.srsLevel = nextLevel;
  src.lastReviewed = todayISO;
  src.nextReview = getNextReviewDate(nextLevel, todayString || getTodayISO());
  return src;
}

export default {
  getNextReviewDate,
  updateSRSOnCorrect,
  updateSRSOnWrong,
};
