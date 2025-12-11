import { Audio } from 'expo-av';
import soundAssets from '../assets/soundAssets';

const AudioPlayer = {
  async play(word) {
    if (!word) return;
    try {
      const asset = soundAssets[word];
      if (!asset) {
        console.warn('Audio asset not found for', word);
        return null;
      }
      const sound = new Audio.Sound();
      await sound.loadAsync(asset);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
      return sound;
    } catch (e) {
      console.warn('AudioPlayer.play error', e);
      return null;
    }
  },
  async playCorrection(word) {
    // same behavior: replay the correct audio (kept separate for clarity)
    return this.play(word);
  },
};

export default AudioPlayer;
