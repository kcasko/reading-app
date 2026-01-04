/**
 * StreakScreen - Simple calendar view of learning activity
 * 
 * Shows a gentle overview of which days the child used the app.
 * No pressure, just a visual record for parents.
 */

import React from 'react';
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
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { StreakData } from '../state/streakStore';
import { getStreakMessage, getStreakEmoji } from '../state/streakStore';

type StreakScreenProps = NativeStackScreenProps<RootStackParamList, 'Streak'>;

interface StreakScreenComponentProps extends StreakScreenProps {
  streakData: StreakData;
}

/**
 * Get days in current month for simple calendar.
 */
function getLastThirtyDays(): string[] {
  const days: string[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  
  return days;
}

/**
 * Format date for display (e.g., "Jan 15").
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export function StreakScreen({
  navigation,
  streakData,
}: StreakScreenComponentProps) {
  const days = getLastThirtyDays();
  
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Learning Days</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current streak summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.streakEmoji}>{getStreakEmoji(streakData.currentStreak)}</Text>
          <Text style={styles.streakTitle}>{getStreakMessage(streakData.currentStreak)}</Text>
          <Text style={styles.streakSubtitle}>
            {streakData.totalDays} day{streakData.totalDays !== 1 ? 's' : ''} total
          </Text>
          {streakData.longestStreak > streakData.currentStreak && (
            <Text style={styles.longestStreak}>
              Longest streak: {streakData.longestStreak} day{streakData.longestStreak !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Simple calendar - last 30 days */}
        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>Last 30 Days</Text>
          <Text style={styles.calendarSubtitle}>
            Dots show days when learning happened
          </Text>
          
          <View style={styles.calendarGrid}>
            {days.map((day) => {
              const isActive = streakData.activeDates.includes(day);
              const isToday = day === new Date().toISOString().split('T')[0];
              
              return (
                <View
                  key={day}
                  style={[
                    styles.dayContainer,
                    isActive && styles.dayContainerActive,
                    isToday && styles.dayContainerToday,
                  ]}
                >
                  <Text style={[
                    styles.dayDate,
                    isActive && styles.dayDateActive,
                    isToday && styles.dayDateToday,
                  ]}>
                    {formatDateShort(day)}
                  </Text>
                  {isActive && <View style={styles.activityDot} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Encouraging message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            {streakData.currentStreak === 0 
              ? "Ready to start learning! Each session helps build reading skills."
              : streakData.currentStreak === 1
              ? "Great start! Regular practice helps children learn to read."
              : "Wonderful consistency! Reading little and often builds strong skills."
            }
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  streakTitle: {
    ...typography.heading,
    fontSize: 28,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  streakSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  longestStreak: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  calendarSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  dayContainer: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  dayContainerActive: {
    backgroundColor: colors.primaryLight,
  },
  dayContainerToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayDate: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  dayDateActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  dayDateToday: {
    fontWeight: '700',
  },
  activityDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  messageCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  messageText: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
});