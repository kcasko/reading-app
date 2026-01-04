/**
 * ProgressBar - Visual indicator of lesson or mastery progress.
 * 
 * Features:
 * - Simple, clear design
 * - Accessible labels
 * - Calm color scheme
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ProgressBarProps {
  /** Current progress value */
  current: number;
  
  /** Total/maximum value */
  total: number;
  
  /** Optional label to show above the bar */
  label?: string;
  
  /** Whether to show numeric progress */
  showNumbers?: boolean;
  
  /** Height of the progress bar */
  height?: number;
  
  /** Color of the filled portion */
  fillColor?: string;
}

export function ProgressBar({
  current,
  total,
  label,
  showNumbers = true,
  height = 12,
  fillColor = colors.success,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  
  return (
    <View style={styles.container}>
      {(label || showNumbers) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showNumbers && (
            <Text style={styles.numbers}>
              {current} / {total}
            </Text>
          )}
        </View>
      )}
      
      <View
        style={[styles.track, { height }]}
        accessibilityLabel={`Progress: ${current} of ${total}`}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: total,
          now: current,
        }}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  numbers: {
    ...typography.caption,
    color: colors.textMuted,
  },
  track: {
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.round,
  },
});
