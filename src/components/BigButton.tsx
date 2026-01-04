/**
 * BigButton - Large, accessible button for young children.
 * 
 * Features:
 * - Large touch target (minimum 64px)
 * - High contrast
 * - Clear visual feedback on press
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

export type ButtonVariant = 'primary' | 'success' | 'attention' | 'secondary';

interface BigButtonProps extends Omit<PressableProps, 'style'> {
  /** Button text */
  label: string;
  
  /** Visual variant */
  variant?: ButtonVariant;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Additional container style */
  style?: ViewStyle;
  
  /** Additional text style */
  textStyle?: TextStyle;
}

export function BigButton({
  label,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  ...pressableProps
}: BigButtonProps) {
  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant].button,
        pressed && variantStyles[variant].pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variantStyles[variant].label,
          disabled && styles.disabledLabel,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: spacing.largeTouchTarget,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.button,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: colors.textMuted,
  },
});

const variantStyles = {
  primary: StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
    },
    pressed: {
      backgroundColor: colors.primaryPressed,
    },
    label: {
      color: colors.surface,
    },
  }),
  success: StyleSheet.create({
    button: {
      backgroundColor: colors.success,
    },
    pressed: {
      backgroundColor: '#5A9E69', // Darker success
    },
    label: {
      color: colors.surface,
    },
  }),
  attention: StyleSheet.create({
    button: {
      backgroundColor: colors.attention,
    },
    pressed: {
      backgroundColor: '#C4814D', // Darker attention
    },
    label: {
      color: colors.surface,
    },
  }),
  secondary: StyleSheet.create({
    button: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
    },
    pressed: {
      backgroundColor: colors.borderLight,
    },
    label: {
      color: colors.textPrimary,
    },
  }),
};
