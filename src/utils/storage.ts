import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for persisting app data locally.
 * Wraps AsyncStorage with typed methods and error handling.
 */

/**
 * Save a value to local storage.
 */
export async function saveToStorage<T>(key: string, value: T): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Failed to save to storage [${key}]:`, error);
    return false;
  }
}

/**
 * Load a value from local storage.
 * Returns null if the key doesn't exist or on error.
 */
export async function loadFromStorage<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Failed to load from storage [${key}]:`, error);
    return null;
  }
}

/**
 * Remove a value from local storage.
 */
export async function removeFromStorage(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove from storage [${key}]:`, error);
    return false;
  }
}

/**
 * Clear all app data from storage.
 * Use with caution - this removes all progress.
 */
export async function clearAllStorage(): Promise<boolean> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    // Only clear keys that belong to this app
    const appKeys = keys.filter(key => key.startsWith('@reading_app/'));
    await AsyncStorage.multiRemove(appKeys);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
}

/**
 * Check if storage is available and working.
 */
export async function isStorageAvailable(): Promise<boolean> {
  const testKey = '@reading_app/storage_test';
  try {
    await AsyncStorage.setItem(testKey, 'test');
    await AsyncStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
