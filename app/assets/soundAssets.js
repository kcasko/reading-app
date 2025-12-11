// Static sound asset map to avoid dynamic requires (Metro bundler safe)
const soundAssets = {
  // existing generic assets
  cat: require('./sounds/cat.mp3'),
  dog: require('./sounds/dog.mp3'),
  sun: require('./sounds/sun.mp3'),
  ball: require('./sounds/ball.mp3'),
  tree: require('./sounds/tree.mp3'),

  // word-level audio keys (map to available placeholders)
  i: require('./sounds/cat.mp3'),
  a: require('./sounds/cat.mp3'),
  the: require('./sounds/dog.mp3'),
  is: require('./sounds/dog.mp3'),
  it: require('./sounds/dog.mp3'),
  can: require('./sounds/ball.mp3'),
  see: require('./sounds/sun.mp3'),
  like: require('./sounds/ball.mp3'),
  go: require('./sounds/dog.mp3'),
  said: require('./sounds/cat.mp3'),

  // phoneme/grapheme audio keys used by WordCard/lesson
  phoneme_i: require('./sounds/cat.mp3'),
  phoneme_a: require('./sounds/cat.mp3'),
  phoneme_th: require('./sounds/dog.mp3'),
  phoneme_e: require('./sounds/dog.mp3'),
  phoneme_s: require('./sounds/cat.mp3'),
  phoneme_t: require('./sounds/dog.mp3'),
  phoneme_c: require('./sounds/ball.mp3'),
  phoneme_n: require('./sounds/ball.mp3'),
  phoneme_ee: require('./sounds/sun.mp3'),
  phoneme_l: require('./sounds/ball.mp3'),
  phoneme_ke: require('./sounds/ball.mp3'),
  phoneme_g: require('./sounds/dog.mp3'),
  phoneme_o: require('./sounds/dog.mp3'),
  phoneme_ai: require('./sounds/cat.mp3'),
};

// default export for compatibility with AudioPlayer
export default soundAssets;
