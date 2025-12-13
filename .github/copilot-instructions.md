# Reading App Copilot Instructions

Project name: Science of Reading sight word app  
Stack: Expo, React Native, Expo Router  
Goal: Build a decoding-first reading app that follows Science of Reading. No flashcard guessing.
# Reading App — Copilot Instructions (condensed)

Purpose: quick reference so AI coding agents can be immediately productive in this Expo + React Native app.

## Architecture (big picture)
- Routes: app/ (Expo Router). Lesson screens: [app/lesson/[word].jsx].
- Data: canonical word list is [data/words.json]; runtime state persists via AsyncStorage through [app/engine/WordEngine.js].
- Engine: SRS logic in [app/engine/SRS.js]; WordEngine exposes `loadWords`, `getWordByValue`, `getDueWords`, `updateWord`.
- UI: grapheme-focused UI in [app/components/WordCard.jsx], [app/components/GraphemeButton.jsx], [app/components/ImageReward.jsx].
- Audio: centralized player at [app/audio/AudioPlayer.js] using `expo-av`; static maps in [app/assets/soundAssets.js] and [app/assets/imageAssets.js].

## Key developer workflows
- Run locally: `npm start` (runs `expo start`). Platform shortcuts: `npm run android` / `npm run ios` / `npm run web`.
- Lint: `npm run lint`.
- Reset local app data: `npm run reset-project` (runs `scripts/reset-project.js`).

## Project-specific conventions (must follow)
- Decoding-first: UI must render grapheme buttons during decision moment (no images until feedback).
- Assets: Use static asset maps in `app/assets/*Assets.js`. Never use dynamic `require()` or template paths; keys must be explicit (e.g. `phoneme_ai`, `said`).
- SRS flow: Use helpers from `app/engine/SRS.js` which return a new word object (do not mutate in-place). Persist by calling `updateWord(updatedObj)` from `app/engine/WordEngine.js`.
- Audio: Play phoneme or word audio via `AudioPlayer.play(key)`. Lesson code falls back to `word` audio when a `phoneme_<grapheme>` key is missing.

## Integration & runtime notes
- AsyncStorage: `WordEngine` persists to `@readingApp:words` (see `WORDS_KEY`). If AsyncStorage is empty, code falls back to `data/words.json`.
- Optional runtime deps: `expo-speech` is loaded with `require('expo-speech')` at runtime in [app/lesson/[word].jsx] to avoid top-level import errors.
- Audio assets: `soundAssets` maps both word keys and `phoneme_...` keys to static files—match those keys when adding audio.

## Concrete examples (copyable)
- Apply SRS then persist:
  const updated = updateSRSOnCorrect(wordObj);
  await updateWord(updated);
- Play a phoneme (lesson):
  const key = `phoneme_${grapheme}`; await AudioPlayer.play(key);

## Files to inspect for patterns
- [app/engine/SRS.js] — SRS helper shapes and intervals.
- [app/engine/WordEngine.js] — AsyncStorage usage and update pattern.
- [app/lesson/[word].jsx] — canonical lesson flow, audio/speech usage, and SRS calls.
- [app/assets/soundAssets.js], [app/assets/imageAssets.js] — required static maps.

## When editing or adding features
- Preserve static asset maps; add new keys to both the map and any UI that references them.
- Keep decision moment text-only—images only in feedback.
- Prefer pure functions in engine helpers; follow existing signature patterns (see SRS and WordEngine exports).

If anything here is unclear or you'd like examples added (component props, tests, or more file links), tell me which parts to expand.
engine/  
