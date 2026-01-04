# Sight Words Reading App

> **🔄 NEW IMPLEMENTATION AVAILABLE**  
> This app has been completely rebuilt to follow child-first principles.  
> See **SUMMARY.md** for complete overview and **MIGRATION.md** to activate new features.  
> Key changes: tap-to-hear (no buttons), exposure-based tracking, image fade, emoji placeholders.

---

A production-ready React Native + Expo app for teaching young children sight words through audio-first interaction and spaced repetition.

## Design Principles

- **Calm, focused UX** for young children
- **Offline-first** - no internet required
- **No ads, dark patterns, or overstimulation**
- **Large tap targets** and high contrast visuals
- **Audio-first learning** with adjustable playback speed

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```text
reading-app/
├── assets/
│   ├── audio/
│   │   ├── words/          # Word audio files (the.mp3, and.mp3, etc.)
│   │   └── ui/             # UI sound effects
│   ├── images/             # App icons and splash screen
│   └── fonts/              # Custom fonts (optional)
├── src/
│   ├── App.tsx             # App entry point
│   ├── navigation/
│   │   └── AppNavigator.tsx    # React Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Main menu
│   │   ├── LessonScreen.tsx    # Active lesson view
│   │   ├── ProgressScreen.tsx  # Learning statistics
│   │   └── SettingsScreen.tsx  # App preferences
│   ├── components/
│   │   ├── WordCard.tsx        # Word display with audio
│   │   ├── AudioButton.tsx     # Audio playback control
│   │   ├── BigButton.tsx       # Large touch target button
│   │   └── ProgressBar.tsx     # Visual progress indicator
│   ├── engine/
│   │   ├── WordEngine.ts       # Word selection logic
│   │   ├── SpacedRepetition.ts # SRS algorithm
│   │   └── LessonBuilder.ts    # Lesson assembly
│   ├── audio/
│   │   └── AudioPlayer.ts      # Expo Audio abstraction
│   ├── data/
│   │   ├── wordLists.ts        # Word definitions
│   │   └── levels.ts           # Difficulty progression
│   ├── state/
│   │   ├── useAppState.ts      # Global state hook
│   │   └── progressStore.ts    # AsyncStorage persistence
│   ├── theme/
│   │   ├── colors.ts           # Color palette
│   │   ├── spacing.ts          # Spacing scale
│   │   └── typography.ts       # Text styles
│   └── utils/
│       ├── storage.ts          # Storage utilities
│       └── constants.ts        # App configuration
```

## Architecture

### Engine Layer (No React Dependencies)

The `engine/` directory contains pure TypeScript logic with zero React imports:

- **SpacedRepetition.ts**: Implements a Leitner-style system where words move through "boxes" based on correct/incorrect responses
- **WordEngine.ts**: Manages word progress state and selection
- **LessonBuilder.ts**: Assembles lesson sessions from due reviews and new words

This separation ensures the core learning logic is:

- Testable without React
- Reusable across platforms
- Easy to reason about

### State Management

Uses a single `useAppState` hook that provides:

- Word progress tracking
- Current lesson state
- App settings
- Persistence via AsyncStorage

### Audio System

`AudioPlayer.ts` wraps Expo Audio to provide:

- Simple play/replay API
- Adjustable playback rate
- Proper resource management

## Lesson Flow

1. User taps "Start Lesson" on HomeScreen
2. LessonBuilder selects 5 words (reviews first, then new words)
3. Words are shown one at a time with audio
4. User taps "Got It" (correct) or "Try Again" (incorrect)
5. Incorrect words are added to a retry queue
6. Lesson completes when all words (including retries) are done

## Spaced Repetition

Words progress through boxes based on responses:

| Box | Review Interval |
|-----|-----------------|
| 0   | Immediate       |
| 1   | 1 minute        |
| 2   | 10 minutes      |
| 3   | 1 hour          |
| 4   | 1 day (mastered)|

- Correct answer: Move to next box
- Incorrect answer: Return to box 0

## Adding Audio Files

### Word Audio Files
Word audio files should be placed in `assets/audio/words/` with filenames matching word IDs:

```text
assets/audio/words/
├── the.mp3
├── and.mp3
├── a.mp3
├── to.mp3
├── is.mp3
├── in.mp3
├── it.mp3
├── you.mp3
├── I.mp3
└── can.mp3
```

### UI Sound Effects ⭐ NEW
Optional audio files for enhanced user experience:

```text
assets/audio/ui/
├── success.mp3      # Plays when lessons complete (1-3 seconds)
└── background.mp3   # Ambient music during lessons (30+ seconds, loops)
```

**Setup**: Run `npm run audio-setup` to see current status and get setup help.  
**Documentation**: See [AUDIO.md](AUDIO.md) for detailed requirements and free resources.  
**Note**: App works perfectly without these files (graceful fallback to console messages).

Update `AudioPlayer.ts` to use bundled assets instead of URI paths for production.

## Adding Words

Edit `src/data/wordLists.ts` to add new words:

```typescript
export const MY_WORDS: Word[] = [
  { id: 'word', text: 'word', audioFile: 'word', level: 1 },
  // ...
];
```

## Next Steps

### Before Production

1. **Add audio files**: Record or source audio for all words
2. **Add app icons**: Create icon.png (1024x1024), splash.png, adaptive-icon.png
3. **Test on devices**: Verify touch targets and audio on real hardware
4. **Accessibility audit**: Ensure VoiceOver/TalkBack compatibility

### Future Enhancements

- [ ] Add more word levels (primer, first grade, etc.)
- [ ] Custom fonts via expo-font
- [ ] Parent dashboard with detailed analytics
- [ ] Multiple user profiles
- [ ] Word illustrations (optional visual cues)
- [ ] Achievement system (subtle, not gamified)

### Technical Improvements

- [ ] Unit tests for engine modules
- [ ] E2E tests with Detox
- [ ] Error boundary for crash recovery
- [ ] Analytics integration (privacy-focused)
- [ ] OTA updates via Expo Updates

## Configuration

Key constants in `src/utils/constants.ts`:

```typescript
LESSON_CONFIG = {
  WORDS_PER_LESSON: 5,      // Words per session
  MIN_ATTEMPTS_FOR_MASTERY: 3,
  MASTERY_THRESHOLD: 0.8,    // 80% accuracy required
}

AUDIO_CONFIG = {
  DEFAULT_RATE: 1.0,
  SLOW_RATE: 0.75,
  AUTO_PLAY_DELAY: 300,      // ms before auto-play
}
```

## License

MIT

## Contributing

This is a foundation for a real product. Focus on:

- Maintaining code clarity
- Keeping the engine layer pure
- Respecting the calm, child-focused UX
