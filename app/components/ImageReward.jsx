import { Image, StyleSheet, View } from 'react-native';
import imageAssets from '../assets/imageAssets';
import theme from '../styles/theme';

export default function ImageReward({ imageKey }) {
  if (!imageKey) return null;
  const src = imageAssets ? imageAssets[imageKey] : null;
  if (!src) return null;

  return (
    <View style={styles.container} accessible accessibilityRole="image">
      <Image source={src} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
});
