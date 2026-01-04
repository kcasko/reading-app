# Sight Words Reading App

> **🔄 NEW IMPLEMENTATION AVAILABLE**  
> This app has been completely rebuilt to follow child-first principles.  
> See **SUMMARY.md** for complete overview and **MIGRATION.md** to activate new features.  
> Key changes: tap-to-hear (no buttons), exposure-based tracking, image fade, emoji placeholders.

---

A production-ready React Native + Expo app for teaching young children sight words through audio-first interaction and spaced repetition.

## Table of Contents

- [Design Principles](#design-principles)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Design Principles

- **Calm, focused UX** for young children
- **Offline-first** - no internet required
- **No ads, dark patterns, or overstimulation**
- **Large tap targets** and high contrast visuals
- **Audio-first learning** with adjustable playback speed

## Features

### Core Learning Features
- ✅ **32 Words** across 4 categories (animals, food, objects, vehicles)
- ✅ **Exposure-based learning** - no right/wrong, just gentle repetition
- ✅ **Spaced repetition algorithm** - intelligent word selection
- ✅ **Tap-to-hear** - tap anywhere on screen to hear word spoken
- ✅ **Auto-advance** - automatic progression after audio plays
- ✅ **Image fade algorithm** - images gradually disappear as mastery increases

### User Features
- ✅ **Multiple child profiles** - complete data isolation per child
- ✅ **Category selection** - choose from 4 word categories
- ✅ **Session customization** - 10-30 words per lesson
- ✅ **Voice selection** - 4 voice types (Default, Male, Female, Child)
- ✅ **Custom fonts** - System, OpenDyslexic, Comic Sans MS for accessibility
- ✅ **Review mode** - zero-pressure practice of learned words
- ✅ **Mastery celebrations** - gentle encouragement at 25 exposures
- ✅ **Daily streaks** - non-pressuring consistency tracking
- ✅ **Sound effects** - optional success sounds and background music
- ✅ **Progress tracking** - detailed parent dashboard
- ✅ **Backup & restore** - export/import all child data
- ✅ **Image preloading** - smooth, instant transitions

See [FEATURES.md](FEATURES.md) for complete feature documentation.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/kcasko/reading-app.git
cd reading-app

# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Initial Setup

1. **Audio Setup** (Optional but recommended)
   ```bash
   npm run audio-setup
   ```
   See [AUDIO.md](AUDIO.md) for adding success sounds and background music.

2. **Font Setup** (Optional)
   
   See [FONTS.md](FONTS.md) for adding OpenDyslexic fonts for dyslexic readers.

3. **Test the App**
   - Create a child profile
   - Select word categories
   - Start a lesson and tap to hear words

### Troubleshooting

**App won't start:**
```bash
# Clear cache and restart
npm start -- --clear
```

**Audio not working:**
- Ensure device volume is up
- Check that device is not in silent mode
- Test with headphones to rule out speaker issues

**Images not loading:**
- Check that image files exist in `assets/images/`
- Verify paths in `src/data/wordLists.ts` match actual files
- Run `npm start -- --clear` to clear asset cache

**TypeScript errors:**
```bash
# Check for type errors
npx tsc --noEmit
```

For more help, see [IMPLEMENTATION.md](IMPLEMENTATION.md).

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

1. **Add audio files**: See [AUDIO.md](AUDIO.md) for adding success sounds and background music
2. **Add app icons**: Create icon.png (1024x1024), splash.png, adaptive-icon.png
3. **Add word images**: Add images to `assets/images/` or keep using emoji placeholders
4. **Test on devices**: Verify touch targets and audio on real hardware
5. **Accessibility audit**: Ensure VoiceOver/TalkBack compatibility

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Building production apps with EAS Build
- Submitting to App Store and Google Play
- OTA updates with Expo Updates
- Environment configuration

### Technical Improvements

- [ ] Unit tests for engine modules
- [ ] E2E tests with Detox
- [ ] Error boundary for crash recovery
- [ ] Analytics integration (privacy-focused)
- [ ] Performance monitoring

## Development

### Running Linter

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Code Structure Guidelines

- Keep `src/engine/` free of React dependencies
- Use functional components with hooks only
- Maintain type safety - no `any` types
- Follow existing code style and patterns
- See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines

### Adding Words

Edit [src/data/wordLists.ts](src/data/wordLists.ts):

```typescript
export const ANIMAL_WORDS: Word[] = [
  {
    id: 'cat',
    text: 'cat',
    imagePath: require('../../assets/images/animals/cat.png'),
    category: 'animals',
    level: 1,
  },
  // Add more words...
];
```

### Customizing Settings

Key constants in [src/utils/constants.ts](src/utils/constants.ts):

```typescript
export const LESSON_CONFIG = {
  MIN_WORDS_PER_LESSON: 10,
  MAX_WORDS_PER_LESSON: 30,
  DEFAULT_WORDS_PER_LESSON: 20,
};

export const MASTERY_THRESHOLD = 25; // Exposures needed for mastery
```

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick overview:
1. Configure app.json with your app details
2. Build with EAS Build
3. Submit to app stores
4. Enable OTA updates

## Documentation

**[📚 Complete Documentation Index](DOCS.md)** - Navigate all documentation

### Core Documentation
- **[README.md](README.md)** - This file, overview and quick start
- **[SUMMARY.md](SUMMARY.md)** - Complete project overview and philosophy
- **[FEATURES.md](FEATURES.md)** - Detailed feature documentation
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Implementation guide and checklist
- **[MIGRATION.md](MIGRATION.md)** - Guide for switching to new implementation
- **[API.md](API.md)** - Code architecture and API documentation

### Setup Guides
- **[AUDIO.md](AUDIO.md)** - Audio file setup and requirements
- **[FONTS.md](FONTS.md)** - Custom font installation guide

### Contributing & Deployment
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code of conduct
- Development setup
- Code standards
- Pull request process
- Priority areas for contribution
