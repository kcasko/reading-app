/**
 * Sound Effects - plays UI sounds and success chimes.
 * 
 * Simple, gentle sounds for positive reinforcement.
 * All sounds are optional and can be disabled.
 */

import { Audio } from 'expo-av';

let successSound: Audio.Sound | null = null;
let backgroundMusic: Audio.Sound | null = null;

/**
 * Initialize audio system.
 * Call this once on app startup.
 */
export async function initializeAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

/**
 * Play success chime (after completing a session).
 * Gentle, encouraging sound.
 */
export async function playSuccessSound(): Promise<void> {
  try {
    // Clean up previous sound instance
    if (successSound) {
      await successSound.unloadAsync();
      successSound = null;
    }

    // Load and play success sound
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/audio/ui/success.mp3'),
      { 
        shouldPlay: true,
        volume: 0.6, // Gentle volume
        isLooping: false
      }
    );
    
    successSound = sound;
    
    // Clean up after playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        if (successSound === sound) {
          successSound = null;
        }
      }
    });
    
  } catch (error) {
    console.error('Failed to play success sound:', error);
    // Fallback: log message if audio file is missing
    console.log('🎉 Success! (Add success.mp3 to assets/audio/ui/ for sound)');
  }
}

/**
 * Start background music (very subtle, optional).
 */
export async function startBackgroundMusic(volume: number = 0.3): Promise<void> {
  try {
    if (backgroundMusic) {
      await stopBackgroundMusic();
    }
    
    // Load and start background music
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/audio/ui/background.mp3'),
      { 
        isLooping: true, 
        volume,
        shouldPlay: true
      }
    );
    
    backgroundMusic = sound;
    
  } catch (error) {
    console.error('Failed to start background music:', error);
    // Fallback: log message if audio file is missing
    console.log(`🎵 Background music disabled (Add background.mp3 to assets/audio/ui/ for music)`);
  }
}

/**
 * Stop background music.
 */
export async function stopBackgroundMusic(): Promise<void> {
  try {
    if (backgroundMusic) {
      await backgroundMusic.stopAsync();
      await backgroundMusic.unloadAsync();
      backgroundMusic = null;
    }
  } catch (error) {
    console.error('Failed to stop background music:', error);
  }
}

/**
 * Set background music volume.
 */
export async function setBackgroundMusicVolume(volume: number): Promise<void> {
  try {
    if (backgroundMusic) {
      await backgroundMusic.setVolumeAsync(volume);
    }
  } catch (error) {
    console.error('Failed to set music volume:', error);
  }
}

/**
 * Clean up audio resources.
 */
export async function cleanupAudio(): Promise<void> {
  try {
    if (successSound) {
      await successSound.unloadAsync();
      successSound = null;
    }
    await stopBackgroundMusic();
  } catch (error) {
    console.error('Failed to cleanup audio:', error);
  }
}
