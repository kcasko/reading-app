# Copilot instructions — Reading App (MVP)

Purpose
- Give agents an immediate, practical map of this app so generated edits are minimal, correct, and aligned with project constraints.

Big picture
- Expo + React Native sight-word learning app with a single flow: `HomeScreen` -> `LessonScreen` -> `RewardScreen`.
- `app/game/WordEngine.js` produces lessons: { word, correctImage, wrongImages } using `app/data/words.json`.
- `app/audio/AudioPlayer.js` encapsulates Expo AV audio playback; audio files live in `app/assets/sounds`.
- `app/game/ProgressTracker.js` persists progress via `AsyncStorage`.

Key files to inspect
- App entry: [App.js](App.js)
- Screens: [app/screens/HomeScreen.jsx](app/screens/HomeScreen.jsx), [app/screens/LessonScreen.jsx](app/screens/LessonScreen.jsx), [app/screens/RewardScreen.jsx](app/screens/RewardScreen.jsx)
- Components: [app/components/WordCard.jsx](app/components/WordCard.jsx), [app/components/ImageOption.jsx](app/components/ImageOption.jsx)
- Logic: [app/game/WordEngine.js](app/game/WordEngine.js), [app/game/ProgressTracker.js](app/game/ProgressTracker.js)
- Audio: [app/audio/AudioPlayer.js](app/audio/AudioPlayer.js)
- Data & assets: [app/data/words.json](app/data/words.json), [app/assets](app/assets)

Project conventions (required)
- Functional components only; use hooks (`useState`, `useEffect`).
- Keep UI large, simple, and child-friendly (big fonts, large touch targets).
- Use relative import paths exactly as the tree shows; do not add or move top-level folders.
- Persist only to `AsyncStorage`; do not add external backends.
- Use `AudioPlayer` for all playback; do not call Expo AV directly elsewhere.
- Random helpers live in `app/utils/random.js` — use `shuffle` / `pickRandom` from there.

Concrete patterns & examples
- Lesson consumption (LessonScreen):

```js
const { word, correctImage, wrongImages } = WordEngine.nextLesson();
// render: <WordCard word={word} /> and three <ImageOption /> components
```

- Audio: call `AudioPlayer.play(word)`; audio file should exist at `app/assets/sounds/${word}.mp3` (follow existing filenames).
- On image tap: `ImageOption` should show immediate visual feedback, call `ProgressTracker` to save result, and—on correct—navigate to `RewardScreen`.

Developer workflow & quick commands
- Install & run (Expo dev server):

```powershell
npm install
npx expo start
```

- Validate flow manually: Home → Lesson (choose correct image) → Reward.

Editing rules for agents
- If a file has a placeholder comment instructing Copilot to implement behavior, replace it with concise, well-commented code that fits project conventions.
- Limit changes to files relevant to the task; avoid broad refactors.
- Preserve `AsyncStorage` key names and asset naming conventions; check `app/game/ProgressTracker.js` and `app/data/words.json` before renaming keys or files.

Integration notes / gotchas
- `words.json` is the single source of truth for words — do not duplicate word lists elsewhere.
- Asset filenames (images and sounds) must match the word keys used by `WordEngine` and `AudioPlayer`.
- If unsure about a storage key or asset name, inspect `app/game/ProgressTracker.js` and `app/audio/AudioPlayer.js`.

If you add features
- Prefer local state + `AsyncStorage`. If adding a dependency, update `package.json` and note why the dependency is necessary.
- Add a 2–4 line usage example at the top of new modules.

When in doubt
- Run the app and test the flow. Ask for clarification when structural changes are proposed.

Feedback
- Tell me any missing specifics (exact AsyncStorage keys, asset filename patterns, or desired UX microcopy) and I'll update these instructions.
