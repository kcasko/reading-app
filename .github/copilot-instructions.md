Copilot Instructions for Reading App (MVP)
Purpose

Provide Copilot with a complete map of the project. Ensure all generated code is consistent, minimal, correct, and compatible with Expo + React Native. Agents must follow the folder structure, naming rules, navigation flow, and asset conventions exactly.

Big Picture Overview

The Reading App is a simple React Native + Expo mobile learning tool for early readers.

Core flow:
HomeScreen → LessonScreen → RewardScreen

Lesson generation is handled by WordEngine.js, which produces lesson payloads:

{
  word: "cat",
  correctImage: require(...),
  wrongImages: [require(...), require(...)]
}


Audio playback is handled by AudioPlayer.js using Expo AV.
Progress is tracked with AsyncStorage inside ProgressTracker.js.

All UI must be child-friendly: large fonts, big tap targets, simple layouts.

Project Structure (Required)
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


Agents must not modify this structure unless explicitly told to.

Navigation Rules

Navigation uses React Navigation’s native stack.

App.js must:

Import the screens from app/screens.

Initialize a Stack.Navigator.

Register HomeScreen, LessonScreen, and RewardScreen.

Export the default App component.

Screens
HomeScreen.jsx

Purpose:
Display app title/logo and a Start button.
Start button navigates to LessonScreen.

Requirements:

Large centered button

Simple kid-friendly layout

Navigation: navigation.navigate("Lesson")

LessonScreen.jsx

Purpose:
Display the word, play audio, show 3 image options (correct + 2 incorrect).

Requirements:

Word displayed via WordCard

Image options displayed via 3 ImageOption components

On correct tap:

visual feedback

update ProgressTracker

navigate to RewardScreen

On incorrect tap: shake or color feedback

Lesson data comes from:

const { word, correctImage, wrongImages } = WordEngine.nextLesson();

RewardScreen.jsx

Purpose:
Show simple celebration and allow user to continue or return home.

Requirements:

Big “Great job!” icon or animation

Button: Continue → new LessonScreen

Button: Home → HomeScreen

Components
WordCard.jsx

Requirements:

Displays the current sight word in a large, readable font.

Takes prop: word.

ImageOption.jsx

Requirements:

Tappable image

Props: source, isCorrect, onPress

Must show correct/incorrect feedback (eg. green/red border or overlay)

Game Logic
WordEngine.js

Requirements:

Source words from app/data/words.json

For each lesson:

pick one word as the correct option

select 2 random incorrect words

map words → asset paths

Return:

{
  word,
  correctImage: require("app/assets/images/<word>.png"),
  wrongImages: [
    require("app/assets/images/<wrong1>.png"),
    require("app/assets/images/<wrong2>.png")
  ]
}


WordEngine must rely only on words.json. No hardcoded word lists.

Progress Tracking
ProgressTracker.js

Use AsyncStorage.
Required keys:

@readingApp:progress
@readingApp:lessonsCompleted
@readingApp:accuracy
@readingApp:streak


Must expose:

saveProgress(data)
loadProgress()
incrementStreak()
resetStreak()


Agents must not rename these keys unless explicitly instructed.

Audio System
AudioPlayer.js

Must use Expo AV.

Filename rule:

app/assets/sounds/<word>.mp3


Function signature:

async function play(word) {
  const sound = new Audio.Sound();
  await sound.loadAsync(require(`../assets/sounds/${word}.mp3`));
  await sound.playAsync();
}


Agents must follow this exact filename pattern.

Assets Conventions (Critical)

Image filenames must match:

app/assets/images/<word>.png


Audio filenames must match:

app/assets/sounds/<word>.mp3


Examples:

cat.png / cat.mp3
dog.png / dog.mp3
sun.png / sun.mp3


No uppercase. No special characters. Names must match entries in words.json exactly.

Data Source
words.json

Single source of truth for available words.

Format:

[
  "cat",
  "dog",
  "sun",
  "ball",
  "tree"
]


Agents must not duplicate or hardcode word lists in other files.

Random Helpers
random.js

Must include:

shuffle(array)
pickRandom(array, count)


These are used by WordEngine to randomize incorrect options.

Theme
theme.js

Must expose:

colors: { primary, secondary, background, text }
fonts: { regular, bold }
spacing: { sm, md, lg }


Agents must follow this theme for all UI unless instructed otherwise.

Developer Commands

Install project dependencies:

npm install
npx expo start


Install required libraries:

npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-av
npx expo install @react-native-async-storage/async-storage

Editing Rules for Copilot Agents

Replace placeholder comments with complete, minimal, well-commented code.

Do not create new top-level folders.

Only change files directly related to the requested modification.

Never restructure navigation or folder layout unless told to.

Keep all logic simple and beginner-friendly.

Prefer small functions, readable code, and inline comments.

When unsure, ask for clarification instead of inventing architecture.

Integration Notes / Gotchas

Asset filenames must match word names exactly.

WordEngine and AudioPlayer depend on identical naming.

ProgressTracker key names must remain stable.

Navigation names must match file imports exactly.

All code must work in Expo, not bare React Native.

When In Doubt

Run:

npx expo start


Verify the flow:
Home → Lesson → Reward

If something doesn’t match these instructions, request clarification and include file paths.