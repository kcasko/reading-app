/**
 * LessonScreen - The learning experience.
 * 
 * CORE PRINCIPLES (NO VIOLATIONS):
 * - One word at a time
 * - Tap ANYWHERE to hear the word
 * - No buttons. No input. No failure screens.
 * - Auto-advance after brief pause
 * - Track exposure count automatically
 * - Image fades over time based on exposures
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { WordCard } from '../components/WordCard';
import { speakWord } from '../audio/TextToSpeech';
import { getImageOpacity, shouldShowImage } from '../engine/SpacedRepetition';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Word } from '../data/wordLists';
import type { WordProgress } from '../engine/SpacedRepetition';
import type { AppSettings } from '../state/progressStore';

type LessonScreenProps = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

interface LessonScreenComponentProps extends LessonScreenProps {
  currentWord: Word | null;
  currentWordProgress: WordProgress | null;
  onWordExposed: () => void; // Called when word is shown
  onAudioPlayed: () => void; // Called when audio is played
  onAdvance: () => void; // Called to move to next word
  wordsInSession: number;
  settings: AppSettings; // For audio settings like voice type
  newlyMasteredWord: { id: string; text: string; emoji: string } | null;
  onClearMastery: () => void;
}

export function LessonScreen({
  navigation,
  currentWord,
  currentWordProgress,
  onWordExposed,
  onAudioPlayed,
  onAdvance,
  wordsInSession,
  settings,
  newlyMasteredWord,
  onClearMastery,
}: LessonScreenComponentProps) {
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [isFirstAppearance, setIsFirstAppearance] = useState(true);
  
  // Navigate to mastery screen when word is mastered
  useEffect(() => {
    if (newlyMasteredWord) {
      navigation.navigate('Mastery', {
        wordText: newlyMasteredWord.text,
        emoji: newlyMasteredWord.emoji,
      });
      onClearMastery();
    }
  }, [newlyMasteredWord, navigation, onClearMastery]);
  
  // Mark word as exposed when it appears
  useEffect(() => {
    if (currentWord) {
      setHasPlayedAudio(false);
      setIsFirstAppearance(true);
      onWordExposed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord?.id, onWordExposed]);
  
  // Auto-advance after audio plays (gentle delay)
  useEffect(() => {
    if (hasPlayedAudio && !isFirstAppearance) {
      const timer = setTimeout(() => {
        onAdvance();
      }, 2000); // 2 second pause after audio before advancing
      
      return () => clearTimeout(timer);
    }
  }, [hasPlayedAudio, isFirstAppearance, onAdvance]);
  
  const handleScreenTap = useCallback(async () => {
    if (!currentWord) return;
    
    // Play audio with voice settings
    try {
      await speakWord(currentWord.text, {
        rate: settings.audioRate,
        voice: settings.voiceType,
      });
      onAudioPlayed();
      setHasPlayedAudio(true);
      
      // After first tap, mark that child has interacted
      if (isFirstAppearance) {
        setIsFirstAppearance(false);
      }
    } catch (error) {
      console.error('Failed to speak word:', error);
    }
  }, [currentWord, isFirstAppearance, onAudioPlayed, settings.audioRate, settings.voiceType]);
  
  // No word available - session ended
  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable 
          style={styles.fullScreen}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.center}>
            <Text style={styles.doneEmoji}>⭐</Text>
            <Text style={styles.doneText}>Great!</Text>
          </View>
        </Pressable>
      </SafeAreaView>
    );
  }
  
  // Calculate image opacity and visibility based on exposure count
  const exposureCount = currentWordProgress?.exposureCount ?? 0;
  const imageOpacity = getImageOpacity(exposureCount);
  const showImage = shouldShowImage(exposureCount);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Entire screen is tappable - no visible buttons */}
      <Pressable 
        style={styles.fullScreen}
        onPress={handleScreenTap}
        accessibilityLabel={`Tap to hear the word ${currentWord.text}`}
        accessibilityRole="button"
      >
        <View style={styles.content}>
          {/* Simple progress indicator - fills slowly, calm */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(wordsInSession / 20) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          {/* Word and image */}
          <View style={styles.wordContainer}>
            <WordCard
              word={currentWord.text}
              imagePath={currentWord.imagePath}
              imageOpacity={imageOpacity}
              showImage={showImage}
              fontFamily={settings.fontFamily}
            />
          </View>
          
          {/* Hidden visual hint (fades in only if child doesn't tap) */}
          {isFirstAppearance && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>👆</Text>
            </View>
          )}
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fullScreen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  progressContainer: {
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  hintContainer: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 48,
    opacity: 0.3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  doneText: {
    ...typography.heading,
    fontSize: 36,
    color: colors.textPrimary,
  },
});
