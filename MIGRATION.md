# Migration Guide - Switch to New Implementation

This guide will help you activate the new exposure-based learning system.

## Step 1: Backup Current Files

```bash
# Backup old implementations
cp src/screens/HomeScreen.tsx src/screens/HomeScreen.old.tsx
cp src/screens/LessonScreen.tsx src/screens/LessonScreen.old.tsx
cp src/state/useAppState.ts src/state/useAppState.old.ts
cp src/navigation/AppNavigator.tsx src/navigation/AppNavigator.old.tsx
```

## Step 2: Activate New Screens

```bash
# Replace with new implementations
mv src/screens/HomeScreen.new.tsx src/screens/HomeScreen.tsx
mv src/screens/LessonScreen.new.tsx src/screens/LessonScreen.tsx
mv src/state/useAppState.new.ts src/state/useAppState.ts
mv src/navigation/AppNavigator.new.tsx src/navigation/AppNavigator.tsx
```

## Step 3: Verify Imports

Make sure these files exist and are being imported correctly:

- `src/audio/TextToSpeech.ts` - Text-to-speech functionality
- `src/engine/SpacedRepetition.ts` - Updated with exposure tracking
- `src/engine/WordEngine.ts` - Updated with markExposure methods
- `src/data/wordLists.ts` - Updated with concrete nouns and image paths
- `src/components/WordCard.tsx` - Updated with emoji placeholders
- `src/theme/colors.ts` - Updated with calm, neutral palette

## Step 4: Test Build

```bash
# Clear any cached builds
npm start -- --clear

# Or on specific platform
npm run android
npm run ios
```

## Step 5: Test Core Functionality

### Test Checklist:

1. **App launches** - No errors on startup
2. **Home screen shows** - Large "Start" button visible
3. **Tap Start button** - Navigates to learning screen
4. **Word displays** - Word text shows large at top
5. **Emoji shows** - Emoji placeholder appears below word
6. **Tap anywhere** - Audio plays (word is spoken)
7. **Auto-advance** - After audio + 2 sec pause, next word appears
8. **Image fades** - (Test after ~8 exposures of same word)
9. **Long-press title** - Parent mode appears on Home screen
10. **Progress indicator** - Stars fill slowly as words are mastered

## Step 6: Troubleshooting

### Error: Cannot find module 'expo-speech'

```bash
npm install expo-speech
```

### Error: Cannot find HomeScreen.new or LessonScreen.new

You need to use the migration commands from Step 2 above.

### Error: TypeScript errors about WordProgress fields

Make sure `SpacedRepetition.ts` has been updated with the new interface:

```typescript
export interface WordProgress {
  wordId: string;
  exposureCount: number;  // NOT totalAttempts
  audioPlayCount: number;
  lastSeenAt: number;     // NOT lastReviewedAt
  introducedAt: number;
}
```

### Words not advancing

Check that `advanceToNextWord` is being called in the LessonScreen component.

### Audio not playing

Verify `expo-speech` is installed and TextToSpeech.ts is imported correctly.

## Step 7: Reset Progress (Optional)

If you want to clear old progress data that used the old tracking system:

1. Open parent mode (long-press on title)
2. Go to Settings
3. Tap "Reset Progress"

Or manually in code:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.removeItem('@reading_app:word_progress');
```

## Step 8: Add Real Images (Optional)

Replace emoji placeholders with actual PNG images:

1. Add images to `assets/images/` folders (see IMAGE_SETUP.md)
2. Update `WordCard.tsx` to use Image component instead of emoji
3. Map image paths to `require()` statements

## Roll Back (If Needed)

```bash
# Restore original files
mv src/screens/HomeScreen.old.tsx src/screens/HomeScreen.tsx
mv src/screens/LessonScreen.old.tsx src/screens/LessonScreen.tsx
mv src/state/useAppState.old.ts src/state/useAppState.ts
mv src/navigation/AppNavigator.old.tsx src/navigation/AppNavigator.tsx
```

## Success Criteria

✅ App launches without errors  
✅ Tap-to-hear works on any part of screen  
✅ Words auto-advance after audio  
✅ No "Got it / Try again" buttons visible  
✅ Emoji placeholders display  
✅ Parent mode accessible via long-press  
✅ Stars fill on home screen as progress is made  

## Next Steps

Once migration is successful:

1. Add real PNG images (see IMAGE_SETUP.md)
2. Test with a child - observe and iterate
3. Implement SettingsScreen parent controls
4. Add category selection
5. Add child profiles (optional)
6. Prepare for App Store submission
