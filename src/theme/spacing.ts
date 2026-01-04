/**
 * Spacing scale for consistent layout.
 * Uses a base-4 scale for predictable visual rhythm.
 */

export const spacing = {
  // Extra small - tight spacing
  xs: 4,
  
  // Small - compact elements
  sm: 8,
  
  // Medium - standard spacing
  md: 16,
  
  // Large - section spacing
  lg: 24,
  
  // Extra large - major sections
  xl: 32,
  
  // 2X large - screen padding
  xxl: 48,
  
  // Screen edge padding
  screenHorizontal: 24,
  screenVertical: 32,
  
  // Minimum touch target size (accessibility)
  touchTarget: 48,
  
  // Large touch target for young children
  largeTouchTarget: 64,
} as const;

export type SpacingName = keyof typeof spacing;

/**
 * Border radius values for consistent rounding.
 */
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export type BorderRadiusName = keyof typeof borderRadius;
