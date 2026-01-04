/**
 * Application constants.
 * Centralized configuration values for easy maintenance.
 */

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  WORD_PROGRESS: '@reading_app/word_progress',
  SETTINGS: '@reading_app/settings',
  LAST_LESSON: '@reading_app/last_lesson',
} as const;

// Lesson configuration
export const LESSON_CONFIG = {
  // Number of words per lesson session
  WORDS_PER_LESSON: 5,
  
  // Minimum attempts before a word can be marked as mastered
  MIN_ATTEMPTS_FOR_MASTERY: 3,
  
  // Success rate required for mastery (0-1)
  MASTERY_THRESHOLD: 0.8,
  
  // Maximum words to review in one session
  MAX_REVIEW_WORDS: 3,
} as const;

// Audio configuration
export const AUDIO_CONFIG = {
  // Default playback rate
  DEFAULT_RATE: 1.0,
  
  // Slow playback rate option
  SLOW_RATE: 0.75,
  
  // Available playback rates
  RATES: [0.75, 1.0] as const,
  
  // Delay before auto-playing word audio (ms)
  AUTO_PLAY_DELAY: 300,
} as const;

// UI configuration
export const UI_CONFIG = {
  // Debounce delay for button presses (ms)
  BUTTON_DEBOUNCE: 300,
  
  // Transition duration (ms)
  TRANSITION_DURATION: 200,
} as const;

// File paths
export const ASSET_PATHS = {
  WORD_AUDIO: 'assets/audio/words/',
  UI_AUDIO: 'assets/audio/ui/',
  IMAGES: 'assets/images/',
} as const;
