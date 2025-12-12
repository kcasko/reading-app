import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import soundAssets from '../assets/soundAssets';
import AudioPlayer from '../audio/AudioPlayer';
import ImageReward from '../components/ImageReward';
import WordCard from '../components/WordCard';
import { updateSRSOnCorrect, updateSRSOnWrong } from '../engine/SRS';
import { getWordByValue, updateWord } from '../engine/WordEngine';
import theme from '../styles/theme';
import { shuffle } from '../utils/random';

export default function LessonByWord() {
  const params = useLocalSearchParams();
  const wordParam = params.word;
  const [wordObj, setWordObj] = useState(null);
  const [choices, setChoices] = useState([]);
  const [locked, setLocked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [mode, setMode] = useState('decoding'); // 'decoding' | 'feedback'
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!wordParam) return;
    const w = getWordByValue(wordParam);
    setWordObj(w);
    if (w) {
      const opts = shuffle([w.word, ...(Array.isArray(w.similarWords) ? w.similarWords : [])]);
      setChoices(opts);
    }
  }, [wordParam]);

  function handleGraphemePress(grapheme, index) {
    // Try to play phoneme audio key: phoneme_<grapheme> else fallback to word audio
    const phonemeKey = `phoneme_${grapheme}`;
    if (soundAssets[phonemeKey]) {
      AudioPlayer.play(phonemeKey).catch(() => {});
    } else if (wordObj) {
      AudioPlayer.play(wordObj.word).catch(() => {});
    }
  }

  async function handleChoicePress(index, choice) {
    if (locked || !wordObj) return;
    setLocked(true);
    setSelectedIndex(index);

    if (choice === wordObj.word) {
      // correct
      setMode('feedback');
      try {
        const updated = updateSRSOnCorrect(wordObj);
        await updateWord(updated);
        setWordObj(updated);
      } catch (e) {
        console.warn('SRS update error', e);
      }

      // play whole word audio then reveal image
      await AudioPlayer.play(wordObj.word).catch(() => {});
      setTimeout(() => setShowImage(true), 250);
      setTimeout(() => setLocked(false), 800);
    } else {
      // incorrect
      try {
        const updated = updateSRSOnWrong(wordObj);
        await updateWord(updated);
        setWordObj(updated);
      } catch (e) {
        console.warn('SRS update error', e);
      }

      // speak corrective template
      const msg = `This word is ${wordObj.word}. You tapped ${choice}. Try again.`;
      try {
        // require at runtime in case expo-speech is not installed in all environments
        // avoids top-level import resolution errors
         
        const SpeechRuntime = require('expo-speech');
        if (SpeechRuntime && SpeechRuntime.speak) SpeechRuntime.speak(msg);
      } catch (e) {
        // fallback: no speech available
        console.warn('expo-speech not available:', e);
      }
      // also play the correct word audio to reinforce
      AudioPlayer.play(wordObj.word).catch(() => {});

      setTimeout(() => {
        setSelectedIndex(null);
        setLocked(false);
      }, 900);
    }
  }

  if (!wordObj) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading word...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WordCard wordObj={wordObj} onGraphemePress={handleGraphemePress} />

      <View style={styles.choicesContainer}>
        {choices.map((c, idx) => {
          const isSelected = idx === selectedIndex;
          const borderColor = isSelected ? (c === wordObj.word ? theme.colors.success : theme.colors.error) : '#ddd';
          return (
            <TouchableOpacity
              key={`${c}-${idx}`}
              style={[styles.choiceButton, { borderColor }]}
              onPress={() => handleChoicePress(idx, c)}
              disabled={locked || mode === 'feedback'}
            >
              <Text style={styles.choiceText}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {mode === 'feedback' && showImage ? <ImageReward imageKey={wordObj.word} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  loading: {
    fontSize: 18,
    color: theme.colors.muted,
  },
  choicesContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  choiceButton: {
    width: '90%',
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    marginVertical: theme.spacing.sm,
  },
  choiceText: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
