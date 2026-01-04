/**
 * Word list data for the reading app.
 * Each word is a concrete noun paired with a simple image.
 */

export type WordCategory = 'animals' | 'food' | 'objects' | 'vehicles';

export interface Word {
  /** Unique identifier for the word */
  id: string;
  
  /** The word text to display */
  text: string;
  
  /** Path to the image file (relative to assets/images/) */
  imagePath: string;
  
  /** Category label */
  category: WordCategory;
  
  /** Difficulty level (1 = easiest) */
  level: number;
}

/**
 * Simple animals - Level 1
 */
export const ANIMALS_LEVEL_1: Word[] = [
  { id: 'cat', text: 'cat', imagePath: 'animals/cat.png', category: 'animals', level: 1 },
  { id: 'dog', text: 'dog', imagePath: 'animals/dog.png', category: 'animals', level: 1 },
  { id: 'bird', text: 'bird', imagePath: 'animals/bird.png', category: 'animals', level: 1 },
  { id: 'fish', text: 'fish', imagePath: 'animals/fish.png', category: 'animals', level: 1 },
  { id: 'cow', text: 'cow', imagePath: 'animals/cow.png', category: 'animals', level: 1 },
  { id: 'pig', text: 'pig', imagePath: 'animals/pig.png', category: 'animals', level: 1 },
  { id: 'horse', text: 'horse', imagePath: 'animals/horse.png', category: 'animals', level: 1 },
  { id: 'duck', text: 'duck', imagePath: 'animals/duck.png', category: 'animals', level: 1 },
];

/**
 * Simple food - Level 1
 */
export const FOOD_LEVEL_1: Word[] = [
  { id: 'apple', text: 'apple', imagePath: 'food/apple.png', category: 'food', level: 1 },
  { id: 'banana', text: 'banana', imagePath: 'food/banana.png', category: 'food', level: 1 },
  { id: 'bread', text: 'bread', imagePath: 'food/bread.png', category: 'food', level: 1 },
  { id: 'milk', text: 'milk', imagePath: 'food/milk.png', category: 'food', level: 1 },
  { id: 'egg', text: 'egg', imagePath: 'food/egg.png', category: 'food', level: 1 },
  { id: 'cake', text: 'cake', imagePath: 'food/cake.png', category: 'food', level: 1 },
  { id: 'pizza', text: 'pizza', imagePath: 'food/pizza.png', category: 'food', level: 1 },
  { id: 'cookie', text: 'cookie', imagePath: 'food/cookie.png', category: 'food', level: 1 },
];

/**
 * Simple objects - Level 1
 */
export const OBJECTS_LEVEL_1: Word[] = [
  { id: 'ball', text: 'ball', imagePath: 'objects/ball.png', category: 'objects', level: 1 },
  { id: 'book', text: 'book', imagePath: 'objects/book.png', category: 'objects', level: 1 },
  { id: 'cup', text: 'cup', imagePath: 'objects/cup.png', category: 'objects', level: 1 },
  { id: 'chair', text: 'chair', imagePath: 'objects/chair.png', category: 'objects', level: 1 },
  { id: 'door', text: 'door', imagePath: 'objects/door.png', category: 'objects', level: 1 },
  { id: 'bed', text: 'bed', imagePath: 'objects/bed.png', category: 'objects', level: 1 },
  { id: 'table', text: 'table', imagePath: 'objects/table.png', category: 'objects', level: 1 },
  { id: 'hat', text: 'hat', imagePath: 'objects/hat.png', category: 'objects', level: 1 },
];

/**
 * Simple vehicles - Level 1
 */
export const VEHICLES_LEVEL_1: Word[] = [
  { id: 'car', text: 'car', imagePath: 'vehicles/car.png', category: 'vehicles', level: 1 },
  { id: 'bus', text: 'bus', imagePath: 'vehicles/bus.png', category: 'vehicles', level: 1 },
  { id: 'truck', text: 'truck', imagePath: 'vehicles/truck.png', category: 'vehicles', level: 1 },
  { id: 'train', text: 'train', imagePath: 'vehicles/train.png', category: 'vehicles', level: 1 },
  { id: 'boat', text: 'boat', imagePath: 'vehicles/boat.png', category: 'vehicles', level: 1 },
  { id: 'plane', text: 'plane', imagePath: 'vehicles/plane.png', category: 'vehicles', level: 1 },
  { id: 'bike', text: 'bike', imagePath: 'vehicles/bike.png', category: 'vehicles', level: 1 },
  { id: 'ship', text: 'ship', imagePath: 'vehicles/ship.png', category: 'vehicles', level: 1 },
];

/**
 * All available words.
 */
export const ALL_WORDS: Word[] = [
  ...ANIMALS_LEVEL_1,
  ...FOOD_LEVEL_1,
  ...OBJECTS_LEVEL_1,
  ...VEHICLES_LEVEL_1,
];

/**
 * Get words filtered by level.
 */
export function getWordsByLevel(level: number): Word[] {
  return ALL_WORDS.filter(word => word.level === level);
}

/**
 * Get words filtered by category.
 */
export function getWordsByCategory(category: WordCategory): Word[] {
  return ALL_WORDS.filter(word => word.category === category);
}

/**
 * Get a word by ID.
 */
export function getWordById(id: string): Word | undefined {
  return ALL_WORDS.find(word => word.id === id);
}

/**
 * Get all word IDs.
 */
export function getAllWordIds(): string[] {
  return ALL_WORDS.map(word => word.id);
}
