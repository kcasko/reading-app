/**
 * ProgressScreen - Enhanced Parent Dashboard
 * 
 * Shows detailed learning progress:
 * - Exposure-based stats (not correct/incorrect)
 * - Image fade progress for each word
 * - Category breakdown
 * - Learning timeline
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { isMastered, IMAGE_FADE_THRESHOLDS } from '../engine/SpacedRepetition';
import { getWordById } from '../data/wordLists';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { WordEngineState } from '../engine/WordEngine';
import type { WordCategory } from '../data/wordLists';

type ProgressScreenProps = NativeStackScreenProps<RootStackParamList, 'Progress'>;

interface ProgressScreenComponentProps extends ProgressScreenProps {
  stats: {
    total: number;
    introduced: number;
    mastered: number;
    learning: number;
  };
  engineState: WordEngineState;
}

export function ProgressScreen({
  navigation,
  stats,
  engineState,
}: ProgressScreenComponentProps) {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all'>('all');
  
  const progressEntries = Object.values(engineState.progress);
  
  // Sort by exposure count (most exposed first)
  const sortedProgress = [...progressEntries].sort((a, b) => {
    return b.exposureCount - a.exposureCount;
  });
  
  // Filter by category
  const filteredProgress = selectedCategory === 'all' 
    ? sortedProgress 
    : sortedProgress.filter(p => {
        const word = getWordById(p.wordId);
        return word?.category === selectedCategory;
      });
  
  // Calculate category stats
  const categoryStats = {
    animals: progressEntries.filter(p => getWordById(p.wordId)?.category === 'animals').length,
    food: progressEntries.filter(p => getWordById(p.wordId)?.category === 'food').length,
    objects: progressEntries.filter(p => getWordById(p.wordId)?.category === 'objects').length,
    vehicles: progressEntries.filter(p => getWordById(p.wordId)?.category === 'vehicles').length,
  };
  
  // Get image fade stage for a word
  const getFadeStage = (exposureCount: number): string => {
    if (exposureCount >= IMAGE_FADE_THRESHOLDS.HIDE) return 'Hidden';
    if (exposureCount >= IMAGE_FADE_THRESHOLDS.INTERMITTENT) return 'Intermittent';
    if (exposureCount >= IMAGE_FADE_THRESHOLDS.START_FADE) return 'Fading';
    return 'Full';
  };
  
  const getFadeColor = (exposureCount: number): string => {
    if (exposureCount >= IMAGE_FADE_THRESHOLDS.HIDE) return colors.success;
    if (exposureCount >= IMAGE_FADE_THRESHOLDS.INTERMITTENT) return '#9B7E46';
    if (exposureCount >= IMAGE_FADE_THRESHOLDS.START_FADE) return colors.attention;
    return colors.textSecondary;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Your Progress</Text>
          <View style={styles.backButton} />
        </View>
        
        {/* Overall Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatNumber}>{stats.introduced}</Text>
            <Text style={styles.mainStatLabel}>Words Introduced</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.mastered}</Text>
              <Text style={styles.statLabel}>Mastered</Text>
              <Text style={styles.statSubtext}>(25+ exposures)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.learning}</Text>
              <Text style={styles.statLabel}>Learning</Text>
              <Text style={styles.statSubtext}>(&lt;25 exposures)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total - stats.introduced}</Text>
              <Text style={styles.statLabel}>Not Started</Text>
              <Text style={styles.statSubtext}>({stats.total} total)</Text>
            </View>
          </View>
        </View>
        
        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <Text style={styles.filterLabel}>Filter by category:</Text>
          <View style={styles.filterButtons}>
            <Pressable
              style={[styles.filterButton, selectedCategory === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.filterButtonText, selectedCategory === 'all' && styles.filterButtonTextActive]}>
                All ({stats.introduced})
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterButton, selectedCategory === 'animals' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('animals')}
            >
              <Text style={[styles.filterButtonText, selectedCategory === 'animals' && styles.filterButtonTextActive]}>
                🐶 {categoryStats.animals}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterButton, selectedCategory === 'food' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('food')}
            >
              <Text style={[styles.filterButtonText, selectedCategory === 'food' && styles.filterButtonTextActive]}>
                🍎 {categoryStats.food}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterButton, selectedCategory === 'objects' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('objects')}
            >
              <Text style={[styles.filterButtonText, selectedCategory === 'objects' && styles.filterButtonTextActive]}>
                ⚽ {categoryStats.objects}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterButton, selectedCategory === 'vehicles' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('vehicles')}
            >
              <Text style={[styles.filterButtonText, selectedCategory === 'vehicles' && styles.filterButtonTextActive]}>
                🚗 {categoryStats.vehicles}
              </Text>
            </Pressable>
          </View>
        </View>
        
        {/* Word List */}
        {filteredProgress.length > 0 && (
          <View style={styles.wordListSection}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Words' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Words`} ({filteredProgress.length})
            </Text>
            
            {filteredProgress.map(progress => {
              const word = getWordById(progress.wordId);
              if (!word) return null;
              
              const mastered = isMastered(progress);
              const fadeStage = getFadeStage(progress.exposureCount);
              const fadeColor = getFadeColor(progress.exposureCount);
              const lastSeen = progress.lastSeenAt 
                ? new Date(progress.lastSeenAt).toLocaleDateString()
                : 'Never';
              
              return (
                <View key={progress.wordId} style={styles.wordItem}>
                  <View style={styles.wordHeader}>
                    <Text style={styles.wordText}>{word.text}</Text>
                    {mastered && <Text style={styles.masteredBadge}>✓ Mastered</Text>}
                  </View>
                  
                  <View style={styles.wordMetrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>Exposures</Text>
                      <Text style={styles.metricValue}>{progress.exposureCount}</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>Audio Plays</Text>
                      <Text style={styles.metricValue}>{progress.audioPlayCount}</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>Image Stage</Text>
                      <Text style={[styles.metricValue, { color: fadeColor }]}>
                        {fadeStage}
                      </Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>Last Seen</Text>
                      <Text style={styles.metricValueSmall}>{lastSeen}</Text>
                    </View>
                  </View>
                  
                  {/* Progress bar showing path to mastery */}
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[
                          styles.progressBarFill,
                          { 
                            width: `${Math.min(100, (progress.exposureCount / IMAGE_FADE_THRESHOLDS.HIDE) * 100)}%`,
                            backgroundColor: fadeColor,
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressBarLabel}>
                      {progress.exposureCount}/{IMAGE_FADE_THRESHOLDS.HIDE} to mastery
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        
        {/* Empty State */}
        {filteredProgress.length === 0 && sortedProgress.length > 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No words in this category yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Select a different category or start learning!
            </Text>
          </View>
        )}
        
        {/* Empty State - No Progress */}
        {sortedProgress.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📚</Text>
            <Text style={styles.emptyStateTitle}>No progress yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start a lesson to begin learning!
            </Text>
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
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mainStatNumber: {
    ...typography.statNumber,
    fontSize: 64,
    color: colors.success,
  },
  mainStatLabel: {
    ...typography.title,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.title,
    fontSize: 28,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  categoryFilter: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterButtonText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  wordListSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  wordItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  wordText: {
    ...typography.body,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  masteredBadge: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  wordMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricValueSmall: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressBarContainer: {
    marginTop: spacing.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressBarLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  wordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordAccuracy: {
    ...typography.body,
    color: colors.success,
    fontWeight: '600',
    marginRight: spacing.md,
  },
  wordAttempts: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
