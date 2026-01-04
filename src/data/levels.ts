/**
 * Level definitions for progressive learning.
 */

export interface Level {
  /** Level number (1-based) */
  number: number;
  
  /** Display name for the level */
  name: string;
  
  /** Description for parents/teachers */
  description: string;
  
  /** Number of words to master before unlocking next level */
  wordsToUnlock: number;
}

/**
 * Available levels in the app.
 * Start simple - one level for MVP, structure ready for expansion.
 */
export const LEVELS: Level[] = [
  {
    number: 1,
    name: 'First Words',
    description: 'The most common sight words for beginning readers',
    wordsToUnlock: 10,
  },
  // Future levels can be added here:
  // {
  //   number: 2,
  //   name: 'Primer Words',
  //   description: 'Building on the basics with more common words',
  //   wordsToUnlock: 20,
  // },
];

/**
 * Get level by number.
 */
export function getLevelByNumber(levelNumber: number): Level | undefined {
  return LEVELS.find(level => level.number === levelNumber);
}

/**
 * Get the current level based on words mastered.
 */
export function getCurrentLevel(wordsMastered: number): Level {
  // Find the highest level where words mastered meets the threshold
  // Default to level 1 if no words mastered
  let currentLevel = LEVELS[0];
  
  for (const level of LEVELS) {
    const previousLevel = LEVELS.find(l => l.number === level.number - 1);
    const requiredWords = previousLevel?.wordsToUnlock ?? 0;
    
    if (wordsMastered >= requiredWords) {
      currentLevel = level;
    } else {
      break;
    }
  }
  
  return currentLevel;
}

/**
 * Check if a level is unlocked.
 */
export function isLevelUnlocked(levelNumber: number, wordsMastered: number): boolean {
  if (levelNumber === 1) return true;
  
  const previousLevel = getLevelByNumber(levelNumber - 1);
  if (!previousLevel) return false;
  
  return wordsMastered >= previousLevel.wordsToUnlock;
}
