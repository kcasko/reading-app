/**
 * MasteryScreen - Celebrate when a child masters a word.
 * 
 * Shows when word reaches 25 exposures (mastery threshold).
 * Gentle, encouraging, non-gamified acknowledgment.
 * Quick transition - doesn't interrupt learning flow.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../navigation/AppNavigator';

type MasteryScreenProps = NativeStackScreenProps<RootStackParamList, 'Mastery'>;

export function MasteryScreen({ navigation, route }: MasteryScreenProps) {
  const { wordText, emoji } = route.params;
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Gentle scale and fade animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      handleContinue();
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable 
        style={styles.fullScreen}
        onPress={handleContinue}
        accessibilityLabel="Continue learning"
        accessibilityRole="button"
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Emoji representation */}
          <Text style={styles.emoji}>{emoji}</Text>
          
          {/* The word they mastered */}
          <Text style={styles.word}>{wordText}</Text>
          
          {/* Encouraging message */}
          <Text style={styles.message}>You know this word!</Text>
          
          {/* Gentle celebration */}
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={styles.star}>⭐</Text>
            ))}
          </View>
          
          {/* Subtle instruction */}
          <Text style={styles.hint}>Tap anywhere to continue</Text>
        </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  emoji: {
    fontSize: 100,
    marginBottom: spacing.lg,
  },
  word: {
    ...typography.heading,
    fontSize: 56,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  star: {
    fontSize: 32,
  },
  hint: {
    ...typography.caption,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
