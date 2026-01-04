/**
 * Lesson Builder - assembles lesson sessions from the word pool.
 * 
 * A lesson is a sequence of words to practice in one sitting.
 * The builder selects words based on:
 * 1. Words due for review (highest priority)
 * 2. New words to introduce (if space available)
 * 
 * This file contains NO React dependencies - pure logic only.
 */

import { Word, getWordById } from '../data/wordLists';
import { LESSON_CONFIG } from '../utils/constants';
import {
  WordEngineState,
  getWordsDueForReview,
  getUnintroducedWordIds,
  introduceWords,
} from './WordEngine';
import { WordProgress, sortByPriority } from './SpacedRepetition';

/**
 * Represents a lesson session.
 */
export interface Lesson {
  /** Unique identifier for this lesson */
  id: string;
  
  /** Word IDs in the order they should be presented */
  wordIds: string[];
  
  /** Current position in the lesson (0-indexed) */
  currentIndex: number;
  
  /** Words that were marked incorrect and need re-review this session */
  retryWordIds: string[];
  
  /** Timestamp when lesson was created */
  createdAt: number;
}

/**
 * Result of building a lesson.
 */
export interface LessonBuildResult {
  /** The built lesson */
  lesson: Lesson;
  
  /** Updated engine state (if new words were introduced) */
  updatedState: WordEngineState;
}

/**
 * Build a new lesson from the current engine state.
 */
export function buildLesson(
  state: WordEngineState,
  wordsPerLesson: number = LESSON_CONFIG.WORDS_PER_LESSON
): LessonBuildResult {
  const wordIds: string[] = [];
  let updatedState = state;
  
  // Step 1: Get words due for review
  const dueWordIds = getWordsDueForReview(state);
  const dueWords = dueWordIds
    .map(wordId => state.progress[wordId])
    .filter((progress): progress is WordProgress => progress !== undefined);
  const reviewWords = sortByPriority(dueWords).slice(0, wordsPerLesson);
  
  for (const progress of reviewWords) {
    wordIds.push(progress.wordId);
  }
  
  // Step 2: If we have room, introduce new words
  const remainingSlots = wordsPerLesson - wordIds.length;
  if (remainingSlots > 0) {
    const unintroducedIds = getUnintroducedWordIds(state);
    const newWordIds = unintroducedIds.slice(0, remainingSlots);
    
    if (newWordIds.length > 0) {
      updatedState = introduceWords(updatedState, newWordIds);
      wordIds.push(...newWordIds);
    }
  }
  
  // Step 3: If still empty, fall back to any introduced words
  if (wordIds.length === 0 && state.introducedWordIds.length > 0) {
    const allProgress = sortByPriority(Object.values(state.progress));
    const fallbackWords = allProgress.slice(0, wordsPerLesson);
    for (const progress of fallbackWords) {
      wordIds.push(progress.wordId);
    }
  }
  
  const lesson: Lesson = {
    id: generateLessonId(),
    wordIds,
    currentIndex: 0,
    retryWordIds: [],
    createdAt: Date.now(),
  };
  
  return { lesson, updatedState };
}

/**
 * Get the current word in a lesson.
 */
export function getCurrentWord(lesson: Lesson): Word | null {
  // First check retry queue
  if (lesson.retryWordIds.length > 0) {
    const retryId = lesson.retryWordIds[0];
    return retryId ? getWordById(retryId) ?? null : null;
  }
  
  // Then check main word list
  if (lesson.currentIndex >= lesson.wordIds.length) {
    return null;
  }
  
  const wordId = lesson.wordIds[lesson.currentIndex];
  return wordId ? getWordById(wordId) ?? null : null;
}

/**
 * Advance to the next word in a lesson.
 */
export function advanceLesson(
  lesson: Lesson,
  wasCorrect: boolean,
  currentWordId: string
): Lesson {
  const isRetryWord = lesson.retryWordIds.includes(currentWordId);
  
  if (isRetryWord) {
    // Remove from retry queue regardless of correctness
    // (they'll be re-added if incorrect)
    const newRetryIds = lesson.retryWordIds.filter(id => id !== currentWordId);
    
    if (!wasCorrect) {
      // Add back to end of retry queue
      return {
        ...lesson,
        retryWordIds: [...newRetryIds, currentWordId],
      };
    }
    
    return {
      ...lesson,
      retryWordIds: newRetryIds,
    };
  }
  
  // Main lesson word
  let newRetryIds = lesson.retryWordIds;
  if (!wasCorrect) {
    // Add to retry queue
    newRetryIds = [...lesson.retryWordIds, currentWordId];
  }
  
  return {
    ...lesson,
    currentIndex: lesson.currentIndex + 1,
    retryWordIds: newRetryIds,
  };
}

/**
 * Check if a lesson is complete.
 */
export function isLessonComplete(lesson: Lesson): boolean {
  const mainComplete = lesson.currentIndex >= lesson.wordIds.length;
  const retryComplete = lesson.retryWordIds.length === 0;
  return mainComplete && retryComplete;
}

/**
 * Get lesson progress.
 */
export function getLessonProgress(lesson: Lesson): {
  current: number;
  total: number;
  retryRemaining: number;
} {
  return {
    current: lesson.currentIndex,
    total: lesson.wordIds.length,
    retryRemaining: lesson.retryWordIds.length,
  };
}

/**
 * Generate a unique lesson ID.
 */
function generateLessonId(): string {
  return `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
