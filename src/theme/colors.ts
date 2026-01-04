/**
 * Color palette for the reading app.
 * 
 * CORE PRINCIPLES:
 * - Calm, neutral background
 * - High contrast text for readability
 * - No distracting bright colors
 * - Child-friendly but not cartoonish
 */

export const colors = {
  // Primary background - neutral, calm off-white
  background: '#F8F8F8',
  
  // Card and surface colors
  surface: '#FFFFFF',
  surfaceElevated: '#FDFCFA',
  
  // Text colors - VERY high contrast for child readability
  textPrimary: '#1A1A1A',    // Nearly black
  textSecondary: '#4A4A4A',
  textMuted: '#8A8A8A',
  
  // Interactive elements - calm, trustworthy blue
  primary: '#4A7BA7',
  primaryPressed: '#3D6890',
  primaryLight: '#E8F1F7',
  
  // Success state - gentle green (not bright)
  success: '#5A9A6A',
  successLight: '#E8F5EB',
  
  // Secondary color - gentle purple
  secondary: '#7A6B9A',
  secondaryLight: '#F0EEFB',
  
  // Warning state - calm orange for data management
  warning: '#D48A5D',
  warningLight: '#FEF5E8',
  
  // Attention state - neutral amber (NO red - no failure)
  attention: '#C48A5D',
  attentionLight: '#FEF3E8',
  
  // Border and divider colors - subtle
  border: '#E0E0E0',
  borderLight: '#ECECEC',
  
  // Shadow color for elevation
  shadow: 'rgba(0, 0, 0, 0.06)',
  
  // Disabled state
  disabled: '#AAAAAA',
  
  // Overlay for parent mode
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorName = keyof typeof colors;

