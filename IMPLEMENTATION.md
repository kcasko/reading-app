# Children's Reading App - Implementation Guide

> **Quick Links:** [README](README.md) | [Summary](SUMMARY.md) | [Features](FEATURES.md) | [API Docs](API.md) | [Migration](MIGRATION.md)

## Core Principles (NEVER VIOLATE)

✓ **Word is always larger than the image**  
✓ **One word per screen**  
✓ **One image per word**  
✓ **Tap anywhere to hear the word spoken**  
✓ **No typing, spelling input, or failure screens**  
✓ **No internet required**  
✓ **No accounts, ads, or distracting animations**

---

## What Has Been Implemented

### ✅ Phase 1: Project Setup
- Expo React Native project with TypeScript
- Functional components and hooks only
- AsyncStorage for local persistence
- Basic app shell with Home and Learning screens
- Stack navigation

### ✅ Phase 2: Word Data Model
- 32 concrete nouns across 4 categories:
  - Animals (cat, dog, bird, fish, cow, pig, horse, duck)
  - Food (apple, banana, bread, milk, egg, cake, pizza, cookie)
  - Objects (ball, book, cup, chair, door, bed, table, hat)
  - Vehicles (car, bus, truck, train, boat, plane, bike, ship)
- Each word includes imagePath, category, and difficulty level
- Tracking fields for exposure count and timestamps

### ✅ Phase 3: Learning Screen UI (NEW)
- **LessonScreen.new.tsx** - Completely redesigned
- Entire screen is tappable (no buttons)
- Large word display above smaller image
- Neutral, calm background
- Simple progress bar that fills slowly
- Auto-advances after audio + brief pause

### ✅ Phase 4: Audio Implementation
- **TextToSpeech.ts** - expo-speech integration
- Instant, reliable offline text-to-speech
- Calm, neutral voice at 0.75 speed
- No auto-play on first appearance (child must tap)
- Works completely offline

### ✅ Phase 5: Progress Tracking (EXPOSURE-BASED)
- **SpacedRepetition.ts** - Completely rebuilt
- Tracks `exposureCount` instead of correct/incorrect
- Tracks `audioPlayCount` separately
- Tracks `lastSeenAt` timestamp
- NO success/failure concept

### ✅ Phase 6: Spaced Repetition Logic
- Simple weighted random selection
- New words (0 exposures) get highest priority
- Recently seen words temporarily deprioritized
- Words with fewer exposures repeat more often

### ✅ Phase 7: Image Fade Strategy
- Images fade based on exposure thresholds:
  - 0-7 exposures: Full opacity (1.0)
  - 8-14 exposures: Gradual fade (1.0 → 0.3)
  - 15-24 exposures: Intermittent at 30% opacity
  - 25+ exposures: Hidden completely
- Automatic and invisible to the child

### ✅ Phase 8: Home Screen (NEW)
- **HomeScreen.new.tsx** - Child-friendly design
- Giant circular "Start" button (280x280)
- Simple star progress indicator
- Long-press on title reveals parent mode
- No text instructions needed

### ✅ Phase 11: Theme
- Calm, neutral colors (#F8F8F8 background)
- Very high contrast text (#1A1A1A)
- No bright, distracting colors
- Large fonts for word display (72pt)

---

## What Needs To Be Done

### 🔧 Phase 9: Add Image Assets

**CRITICAL**: Add simple, clean illustrations to:
```
assets/images/
  animals/
    cat.png
    dog.png
    bird.png
    fish.png
    cow.png
    pig.png
    horse.png
    duck.png
  food/
    apple.png
    banana.png
    bread.png
    milk.png
    egg.png
    cake.png
    pizza.png
    cookie.png
  objects/
    ball.png
    book.png
    cup.png
    chair.png
    door.png
    bed.png
    table.png
    hat.png
  vehicles/
    car.png
    bus.png
    truck.png
    train.png
    boat.png
    plane.png
    bike.png
    ship.png
```

**Image Requirements**:
- Simple, clean illustrations or icons
- NO busy backgrounds
- NO scenes
- 512x512px recommended
- PNG format with transparency
- Child-friendly but not cartoonish

**Quick Start**: Use public domain icons from:
- https://thenounproject.com (public domain section)
- https://www.flaticon.com (free with attribution)
- Create simple emoji-style SVGs

### 🔧 Update WordCard.tsx Image Loading

Replace the `getImageSource()` function:

```typescript
function getImageSource(imagePath: string): any {
  const images: Record<string, any> = {
    'animals/cat.png': require('../../assets/images/animals/cat.png'),
    'animals/dog.png': require('../../assets/images/animals/dog.png'),
    // ... add all 32 images
  };
  return images[imagePath] || null;
}
```

### 🔧 Wire Up New Screens

1. **Replace old LessonScreen**:
   ```bash
   mv src/screens/LessonScreen.tsx src/screens/LessonScreen.old.tsx
   mv src/screens/LessonScreen.new.tsx src/screens/LessonScreen.tsx
   ```

2. **Replace old HomeScreen**:
   ```bash
   mv src/screens/HomeScreen.tsx src/screens/HomeScreen.old.tsx
   mv src/screens/HomeScreen.new.tsx src/screens/HomeScreen.tsx
   ```

3. **Update useAppState.ts** to use new exposure-based methods:
   - Replace `markCorrect` → `markExposure`
   - Replace `markIncorrect` → remove (not needed)
   - Add `markAudioPlayed` tracking

### 🔧 Parent Mode Implementation
- Create ProgressScreen for parent viewing only
- Add reset progress functionality
- Add category selection
- Add child profiles (future)

### 🔧 Session Management
- Implement gentle session length (5-10 minutes default)
- Add word introduction logic (start with 5 words)
- Gradually introduce new words as child progresses

### 🔧 Settings Screen
- Parent-only access
- Toggle image fade behavior
- View stats
- Reset progress

---

## Quick Start Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## File Structure

```
src/
  App.tsx                     - Entry point
  audio/
    TextToSpeech.ts          - ✅ NEW: expo-speech integration
    AudioPlayer.ts           - (old, can be removed)
  components/
    WordCard.tsx             - ✅ UPDATED: word + image display
  data/
    wordLists.ts             - ✅ UPDATED: 32 concrete nouns
  engine/
    SpacedRepetition.ts      - ✅ REBUILT: exposure-based tracking
    WordEngine.ts            - ✅ UPDATED: exposure methods
  screens/
    HomeScreen.new.tsx       - ✅ NEW: child-friendly home
    LessonScreen.new.tsx     - ✅ NEW: tap-to-hear learning
    HomeScreen.tsx           - (old, to be replaced)
    LessonScreen.tsx         - (old, to be replaced)
  theme/
    colors.ts                - ✅ UPDATED: calm, neutral palette
```

---

## Testing Checklist

- [ ] A 4-year-old can launch and use without help
- [ ] Word is always larger than image
- [ ] Tapping anywhere plays audio
- [ ] Auto-advances after audio plays
- [ ] Works completely offline
- [ ] Images fade as words are mastered
- [ ] No failure screens or negative feedback
- [ ] Parent mode accessible via long-press
- [ ] Session feels calm and predictable

---

## Next Steps Priority

1. **Add placeholder images** (use emojis temporarily if needed)
2. **Wire up new screens** (replace old with new)
3. **Update useAppState.ts** for exposure tracking
4. **Test with a child** - observe and iterate
5. **Add parent mode screens** (settings, progress)
6. **Polish session flow** (introduce words gradually)

---

## Philosophy Reminder

This app wins by being:
- **Calm** - No bright colors, no animations, no noise
- **Predictable** - Same interaction every time
- **Effective** - Image fades as word is learned
- **Accessible** - Works for non-reading 4-year-old
- **Offline** - No internet, no accounts, no tracking
- **Private** - All data stays on device

If a feature conflicts with these principles, **remove the feature**.
