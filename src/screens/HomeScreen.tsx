/**
 * HomeScreen - Entry point for children.
 * 
 * CORE PRINCIPLES:
 * - Large "Start Learning" button a 4-year-old can tap
 * - Hidden parent mode via long-press
 * - No text instructions needed
 * - Calm, simple, predictable
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { WordCategory } from '../data/wordLists';
import type { Profile } from '../state/profileStore';
import type { StreakData } from '../state/streakStore';
import { getStreakMessage, getStreakEmoji } from '../state/streakStore';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface HomeScreenComponentProps extends HomeScreenProps {
  stats: {
    total: number;
    introduced: number;
    mastered: number;
    learning: number;
  };
  selectedCategories: WordCategory[];
  lastSessionWords: string[];
  activeProfile: Profile | null;
  streakData: StreakData;
  onStartLesson: () => void;
  onStartReplaySession: () => void;
  onToggleCategory: (category: WordCategory) => void;
}

const CATEGORY_CONFIG: Record<WordCategory, { emoji: string; label: string; color: string }> = {
  animals: { emoji: '🐶', label: 'Animals', color: '#FFE5CC' },
  food: { emoji: '🍎', label: 'Food', color: '#FFD6D6' },
  objects: { emoji: '⚽', label: 'Objects', color: '#D6E5FF' },
  vehicles: { emoji: '🚗', label: 'Vehicles', color: '#E5FFD6' },
};

export function HomeScreen({
  navigation,
  stats,
  selectedCategories,
  lastSessionWords,
  activeProfile,
  streakData,
  onStartLesson,
  onStartReplaySession,
  onToggleCategory,
}: HomeScreenComponentProps) {
  const [parentModeVisible, setParentModeVisible] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleStartLesson = () => {
    if (selectedCategories.length === 0) return; // Prevent starting with no categories
    onStartLesson();
    navigation.navigate('Lesson');
  };
  
  const handleReplaySession = () => {
    onStartReplaySession();
    navigation.navigate('Lesson');
  };
  
  const handleCategoryToggle = (category: WordCategory) => {
    onToggleCategory(category);
  };
  
  const handleSwitchProfile = () => {
    navigation.navigate('ProfileSelector');
    setParentModeVisible(false);
  };
  
  // Long-press on title to reveal parent mode
  const handleTitlePressIn = () => {
    const timer = setTimeout(() => {
      setParentModeVisible(true);
    }, 2000); // 2 second long press
    setLongPressTimer(timer);
  };
  
  const handleTitlePressOut = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  const handleOpenSettings = () => {
    navigation.navigate('Settings');
    setParentModeVisible(false);
  };
  
  const handleOpenProgress = () => {
    navigation.navigate('Progress');
    setParentModeVisible(false);
  };
  
  const handleOpenReview = () => {
    navigation.navigate('Review');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Badge - shows active profile */}
        {activeProfile && (
          <View style={styles.profileBadge}>
            <Text style={styles.profileAvatar}>{activeProfile.avatar}</Text>
            <Text style={styles.profileName}>{activeProfile.name}</Text>
          </View>
        )}
        
        {/* Title - long press to reveal parent mode */}
        <Pressable
          onPressIn={handleTitlePressIn}
          onPressOut={handleTitlePressOut}
          style={styles.titleContainer}
        >
          <Text style={styles.appIcon}>📚</Text>
          <Text style={styles.title}>Learn Words</Text>
        </Pressable>
        
        {/* Gentle streak display */}
        {streakData.currentStreak > 0 && (
          <View style={styles.streakContainer}>
            <Text style={styles.streakEmoji}>{getStreakEmoji(streakData.currentStreak)}</Text>
            <Text style={styles.streakText}>{getStreakMessage(streakData.currentStreak)}</Text>
          </View>
        )}
        
        {/* Category selection - child chooses what interests them */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryPrompt}>What do you want to learn?</Text>
          <View style={styles.categoryGrid}>
            {(Object.keys(CATEGORY_CONFIG) as WordCategory[]).map((category) => {
              const config = CATEGORY_CONFIG[category];
              const isSelected = selectedCategories.includes(category);
              
              return (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: config.color },
                    isSelected && styles.categoryButtonSelected,
                  ]}
                  onPress={() => handleCategoryToggle(category)}
                  accessibilityLabel={`${config.label} category`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={styles.categoryEmoji}>{config.emoji}</Text>
                  <Text style={styles.categoryLabel}>{config.label}</Text>
                  {isSelected && <Text style={styles.categoryCheck}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>
        
        {/* Large start button - only enabled if categories selected */}
        <View style={styles.mainButtonContainer}>
          <Pressable
            style={[
              styles.startButton,
              selectedCategories.length === 0 && styles.startButtonDisabled,
            ]}
            onPress={handleStartLesson}
            disabled={selectedCategories.length === 0}
            accessibilityLabel="Start learning"
            accessibilityRole="button"
          >
            <Text style={styles.startButtonText}>Start</Text>
            <Text style={styles.startButtonIcon}>▶</Text>
          </Pressable>
          
          {/* Review button - child can revisit learned words */}
          {stats.introduced > 0 && (
            <Pressable
              style={styles.reviewButton}
              onPress={handleOpenReview}
              accessibilityLabel="Review learned words"
              accessibilityRole="button"
            >
              <Text style={styles.reviewButtonText}>Review</Text>
              <Text style={styles.reviewButtonIcon}>📚</Text>
            </Pressable>
          )}
          
          {/* Replay last session button */}
          {lastSessionWords.length > 0 && (
            <Pressable
              style={styles.replayButton}
              onPress={handleReplaySession}
              accessibilityLabel="Replay last session"
              accessibilityRole="button"
            >
              <Text style={styles.replayButtonText}>Replay Last ({lastSessionWords.length} words)</Text>
              <Text style={styles.replayButtonIcon}>🔄</Text>
            </Pressable>
          )}
        </View>
        
        {/* Simple progress indicator - non-distracting */}
        <View style={styles.progressContainer}>
          {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                i < Math.floor(stats.mastered / 3) && styles.starFilled
              ]}
            >
              <Text style={styles.starText}>⭐</Text>
            </View>
          ))}
        </View>
        
        {/* Parent mode - only visible after long press */}
        {parentModeVisible && (
          <View style={styles.parentMode}>
            <Text style={styles.parentModeTitle}>Parent Mode</Text>
            <Pressable style={styles.parentButton} onPress={handleOpenProgress}>
              <Text style={styles.parentButtonText}>View Progress</Text>
            </Pressable>
            <Pressable style={styles.parentButton} onPress={handleOpenSettings}>
              <Text style={styles.parentButtonText}>Settings</Text>
            </Pressable>
            <Pressable style={styles.parentButton} onPress={handleSwitchProfile}>
              <Text style={styles.parentButtonText}>Switch Child</Text>
            </Pressable>
            <Pressable 
              style={[styles.parentButton, styles.parentButtonSecondary]} 
              onPress={() => setParentModeVisible(false)}
            >
              <Text style={[styles.parentButtonText, styles.parentButtonTextSecondary]}>
                Close
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.screenVertical,
    justifyContent: 'space-between',
  },
  profileBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  profileAvatar: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  profileName: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  appIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 42,
    color: colors.textPrimary,
  },
  categoryContainer: {
    marginVertical: spacing.xl,
  },
  categoryPrompt: {
    ...typography.body,
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  categoryButton: {
    width: 140,
    height: 140,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 5,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryEmoji: {
    fontSize: 56,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  mainButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  startButtonIcon: {
    fontSize: 64,
    color: '#FFFFFF',
  },
  reviewButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
  },
  reviewButtonIcon: {
    fontSize: 28,
  },
  replayButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  replayButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  replayButtonIcon: {
    fontSize: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  star: {
    opacity: 0.2,
  },
  starFilled: {
    opacity: 1.0,
  },
  starText: {
    fontSize: 28,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    marginHorizontal: spacing.screenHorizontal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  streakText: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  parentMode: {
    position: 'absolute',
    top: '50%',
    left: spacing.screenHorizontal,
    right: spacing.screenHorizontal,
    transform: [{ translateY: -150 }],
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  parentModeTitle: {
    ...typography.title,
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  parentButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  parentButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  parentButtonText: {
    ...typography.body,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  parentButtonTextSecondary: {
    color: colors.textSecondary,
  },
});
