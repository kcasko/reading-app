/**
 * Data Manager - Enhanced offline-first data management with backup/restore
 * 
 * Provides:
 * - Complete data backup/export for profiles
 * - Data import/restore with conflict resolution
 * - Data integrity validation
 * - Storage optimization and cleanup
 * - Multi-device data transfer capabilities
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Profile, getAllProfiles, getProfileStorageKeys } from '../state/profileStore';
import { AppSettings } from '../state/progressStore';
import { WordProgress } from '../engine/SpacedRepetition';
import { StreakData } from '../state/streakStore';
import { WordCategory } from '../data/wordLists';

/**
 * Complete backup data structure
 */
export interface AppBackup {
  version: string;
  timestamp: string;
  deviceInfo: {
    platform: string;
    appVersion: string;
  };
  profiles: ProfileBackup[];
}

/**
 * Individual profile backup data
 */
export interface ProfileBackup {
  profile: Profile;
  progress: Record<string, WordProgress>;
  settings: AppSettings;
  selectedCategories: WordCategory[];
  lastSessionWords: string[];
  celebratedWords: string[];
  streakData: StreakData;
}

/**
 * Backup validation result
 */
export interface BackupValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  version?: string;
  profileCount?: number;
}

/**
 * Import options for conflict resolution
 */
export interface ImportOptions {
  overwriteExisting: boolean;
  mergeProgress: boolean; // If true, combines progress instead of overwriting
  createNewProfiles: boolean; // If false, skip profiles with conflicting names
}

/**
 * Create a complete backup of all app data
 */
export async function createFullBackup(): Promise<AppBackup | null> {
  try {
    console.log('Creating full app backup...');
    
    // Get all profiles
    const profiles = await getAllProfiles();
    const profileBackups: ProfileBackup[] = [];
    
    // Backup each profile's data
    for (const profile of profiles) {
      const storageKeys = getProfileStorageKeys(profile.id);
      
      // Load all profile data
      const [progress, settings, categoriesJson, lastSessionJson, celebratedJson, streakJson] = await Promise.all([
        AsyncStorage.getItem(storageKeys.progress),
        AsyncStorage.getItem(storageKeys.settings),
        AsyncStorage.getItem(storageKeys.categories),
        AsyncStorage.getItem(storageKeys.lastSession),
        AsyncStorage.getItem(storageKeys.celebrated),
        AsyncStorage.getItem(storageKeys.streak),
      ]);
      
      const profileBackup: ProfileBackup = {
        profile,
        progress: progress ? JSON.parse(progress) : {},
        settings: settings ? JSON.parse(settings) : {},
        selectedCategories: categoriesJson ? JSON.parse(categoriesJson) : ['animals'],
        lastSessionWords: lastSessionJson ? JSON.parse(lastSessionJson) : [],
        celebratedWords: celebratedJson ? JSON.parse(celebratedJson) : [],
        streakData: streakJson ? JSON.parse(streakJson) : {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
          totalDays: 0,
          activeDates: []
        },
      };
      
      profileBackups.push(profileBackup);
    }
    
    const backup: AppBackup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      deviceInfo: {
        platform: 'expo',
        appVersion: '1.0.0',
      },
      profiles: profileBackups,
    };
    
    console.log(`Backup created with ${profileBackups.length} profiles`);
    return backup;
    
  } catch (error) {
    console.error('Failed to create backup:', error);
    return null;
  }
}

/**
 * Export backup to file and share with user
 */
export async function exportBackupToFile(): Promise<boolean> {
  try {
    const backup = await createFullBackup();
    if (!backup) {
      return false;
    }
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, '-');
    const filename = `reading-app-backup-${timestamp}.json`;
    const filePath = `${FileSystem.documentDirectory}${filename}`;
    
    // Write backup to file
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(backup, null, 2));
    
    // Check if sharing is available and share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Save Reading App Backup',
        UTI: 'public.json',
      });
      
      console.log(`Backup exported to: ${filename}`);
      return true;
    } else {
      console.log('Sharing not available on this platform');
      return false;
    }
    
  } catch (error) {
    console.error('Failed to export backup:', error);
    return false;
  }
}

/**
 * Validate a backup file structure
 */
export function validateBackup(backup: any): BackupValidation {
  const validation: BackupValidation = {
    isValid: true,
    errors: [],
    warnings: [],
  };
  
  try {
    // Check required top-level fields
    if (!backup.version) {
      validation.errors.push('Missing backup version');
    } else {
      validation.version = backup.version;
    }
    
    if (!backup.timestamp) {
      validation.errors.push('Missing backup timestamp');
    }
    
    if (!backup.profiles || !Array.isArray(backup.profiles)) {
      validation.errors.push('Invalid or missing profiles array');
    } else {
      validation.profileCount = backup.profiles.length;
      
      // Validate each profile
      backup.profiles.forEach((profileBackup: any, index: number) => {
        if (!profileBackup.profile) {
          validation.errors.push(`Profile ${index}: Missing profile data`);
        } else {
          if (!profileBackup.profile.id) {
            validation.errors.push(`Profile ${index}: Missing profile ID`);
          }
          if (!profileBackup.profile.name) {
            validation.errors.push(`Profile ${index}: Missing profile name`);
          }
        }
        
        if (!profileBackup.progress || typeof profileBackup.progress !== 'object') {
          validation.warnings.push(`Profile ${index}: Missing or invalid progress data`);
        }
        
        if (!profileBackup.settings || typeof profileBackup.settings !== 'object') {
          validation.warnings.push(`Profile ${index}: Missing or invalid settings data`);
        }
      });
    }
    
    // Version compatibility check
    if (backup.version !== '1.0') {
      validation.warnings.push(`Backup version ${backup.version} may not be fully compatible`);
    }
    
    validation.isValid = validation.errors.length === 0;
    
  } catch {
    validation.isValid = false;
    validation.errors.push('Invalid JSON structure');
  }
  
  return validation;
}

/**
 * Import backup from file
 */
export async function importBackupFromFile(options: ImportOptions = {
  overwriteExisting: false,
  mergeProgress: true,
  createNewProfiles: true,
}): Promise<{ success: boolean; message: string; profilesImported: number }> {
  try {
    // Let user pick a backup file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });
    
    if (result.canceled) {
      return { success: false, message: 'Import cancelled by user', profilesImported: 0 };
    }
    
    // Read the backup file
    const backupContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const backup = JSON.parse(backupContent);
    
    // Validate backup structure
    const validation = validateBackup(backup);
    if (!validation.isValid) {
      return { 
        success: false, 
        message: `Invalid backup file: ${validation.errors.join(', ')}`, 
        profilesImported: 0 
      };
    }
    
    // Import profiles
    let profilesImported = 0;
    const existingProfiles = await getAllProfiles();
    const existingNames = existingProfiles.map((p: Profile) => p.name.toLowerCase());
    
    for (const profileBackup of backup.profiles) {
      try {
        const profileName = profileBackup.profile.name.toLowerCase();
        const profileExists = existingNames.includes(profileName);
        
        if (profileExists && !options.overwriteExisting) {
          if (!options.createNewProfiles) {
            console.log(`Skipping existing profile: ${profileBackup.profile.name}`);
            continue;
          }
          // Create with modified name
          profileBackup.profile.name = `${profileBackup.profile.name} (Imported)`;
          profileBackup.profile.id = `${profileBackup.profile.id}-imported-${Date.now()}`;
        }
        
        // Import profile data
        await importProfileData(profileBackup, options);
        profilesImported++;
        
      } catch (error) {
        console.error(`Failed to import profile ${profileBackup.profile.name}:`, error);
      }
    }
    
    const message = profilesImported > 0 
      ? `Successfully imported ${profilesImported} profile(s)`
      : 'No profiles were imported';
      
    return { success: profilesImported > 0, message, profilesImported };
    
  } catch (error) {
    console.error('Failed to import backup:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error during import',
      profilesImported: 0 
    };
  }
}

/**
 * Import a single profile's data
 */
async function importProfileData(profileBackup: ProfileBackup, options: ImportOptions): Promise<void> {
  const storageKeys = getProfileStorageKeys(profileBackup.profile.id);
  
  // Save profile
  const profiles = await getAllProfiles();
  const updatedProfiles = [...profiles, profileBackup.profile];
  await AsyncStorage.setItem('@ReadingApp:profiles', JSON.stringify(updatedProfiles));
  
  // Import progress data
  if (options.mergeProgress) {
    // Load existing progress and merge
    const existingProgressJson = await AsyncStorage.getItem(storageKeys.progress);
    const existingProgress = existingProgressJson ? JSON.parse(existingProgressJson) : {};
    
    // Merge progress (keeping higher exposure counts)
    const mergedProgress = { ...existingProgress };
    Object.entries(profileBackup.progress).forEach(([wordId, newProgress]) => {
      const existing = mergedProgress[wordId];
      if (!existing || (newProgress as WordProgress).exposureCount > existing.exposureCount) {
        mergedProgress[wordId] = newProgress;
      }
    });
    
    await AsyncStorage.setItem(storageKeys.progress, JSON.stringify(mergedProgress));
  } else {
    await AsyncStorage.setItem(storageKeys.progress, JSON.stringify(profileBackup.progress));
  }
  
  // Import other data
  await AsyncStorage.setItem(storageKeys.settings, JSON.stringify(profileBackup.settings));
  await AsyncStorage.setItem(storageKeys.categories, JSON.stringify(profileBackup.selectedCategories));
  await AsyncStorage.setItem(storageKeys.lastSession, JSON.stringify(profileBackup.lastSessionWords));
  await AsyncStorage.setItem(storageKeys.celebrated, JSON.stringify(profileBackup.celebratedWords));
  await AsyncStorage.setItem(storageKeys.streak, JSON.stringify(profileBackup.streakData));
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<{
  totalKeys: number;
  estimatedSize: string;
  profileCount: number;
  keysPerProfile: number;
}> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const readingAppKeys = allKeys.filter(key => key.startsWith('@ReadingApp:'));
    
    // Estimate total storage size
    let totalSize = 0;
    for (const key of readingAppKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }
    
    const profiles = await getAllProfiles();
    
    return {
      totalKeys: readingAppKeys.length,
      estimatedSize: formatBytes(totalSize),
      profileCount: profiles.length,
      keysPerProfile: profiles.length > 0 ? Math.round(readingAppKeys.length / profiles.length) : 0,
    };
    
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      totalKeys: 0,
      estimatedSize: '0 B',
      profileCount: 0,
      keysPerProfile: 0,
    };
  }
}

/**
 * Clean up orphaned storage keys (keys without associated profiles)
 */
export async function cleanupOrphanedData(): Promise<{ cleaned: number; errors: string[] }> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const readingAppKeys = allKeys.filter(key => key.startsWith('@ReadingApp:'));
    const profiles = await getAllProfiles();
    const validProfileIds = profiles.map((p: Profile) => p.id);
    
    const orphanedKeys: string[] = [];
    const errors: string[] = [];
    
    for (const key of readingAppKeys) {
      // Skip global keys
      if (key === '@ReadingApp:profiles' || key === '@ReadingApp:activeProfile') {
        continue;
      }
      
      // Extract profile ID from key
      const match = key.match(/@ReadingApp:\w+:(.+)/);
      if (match) {
        const profileId = match[1];
        if (!validProfileIds.includes(profileId)) {
          orphanedKeys.push(key);
        }
      }
    }
    
    // Remove orphaned keys
    for (const key of orphanedKeys) {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        errors.push(`Failed to remove ${key}: ${error}`);
      }
    }
    
    console.log(`Cleaned up ${orphanedKeys.length} orphaned storage keys`);
    return { cleaned: orphanedKeys.length, errors };
    
  } catch (error) {
    console.error('Failed to cleanup orphaned data:', error);
    return { cleaned: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] };
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}