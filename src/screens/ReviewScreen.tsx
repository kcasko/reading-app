/**
 * ReviewScreen - Free exploration of learned words.
 * 
 * CORE PRINCIPLES:
 * - No pressure, no tracking
 * - Child can browse and tap any word to hear it
 * - Shows only words that have been introduced
 * - Simple grid layout, easy to navigate
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography, getTypography } from '../theme/typography';
import { speakWord } from '../audio/TextToSpeech';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Word } from '../data/wordLists';
import { getWordById } from '../data/wordLists';
import type { WordEngineState } from '../engine/WordEngine';
import type { AppSettings } from '../state/progressStore';

type ReviewScreenProps = NativeStackScreenProps<RootStackParamList, 'Review'>;

interface ReviewScreenComponentProps extends ReviewScreenProps {
  engineState: WordEngineState;
  settings: AppSettings; // For audio settings like voice type
}

/**
 * Emoji map for visual representation.
 */
const EMOJI_MAP: Record<string, string> = {
  // Animals
  'animals/cat.png': '🐱',
  'animals/dog.png': '🐕',
  'animals/bird.png': '🐦',
  'animals/fish.png': '🐟',
  'animals/cow.png': '🐄',
  'animals/pig.png': '🐷',
  'animals/horse.png': '🐴',
  'animals/duck.png': '🦆',
  
  // Food
  'food/apple.png': '🍎',
  'food/banana.png': '🍌',
  'food/bread.png': '🍞',
  'food/milk.png': '🥛',
  'food/egg.png': '🥚',
  'food/cake.png': '🍰',
  'food/pizza.png': '🍕',
  'food/cookie.png': '🍪',
  
  // Objects
  'objects/ball.png': '⚽',
  'objects/book.png': '📖',
  'objects/cup.png': '☕',
  'objects/chair.png': '🪑',
  'objects/door.png': '🚪',
  'objects/bed.png': '🛏️',
  'objects/table.png': '🪑',
  'objects/hat.png': '🎩',
  
  // Vehicles
  'vehicles/car.png': '🚗',
  'vehicles/bus.png': '🚌',
  'vehicles/truck.png': '🚚',
  'vehicles/train.png': '🚂',
  'vehicles/boat.png': '⛵',
  'vehicles/plane.png': '✈️',
  'vehicles/bike.png': '🚲',
  'vehicles/ship.png': '🚢',
};

export function ReviewScreen({
  navigation,
  engineState,
  settings,
}: ReviewScreenComponentProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Get all introduced words
  const introducedWords = engineState.introducedWordIds
    .map(id => getWordById(id))
    .filter((word): word is Word => word !== null);
  
  // Get typography with selected font
  const customTypography = getTypography(settings.fontFamily);

  const handleWordTap = async (word: Word) => {
    setCurrentlyPlaying(word.id);
    await speakWord(word.text, {
      rate: settings.audioRate,
      voice: settings.voiceType,
    });
    setCurrentlyPlaying(null);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Empty state - no words learned yet
  if (introducedWords.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Review Words</Text>
          <View style={styles.backButton} />
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyText}>No words learned yet!</Text>
          <Text style={styles.emptySubtext}>
            Start a lesson to learn your first words.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Review Words</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.subtitle}>
        <Text style={styles.subtitleText}>
          Tap any word to hear it again • {introducedWords.length} word{introducedWords.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={introducedWords}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => {
          const isPlaying = currentlyPlaying === item.id;
          const emoji = EMOJI_MAP[item.imagePath] || '📦';
          
          return (
            <Pressable
              style={[styles.wordCard, isPlaying && styles.wordCardPlaying]}
              onPress={() => handleWordTap(item)}
              accessibilityLabel={`${item.text}`}
              accessibilityRole="button"
            >
              <Text style={styles.wordEmoji}>{emoji}</Text>
              <Text style={[styles.wordText, customTypography.title]}>{item.text}</Text>
              {isPlaying && <Text style={styles.playingIndicator}>♪</Text>}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 80,
  },
  backButtonText: {
    ...typography.body,
    fontSize: 18,
    color: colors.primary,
  },
  headerTitle: {
    ...typography.heading,
    fontSize: 24,
    color: colors.textPrimary,
  },
  subtitle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  subtitleText: {
    ...typography.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  gridContainer: {
    padding: spacing.md,
  },
  wordCard: {
    flex: 1,
    margin: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    maxWidth: '48%',
    borderWidth: 2,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wordCardPlaying: {
    borderColor: colors.primary,
    borderWidth: 3,
    backgroundColor: colors.primaryLight,
    transform: [{ scale: 0.98 }],
  },
  wordEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  wordText: {
    ...typography.body,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  playingIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 20,
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.heading,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptySubtext: {
    ...typography.body,
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
