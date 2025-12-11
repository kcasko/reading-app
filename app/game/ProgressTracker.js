import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  progress: '@readingApp:progress',
  lessonsCompleted: '@readingApp:lessonsCompleted',
  accuracy: '@readingApp:accuracy',
  streak: '@readingApp:streak',
};

const ProgressTracker = {
  async saveProgress(data = {}) {
    try {
      const json = JSON.stringify(data);
      await AsyncStorage.setItem(KEYS.progress, json);
      return true;
    } catch (e) {
      console.warn('saveProgress error', e);
      return false;
    }
  },

  async loadProgress() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.progress);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('loadProgress error', e);
      return null;
    }
  },

  async incrementStreak() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.streak);
      const current = raw ? parseInt(raw, 10) || 0 : 0;
      const next = current + 1;
      await AsyncStorage.setItem(KEYS.streak, String(next));
      return next;
    } catch (e) {
      console.warn('incrementStreak error', e);
      return null;
    }
  },

  async resetStreak() {
    try {
      await AsyncStorage.setItem(KEYS.streak, '0');
      return 0;
    } catch (e) {
      console.warn('resetStreak error', e);
      return null;
    }
  },

  // return a normalized progress object
  async getProgress() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.progress);
      if (!raw) {
        const empty = { words: {}, lessonsCompleted: 0, totalAnswered: 0, totalCorrect: 0 };
        return empty;
      }
      const parsed = JSON.parse(raw);
      // ensure words map exists
      parsed.words = parsed.words || {};
      parsed.lessonsCompleted = parsed.lessonsCompleted || 0;
      parsed.totalAnswered = parsed.totalAnswered || 0;
      parsed.totalCorrect = parsed.totalCorrect || 0;
      return parsed;
    } catch (e) {
      console.warn('getProgress error', e);
      return { words: {}, lessonsCompleted: 0, totalAnswered: 0, totalCorrect: 0 };
    }
  },

  async markCorrect(word) {
    try {
      const progress = (await this.getProgress()) || { words: {} };
      const now = Date.now();
      const w = progress.words[word] || { level: 0, lastSeen: 0, nextDue: 0 };
      // increase level up to 4
      const newLevel = Math.min((w.level || 0) + 1, 4) || 1;
      const daysMap = { 1: 1, 2: 7, 3: 16, 4: 35 };
      const nextDue = now + (daysMap[newLevel] || 1) * 24 * 60 * 60 * 1000;
      progress.words[word] = { level: newLevel, lastSeen: now, nextDue };
      // update simple counters
      progress.lessonsCompleted = (progress.lessonsCompleted || 0) + 1;
      progress.totalAnswered = (progress.totalAnswered || 0) + 1;
      progress.totalCorrect = (progress.totalCorrect || 0) + 1;
      await this.saveProgress(progress);
      return progress.words[word];
    } catch (e) {
      console.warn('markCorrect error', e);
      return null;
    }
  },

  async markIncorrect(word) {
    try {
      const progress = (await this.getProgress()) || { words: {} };
      const now = Date.now();
      const newLevel = 1;
      const nextDue = now + 1 * 24 * 60 * 60 * 1000;
      progress.words[word] = { level: newLevel, lastSeen: now, nextDue };
      progress.totalAnswered = (progress.totalAnswered || 0) + 1;
      await this.saveProgress(progress);
      return progress.words[word];
    } catch (e) {
      console.warn('markIncorrect error', e);
      return null;
    }
  },

  KEYS,
};

export default ProgressTracker;
