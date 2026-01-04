/**
 * Word Engine - manages word selection and state.
 * 
 * Responsible for:
 * - Tracking progress for all words (exposure-based)
 * - Selecting the next word based on spaced repetition
 * - Recording exposures
 * 
 * This file contains NO React dependencies - pure logic only.
 */

import { Word, ALL_WORDS, getWordById, WordCategory } from '../data/wordLists';
import {
  WordProgress,
  createWordProgress,
  recordExposure,
  recordAudioPlay,
  sortByPriority,
  isMastered,
} from './SpacedRepetition';

/**
 * Complete state of the word engine.
 */
export interface WordEngineState {
  /** Progress for each word by ID */
  progress: Record<string, WordProgress>;
  
  /** IDs of words that have been introduced */
  introducedWordIds: string[];
}

/**
 * Create initial engine state.
 */
export function createInitialState(): WordEngineState {
  return {
    progress: {},
    introducedWordIds: [],
  };
}

/**
 * Initialize engine state from saved progress.
 */
export function initializeFromProgress(
  savedProgress: Record<string, WordProgress>
): WordEngineState {
  const introducedWordIds = Object.keys(savedProgress);
  return {
    progress: savedProgress,
    introducedWordIds,
  };
}

/**
 * Introduce a new word to the learning pool.
 */
export function introduceWord(
  state: WordEngineState,
  wordId: string
): WordEngineState {
  if (state.introducedWordIds.includes(wordId)) {
    return state;
  }
  
  return {
    progress: {
      ...state.progress,
      [wordId]: createWordProgress(wordId),
    },
    introducedWordIds: [...state.introducedWordIds, wordId],
  };
}

/**
 * Introduce multiple words at once.
 */
export function introduceWords(
  state: WordEngineState,
  wordIds: string[]
): WordEngineState {
  let newState = state;
  for (const wordId of wordIds) {
    newState = introduceWord(newState, wordId);
  }
  return newState;
}

/**
 * Record that a word was exposed (shown to the child).
 */
export function markExposure(
  state: WordEngineState,
  wordId: string
): WordEngineState {
  const progress = state.progress[wordId];
  if (!progress) {
    return state;
  }
  
  return {
    ...state,
    progress: {
      ...state.progress,
      [wordId]: recordExposure(progress),
    },
  };
}

/**
 * Record that audio was played for a word.
 */
export function markAudioPlayed(
  state: WordEngineState,
  wordId: string
): WordEngineState {
  const progress = state.progress[wordId];
  if (!progress) {
    return state;
  }
  
  return {
    ...state,
    progress: {
      ...state.progress,
      [wordId]: recordAudioPlay(progress),
    },
  };
}

/**
 * Record successful no-image recognition (word shown without image, child didn't tap audio).
 */
export function markNoImageSuccess(
  state: WordEngineState,
  wordId: string
): WordEngineState {
  const progress = state.progress[wordId];
  if (!progress) {
    return state;
  }
  
  return {
    ...state,
    progress: {
      ...state.progress,
      [wordId]: recordNoImageSuccess(progress),
    },
  };
}

/**
 * Record successful no-image recognition (word shown without image, child didn't tap audio).
 */
export function markNoImageSuccess(
  state: WordEngineState,
  wordId: string
): WordEngineState {
  const progress = state.progress[wordId];
  if (!progress) {
    return state;
  }
  
  return {
    ...state,
    progress: {
      ...state.progress,
      [wordId]: recordNoImageSuccess(progress),
    },
  };
}

/**
 * Get the next word to study, prioritized by spaced repetition.
 * Returns null if no words are available.
 * Optionally filters by selected categories.
 */
export function getNextWord(
  state: WordEngineState,
  excludeWordIds: string[] = [],
  selectedCategories?: WordCategory[]
): Word | null {
  // Filter progress by category if specified
  let progressList = Object.values(state.progress).filter(
    p => !excludeWordIds.includes(p.wordId)
  );
  
  // Apply category filter
  if (selectedCategories && selectedCategories.length > 0) {
    progressList = progressList.filter(p => {
      const word = getWordById(p.wordId);
      return word && selectedCategories.includes(word.category);
    });
  }
  
  // If no words available in selected categories, introduce a new one
  if (progressList.length === 0 && selectedCategories && selectedCategories.length > 0) {
    // Find words from selected categories that haven't been introduced yet
    const availableWords = ALL_WORDS.filter(word => 
      selectedCategories.includes(word.category) &&
      !state.introducedWordIds.includes(word.id)
    );
    
    if (availableWords.length > 0) {
      // Return the first available word (it will be introduced when exposed)
      return availableWords[0];
    }
  }
  
  if (progressList.length === 0) {
    return null;
  }
  
  // Sort by priority (new words and infrequently seen words first)
  const sorted = sortByPriority(progressList);
  
  const nextProgress = sorted[0];
  if (!nextProgress) {
    return null;
  }
  
  return getWordById(nextProgress.wordId) ?? null;
}

/**
 * Get count of words at each mastery level.
 */
export function getMasteryStats(state: WordEngineState): {
  total: number;
  introduced: number;
  mastered: number;
  learning: number;
} {
  const progressList = Object.values(state.progress);
  const masteredCount = progressList.filter(isMastered).length;
  
  return {
    total: ALL_WORDS.length,
    introduced: state.introducedWordIds.length,
    mastered: masteredCount,
    learning: state.introducedWordIds.length - masteredCount,
  };
}

/**
 * Get progress for a specific word.
 */
export function getWordProgress(
  state: WordEngineState,
  wordId: string
): WordProgress | null {
  return state.progress[wordId] ?? null;
}

/**
 * Get all word IDs that haven't been introduced yet.
 */
export function getUnintroducedWordIds(state: WordEngineState): string[] {
  const introducedSet = new Set(state.introducedWordIds);
  return ALL_WORDS
    .map(w => w.id)
    .filter(id => !introducedSet.has(id));
}

/**
 * Get all unintroduced word IDs filtered by selected categories.
 */
export function getUnintroducedWordIdsByCategory(
  state: WordEngineState,
  selectedCategories: WordCategory[]
): string[] {
  if (selectedCategories.length === 0) {
    return [];
  }
  
  const introducedSet = new Set(state.introducedWordIds);
  return ALL_WORDS
    .filter(w => selectedCategories.includes(w.category))
    .map(w => w.id)
    .filter(id => !introducedSet.has(id));
}

/**
 * Get words that are due for review based on spaced repetition.
 */
export function getWordsDueForReview(
  state: WordEngineState,
  selectedCategories?: WordCategory[]
): string[] {
  let progressList = Object.values(state.progress);
  
  // Apply category filter if specified
  if (selectedCategories && selectedCategories.length > 0) {
    progressList = progressList.filter(p => {
      const word = getWordById(p.wordId);
      return word && selectedCategories.includes(word.category);
    });
  }
  
  // Sort by priority and return word IDs that need review
  const sorted = sortByPriority(progressList);
  return sorted.slice(0, 10).map(p => p.wordId); // Return up to 10 words due for review
}

