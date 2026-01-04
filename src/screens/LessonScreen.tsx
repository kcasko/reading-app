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

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  onNoImageSuccess: () => void; // Called when word recognized without image/audio
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
  onNoImageSuccess,
  onAdvance,
  wordsInSession,
  settings,
  newlyMasteredWord,
  onClearMastery,
}: LessonScreenComponentProps) {
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [imageVisible, setImageVisible] = useState(true);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onAdvanceRef = useRef(onAdvance);
  const onWordExposedRef = useRef(onWordExposed);
  const onNoImageSuccessRef = useRef(onNoImageSuccess);
  const currentWordIdRef = useRef<string | null>(null);
  
  // Keep refs up to date
  useEffect(() => {
    onAdvanceRef.current = onAdvance;
    onWordExposedRef.current = onWordExposed;
    onNoImageSuccessRef.current = onNoImageSuccess;
  }, [onAdvance, onWordExposed, onNoImageSuccess]);
  
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
  
  // Mark word as exposed when it appears (and reset state)
  useEffect(() => {
    if (currentWord && currentWord.id !== currentWordIdRef.current) {
      console.log('New word appeared:', currentWord.id);
      currentWordIdRef.current = currentWord.id;
      setHasPlayedAudio(false);
      
      // Determine if image should be shown based on progress
      if (currentWordProgress) {
        const showImage = shouldShowImage(currentWordProgress);
        setImageVisible(showImage);
        console.log('Image visible:', showImage, 'State:', currentWordProgress.masteryState);
      } else {
        setImageVisible(true); // Default to showing image
      }
      
      // Clear any pending auto-advance timer
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
      
      onWordExposedRef.current();
    }
  }, [currentWord?.id, currentWordProgress]);
  
  // Auto-advance after audio plays (gentle delay)
  useEffect(() => {
    console.log('Auto-advance check - hasPlayedAudio:', hasPlayedAudio);
    
    if (hasPlayedAudio) {
      console.log('Setting timer to advance in 2 seconds...');
      const timer = setTimeout(() => {
        console.log('Auto-advancing to next word');
        
        // If image wasn't visible and child didn't tap audio, count as no-image success
        if (!imageVisible) {
          console.log('No-image success - word recognized without picture!');
          onNoImageSuccessRef.current();
        }
        
        onAdvanceRef.current();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasPlayedAudio, imageVisible]);
  
  const handleScreenTap = useCallback(async () => {
        console.log('Auto-advancing to next word');
        onAdvanceRef.current();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasPlayedAudio]);
  
  const handleScreenTap = useCallback(async () => {
    if (!currentWord) return;
    
    console.log('Screen tapped - speaking word:', currentWord.text);
    
    // Play audio with voice settings
    try {
      await speakWord(currentWord.text, {
        rate: settings?.audioRate ?? 0.75,
        voice: settings?.voiceType ?? 'default',
      });
      
      console.log('Audio finished playing, updating state...');
      onAudioPlayed();
      setHasPlayedAudio(true);
      
    } catch (error) {
      console.error('Failed to speak word:', error);
    }
  }, [currentWord, onAudioPlayed, settings]);
  
  // No word available - session ended
  if (!currentWord) {based on mastery state
  const imageOpacity = currentWordProgress ? getImageOpacity(currentWordProgress) : 1.0
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
              showImage={imageVisible}
              fontFamily={settings.fontFamily}
            />
          </View>
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
