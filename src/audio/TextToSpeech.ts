/**
 * Text-to-Speech - handles word pronunciation using expo-speech.
 * 
 * CORE PRINCIPLES:
 * - Works offline always
 * - Instant and reliable
 * - Calm, neutral voice options
 * - No internet required
 */

import * as Speech from 'expo-speech';

export type VoiceType = 'default' | 'male' | 'female' | 'child';

interface SpeechOptions {
  rate?: number;
  voice?: VoiceType;
}

/**
 * Get voice configuration based on type.
 * Note: expo-speech uses system voices, so these are guidelines.
 * Actual voice varies by device.
 */
function getVoiceConfig(voiceType: VoiceType): { pitch: number; language: string } {
  switch (voiceType) {
    case 'male':
      return { pitch: 0.9, language: 'en-US' };
    case 'female':
      return { pitch: 1.1, language: 'en-US' };
    case 'child':
      return { pitch: 1.3, language: 'en-US' };
    default:
      return { pitch: 1.0, language: 'en-US' };
  }
}

/**
 * Speak a word using text-to-speech.
 * Returns a promise that resolves when speech is complete.
 */
export async function speakWord(
  word: string, 
  options: SpeechOptions = {}
): Promise<void> {
  const { rate = 0.75, voice = 'default' } = options;
  const voiceConfig = getVoiceConfig(voice);
  
  return new Promise((resolve, reject) => {
    try {
      Speech.speak(word, {
        language: voiceConfig.language,
        pitch: voiceConfig.pitch,
        rate, // Child-friendly pace
        onDone: () => resolve(),
        onError: (error) => {
          console.error('Speech error:', error);
          reject(error);
        },
      });
    } catch (error) {
      console.error('Failed to speak:', error);
      reject(error);
    }
  });
}

/**
 * Stop any currently playing speech.
 */
export function stopSpeaking(): void {
  Speech.stop();
}

/**
 * Check if speech is currently active.
 */
export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
