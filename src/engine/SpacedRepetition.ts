/**
 * Spaced Repetition System for sight word learning.
 * 
 * Behavior-based mastery system:
 * - Track exposures as a prerequisite, not proof of mastery
 * - Evaluate audio dependency ratio (low dependency = confident)
 * - Require successful no-image recognition multiple times
 * - Use state machine: learning → practicing → reinforcing → mastered
 * - Allow reversible mastery if dependency increases
 * 
 * This file contains NO React dependencies - pure logic only.
 */

/**
 * Mastery state for a word (behavior-based, not exposure-based).
 */
export enum MasteryState {
  /** Initial learning phase - image always shown */
  LEARNING = 'learning',
  
  /** Practicing phase - image shown, may start fading */
  PRACTICING = 'practicing',
  
  /** Reinforcing phase - image may be hidden intermittently */
  REINFORCING = 'reinforcing',
  
  /** Mastered - low audio dependency + multiple no-image successes */
  MASTERED = 'mastered',
}

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
  
  /** Times child recognized word without image and without tapping audio */
  noImageSuccessCount: number;
  
  /** Timestamp of last successful no-image recognition */
  lastNoImageSuccessAt: number;
  
  /** Current mastery state (state machine) */
  masteryState: MasteryState;
}

/**
 * Thresholds for state transitions (exposure gates, not mastery proof).
 */
export const STATE_TRANSITION_THRESHOLDS = {
  /** Transition from learning to practicing */
  PRACTICING: 8,
  
  /** Transition from practicing to reinforcing, eligible for mastery eval */
  REINFORCING: 12,
};

/**
 * Mastery evaluation criteria.
 */
export const MASTERY_CRITERIA = {
  /** Minimum exposures before mastery evaluation */
  MIN_EXPOSURES: 12,
  
  /** Maximum audio/exposure ratio for mastery (low dependency) */
  MAX_AUDIO_RATIO: 0.25,
  
  /** Required no-image successes for mastery */
  REQUIRED_NO_IMAGE_SUCCESSES: 3,
  
  /** Audio ratio threshold to downgrade from mastered */
  DOWNGRADE_AUDIO_RATIO: 0.35,
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
    noImageSuccessCount: 0,
    lastNoImageSuccessAt: 0,
    masteryState: MasteryState.LEARNING,
  };
}

/**
 * Record that the word was exposed (shown on screen).
 * Also updates mastery state based on exposure thresholds.
 */
export function recordExposure(progress: WordProgress): WordProgress {
  const updated = {
    ...progress,
    exposureCount: progress.exposureCount + 1,
    lastSeenAt: Date.now(),
  };
  
  return updateMasteryState(updated);
}

/**
 * Record that audio was played for this word.
 * May trigger mastery downgrade if dependency ratio increases.
 */
export function recordAudioPlay(progress: WordProgress): WordProgress {
  const updated = {
    ...progress,
    audioPlayCount: progress.audioPlayCount + 1,
  };
  
  return checkMasteryDowngrade(updated);
}

/**
 * Record a successful no-image recognition (word shown without image, audio not tapped).
 */
export function recordNoImageSuccess(progress: WordProgress): WordProgress {
  const updated = {
    ...progress,
    noImageSuccessCount: progress.noImageSuccessCount + 1,
    lastNoImageSuccessAt: Date.now(),
  };
  
  return updateMasteryState(updated);
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
 * Calculate audio dependency ratio.
 */
export function getAudioDependencyRatio(progress: WordProgress): number {
  if (progress.exposureCount === 0) return 0;
  return progress.audioPlayCount / progress.exposureCount;
}

/**
 * Check if word meets all criteria for mastery.
 */
function meetsMasteryCriteria(progress: WordProgress): boolean {
  // Must have minimum exposures
  if (progress.exposureCount < MASTERY_CRITERIA.MIN_EXPOSURES) {
    return false;
  }
  
  // Must have low audio dependency
  const audioRatio = getAudioDependencyRatio(progress);
  if (audioRatio > MASTERY_CRITERIA.MAX_AUDIO_RATIO) {
    return false;
  }
  
  // Must have multiple successful no-image recognitions
  if (progress.noImageSuccessCount < MASTERY_CRITERIA.REQUIRED_NO_IMAGE_SUCCESSES) {
    return false;
  }
  
  return true;
}

/**
 * Update mastery state based on exposure count and behavior.
 */
function updateMasteryState(progress: WordProgress): WordProgress {
  let newState = progress.masteryState;
  
  // Transition from learning to practicing at threshold
  if (newState === MasteryState.LEARNING && 
      progress.exposureCount >= STATE_TRANSITION_THRESHOLDS.PRACTICING) {
    newState = MasteryState.PRACTICING;
  }
  
  // Transition from practicing to reinforcing at threshold
  if (newState === MasteryState.PRACTICING && 
      progress.exposureCount >= STATE_TRANSITION_THRESHOLDS.REINFORCING) {
    newState = MasteryState.REINFORCING;
  }
  
  // Transition to mastered only if all criteria met
  if (newState === MasteryState.REINFORCING && meetsMasteryCriteria(progress)) {
    newState = MasteryState.MASTERED;
  }
  
  return {
    ...progress,
    masteryState: newState,
  };
}

/**
 * Check if mastered word should be downgraded due to increased dependency.
 */
function checkMasteryDowngrade(progress: WordProgress): WordProgress {
  if (progress.masteryState !== MasteryState.MASTERED) {
    return progress;
  }
  
  const audioRatio = getAudioDependencyRatio(progress);
  
  // Downgrade if audio dependency increased significantly
  if (audioRatio > MASTERY_CRITERIA.DOWNGRADE_AUDIO_RATIO) {
    return {
      ...progress,
      masteryState: MasteryState.REINFORCING,
    };
  }
  
  return progress;
}

/**
 * Check if a word is considered mastered.
 */
export function isMastered(progress: WordProgress): boolean {
  return progress.masteryState === MasteryState.MASTERED;
}

/**
 * Determine if image should be shown for this word.
 * Based on mastery state, not just exposure count.
 */
export function shouldShowImage(progress: WordProgress): boolean {
  switch (progress.masteryState) {
    case MasteryState.LEARNING:
      return true; // Always show in learning
      
    case MasteryState.PRACTICING:
      return true; // Show in practicing (may fade slightly in UI)
      
    case MasteryState.REINFORCING:
      // Show intermittently - hide 30% of the time to test recognition
      return Math.random() > 0.3;
      
    case MasteryState.MASTERED:
      // Hide by default but show occasionally for confidence
      return Math.random() < 0.1;
      
    default:
      return true;
  }
}

/**
 * Get image opacity based on mastery state.
 */
export function getImageOpacity(progress: WordProgress): number {
  switch (progress.masteryState) {
    case MasteryState.LEARNING:
      return 1.0; // Full opacity
      
    case MasteryState.PRACTICING:
      // Gradual fade from 1.0 to 0.7
      const practicingProgress = (progress.exposureCount - STATE_TRANSITION_THRESHOLDS.PRACTICING) / 
                                  (STATE_TRANSITION_THRESHOLDS.REINFORCING - STATE_TRANSITION_THRESHOLDS.PRACTICING);
      return Math.max(0.7, 1.0 - (practicingProgress * 0.3));
      
    case MasteryState.REINFORCING:
      return 0.6; // Lighter when shown
      
    case MasteryState.MASTERED:
      return 0.5; // Very light when shown
      
    default:
      return 1.0;
  }
}

/**
 * Sort words by priority (highest priority first).
 */
export function sortByPriority(progressList: WordProgress[]): WordProgress[] {
  const now = Date.now();
  return [...progressList].sort((a, b) => calculatePriority(b, now) - calculatePriority(a, now));
}

