import { StyleSheet, Text, View } from 'react-native';
import theme from '../styles/theme';

export default function WordCard({ word }) {
  return (
    <View style={styles.card} accessible accessibilityRole="text">
      <Text style={styles.word}>{word}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  word: {
    fontSize: 56,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
