/**
 * Profile Management - Multi-child support
 * 
 * Allows multiple children to have separate learning progress.
 * Each profile has independent:
 * - Word progress
 * - Settings
 * - Category selections
 * - Session history
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Profile represents one child using the app.
 */
export interface Profile {
  id: string;
  name: string;
  avatar: string; // Emoji representing the child
  createdAt: string; // ISO date string
}

/**
 * Storage keys for profiles.
 */
const STORAGE_KEYS = {
  PROFILES: '@ReadingApp:profiles',
  ACTIVE_PROFILE_ID: '@ReadingApp:activeProfileId',
  PROGRESS: (profileId: string) => `@ReadingApp:progress:${profileId}`,
  SETTINGS: (profileId: string) => `@ReadingApp:settings:${profileId}`,
  CATEGORIES: (profileId: string) => `@ReadingApp:selectedCategories:${profileId}`,
  LAST_SESSION: (profileId: string) => `@ReadingApp:lastSessionWords:${profileId}`,
  CELEBRATED: (profileId: string) => `@ReadingApp:celebratedWords:${profileId}`,
  STREAK: (profileId: string) => `@ReadingApp:streak:${profileId}`,
};

/**
 * Load all profiles.
 */
export async function loadProfiles(): Promise<Profile[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!json) return [];
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to load profiles:', error);
    return [];
  }
}

/**
 * Save profiles list.
 */
export async function saveProfiles(profiles: Profile[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  } catch (error) {
    console.error('Failed to save profiles:', error);
  }
}

/**
 * Create a new profile.
 */
export async function createProfile(name: string, avatar: string): Promise<Profile> {
  const profile: Profile = {
    id: `profile_${Date.now()}`,
    name,
    avatar,
    createdAt: new Date().toISOString(),
  };
  
  const profiles = await loadProfiles();
  profiles.push(profile);
  await saveProfiles(profiles);
  
  return profile;
}

/**
 * Delete a profile and all its data.
 */
export async function deleteProfile(profileId: string): Promise<void> {
  // Remove from profiles list
  const profiles = await loadProfiles();
  const filtered = profiles.filter(p => p.id !== profileId);
  await saveProfiles(filtered);
  
  // Remove all profile data
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PROGRESS(profileId),
      STORAGE_KEYS.SETTINGS(profileId),
      STORAGE_KEYS.CATEGORIES(profileId),
      STORAGE_KEYS.LAST_SESSION(profileId),
    ]);
  } catch (error) {
    console.error('Failed to delete profile data:', error);
  }
  
  // If this was the active profile, clear it
  const activeId = await getActiveProfileId();
  if (activeId === profileId) {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  }
}

/**
 * Get the currently active profile ID.
 */
export async function getActiveProfileId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  } catch (error) {
    console.error('Failed to get active profile ID:', error);
    return null;
  }
}

/**
 * Set the active profile.
 */
export async function setActiveProfileId(profileId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, profileId);
  } catch (error) {
    console.error('Failed to set active profile ID:', error);
  }
}

/**
 * Get the active profile object.
 */
export async function getActiveProfile(): Promise<Profile | null> {
  const profileId = await getActiveProfileId();
  if (!profileId) return null;
  
  const profiles = await loadProfiles();
  return profiles.find(p => p.id === profileId) || null;
}

/**
 * Update a profile's name or avatar.
 */
export async function updateProfile(profileId: string, updates: Partial<Pick<Profile, 'name' | 'avatar'>>): Promise<void> {
  const profiles = await loadProfiles();
  const index = profiles.findIndex(p => p.id === profileId);
  
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...updates };
    await saveProfiles(profiles);
  }
}

/**
 * Get profile-specific storage keys.
 */
export function getProfileStorageKeys(profileId: string) {
  return {
    progress: STORAGE_KEYS.PROGRESS(profileId),
    settings: STORAGE_KEYS.SETTINGS(profileId),
    categories: STORAGE_KEYS.CATEGORIES(profileId),
    lastSession: STORAGE_KEYS.LAST_SESSION(profileId),
    celebrated: STORAGE_KEYS.CELEBRATED(profileId),
    streak: STORAGE_KEYS.STREAK(profileId),
  };
}

/**
 * Get all profiles (alias for loadProfiles for compatibility).
 */
export async function getAllProfiles(): Promise<Profile[]> {
  return loadProfiles();
}

/**
 * Default avatars for profile creation.
 */
export const DEFAULT_AVATARS = [
  '👧', '👦', '🧒', '👶',
  '😊', '😄', '🤗', '🥰',
  '🐱', '🐶', '🐻', '🦁',
  '🌟', '🌈', '🎨', '📚',
];
