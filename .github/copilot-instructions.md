# Reading App Copilot Instructions

Project name: Science of Reading sight word app  
Stack: Expo, React Native, Expo Router  
Goal: Build a decoding-first reading app that follows Science of Reading. No flashcard guessing.

## Core Teaching Rules

Rule 1: The app is decoding-first.  
Children must interact with letters and graphemes, not just pick pictures.

Rule 2: During the decision moment, only show text.  
The word is shown large and centered with no image.  
Images are only revealed after the correct answer.

Rule 3: Every word uses orthographic mapping.  
Words are broken into graphemes and phonemes.  
Tricky graphemes are highlighted.

Rule 4: Use look alike words as distractors.  
Wrong answers must be visually similar to the target word, not random words.

Rule 5: Use spaced repetition.  
Each word has an SRS level and next review date.  
Intervals follow a simplified SM 2 pattern.

## Platform and Structure

The app must use:

Expo with React Native  
Expo Router for navigation  
Static imports for images and sounds  
No dynamic require  
No template string paths for assets

Target structure:

app/  
  _layout.jsx  
  index.jsx  
  lesson/  
    [word].jsx

assets/  
  images/  
  audio/  

data/  
  words.json  

engine/  
  WordEngine.js  
  SRS.js  

components/  
  GraphemeButton.jsx  
  WordCard.jsx  
  ImageReward.jsx  

utils/  
  graphemeHelpers.js  
  dateUtils.js  

You must keep file names and folders consistent when generating new files.

## Word Data Model

Every word must have this shape:

{
  "word": "said",
  "graphemes": ["s", "ai", "d"],
  "phonemes": ["s", "eh", "d"],
  "tricky": ["ai"],
  "similarWords": ["sad", "paid", "sid"],
  "srsLevel": 1,
  "lastReviewed": null,
  "nextReview": null
}

Rules for this data:

word is the full word in lowercase  
graphemes is an ordered array of letter chunks  
phonemes is an ordered array of sound labels, same length as graphemes  
tricky contains graphemes that do not follow simple rules  
similarWords is a list of look alike words to use as distractors  
srsLevel is an integer from 1 to 4  
lastReviewed and nextReview are ISO date strings or null

You must always follow this shape when adding or editing words.

## Spaced Repetition Rules

Use a simple level based SRS system.

Level 1: review after 1 day  
Level 2: review after 7 days  
Level 3: review after 16 days  
Level 4: review after 35 days

A correct answer:

If level is less than 4, increase level by 1.  
Set nextReview to today plus the interval for the new level.  
Update lastReviewed to today.

A wrong answer:

Set level to 1.  
Set nextReview to today plus 1 day.  
Update lastReviewed to today.

Implement these helpers in engine/SRS.js:

getNextReviewDate(level, todayString)  
updateSRSOnCorrect(wordObj, todayString)  
updateSRSOnWrong(wordObj, todayString)

## Lesson Flow Rules

The main lesson screen must follow this flow:

State 1: decoding mode  
Show the target word as big text only.  
Break the word into graphemes and render each as a tappable GraphemeButton.  
When a grapheme is tapped, play its phoneme audio.  
If the grapheme is in word.tricky, render it with a special highlight.

Show multiple choice options that include the target word and distractors from similarWords.  
User selects one of the words.

State 2: feedback mode

If the user picked the correct word:

Play a success sound.  
Play the whole word audio.  
Reveal the matching image using ImageReward.  
Update the SRS data for that word as a correct answer.  

If the user picked a wrong word:

Play corrective audio with this structure:  
"This word is {correctWord}. You tapped {selectedWord}. Try again."  
Show a simple visual error state.  
Update SRS as a wrong answer.

Images must only appear in feedback mode, never during decoding mode.

## Components to Implement

GraphemeButton.jsx

Renders a single grapheme.  
Props: text, isTricky, onPress.  
Tappable.  
Calls onPress when tapped.  
If isTricky is true, render with a distinct style that clearly marks it as special.

WordCard.jsx

Renders a full word as a row of GraphemeButton components.  
Props: wordObj, onGraphemePress(grapheme, index).  
Uses wordObj.graphemes and wordObj.tricky.  
Keeps layout clean and readable.

ImageReward.jsx

Props: imageKey.  
Uses imageAssets map to display the right image.  
Used only after a correct response.

LessonScreen component

Should:

Read a word object from words.json or from a WordEngine helper.  
Render the word in decoding mode.  
Allow grapheme tapping.  
Render multiple choice options using target word plus similarWords.  
Handle answer selection.  
Switch to feedback mode after an answer.  
Call SRS helpers to update that word.  
Trigger ImageReward only on correct answers.

## Asset Rules

Create static maps for assets.

imageAssets.js:

export const imageAssets = {
  dog: require("../assets/images/dog.png"),
  cat: require("../assets/images/cat.png")
};

soundAssets.js:

export const soundAssets = {
  "phoneme_s": require("../assets/audio/phonemes/s.mp3"),
  "phoneme_ai": require("../assets/audio/phonemes/ai.mp3"),
  "word_said": require("../assets/audio/words/said.mp3")
};

Never use dynamic require.  
Never build asset paths with template strings.  
Always add keys to these maps when using new assets.

## Word Engine

Create engine/WordEngine.js with helpers to:

Load words.json.  
Return a list of words due for review today or earlier.  
Return a single word by id or value.  
Update a word in memory after SRS changes and persist back if needed.

## General Copilot Rules

Always respect this file when generating code.  
Always keep the Science of Reading decoding first flow.  
Always keep images out of the decision moment.  
Always use the word data model as defined.  
Always apply SRS updates on every answer.  
Use React functional components and hooks.  
Keep UI clean and text focused.
