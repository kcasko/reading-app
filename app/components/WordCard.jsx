import { StyleSheet, View } from 'react-native';
import theme from '../styles/theme';
import { mapWordToGraphemes } from '../utils/graphemeHelpers';
import GraphemeButton from './GraphemeButton';

export default function WordCard({ wordObj, word, onGraphemePress = () => {} }) {
  // Support either a full wordObj (preferred) or a legacy `word` string.
  const graphemeInfos = wordObj ? mapWordToGraphemes(wordObj) : (String(word || '')).split('').map((ch) => ({ text: ch, isTricky: false }));

  return (
    <View style={styles.card} accessible accessibilityRole="text">
      <View style={styles.row}>
        {graphemeInfos.map((g, idx) => (
          <GraphemeButton
            key={`${g.text}-${idx}`}
            text={g.text}
            isTricky={!!g.isTricky}
            onPress={() => onGraphemePress(g.text, idx)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  word: {
    fontSize: 56,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
