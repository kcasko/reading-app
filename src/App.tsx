/**
 * App Entry Point
 * 
 * Main application component that sets up:
 * - Status bar styling
 * - Safe area provider
 * - Navigation
 * - Audio system initialization
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator';
import { colors } from './theme/colors';
import { typography } from './theme/typography';
import { initializeAudio, cleanupAudio } from './audio/SoundEffects';
import { loadCustomFonts } from './utils/fonts';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Initialize audio system and load fonts on app start
  useEffect(() => {
    const initialize = async () => {
      await initializeAudio();
      await loadCustomFonts();
      setFontsLoaded(true);
    };
    
    initialize();
    
    return () => {
      cleanupAudio();
    };
  }, []);
  
  // Show loading screen while fonts load
  if (!fontsLoaded) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

/**
 * Loading screen shown while app initializes.
 * Can be used in AppNavigator if needed.
 */
export function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 16,
  },
});
