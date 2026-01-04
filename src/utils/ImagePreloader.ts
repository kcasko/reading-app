/**
 * ImagePreloader - Preloads word images to reduce lag during lessons
 * 
 * Uses expo-asset to preload images in the background while user is
 * engaging with current word. Manages memory efficiently by only
 * keeping next 5 images preloaded.
 */

import { Asset } from 'expo-asset';

/**
 * Preloaded image cache.
 * Maps image paths to preloaded Asset objects.
 */
const preloadedImages = new Map<string, Asset>();

/**
 * Currently preloading promises to avoid duplicate preloads
 */
const preloadingPromises = new Map<string, Promise<Asset>>();

/**
 * Get the require() statement for a given image path.
 * This maps to the same system used in WordCard.tsx
 */
function getImageRequire(imagePath: string): number | null {
  // Map image paths to require() statements
  // This allows images to be bundled with the app
  const imageMap: Record<string, any> = {
    // Animals
    'animals/cat.png': require('../../assets/images/animals/cat.png'),
    'animals/dog.png': require('../../assets/images/animals/dog.png'),
    'animals/bird.png': require('../../assets/images/animals/bird.png'),
    'animals/fish.png': require('../../assets/images/animals/fish.png'),
    'animals/cow.png': require('../../assets/images/animals/cow.png'),
    'animals/pig.png': require('../../assets/images/animals/pig.png'),
    'animals/horse.png': require('../../assets/images/animals/horse.png'),
    'animals/duck.png': require('../../assets/images/animals/duck.png'),
    
    // Food
    'food/apple.png': require('../../assets/images/food/apple.png'),
    'food/banana.png': require('../../assets/images/food/banana.png'),
    'food/bread.png': require('../../assets/images/food/bread.png'),
    'food/milk.png': require('../../assets/images/food/milk.png'),
    'food/egg.png': require('../../assets/images/food/egg.png'),
    'food/cake.png': require('../../assets/images/food/cake.png'),
    'food/pizza.png': require('../../assets/images/food/pizza.png'),
    'food/cookie.png': require('../../assets/images/food/cookie.png'),
    
    // Objects
    'objects/ball.png': require('../../assets/images/objects/ball.png'),
    'objects/book.png': require('../../assets/images/objects/book.png'),
    'objects/chair.png': require('../../assets/images/objects/chair.png'),
    'objects/table.png': require('../../assets/images/objects/table.png'),
    'objects/door.png': require('../../assets/images/objects/door.png'),
    'objects/window.png': require('../../assets/images/objects/window.png'),
    'objects/cup.png': require('../../assets/images/objects/cup.png'),
    'objects/phone.png': require('../../assets/images/objects/phone.png'),
    
    // Vehicles
    'vehicles/car.png': require('../../assets/images/vehicles/car.png'),
    'vehicles/bus.png': require('../../assets/images/vehicles/bus.png'),
    'vehicles/bike.png': require('../../assets/images/vehicles/bike.png'),
    'vehicles/train.png': require('../../assets/images/vehicles/train.png'),
    'vehicles/plane.png': require('../../assets/images/vehicles/plane.png'),
    'vehicles/boat.png': require('../../assets/images/vehicles/boat.png'),
    'vehicles/truck.png': require('../../assets/images/vehicles/truck.png'),
    'vehicles/motorcycle.png': require('../../assets/images/vehicles/motorcycle.png'),
  };
  
  return imageMap[imagePath] || null;
}

/**
 * Preload a single image asset.
 */
async function preloadImage(imagePath: string): Promise<Asset | null> {
  try {
    // Check if already preloaded
    if (preloadedImages.has(imagePath)) {
      return preloadedImages.get(imagePath)!;
    }
    
    // Check if currently preloading
    if (preloadingPromises.has(imagePath)) {
      return await preloadingPromises.get(imagePath)!;
    }
    
    // Get the require() number for this path
    const imageRequire = getImageRequire(imagePath);
    if (!imageRequire) {
      console.warn(`Image not found for path: ${imagePath}`);
      return null;
    }
    
    // Start preloading
    const preloadPromise = Asset.fromModule(imageRequire).downloadAsync();
    preloadingPromises.set(imagePath, preloadPromise);
    
    const asset = await preloadPromise;
    
    // Cache the result
    preloadedImages.set(imagePath, asset);
    preloadingPromises.delete(imagePath);
    
    return asset;
    
  } catch (error) {
    console.error(`Failed to preload image ${imagePath}:`, error);
    preloadingPromises.delete(imagePath);
    return null;
  }
}

/**
 * Preload multiple images in parallel.
 * 
 * @param imagePaths Array of image paths to preload
 * @returns Promise that resolves when all images are preloaded (or failed)
 */
export async function preloadImages(imagePaths: string[]): Promise<void> {
  try {
    // Filter out paths that are already preloaded or preloading
    const pathsToPreload = imagePaths.filter(path => 
      !preloadedImages.has(path) && !preloadingPromises.has(path)
    );
    
    if (pathsToPreload.length === 0) {
      return; // All images already preloaded
    }
    
    // Preload all images in parallel
    const preloadPromises = pathsToPreload.map(path => preloadImage(path));
    await Promise.allSettled(preloadPromises);
    
  } catch (error) {
    console.error('Failed to preload images:', error);
  }
}

/**
 * Get the next N word image paths from the lesson queue.
 * This helps determine which images to preload.
 * 
 * @param currentWord Current word being shown
 * @param upcomingWords Array of upcoming words in lesson
 * @param maxCount Maximum number of images to preload (default: 5)
 * @returns Array of image paths to preload
 */
export function getImagePathsToPreload(
  currentWord: { imagePath: string } | null,
  upcomingWords: { imagePath: string }[],
  maxCount: number = 5
): string[] {
  const paths: string[] = [];
  
  // Always preload current word's image if we have one
  if (currentWord?.imagePath) {
    paths.push(currentWord.imagePath);
  }
  
  // Add upcoming word images up to maxCount
  for (const word of upcomingWords) {
    if (paths.length >= maxCount) break;
    if (!paths.includes(word.imagePath)) {
      paths.push(word.imagePath);
    }
  }
  
  return paths;
}

/**
 * Check if an image is preloaded and ready.
 * 
 * @param imagePath Path to the image
 * @returns true if image is preloaded, false otherwise
 */
export function isImagePreloaded(imagePath: string): boolean {
  return preloadedImages.has(imagePath);
}

/**
 * Clear preloaded images that are no longer needed.
 * Helps manage memory by removing old preloaded images.
 * 
 * @param keepPaths Array of image paths to keep in cache
 */
export function cleanupPreloadedImages(keepPaths: string[]): void {
  try {
    const pathsToRemove: string[] = [];
    
    // Find images that are no longer needed
    for (const path of Array.from(preloadedImages.keys())) {
      if (!keepPaths.includes(path)) {
        pathsToRemove.push(path);
      }
    }
    
    // Remove unused images from cache
    for (const path of pathsToRemove) {
      preloadedImages.delete(path);
    }
    
    if (pathsToRemove.length > 0) {
      console.log(`Cleaned up ${pathsToRemove.length} preloaded images`);
    }
    
  } catch (error) {
    console.error('Failed to cleanup preloaded images:', error);
  }
}

/**
 * Get statistics about the preloader cache.
 * Useful for debugging and monitoring memory usage.
 */
export function getPreloaderStats() {
  return {
    preloadedCount: preloadedImages.size,
    preloadingCount: preloadingPromises.size,
    preloadedPaths: Array.from(preloadedImages.keys()),
    preloadingPaths: Array.from(preloadingPromises.keys()),
  };
}

/**
 * Clear all preloaded images from memory.
 * Use sparingly - typically only on app shutdown or memory pressure.
 */
export function clearAllPreloadedImages(): void {
  preloadedImages.clear();
  preloadingPromises.clear();
  console.log('Cleared all preloaded images');
}