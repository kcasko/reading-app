/**
 * Font loading utility for custom fonts.
 * Loads OpenDyslexic fonts if available.
 */

import * as Font from 'expo-font';

/**
 * Load custom fonts for the app.
 * Returns true if fonts loaded successfully, false otherwise.
 */
export async function loadCustomFonts(): Promise<boolean> {
  try {
    await Font.loadAsync({
      'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
      'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    });
    return true;
  } catch (error) {
    // Font files not found - app will fall back to system fonts
    console.log('Custom fonts not available, using system fonts:', error);
    return false;
  }
}
