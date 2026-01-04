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
 */
export async function loadProgress(
  storageKey: string = STORAGE_KEYS.WORD_PROGRESS
): Promise<Record<string, WordProgress>> {
  const progress = await loadFromStorage<Record<string, WordProgress>>(
    storageKey
  );
  return progress ?? {};
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
