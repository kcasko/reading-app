import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../styles/theme';

export default function GraphemeButton({ text, isTricky = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isTricky && styles.tricky,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`grapheme ${text}`}
    >
      <Text style={[styles.text, isTricky && styles.trickyText]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  tricky: {
    borderColor: theme.colors.secondary,
    backgroundColor: '#FFF8E1',
  },
  trickyText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
