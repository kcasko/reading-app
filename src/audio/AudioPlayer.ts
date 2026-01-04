/**
 * Audio Player - abstracts Expo Audio for word playback.
 * 
 * Provides a clean interface for playing word audio without
 * exposing Expo Audio implementation details to screens.
 */

import { Audio, AVPlaybackStatus } from 'expo-av';
import { AUDIO_CONFIG } from '../utils/constants';

/**
 * Audio player state.
 */
export interface AudioPlayerState {
  isPlaying: boolean;
  isLoaded: boolean;
  playbackRate: number;
}

/**
 * Audio player class for managing sound playback.
 */
class AudioPlayer {
  private sound: Audio.Sound | null = null;
  private currentWordId: string | null = null;
  private playbackRate: number = AUDIO_CONFIG.DEFAULT_RATE;
  private isInitialized: boolean = false;
  
  /**
   * Initialize the audio system.
   * Call this once when the app starts.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }
  
  /**
   * Set the playback rate.
   */
  setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    
    // Update current sound if loaded
    if (this.sound) {
      this.sound.setRateAsync(rate, true).catch(console.error);
    }
  }
  
  /**
   * Get current playback rate.
   */
  getPlaybackRate(): number {
    return this.playbackRate;
  }
  
  /**
   * Play audio for a word.
   * If the same word is already loaded, replays it.
   * Otherwise, loads and plays the new word.
   */
  async playWord(wordId: string): Promise<void> {
    try {
      // If different word, unload current
      if (this.currentWordId !== wordId) {
        await this.unload();
        await this.loadWord(wordId);
      }
      
      // Play from beginning
      if (this.sound) {
        await this.sound.setPositionAsync(0);
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error(`Failed to play word "${wordId}":`, error);
    }
  }
  
  /**
   * Replay the current word.
   */
  async replay(): Promise<void> {
    if (!this.sound || !this.currentWordId) return;
    
    try {
      await this.sound.setPositionAsync(0);
      await this.sound.playAsync();
    } catch (error) {
      console.error('Failed to replay audio:', error);
    }
  }
  
  /**
   * Stop playback.
   */
  async stop(): Promise<void> {
    if (!this.sound) return;
    
    try {
      await this.sound.stopAsync();
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  }
  
  /**
   * Unload current sound to free resources.
   */
  async unload(): Promise<void> {
    if (!this.sound) return;
    
    try {
      await this.sound.unloadAsync();
    } catch (error) {
      console.error('Failed to unload audio:', error);
    } finally {
      this.sound = null;
      this.currentWordId = null;
    }
  }
  
  /**
   * Get current state.
   */
  async getState(): Promise<AudioPlayerState> {
    if (!this.sound) {
      return {
        isPlaying: false,
        isLoaded: false,
        playbackRate: this.playbackRate,
      };
    }
    
    try {
      const status: AVPlaybackStatus = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        return {
          isPlaying: status.isPlaying,
          isLoaded: true,
          playbackRate: this.playbackRate,
        };
      }
    } catch (error) {
      console.error('Failed to get audio state:', error);
    }
    
    return {
      isPlaying: false,
      isLoaded: false,
      playbackRate: this.playbackRate,
    };
  }
  
  /**
   * Load audio for a word.
   */
  private async loadWord(wordId: string): Promise<void> {
    try {
      // For production, audio files would be in assets/audio/words/
      // The require would be dynamic based on wordId
      // For now, we create a placeholder that handles missing files gracefully
      
      const { sound } = await Audio.Sound.createAsync(
        this.getWordAudioSource(wordId),
        {
          shouldPlay: false,
          rate: this.playbackRate,
          shouldCorrectPitch: true,
        }
      );
      
      this.sound = sound;
      this.currentWordId = wordId;
    } catch (error) {
      console.error(`Failed to load audio for "${wordId}":`, error);
      this.sound = null;
      this.currentWordId = null;
    }
  }
  
  /**
   * Get the audio source for a word.
   * In production, this would map to actual audio files.
   */
  private getWordAudioSource(wordId: string): { uri: string } {
    // Audio files should be named to match word IDs exactly
    // For now, return a placeholder URI structure
    // In production, use Asset.fromModule or bundled assets
    return { uri: `asset:/audio/words/${wordId}.mp3` };
  }
}

// Export singleton instance
export const audioPlayer = new AudioPlayer();

// Export class for testing
export { AudioPlayer };
