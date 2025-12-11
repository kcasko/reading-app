Reading App Development Guide

Practical workflow for building and maintaining the MVP

This document is for you, the developer.
It explains how to work efficiently inside the project, how to use Copilot properly, how screens talk to each other, and how to avoid breaking the app.

This is not for Copilot.
Copilot’s rules are in copilot-instructions.md.

1. PROJECT PHILOSOPHY

The Reading App is designed to be:

Simple
Predictable
Modular
Easy to expand later

Every part of the system is intentionally tiny. Each screen, component, and logic module should be readable in under a minute. No clever patterns. No over-architecture.

Your job is to keep it simple.
Copilot’s job is to fill in the boring stuff.

2. HOW TO WORK WITH COPILOT

Copilot behaves best when you:

Write clear placeholder comments
Define what you want in plain language
Work inside the proper file
Make small edits instead of giant multi-file changes

Examples Copilot loves:

// Create a simple screen with a centered button labeled Start.
// On press, navigate to LessonScreen.

// Implement function getLessonData(level).
// Return word, correctImage, and two wrongImages.
// Use words.json and random.js helpers.


It will generate exactly what you're describing.

Bad examples:

// make it good

// fix stuff


Copilot will hallucinate architecture changes.

3. STARTING THE APP DURING DEVELOPMENT

Use Expo’s local server:

npx expo start


Then scan the QR code with your phone.
Your app updates instantly each time you save a file.

If changes don’t show up:

Shake phone → Reload
Or press "r" in the terminal.

4. DAY-TO-DAY WORKFLOW

Here’s the flow you’ll follow every day you work on this project.

Step 1: Pick a feature (example: audio playback).
Step 2: Open the correct file (example: /app/audio/AudioPlayer.js).
Step 3: Write clear placeholder comments describing the behavior.
Step 4: Let Copilot generate the code.
Step 5: Test it immediately using Expo.
Step 6: Fix logic using Copilot or manually.
Step 7: Commit clean changes.

Never trust Copilot without testing in Expo.

5. FILES YOU TOUCH MOST OFTEN

Screens
app/screens/*

Lesson logic
app/game/WordEngine.js

Audio
app/audio/AudioPlayer.js

Progress tracking
app/game/ProgressTracker.js

Word data
app/data/words.json

UI components
app/components/*

Theme
app/styles/theme.js

Navigation
App.js

6. ADDING WORDS (THE RIGHT WAY)

If you expand the word list, ALWAYS:

Add the word to words.json

Add an image: app/assets/images/<word>.png

Add an audio file: app/assets/sounds/<word>.mp3

Example:
Adding “fish” means:

words.json → "fish"
app/assets/images/fish.png
app/assets/sounds/fish.mp3

If you miss one, the app will crash.

7. HOW THE APP ACTUALLY FLOWS

Here is the full logic:

HomeScreen
User taps Start
↓
LessonScreen
Loads new lesson via WordEngine
Displays word
Shows image options
Plays audio
User taps image
If correct → update progress → navigate to RewardScreen
If wrong → show feedback
↓
RewardScreen
Show celebration
User can go Home or Continue
↓
Continue
Loads next lesson

8. DEBUGGING COMMON ISSUES

Issue: Red screen “module not found”
Cause: Wrong asset filename or wrong import path.
Fix: Check that word names match image/sound names exactly.

Issue: Audio won’t play
Cause: Wrong path in require.
Fix: Must match this pattern:

require(`../assets/sounds/${word}.mp3`)


Issue: Navigation not working
Cause: Screen name mismatch.
Fix: Check App.js navigator.

Issue: Wrong image displayed
Cause: WordEngine returned incorrect wrongImages.
Fix: Test WordEngine output manually with console.log.

9. HOW TO EXPAND THE APP LATER

Future features can slot into the existing structure without breaking anything:

More lessons → update words.json and assets
User profiles → expand ProgressTracker
Minigames → add screens under app/screens
Animations → Lottie or Reanimated
Settings screen → add to navigator
Multilingual audio → expand AudioPlayer logic

The structure is intentionally simple so expansion is painless.

10. HOW TO KEEP THE CODE CLEAN

Always:

Use small components
Add comments above new functions
Keep imports tidy
Use theme.js for colors and spacing
Push all random logic into random.js
Push all lesson logic into WordEngine.js
Push all persistence into ProgressTracker.js

Never:

Hardcode file paths outside WordEngine or AudioPlayer
Add new folders without updating instructions
Introduce backend services without a plan

11. GIT WORKFLOW

Basic flow:

git add .
git commit -m "Add LessonScreen layout"
git push


Recommended branching:

main
feature/lesson-layout
feature/audio
feature/progress


Keep commits small.
Commit only working code.

12. HOW TO ASK COPILOT FOR HELP

Examples that will give you good results:

“Add correct/incorrect visual feedback to ImageOption.jsx”
“Refactor WordEngine.js to support 4 choices instead of 3”
“Add a function in ProgressTracker.js to reset all progress”
“Create a simple animation in RewardScreen using Lottie”

Examples that will cause chaos:

“Make the app better”
“Fix navigation” without context
“Rewrite the project”

Be specific.

13. WHEN YOU'RE READY TO BUILD AN APK

Later, when the MVP is stable:

npx expo prebuild
npx expo build:android


But that’s for way down the road.

14. FINAL ADVICE

This project succeeds if:

You stay consistent
You follow the structure
You test everything in Expo
You keep Copilot on a tight leash

You’re building a mobile app exactly like a real developer would.
And you’re doing it cleanly.