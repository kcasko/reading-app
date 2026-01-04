import { TextStyle } from 'react-native';
import type { FontFamily } from '../state/progressStore';

/**
 * Typography scale for the reading app.
 * Large, clear text optimized for emerging readers.
 */

/**
 * Font family mappings for different accessibility options.
 */
export const FONT_FAMILIES: Record<FontFamily, { regular: string; bold: string }> = {
  system: {
    regular: 'System',
    bold: 'System',
  },
  opendyslexic: {
    regular: 'OpenDyslexic-Regular',
    bold: 'OpenDyslexic-Bold',
  },
  'comic-sans': {
    regular: 'Comic Sans MS',
    bold: 'Comic Sans MS',
  },
};

// Default font family
const fontFamily = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
} as const;

/**
 * Text styles for different use cases.
 * All sizes are larger than typical to aid young readers.
 */
export const typography = {
  // Sight word display - the main learning text
  wordDisplay: {
    fontFamily: fontFamily.bold,
    fontSize: 72,
    fontWeight: '700',
    lineHeight: 88,
    letterSpacing: 2,
  } as TextStyle,
  
  // Large heading - screen titles
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: 0.5,
  } as TextStyle,
  
  // Section title
  title: {
    fontFamily: fontFamily.medium,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: 0.25,
  } as TextStyle,
  
  // Button text - large and clear
  button: {
    fontFamily: fontFamily.medium,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0.5,
  } as TextStyle,
  
  // Body text
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: 0.25,
  } as TextStyle,
  
  // Small text - use sparingly
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
  } as TextStyle,
  
  // Number display for stats
  statNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
    letterSpacing: 0,
  } as TextStyle,
} as const;

export type TypographyName = keyof typeof typography;

/**
 * Generate typography with a specific font family.
 * Used to apply user's font preference throughout the app.
 */
export function getTypography(selectedFont: FontFamily = 'system') {
  const fonts = FONT_FAMILIES[selectedFont];
  
  return {
    wordDisplay: {
      ...typography.wordDisplay,
      fontFamily: fonts.bold,
    } as TextStyle,
    
    heading: {
      ...typography.heading,
      fontFamily: fonts.bold,
    } as TextStyle,
    
    title: {
      ...typography.title,
      fontFamily: fonts.bold,
    } as TextStyle,
    
    button: {
      ...typography.button,
      fontFamily: fonts.bold,
    } as TextStyle,
    
    body: {
      ...typography.body,
      fontFamily: fonts.regular,
    } as TextStyle,
    
    caption: {
      ...typography.caption,
      fontFamily: fonts.regular,
    } as TextStyle,
    
    statNumber: {
      ...typography.statNumber,
      fontFamily: fonts.bold,
    } as TextStyle,
  };
}
