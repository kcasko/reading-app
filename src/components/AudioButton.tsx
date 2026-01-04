/**
 * AudioButton - Button for playing/replaying word audio.
 * 
 * Features:
 * - Large tap target
 * - Visual speaker icon
 * - Accessible for screen readers
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

interface AudioButtonProps {
  /** Called when button is pressed */
  onPress: () => void;
  
  /** Whether audio is currently playing */
  isPlaying?: boolean;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Size variant */
  size?: 'normal' | 'large';
}

export function AudioButton({
  onPress,
  isPlaying = false,
  disabled = false,
  size = 'normal',
}: AudioButtonProps) {
  const buttonSize = size === 'large' ? 80 : 56;
  const iconSize = size === 'large' ? 36 : 24;
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={isPlaying ? 'Stop audio' : 'Play audio'}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.iconContainer}>
        {/* Simple speaker icon using text - in production, use vector icons */}
        <Text
          style={[
            styles.icon,
            { fontSize: iconSize },
            isPlaying && styles.iconPlaying,
          ]}
        >
          🔊
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pressed: {
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
    borderColor: colors.border,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.primary,
  },
  iconPlaying: {
    color: colors.surface,
  },
});
