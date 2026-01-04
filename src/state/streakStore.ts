/**
 * Streak Tracking - Daily engagement tracking
 * 
 * Gentle, encouraging system that celebrates consistency
 * without creating pressure or guilt.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StreakData {
  /** Current streak count (consecutive days) */
  currentStreak: number;
  
  /** Longest streak ever achieved */
  longestStreak: number;
  
  /** Last day the app was used (YYYY-MM-DD format) */
  lastActiveDate: string;
  
  /** Total number of unique days used */
  totalDays: number;
  
  /** Array of dates when app was used (for calendar view) */
  activeDates: string[];
}

/**
 * Get today's date in YYYY-MM-DD format.
 */
function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Get yesterday's date in YYYY-MM-DD format.
 */
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Load streak data for a profile.
 */
export async function loadStreakData(storageKey: string): Promise<StreakData> {
  try {
    const json = await AsyncStorage.getItem(storageKey);
    if (!json) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        totalDays: 0,
        activeDates: [],
      };
    }
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to load streak data:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      totalDays: 0,
      activeDates: [],
    };
  }
}

/**
 * Save streak data for a profile.
 */
export async function saveStreakData(storageKey: string, data: StreakData): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save streak data:', error);
  }
}

/**
 * Update streak based on today's activity.
 * Call this when a lesson is completed.
 */
export function updateStreak(data: StreakData): StreakData {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  
  // Already logged today - no change
  if (data.lastActiveDate === today) {
    return data;
  }
  
  // Determine if streak continues
  let newStreak: number;
  if (data.lastActiveDate === yesterday) {
    // Consecutive day - increment streak
    newStreak = data.currentStreak + 1;
  } else if (data.lastActiveDate === '') {
    // First time using app
    newStreak = 1;
  } else {
    // Streak broken (missed a day) - restart
    newStreak = 1;
  }
  
  // Track this date
  const newActiveDates = [...data.activeDates];
  if (!newActiveDates.includes(today)) {
    newActiveDates.push(today);
    // Keep only last 90 days for performance
    if (newActiveDates.length > 90) {
      newActiveDates.shift();
    }
  }
  
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, data.longestStreak),
    lastActiveDate: today,
    totalDays: data.totalDays + 1,
    activeDates: newActiveDates,
  };
}

/**
 * Get encouraging message based on streak.
 * Always positive, never pressuring.
 */
export function getStreakMessage(streak: number): string {
  if (streak === 0) return '';
  if (streak === 1) return 'Great start!';
  if (streak === 2) return 'Two days!';
  if (streak === 3) return 'Three days!';
  if (streak < 7) return `${streak} days!`;
  if (streak === 7) return 'One week! 🌟';
  if (streak < 14) return `${streak} days! 🌟`;
  if (streak === 14) return 'Two weeks! ⭐';
  if (streak < 30) return `${streak} days! ⭐`;
  if (streak === 30) return 'One month! 🎉';
  return `${streak} days! 🎉`;
}

/**
 * Get emoji for streak display.
 */
export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '📚';
  if (streak < 3) return '🌱';
  if (streak < 7) return '🌿';
  if (streak < 14) return '🌟';
  if (streak < 30) return '⭐';
  return '🔥';
}
