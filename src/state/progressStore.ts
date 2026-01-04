/**
 * Progress Store - handles persistence of learning progress.
 * 
 * Responsible for:
 * - Saving and loading word progress
 * - Saving and loading app settings
 */

import { saveToStorage, loadFromStorage } from '../utils/storage';
import { STORAGE_KEYS, AUDIO_CONFIG } from '../utils/constants';
import { WordProgress } from '../engine/SpacedRepetition';
import type { VoiceType } from '../audio/TextToSpeech';

export type FontFamily = 'system' | 'opendyslexic' | 'comic-sans';

/**
 * App settings that persist between sessions.
 */
export interface AppSettings {
  /** Audio playback rate */
  audioRate: number;
  
  /** Whether to auto-play word audio */
  autoPlayAudio: boolean;
  
  /** Number of times to repeat audio on tap */
  repeatCount: number;
  
  /** Session length (number of words per session) */
  sessionLength: number;
  
  /** Voice type for text-to-speech */
  voiceType: VoiceType;
  
  /** Enable success sound after session */
  successSoundEnabled: boolean;
  
  /** Background music enabled */
  backgroundMusicEnabled: boolean;
  
  /** Background music volume (0-1) */
  backgroundMusicVolume: number;
  
  /** Font family for text display */
  fontFamily: FontFamily;
}

/**
 * Default settings.
 */
export const DEFAULT_SETTINGS: AppSettings = {
  audioRate: AUDIO_CONFIG.DEFAULT_RATE,
  autoPlayAudio: true,
  repeatCount: 1,
  sessionLength: 20,
  voiceType: 'default',
  successSoundEnabled: true,
  backgroundMusicEnabled: false,
  backgroundMusicVolume: 0.3,
  fontFamily: 'system',
};

/**
 * Save word progress to storage.
 */
export async function saveProgress(
  progress: Record<string, WordProgress>,
  storageKey: string = STORAGE_KEYS.WORD_PROGRESS
): Promise<boolean> {
  return saveToStorage(storageKey, progress);
}

/**
 * Load word progress from storage.
 * Migrates old progress format to new format with masteryState fields.
 */
export async function loadProgress(
  storageKey: string = STORAGE_KEYS.WORD_PROGRESS
): Promise<Record<string, WordProgress>> {
  const progress = await loadFromStorage<Record<string, WordProgress>>(
    storageKey
  );
  
  if (!progress) {
    return {};
  }
  
  // Migrate old progress data to new format
  const migratedProgress: Record<string, WordProgress> = {};
  
  for (const [wordId, wordProgress] of Object.entries(progress)) {
    migratedProgress[wordId] = {
      ...wordProgress,
      // Add new fields if they don't exist
      noImageSuccessCount: wordProgress.noImageSuccessCount ?? 0,
      lastNoImageSuccessAt: wordProgress.lastNoImageSuccessAt ?? 0,
      masteryState: wordProgress.masteryState ?? determineMasteryStateFromExposure(wordProgress),
    };
  }
  
  return migratedProgress;
}

/**
 * Determine initial mastery state based on exposure count (for migration).
 */
function determineMasteryStateFromExposure(progress: WordProgress): string {
  const exposureCount = progress.exposureCount ?? 0;
  
  if (exposureCount >= 12) {
    return 'reinforcing'; // Give them a chance to prove mastery
  } else if (exposureCount >= 8) {
    return 'practicing';
  } else {
    return 'learning';
  }
}

/**
 * Save settings to storage.
 */
export async function saveSettings(
  settings: AppSettings,
  storageKey: string = STORAGE_KEYS.SETTINGS
): Promise<boolean> {
  return saveToStorage(storageKey, settings);
}

/**
 * Load settings from storage.
 */
export async function loadSettings(
  storageKey: string = STORAGE_KEYS.SETTINGS
): Promise<AppSettings> {
  const settings = await loadFromStorage<AppSettings>(storageKey);
  return settings ?? DEFAULT_SETTINGS;
}

/**
 * Reset all progress (use with caution).
 */
export async function resetProgress(): Promise<boolean> {
  return saveToStorage(STORAGE_KEYS.WORD_PROGRESS, {});
}
