import { useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../styles/theme';

// ImageOption now relies on external `isSelected` to render feedback
export default function ImageOption({ source, isCorrect, isSelected = false, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  function handlePress() {
    // run a short scale + opacity tap animation
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 80, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]),
    ]).start();

    if (onPress) onPress();
  }

  let borderColor = '#ddd';
  if (isSelected && isCorrect) borderColor = theme.colors.success;
  else if (isSelected && !isCorrect) borderColor = theme.colors.error;
  else borderColor = '#ddd';

  return (
    <Animated.View style={[styles.animated, { transform: [{ scale }], opacity }]}> 
      <TouchableOpacity
        style={[styles.container, { borderColor }]}
        onPress={handlePress}
        accessibilityRole="button"
      >
        {source ? (
          <Image source={source} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Image</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    marginVertical: theme.spacing.sm,
  },
  image: {
    width: '100%',
    height: 120,
  },
  placeholder: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.muted,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 18,
    color: theme.colors.text,
  },
});
