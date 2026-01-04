# API Documentation

This document describes the internal API and architecture of the Reading App.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Engine Layer](#engine-layer)
- [State Management](#state-management)
- [Audio System](#audio-system)
- [Data Models](#data-models)
- [Storage](#storage)
- [Navigation](#navigation)

## Architecture Overview

The app follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Screens (React)             │
│  ProfileSelector, Home, Lesson, etc │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Components (React)             │
│    WordCard, BigButton, etc         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    State Management (Hooks)         │
│    useAppState, profileStore, etc   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Engine (Pure TypeScript)         │
│  SpacedRepetition, WordEngine, etc  │
└─────────────────────────────────────┘
```

**Key Principles:**
- Engine layer has **zero React dependencies**
- State management uses React hooks
- Screens are functional components only
- AsyncStorage for all persistence

## Engine Layer

Pure TypeScript modules with no React dependencies. Fully testable and reusable.

### SpacedRepetition

**File:** `src/engine/SpacedRepetition.ts`

Manages the spaced repetition algorithm for word selection.

```typescript
class SpacedRepetition {
  // Select next word based on exposure counts
  selectNextWord(
    words: Word[],
    progress: Record<string, WordProgress>,
    options?: SelectionOptions
  ): Word | null;

  // Calculate priority score for a word
  calculatePriority(
    word: Word,
    progress: WordProgress,
    now: number
  ): number;

  // Get words due for review
  getDueWords(
    words: Word[],
    progress: Record<string, WordProgress>
  ): Word[];
}
```

**Algorithm:**
- New words (0 exposures) get highest priority
- Recently seen words get lower priority
- Words with fewer exposures repeat more often
- Uses weighted random selection

### WordEngine

**File:** `src/engine/WordEngine.ts`

Manages word progress tracking and exposure counting.

```typescript
class WordEngine {
  // Mark a word as exposed (seen)
  markExposure(wordId: string): void;

  // Mark audio as played
  markAudioPlayed(wordId: string): void;

  // Get progress for a specific word
  getWordProgress(wordId: string): WordProgress;

  // Get all word progress
  getAllProgress(): Record<string, WordProgress>;

  // Check if word is mastered (25+ exposures)
  isMastered(wordId: string): boolean;

  // Get total exposures across all words
  getTotalExposures(): number;
}
```

**Word Progress Tracking:**
- `exposureCount`: How many times word has been shown
- `audioPlayCount`: How many times audio was played
- `lastSeenAt`: Timestamp of last exposure
- `masteryLevel`: Calculated based on exposure count

### LessonBuilder

**File:** `src/engine/LessonBuilder.ts`

Assembles lesson sessions from available words.

```typescript
class LessonBuilder {
  // Build a lesson with specified number of words
  buildLesson(
    allWords: Word[],
    progress: Record<string, WordProgress>,
    wordCount: number,
    categories?: string[]
  ): Word[];

  // Get words for review (due based on spacing)
  getReviewWords(
    words: Word[],
    progress: Record<string, WordProgress>
  ): Word[];

  // Get new words to introduce
  getNewWords(
    words: Word[],
    progress: Record<string, WordProgress>,
    count: number
  ): Word[];
}
```

## State Management

React hooks-based state management with AsyncStorage persistence.

### useAppState

**File:** `src/state/useAppState.ts`

Central state hook providing all app state and actions.

```typescript
interface AppState {
  // Profile Management
  currentProfile: Profile | null;
  profiles: Profile[];
  createProfile: (name: string, emoji: string) => Promise<void>;
  selectProfile: (profileId: string) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;

  // Word Progress
  wordProgress: Record<string, WordProgress>;
  markWordExposure: (wordId: string) => Promise<void>;
  markAudioPlayed: (wordId: string) => Promise<void>;

  // Lesson Management
  currentLesson: Word[];
  currentWordIndex: number;
  startLesson: () => Promise<void>;
  advanceWord: () => void;
  endLesson: () => void;

  // Settings
  selectedVoice: VoiceType;
  setSelectedVoice: (voice: VoiceType) => Promise<void>;
  selectedFont: FontType;
  setSelectedFont: (font: FontType) => Promise<void>;
  sessionLength: number;
  setSessionLength: (length: number) => Promise<void>;
  
  // Category Selection
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => Promise<void>;

  // Statistics
  getTotalWords: () => number;
  getIntroducedWords: () => number;
  getLearningWords: () => number;
  getMasteredWords: () => number;

  // Mastery Celebrations
  celebratedWords: string[];
  checkForNewMastery: () => string | null;
  markWordCelebrated: (wordId: string) => Promise<void>;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  streakDates: string[];
  updateStreak: () => Promise<void>;
}

const { state, actions } = useAppState();
```

### profileStore

**File:** `src/state/profileStore.ts`

Profile-specific storage utilities.

```typescript
// Save data scoped to current profile
export async function saveProfileData<T>(
  key: string,
  data: T,
  profileId: string
): Promise<void>;

// Load data scoped to current profile
export async function loadProfileData<T>(
  key: string,
  profileId: string
): Promise<T | null>;

// Delete all data for a profile
export async function deleteProfileData(
  profileId: string
): Promise<void>;

// Get all storage keys for a profile
export async function getProfileKeys(
  profileId: string
): Promise<string[]>;
```

**Storage Keys:**
- `@ReadingApp:progress:{profileId}` - Word progress
- `@ReadingApp:settings:{profileId}` - User settings
- `@ReadingApp:selectedCategories:{profileId}` - Category filters
- `@ReadingApp:lastSessionWords:{profileId}` - Last lesson
- `@ReadingApp:celebratedWords:{profileId}` - Mastery celebrations
- `@ReadingApp:streak:{profileId}` - Daily streaks

### progressStore

**File:** `src/state/progressStore.ts`

Generic AsyncStorage persistence utilities.

```typescript
// Save data to AsyncStorage
export async function saveProgress(
  key: string,
  data: any
): Promise<void>;

// Load data from AsyncStorage
export async function loadProgress<T>(
  key: string
): Promise<T | null>;

// Clear all app data
export async function clearAllData(): Promise<void>;

// Get all storage keys
export async function getAllKeys(): Promise<string[]>;
```

### streakStore

**File:** `src/state/streakStore.ts`

Streak tracking and management.

```typescript
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakDates: string[]; // ISO date strings
}

// Update streak when activity occurs
export async function updateStreak(
  profileId: string
): Promise<StreakData>;

// Get current streak data
export async function getStreakData(
  profileId: string
): Promise<StreakData>;

// Reset streak (for testing)
export async function resetStreak(
  profileId: string
): Promise<void>;
```

## Audio System

### TextToSpeech

**File:** `src/audio/TextToSpeech.ts`

Text-to-speech using expo-speech.

```typescript
class TextToSpeech {
  // Speak a word with selected voice
  async speak(
    text: string,
    options?: SpeakOptions
  ): Promise<void>;

  // Stop current speech
  async stop(): Promise<void>;

  // Check if speaking
  isSpeaking(): Promise<boolean>;

  // Get available voices
  async getAvailableVoices(): Promise<Voice[]>;
}

interface SpeakOptions {
  voice?: VoiceType; // 'default' | 'male' | 'female' | 'child'
  rate?: number;     // 0.5 - 2.0, default 0.75
  pitch?: number;    // 0.5 - 2.0, varies by voice type
}
```

**Voice Types:**
- `default`: Pitch 1.0
- `male`: Pitch 0.9 (lower)
- `female`: Pitch 1.2 (higher)
- `child`: Pitch 1.3 (highest)

### SoundEffects

**File:** `src/audio/SoundEffects.ts`

UI sound effects using expo-av.

```typescript
class SoundEffects {
  // Play success sound
  async playSuccess(): Promise<void>;

  // Start background music (looping)
  async startBackgroundMusic(volume: number): Promise<void>;

  // Stop background music
  async stopBackgroundMusic(): Promise<void>;

  // Set background music volume (0-1)
  async setBackgroundVolume(volume: number): Promise<void>;

  // Cleanup resources
  async cleanup(): Promise<void>;
}
```

**Audio Files:**
- `assets/audio/ui/success.mp3` - Success sound (1-3 seconds)
- `assets/audio/ui/background.mp3` - Background music (30+ seconds, loops)

## Data Models

### Word

```typescript
interface Word {
  id: string;           // Unique identifier
  text: string;         // Display text
  imagePath: any;       // require() or emoji string
  category: string;     // 'animals' | 'food' | 'objects' | 'vehicles'
  level: number;        // Difficulty level (1-3)
}
```

### WordProgress

```typescript
interface WordProgress {
  wordId: string;
  exposureCount: number;    // Times word shown
  audioPlayCount: number;   // Times audio played
  lastSeenAt: number;       // Timestamp
  masteryLevel: number;     // 0-4 based on exposures
  createdAt: number;        // First exposure timestamp
}
```

**Mastery Levels:**
- 0: New (0 exposures)
- 1: Faint (1-7 exposures)
- 2: Dim (8-14 exposures)
- 3: Fading (15-24 exposures)
- 4: Mastered (25+ exposures)

### Profile

```typescript
interface Profile {
  id: string;          // UUID
  name: string;        // Child's name
  emoji: string;       // Avatar emoji
  createdAt: number;   // Timestamp
}
```

### Settings

```typescript
interface ProfileSettings {
  selectedVoice: VoiceType;           // 'default' | 'male' | 'female' | 'child'
  selectedFont: FontType;             // 'system' | 'opendyslexic' | 'comic'
  sessionLength: number;              // 10-30 words
  successSoundEnabled: boolean;       // Default: true
  backgroundMusicEnabled: boolean;    // Default: false
  backgroundMusicVolume: number;      // 0-100
}
```

## Storage

All data is stored in AsyncStorage with profile-scoped keys.

### Storage Schema

```
@ReadingApp:profiles                          -> Profile[]
@ReadingApp:activeProfileId                   -> string

Per-Profile Keys:
@ReadingApp:progress:{profileId}              -> Record<string, WordProgress>
@ReadingApp:settings:{profileId}              -> ProfileSettings
@ReadingApp:selectedCategories:{profileId}    -> string[]
@ReadingApp:lastSessionWords:{profileId}      -> string[]
@ReadingApp:celebratedWords:{profileId}       -> string[]
@ReadingApp:streak:{profileId}                -> StreakData
```

### DataManager

**File:** `src/utils/DataManager.ts`

Data backup and restore utilities.

```typescript
// Export all app data
export async function exportData(): Promise<string>;

// Import and merge data
export async function importData(
  jsonData: string,
  mode: 'merge' | 'replace'
): Promise<void>;

// Get storage statistics
export async function getStorageStats(): Promise<StorageStats>;

// Cleanup orphaned data
export async function cleanupOrphanedData(): Promise<number>;

// Validate backup file
export function validateBackupData(data: any): boolean;
```

## Navigation

**File:** `src/navigation/AppNavigator.tsx`

React Navigation stack navigator.

```typescript
type RootStackParamList = {
  ProfileSelector: undefined;
  CreateProfile: undefined;
  Home: undefined;
  Lesson: undefined;
  Progress: undefined;
  Settings: undefined;
  Review: undefined;
  Mastery: { word: Word };
  Streak: undefined;
  DataManagement: undefined;
};

// Navigate to screen
navigation.navigate('Home');

// Navigate with params
navigation.navigate('Mastery', { word: currentWord });

// Go back
navigation.goBack();

// Replace current screen
navigation.replace('ProfileSelector');
```

## Utilities

### ImagePreloader

**File:** `src/utils/ImagePreloader.ts`

Preloads images for smooth transitions.

```typescript
class ImagePreloader {
  // Preload array of image assets
  async preloadImages(imagePaths: any[]): Promise<void>;

  // Clear preloaded images
  clearCache(): void;

  // Check if image is preloaded
  isPreloaded(imagePath: any): boolean;
}
```

### Constants

**File:** `src/utils/constants.ts`

App-wide configuration constants.

```typescript
export const LESSON_CONFIG = {
  MIN_WORDS_PER_LESSON: 10,
  MAX_WORDS_PER_LESSON: 30,
  DEFAULT_WORDS_PER_LESSON: 20,
  WORDS_PER_LESSON_STEP: 5,
};

export const MASTERY_THRESHOLD = 25;

export const IMAGE_FADE_THRESHOLDS = {
  FULL_OPACITY: 7,      // 0-7 exposures: 1.0
  START_FADE: 8,        // 8-14 exposures: 1.0 → 0.3
  INTERMITTENT: 15,     // 15-24 exposures: 30% at random
  HIDDEN: 25,           // 25+ exposures: 0.0
};

export const AUTO_ADVANCE_DELAY = 2000; // ms
```

## Testing

### Unit Testing Engine

Engine modules are pure TypeScript and easily testable:

```typescript
import { SpacedRepetition } from '../engine/SpacedRepetition';

describe('SpacedRepetition', () => {
  it('should prioritize new words', () => {
    const sr = new SpacedRepetition();
    const words = [/* ... */];
    const progress = {/* ... */};
    
    const nextWord = sr.selectNextWord(words, progress);
    expect(nextWord?.id).toBe('new-word-id');
  });
});
```

### Integration Testing

For testing React components and state:

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAppState } from '../state/useAppState';

describe('useAppState', () => {
  it('should create profile', async () => {
    const { result } = renderHook(() => useAppState());
    
    await result.current.createProfile('Test', '😀');
    expect(result.current.profiles).toHaveLength(1);
  });
});
```

## Performance Considerations

### Memory Management
- Images are preloaded in batches of 5
- Old images are cleaned up automatically
- Audio resources are properly disposed

### Storage Optimization
- Profile data is isolated
- Orphaned data is cleaned up via DataManager
- Large datasets use efficient JSON serialization

### Render Optimization
- Functional components with hooks
- Minimal re-renders via careful state design
- Image caching via expo-asset

## Security & Privacy

- **No network requests** - completely offline
- **Local storage only** - AsyncStorage
- **No analytics by default** - privacy-first
- **Profile isolation** - complete data separation
- **No external dependencies for core functionality**

## Error Handling

### Graceful Degradation
- Missing audio files → console warnings
- Missing images → emoji fallbacks
- Storage errors → in-memory fallback
- Corrupted data → validation and recovery

### Error Boundaries
Implement error boundaries for crash recovery:

```typescript
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

---

For implementation guides, see [IMPLEMENTATION.md](IMPLEMENTATION.md).  
For contributing guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
