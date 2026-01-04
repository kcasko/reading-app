/**
 * HomeScreen - Entry point for children.
 * 
 * CORE PRINCIPLES:
 * - Large "Start Learning" button a 4-year-old can tap
 * - Hidden parent mode via long-press
 * - No text instructions needed
 * - Calm, simple, predictable
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
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
  onReloadProfile: () => Promise<void>;
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
  onReloadProfile,
}: HomeScreenComponentProps) {
  const [parentModeVisible, setParentModeVisible] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Reload profile data when returning from ProfileSelector
  useFocusEffect(
    React.useCallback(() => {
      // Always reload to catch profile switches/deletions
      onReloadProfile();
    }, [onReloadProfile])
  );
  
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
      {/* Profile Badge - shows active profile, positioned absolutely over everything */}
      {activeProfile && (
        <Pressable 
          style={styles.profileBadge}
          onPress={handleSwitchProfile}
          accessibilityLabel={`Switch from ${activeProfile.name}`}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.profileAvatar}>{activeProfile.avatar}</Text>
          <Text style={styles.profileName}>{activeProfile.name}</Text>
        </Pressable>
      )}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
          
          {/* Progress Stars - Shows mastered words */}
          {stats.mastered > 0 && (
            <View style={styles.starsContainer}>
              <Text style={styles.starsText}>
                {'⭐'.repeat(Math.min(stats.mastered, 10))}
              </Text>
              <Text style={styles.starsLabel}>
                {stats.mastered} word{stats.mastered !== 1 ? 's' : ''} mastered!
              </Text>
            </View>
          )}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  profileBadge: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  appIcon: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.heading,
    fontSize: 32,
    color: colors.textPrimary,
  },
  categoryContainer: {
    marginVertical: spacing.sm,
    zIndex: 10,
  },
  categoryPrompt: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  categoryButton: {
    width: 90,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 4,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryEmoji: {
    fontSize: 36,
    marginBottom: 2,
  },
  categoryLabel: {
    fontSize: 13,
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
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  startButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
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
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  startButtonIcon: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  reviewButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  reviewButtonIcon: {
    fontSize: 20,
  },
  replayButton: {
    marginTop: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  replayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  replayButtonIcon: {
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  star: {
    opacity: 0.2,
  },
  starFilled: {
    opacity: 1.0,
  },
  starText: {
    fontSize: 20,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
    marginHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakEmoji: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  streakText: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  starsContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  starsText: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  starsLabel: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
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
