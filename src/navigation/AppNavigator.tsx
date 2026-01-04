/**
 * App Navigator - Exposure-Based Learning
 * 
 * Wires up the new screens with exposure-based tracking.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ReviewScreen } from '../screens/ReviewScreen';
import { ProfileSelectorScreen } from '../screens/ProfileSelectorScreen';
import { CreateProfileScreen } from '../screens/CreateProfileScreen';
import { MasteryScreen } from '../screens/MasteryScreen';
import { StreakScreen } from '../screens/StreakScreen';
import DataManagementScreen from '../screens/DataManagementScreen';
import { useAppState } from '../state/useAppState';
import { colors } from '../theme/colors';

/**
 * Type definitions for navigation routes.
 */
export type RootStackParamList = {
  ProfileSelector: undefined;
  CreateProfile: undefined;
  Home: undefined;
  Lesson: undefined;
  Progress: undefined;
  Settings: undefined;
  Review: undefined;
  Mastery: { wordText: string; emoji: string };
  Streak: undefined;
  DataManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main app navigator component.
 */
export function AppNavigator() {
  const appState = useAppState();
  
  // Handle mastery celebration - navigate when triggered
  React.useEffect(() => {
    if (appState.newlyMasteredWord) {
      // We'll navigate to mastery screen from LessonScreen instead
      // This is just for reference
    }
  }, [appState.newlyMasteredWord]);
  
  // Show loading screen while initializing
  if (appState.isLoading) {
    return null; // Or a simple loading view
  }
  
  // If no active profile, show profile selector
  const initialRouteName = appState.activeProfile ? 'Home' : 'ProfileSelector';
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="root"
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        {/* Profile Screens */}
        <Stack.Screen name="ProfileSelector" component={ProfileSelectorScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        
        {/* Main App Screens */}
        <Stack.Screen name="Home">{(props) => (
            <HomeScreen
              {...props}
              stats={appState.stats}
              selectedCategories={appState.selectedCategories}
              lastSessionWords={appState.lastSessionWords}
              streakData={appState.streakData}
              onStartLesson={appState.startLesson}
              onStartReplaySession={appState.startReplaySession}
              onToggleCategory={appState.toggleCategory}
              onReloadProfile={appState.reloadProfile}
              activeProfile={appState.activeProfile}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen
          name="Lesson"
          options={{
            gestureEnabled: false, // Prevent accidental back swipe during lesson
          }}
        >
          {(props) => (
            <LessonScreen
              {...props}
              currentWord={appState.currentWord}
              currentWordProgress={appState.currentWordProgress}
              onWordExposed={appState.onWordExposed}
              onAudioPlayed={appState.onAudioPlayed}
              onNoImageSuccess={appState.onNoImageSuccess}
              onAdvance={appState.advanceToNextWord}
              wordsInSession={appState.wordsInSession}
              settings={appState.settings}
              newlyMasteredWord={appState.newlyMasteredWord}
              onClearMastery={appState.clearMasteryNotification}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Progress">
          {(props) => (
            <ProgressScreen
              {...props}
              stats={appState.stats}
              engineState={appState.engineState}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen
              {...props}
              settings={appState.settings}
              onUpdateSettings={appState.updateSettings}
              onResetProgress={appState.resetAllProgress}
              streakData={appState.streakData}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Streak">
          {(props) => (
            <StreakScreen
              {...props}
              streakData={appState.streakData}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen name="DataManagement">
          {(props) => (
            <DataManagementScreen
              {...props}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Review">
          {(props) => (
            <ReviewScreen
              {...props}
              engineState={appState.engineState}
              settings={appState.settings}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen
          name="Mastery"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        >
          {(props) => (
            <MasteryScreen
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
