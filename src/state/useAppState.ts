/**
 * Global App State Hook - Exposure-Based Learning
 * 
 * CORE PRINCIPLES:
 * - No correct/incorrect tracking
 * - Track exposures (times shown)
 * - Track audio plays
 * - Simple, automatic progression
 */

import { useState, useEffect, useCallback } from 'react';
import {
  WordEngineState,
  createInitialState,
  initializeFromProgress,
  markExposure,
  markAudioPlayed,
  getMasteryStats,
  getNextWord,
  introduceWords,
  getUnintroducedWordIdsByCategory,
  getWordProgress,
} from '../engine/WordEngine';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  saveProgress,
  loadProgress,
  saveSettings,
  loadSettings,
} from './progressStore';
import { Word, ALL_WORDS, WordCategory } from '../data/wordLists';
import { WordProgress } from '../engine/SpacedRepetition';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playSuccessSound, startBackgroundMusic, stopBackgroundMusic, setBackgroundMusicVolume } from '../audio/SoundEffects';
import { Profile, getActiveProfile, getProfileStorageKeys } from './profileStore';
import { StreakData, loadStreakData, saveStreakData, updateStreak } from './streakStore';
import { preloadImages, getImagePathsToPreload, cleanupPreloadedImages } from '../utils/ImagePreloader';

/**
 * App state exposed by the hook.
 */
export interface AppState {
  // Loading state
  isLoading: boolean;
  isInitialized: boolean;
  
  // Profile
  activeProfile: Profile | null;
  
  // Engine state
  engineState: WordEngineState;
  
  // Current lesson
  currentWord: Word | null;
  currentWordProgress: WordProgress | null;
  wordsInSession: number;
  lastSessionWords: string[]; // Word IDs from last completed session
  
  // Mastery celebration
  celebratedWords: Set<string>; // Word IDs that have been celebrated
  newlyMasteredWord: { id: string; text: string; emoji: string } | null;
  
  // Settings
  settings: AppSettings;
  
  // Category selection
  selectedCategories: WordCategory[];
  
  // Streak tracking
  streakData: StreakData;
  
  // Computed stats
  stats: {
    total: number;
    introduced: number;
    mastered: number;
    learning: number;
  };
}

/**
 * App actions exposed by the hook.
 */
export interface AppActions {
  // Lesson actions
  startLesson: () => void;
  startReplaySession: () => void;
  onWordExposed: () => void;
  onAudioPlayed: () => void;
  advanceToNextWord: () => void;
  endLesson: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  
  // Category actions
  toggleCategory: (category: WordCategory) => void;
  
  // Mastery actions
  clearMasteryNotification: () => void;
  
  // Reset
  resetAllProgress: () => Promise<void>;
}

/**
 * Main app state hook - exposure-based learning.
 */
export function useAppState(): AppState & AppActions {
  // Core state
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [engineState, setEngineState] = useState<WordEngineState>(createInitialState());
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [wordsInSession, setWordsInSession] = useState(0);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [selectedCategories, setSelectedCategories] = useState<WordCategory[]>(['animals', 'food', 'objects', 'vehicles']);
  const [lastSessionWords, setLastSessionWords] = useState<string[]>([]);
  const [currentSessionWords, setCurrentSessionWords] = useState<string[]>([]);
  const [celebratedWords, setCelebratedWords] = useState<Set<string>>(new Set());
  const [newlyMasteredWord, setNewlyMasteredWord] = useState<{ id: string; text: string; emoji: string } | null>(null);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    totalDays: 0,
    activeDates: [],
  });
  
  // Initialize on mount
  useEffect(() => {
    initializeApp();
  }, []);
  
  // Auto-save progress when engine state changes
  useEffect(() => {
    if (isInitialized && activeProfile && Object.keys(engineState.progress).length > 0) {
      const storageKeys = getProfileStorageKeys(activeProfile.id);
      saveProgress(engineState.progress, storageKeys.progress);
    }
  }, [engineState.progress, isInitialized, activeProfile]);
  
  /**
   * Initialize the app state from storage.
   */
  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Load active profile
      const profile = await getActiveProfile();
      if (!profile) {
        // No active profile - user needs to select/create one
        setIsLoading(false);
        return;
      }
      
      setActiveProfile(profile);
      const storageKeys = getProfileStorageKeys(profile.id);
      
      // Load saved progress for this profile
      const savedProgress = await loadProgress(storageKeys.progress);
      let initialState: WordEngineState;
      
      if (Object.keys(savedProgress).length > 0) {
        initialState = initializeFromProgress(savedProgress);
      } else {
        // First launch for this profile - introduce first 5 words
        initialState = createInitialState();
        const firstWords = ALL_WORDS.slice(0, 5).map(w => w.id);
        initialState = introduceWords(initialState, firstWords);
      }
      
      setEngineState(initialState);
      
      // Load saved settings for this profile
      const savedSettings = await loadSettings(storageKeys.settings);
      setSettings(savedSettings);
      
      // Load selected categories for this profile
      const categoriesJson = await AsyncStorage.getItem(storageKeys.categories);
      if (categoriesJson) {
        const categories = JSON.parse(categoriesJson) as WordCategory[];
        setSelectedCategories(categories);
      }
      
      // Load last session words for this profile
      const lastSessionJson = await AsyncStorage.getItem(storageKeys.lastSession);
      if (lastSessionJson) {
        const words = JSON.parse(lastSessionJson) as string[];
        setLastSessionWords(words);
      }
      
      // Load celebrated words for this profile
      const celebratedJson = await AsyncStorage.getItem(storageKeys.celebrated);
      if (celebratedJson) {
        const words = JSON.parse(celebratedJson) as string[];
        setCelebratedWords(new Set(words));
      }
      
      // Load streak data for this profile
      const savedStreakData = await loadStreakData(storageKeys.streak);
      setStreakData(savedStreakData);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Start a new learning session.
   */
  const startLesson = useCallback(() => {
    // Start background music if enabled
    if (settings.backgroundMusicEnabled) {
      startBackgroundMusic(settings.backgroundMusicVolume).catch(error => {
        console.error('Failed to start background music:', error);
      });
    }
    
    // Introduce new words if ready
    let state = engineState;
    const unintroducedIds = getUnintroducedWordIdsByCategory(state, selectedCategories);
    
    // If child has seen all introduced words at least 5 times, introduce 2-3 new words
    const allIntroducedSeenEnough = Object.values(state.progress).every(
      p => p.exposureCount >= 5
    );
    
    if (allIntroducedSeenEnough && unintroducedIds.length > 0) {
      const newWords = unintroducedIds.slice(0, 3);
      state = introduceWords(state, newWords);
      setEngineState(state);
    }
    
    // Get first word from selected categories
    const word = getNextWord(state, [], selectedCategories);
    setCurrentWord(word);
    setWordsInSession(0);
    setCurrentSessionWords([]); // Start fresh session tracking
    
    // Preload next 5 word images for smooth transitions
    if (word) {
      // Get upcoming words to predict what images we'll need
      const upcomingWords: Word[] = [];
      const tempUsedWords: string[] = [];
      
      for (let i = 0; i < 5; i++) {
        const nextWord = getNextWord(state, tempUsedWords, selectedCategories);
        if (nextWord) {
          upcomingWords.push(nextWord);
          tempUsedWords.push(nextWord.id);
        }
      }
      
      // Get image paths to preload
      const imagePaths = getImagePathsToPreload(word, upcomingWords, 5);
      
      // Preload images in background
      preloadImages(imagePaths).catch(error => {
        console.warn('Failed to preload lesson images:', error);
      });
      
      console.log(`Preloading ${imagePaths.length} images for lesson`);
    }
  }, [engineState, selectedCategories, settings.backgroundMusicEnabled, settings.backgroundMusicVolume]);
  
  /**
   * Start a replay of the last session.
   */
  const startReplaySession = useCallback(() => {
    if (lastSessionWords.length === 0) return;
    
    // Get first word from last session
    const firstWordId = lastSessionWords[0];
    const firstWord = ALL_WORDS.find(w => w.id === firstWordId);
    
    setCurrentWord(firstWord || null);
    setWordsInSession(0);
    setCurrentSessionWords([]); // Track this replay session
  }, [lastSessionWords]);
  
  /**
   * Record that current word was exposed (shown on screen).
   */
  const onWordExposed = useCallback(() => {
    if (!currentWord || !activeProfile) return;
    
    const newState = markExposure(engineState, currentWord.id);
    setEngineState(newState);
    
    // Check if word just reached mastery (25 exposures)
    const wordProgress = getWordProgress(newState, currentWord.id);
    if (wordProgress && wordProgress.exposureCount === 25 && !celebratedWords.has(currentWord.id)) {
      // Word just mastered! Trigger celebration
      // Get category emoji
      const categoryEmojis: Record<string, string> = {
        animals: '🐶',
        food: '🍎',
        objects: '⚽',
        vehicles: '🚗',
      };
      
      setNewlyMasteredWord({
        id: currentWord.id,
        text: currentWord.text,
        emoji: categoryEmojis[currentWord.category] || '⭐',
      });
      
      // Mark as celebrated
      const updatedCelebrated = new Set(celebratedWords);
      updatedCelebrated.add(currentWord.id);
      setCelebratedWords(updatedCelebrated);
      
      // Save celebrated words
      const storageKeys = getProfileStorageKeys(activeProfile.id);
      AsyncStorage.setItem(storageKeys.celebrated, JSON.stringify(Array.from(updatedCelebrated)));
    }
    
    // Track word in current session
    if (!currentSessionWords.includes(currentWord.id)) {
      setCurrentSessionWords(prev => [...prev, currentWord.id]);
    }
  }, [currentWord, engineState, currentSessionWords, celebratedWords, activeProfile]);
  
  /**
   * Record that audio was played for current word.
   */
  const onAudioPlayed = useCallback(() => {
    if (!currentWord) return;
    
    const newState = markAudioPlayed(engineState, currentWord.id);
    setEngineState(newState);
  }, [currentWord, engineState]);
  
  /**
   * Advance to next word in session.
   */
  const advanceToNextWord = useCallback(() => {
    const newCount = wordsInSession + 1;
    setWordsInSession(newCount);
    
    // Use session length from settings
    if (newCount >= settings.sessionLength) {
      // Session complete - save words for replay
      setLastSessionWords(currentSessionWords);
      setCurrentWord(null); // End session
      
      // Clean up preloaded images when session ends
      cleanupPreloadedImages([]);
      return;
    }
    
    const nextWord = getNextWord(engineState, [], selectedCategories);
    setCurrentWord(nextWord);
    
    // Preload next 5 word images for smooth transitions
    if (nextWord) {
      // Get upcoming words to predict what images we'll need
      const upcomingWords: Word[] = [];
      const tempUsedWords: string[] = [];
      
      for (let i = 0; i < 5; i++) {
        const futureWord = getNextWord(engineState, tempUsedWords, selectedCategories);
        if (futureWord) {
          upcomingWords.push(futureWord);
          tempUsedWords.push(futureWord.id);
        }
      }
      
      // Get image paths to preload
      const imagePaths = getImagePathsToPreload(nextWord, upcomingWords, 5);
      
      // Preload images in background
      preloadImages(imagePaths).catch(error => {
        console.warn('Failed to preload next word images:', error);
      });
      
      // Clean up old images that are no longer needed
      cleanupPreloadedImages(imagePaths);
    }
  }, [engineState, wordsInSession, selectedCategories, settings.sessionLength, currentSessionWords]);
  
  /**
   * End current learning session.
   */
  const endLesson = useCallback(async () => {
    // Stop background music
    stopBackgroundMusic().catch(error => {
      console.error('Failed to stop background music:', error);
    });
    
    // Play success sound if enabled
    if (settings.successSoundEnabled && wordsInSession > 0) {
      playSuccessSound().catch(error => {
        console.error('Failed to play success sound:', error);
      });
    }
    
    // Update streak if lesson was completed (at least 1 word)
    if (activeProfile && wordsInSession > 0) {
      const updatedStreak = updateStreak(streakData);
      setStreakData(updatedStreak);
      
      // Save updated streak
      const storageKeys = getProfileStorageKeys(activeProfile.id);
      await saveStreakData(storageKeys.streak, updatedStreak);
    }
    
    // Save current session words for replay
    if (currentSessionWords.length > 0 && activeProfile) {
      setLastSessionWords(currentSessionWords);
      const storageKeys = getProfileStorageKeys(activeProfile.id);
      await AsyncStorage.setItem(storageKeys.lastSession, JSON.stringify(currentSessionWords));
    }
    setCurrentWord(null);
    setWordsInSession(0);
    setCurrentSessionWords([]);
  }, [currentSessionWords, settings.successSoundEnabled, wordsInSession, activeProfile, streakData]);
  
  /**
   * Update app settings.
   */
  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    if (!activeProfile) return;
    
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    const storageKeys = getProfileStorageKeys(activeProfile.id);
    await saveSettings(updated, storageKeys.settings);
    
    // Handle background music changes
    if ('backgroundMusicEnabled' in newSettings) {
      if (newSettings.backgroundMusicEnabled && currentWord) {
        // Music turned on during lesson
        startBackgroundMusic(updated.backgroundMusicVolume).catch(console.error);
      } else if (!newSettings.backgroundMusicEnabled) {
        // Music turned off
        stopBackgroundMusic().catch(console.error);
      }
    }
    
    // Handle volume changes
    if ('backgroundMusicVolume' in newSettings && updated.backgroundMusicEnabled) {
      setBackgroundMusicVolume(updated.backgroundMusicVolume).catch(console.error);
    }
  }, [settings, currentWord, activeProfile]);
  
  /**
   * Reset all learning progress.
   */
  const resetAllProgress = useCallback(async () => {
    if (!activeProfile) return;
    
    const freshState = createInitialState();
    // Re-introduce first 5 words
    const firstWords = ALL_WORDS.slice(0, 5).map(w => w.id);
    const initializedState = introduceWords(freshState, firstWords);
    
    setEngineState(initializedState);
    
    const storageKeys = getProfileStorageKeys(activeProfile.id);
    await saveProgress(initializedState.progress, storageKeys.progress);
  }, [activeProfile]);
  
  /**
   * Toggle category selection.
   */
  const toggleCategory = useCallback(async (category: WordCategory) => {
    if (!activeProfile) return;
    
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    
    // Save to storage
    try {
      const storageKeys = getProfileStorageKeys(activeProfile.id);
      await AsyncStorage.setItem(storageKeys.categories, JSON.stringify(newCategories));
    } catch (error) {
      console.error('Failed to save selected categories:', error);
    }
  }, [selectedCategories, activeProfile]);
  
  /**
   * Clear mastery notification after it's been shown.
   */
  const clearMasteryNotification = useCallback(() => {
    setNewlyMasteredWord(null);
  }, []);
  
  // Computed values
  const stats = getMasteryStats(engineState);
  const currentWordProgress = currentWord 
    ? getWordProgress(engineState, currentWord.id)
    : null;
  
  return {
    // State
    isLoading,
    isInitialized,
    activeProfile,
    engineState,
    currentWord,
    currentWordProgress,
    wordsInSession,
    lastSessionWords,
    celebratedWords,
    newlyMasteredWord,
    settings,
    selectedCategories,
    streakData,
    stats,
    
    // Actions
    startLesson,
    startReplaySession,
    onWordExposed,
    onAudioPlayed,
    advanceToNextWord,
    endLesson,
    updateSettings,
    toggleCategory,
    clearMasteryNotification,
    resetAllProgress,
  };
}
