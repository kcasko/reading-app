import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import baseWords from '../data/words.json';
import { loadWords } from './engine/WordEngine';
import theme from './styles/theme';

export default function Home() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchWords() {
      try {
        const list = await loadWords();
        if (mounted && Array.isArray(list)) setWords(list);
      } catch (e) {
        console.warn('Home: loadWords failed, falling back to bundled words', e);
        if (mounted && Array.isArray(baseWords)) setWords(baseWords);
      }
    }
    fetchWords();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose a word</Text>
      <View style={styles.list}>
        {Array.isArray(words) && words.length > 0 ? (
          words.map((w) => (
            <Link key={w.word} href={`/lesson/${w.word}`} asChild>
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>{w.word}</Text>
              </TouchableOpacity>
            </Link>
          ))
        ) : (
          <Text style={styles.loading}>No words available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  list: {
    width: '100%',
    alignItems: 'center',
  },
  item: {
    width: '90%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#eee',
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: '600',
  },
});
