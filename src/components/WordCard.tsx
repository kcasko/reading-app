/**
 * WordCard - Displays a word with its supporting image.
 * 
 * CORE PRINCIPLES:
 * - Word is ALWAYS larger than the image
 * - Image is a support tool that fades over time
 * - Simple, clean design
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography, getTypography } from '../theme/typography';
import type { FontFamily } from '../state/progressStore';
import { isImagePreloaded } from '../utils/ImagePreloader';

interface WordCardProps {
  /** The word to display */
  word: string;
  
  /** Path to the image file */
  imagePath: string;
  
  /** Opacity of the image (0-1) based on exposure count */
  imageOpacity: number;
  
  /** Whether to show the image at all */
  showImage: boolean;
  
  /** Font family to use */
  fontFamily?: FontFamily;
}

/**
 * Emoji placeholders for each word.
 * TODO: Replace with actual PNG images in production.
 */
const EMOJI_MAP: Record<string, string> = {
  // Animals
  'animals/cat.png': '🐱',
  'animals/dog.png': '🐕',
  'animals/bird.png': '🐦',
  'animals/fish.png': '🐟',
  'animals/cow.png': '🐄',
  'animals/pig.png': '🐷',
  'animals/horse.png': '🐴',
  'animals/duck.png': '🦆',
  
  // Food
  'food/apple.png': '🍎',
  'food/banana.png': '🍌',
  'food/bread.png': '🍞',
  'food/milk.png': '🥛',
  'food/egg.png': '🥚',
  'food/cake.png': '🍰',
  'food/pizza.png': '🍕',
  'food/cookie.png': '🍪',
  
  // Objects
  'objects/ball.png': '⚽',
  'objects/book.png': '📖',
  'objects/cup.png': '☕',
  'objects/chair.png': '🪑',
  'objects/door.png': '🚪',
  'objects/bed.png': '🛏️',
  'objects/table.png': '🪑',
  'objects/hat.png': '🎩',
  
  // Vehicles
  'vehicles/car.png': '🚗',
  'vehicles/bus.png': '🚌',
  'vehicles/truck.png': '🚚',
  'vehicles/train.png': '🚂',
  'vehicles/boat.png': '⛵',
  'vehicles/plane.png': '✈️',
  'vehicles/bike.png': '🚲',
  'vehicles/ship.png': '🚢',
};

export function WordCard({
  word,
  imagePath,
  imageOpacity,
  showImage,
  fontFamily = 'system',
}: WordCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isPreloaded, setIsPreloaded] = useState(false);
  
  const emoji = EMOJI_MAP[imagePath] || '📦';
  
  // Check if image is preloaded
  useEffect(() => {
    setIsPreloaded(isImagePreloaded(imagePath));
  }, [imagePath]);
  
  // Try to load real image, fall back to emoji if not available
  const imageSource = getImageSource(imagePath);
  const useRealImage = imageSource !== null && !imageError;
  
  // Get typography with selected font
  const customTypography = getTypography(fontFamily);
  
  return (
    <View style={styles.container}>
      {/* Word - Always primary and larger */}
      <Text
        style={[styles.word, customTypography.wordDisplay]}
        accessibilityLabel={`The word is: ${word}`}
        accessibilityRole="text"
      >
        {word}
      </Text>
      
      {/* Image - Smaller, below the word, fades over time */}
      {showImage && (
        <View style={[styles.imageContainer, { opacity: imageOpacity }]}>
          {useRealImage ? (
            <View style={styles.imageWrapper}>
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoad={() => setImageLoading(false)}
                accessibilityLabel={`Picture of ${word}`}
              />
              {/* Show subtle loading indicator if image isn't preloaded and is still loading */}
              {imageLoading && !isPreloaded && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}
            </View>
          ) : (
            <Text
              style={styles.emoji}
              accessibilityLabel={`Picture of ${word}`}
            >
              {emoji}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Get the image source for a given path.
 * Returns null if image doesn't exist (will fall back to emoji).
 */
function getImageSource(imagePath: string): number | null {
  // Images not yet added - using emoji placeholders
  // Uncomment when images are added to assets/images/
  /*
  const imageMap: Record<string, any> = {
    // Animals
    'animals/cat.png': require('../../assets/images/animals/cat.png'),
    'animals/dog.png': require('../../assets/images/animals/dog.png'),
    // ... etc
  };
  
  return imageMap[imagePath] || null;
  */
  
  return null; // Always use emoji for now
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },
  word: {
    ...typography.wordDisplay,
    fontSize: 72, // Very large text - always larger than image
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontWeight: '700',
  },
  imageContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
  },
  emoji: {
    fontSize: 120, // Image is visible but word is still primary due to positioning
    textAlign: 'center',
  },
});


