Copilot Instructions for Reading App (MVP)
Purpose

Provide Copilot with a clear, authoritative map of the project.
All generated code must remain consistent with the project structure, naming rules, navigation flow, asset conventions, and Expo + React Native environment.

These instructions override Copilot’s default behavior.
Agents must not guess or redesign architecture.

1. Big Picture Overview

The Reading App is an early-reader learning tool built with React Native + Expo.

Core navigation flow:
HomeScreen → LessonScreen → RewardScreen

Logic responsibilities:

WordEngine.js generates lesson payloads:
{ word, correctImage, wrongImages }

AudioPlayer.js plays audio via Expo AV.

ProgressTracker.js stores progress in AsyncStorage.

UI must be child-friendly: large text, big tap targets, simple layouts.

No external backend. No advanced animations unless requested.

2. Required Project Structure

Agents must follow this exact tree:

reading-app
├── App.js
├── package.json
├── README.md
│
├── app
│   ├── screens
│   │   ├── HomeScreen.jsx
│   │   ├── LessonScreen.jsx
│   │   └── RewardScreen.jsx
│   │
│   ├── components
│   │   ├── WordCard.jsx
│   │   └── ImageOption.jsx
│   │
│   ├── game
│   │   ├── WordEngine.js
│   │   └── ProgressTracker.js
│   │
│   ├── audio
│   │   └── AudioPlayer.js
│   │
│   ├── data
│   │   └── words.json
│   │
│   ├── utils
│   │   └── random.js
│   │
│   ├── styles
│   │   └── theme.js
│   │
│   └── assets
│       ├── images
│       └── sounds


Do not alter this hierarchy unless explicitly instructed.

3. Navigation Rules (App.js)

Use React Navigation Native Stack.

App.js must:

Import screens from app/screens

Create a NavigationContainer

Register:

"Home" → HomeScreen

"Lesson" → LessonScreen

"Reward" → RewardScreen

Export the App component

Screen names must remain consistent.

4. Screen Requirements
HomeScreen.jsx

Purpose: Entry point of the app.

Requirements:

Large centered “Start” button

Simple child-friendly layout

On press: navigation.navigate("Lesson")

LessonScreen.jsx

Purpose: Present a single lesson.

Requirements:

Retrieve lesson via:
const { word, correctImage, wrongImages } = WordEngine.nextLesson()

Show WordCard for the word

Show 3 ImageOption components
(1 correct, 2 wrong)

Must:

Show feedback on taps

Play audio for the word

On correct: update ProgressTracker → navigate to RewardScreen

RewardScreen.jsx

Purpose: Positive feedback + next step.

Requirements:

Simple celebration UI

“Continue” → new lesson

“Home” → HomeScreen

5. Components
WordCard.jsx

Displays the word using large, readable text.

Accepts word prop.

ImageOption.jsx

Tappable image button.

Props:
source, isCorrect, onPress

Must visually show correct/incorrect feedback.

6. Game Logic
WordEngine.js

Rules:

Use words.json as the only word source.

For each lesson:

Select a correct word

Select 2 incorrect random words

Map each word to image assets

Returned object:

{
  word,
  correctImage: require("app/assets/images/<word>.png"),
  wrongImages: [
    require("app/assets/images/<other1>.png"),
    require("app/assets/images/<other2>.png")
  ]
}


Hardcoded word lists are not allowed.

7. Progress Tracking
ProgressTracker.js

Use AsyncStorage with these fixed keys:

@readingApp:progress
@readingApp:lessonsCompleted
@readingApp:accuracy
@readingApp:streak


Expose functions:

saveProgress(data)
loadProgress()
incrementStreak()
resetStreak()


Do not rename keys unless requested.

8. Audio System
AudioPlayer.js

Must use Expo AV.

Audio file naming:

app/assets/sounds/<word>.mp3


Implementation pattern:

async function play(word) {
  const sound = new Audio.Sound();
  await sound.loadAsync(require(`../assets/sounds/${word}.mp3`));
  await sound.playAsync();
}


Agents must follow this pattern exactly.

9. Asset Conventions (Critical)

Images must follow:

app/assets/images/<word>.png


Audio must follow:

app/assets/sounds/<word>.mp3


Examples:

cat.png / cat.mp3
dog.png / dog.mp3
sun.png / sun.mp3


Names must match words.json entries exactly:

lowercase

no spaces

no special characters

10. Data Source (words.json)

words.json is the single source of truth.

Format:

[
  "cat",
  "dog",
  "sun",
  "ball",
  "tree"
]


Do not redefine the word list in any other file.

11. Helpers
random.js

Must include:

shuffle(array)
pickRandom(array, count)


Used exclusively by WordEngine.

12. Theme (theme.js)

Must export:

colors: { primary, secondary, background, text }
fonts:  { regular, bold }
spacing: { sm, md, lg }


All UI should use the shared theme.

13. Developer Commands

Install dependencies:

npm install
npx expo start


Install required libraries:

npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-av
npx expo install @react-native-async-storage/async-storage


Run app:

npx expo start

14. Editing Rules for Copilot Agents

Agents must follow these rules:

Replace placeholder comments with minimal, well-commented code.

Never alter top-level folders.

Change only files relevant to the current request.

Avoid architectural changes unless explicitly requested.

Keep logic simple and beginner-friendly.

Prefer small, readable functions.

Ask for clarification when behavior is unclear.

15. Integration Notes / Gotchas

Asset filenames must match word names exactly.

WordEngine and AudioPlayer depend on identical naming.

ProgressTracker key names must not change.

React Navigation screen names must match App.js.

All code must run under Expo (not bare RN).

16. When In Doubt

Run:

npx expo start


Verify:
Home → Lesson → Reward

If something appears inconsistent with these instructions, ask for clarification and include the relevant file path.