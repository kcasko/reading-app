/**
 * Spaced Repetition System for sight word learning.
 * 
 * Exposure-based learning:
 * - Track how many times each word has been seen (exposed)
 * - Track when word was last seen
 * - New words and infrequently seen words appear more often
 * - Recently seen words are temporarily deprioritized
 * - No correct/incorrect tracking - just exposures
 * 
 * This file contains NO React dependencies - pure logic only.
 */

/**
 * Represents learning progress for a single word.
 */
export interface WordProgress {
  /** Word identifier */
  wordId: string;
  
  /** Total times word has been exposed (shown + audio played) */
  exposureCount: number;
  
  /** Total times audio was triggered for this word */
  audioPlayCount: number;
  
  /** Timestamp of last exposure */
  lastSeenAt: number;
  
  /** Timestamp when first introduced */
  introducedAt: number;
}

/**
 * Thresholds for image fading based on exposure count.
 */
export const IMAGE_FADE_THRESHOLDS = {
  /** Start fading image after this many exposures */
  START_FADE: 8,
  
  /** Show image only sometimes after this many exposures */
  INTERMITTENT: 15,
  
  /** Hide image completely after this many exposures */
  HIDE: 25,
};

/**
 * Create initial progress for a new word.
 */
export function createWordProgress(wordId: string): WordProgress {
  const now = Date.now();
  return {
    wordId,
    exposureCount: 0,
    audioPlayCount: 0,
    lastSeenAt: now,
    introducedAt: now,
  };
}

/**
 * Record that the word was exposed (shown on screen).
 */
export function recordExposure(progress: WordProgress): WordProgress {
  return {
    ...progress,
    exposureCount: progress.exposureCount + 1,
    lastSeenAt: Date.now(),
  };
}

/**
 * Record that audio was played for this word.
 */
export function recordAudioPlay(progress: WordProgress): WordProgress {
  return {
    ...progress,
    audioPlayCount: progress.audioPlayCount + 1,
  };
}

/**
 * Calculate priority score for selecting next word.
 * Lower exposure count = higher priority.
 * Recently seen words get lower priority.
 */
export function calculatePriority(progress: WordProgress, now: number = Date.now()): number {
  const minutesSinceLastSeen = (now - progress.lastSeenAt) / (1000 * 60);
  
  // Base priority: inversely related to exposure count (fewer exposures = higher priority)
  // New words (0 exposures) get highest priority
  const exposurePriority = 100 / (progress.exposureCount + 1);
  
  // Time bonus: words not seen recently get higher priority
  // Words seen in last minute get penalty
  const timePriority = minutesSinceLastSeen < 1 ? 0 : Math.min(minutesSinceLastSeen / 10, 10);
  
  return exposurePriority + timePriority;
}

/**
 * Get image opacity based on exposure count.
 * Returns a value between 0 (invisible) and 1 (fully visible).
 */
export function getImageOpacity(exposureCount: number): number {
  if (exposureCount < IMAGE_FADE_THRESHOLDS.START_FADE) {
    // Full opacity for new words
    return 1.0;
  } else if (exposureCount < IMAGE_FADE_THRESHOLDS.INTERMITTENT) {
    // Gradual fade from 1.0 to 0.3
    const progress = (exposureCount - IMAGE_FADE_THRESHOLDS.START_FADE) / 
                    (IMAGE_FADE_THRESHOLDS.INTERMITTENT - IMAGE_FADE_THRESHOLDS.START_FADE);
    return 1.0 - (progress * 0.7);
  } else if (exposureCount < IMAGE_FADE_THRESHOLDS.HIDE) {
    // Show intermittently at 30% opacity
    return 0.3;
  } else {
    // Hide completely
    return 0;
  }
}

/**
 * Check if image should be shown at all (for intermittent phase).
 * Returns true if image should be visible this time.
 */
export function shouldShowImage(exposureCount: number): boolean {
  if (exposureCount < IMAGE_FADE_THRESHOLDS.INTERMITTENT) {
    // Always show during fade phase
    return true;
  } else if (exposureCount < IMAGE_FADE_THRESHOLDS.HIDE) {
    // Show 50% of the time during intermittent phase
    return Math.random() < 0.5;
  } else {
    // Never show when fully mastered
    return false;
  }
}

/**
 * Check if a word is considered mastered (enough exposures).
 */
export function isMastered(progress: WordProgress): boolean {
  return progress.exposureCount >= IMAGE_FADE_THRESHOLDS.HIDE;
}

/**
 * Sort words by priority (highest priority first).
 */
export function sortByPriority(progressList: WordProgress[]): WordProgress[] {
  const now = Date.now();
  return [...progressList].sort((a, b) => calculatePriority(b, now) - calculatePriority(a, now));
}

