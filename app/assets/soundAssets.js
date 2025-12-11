// Static sound asset map to avoid dynamic requires (Metro bundler safe)
const sounds = {
  cat: require('./sounds/cat.mp3'),
  dog: require('./sounds/dog.mp3'),
  sun: require('./sounds/sun.mp3'),
  ball: require('./sounds/ball.mp3'),
  tree: require('./sounds/tree.mp3'),
};

export default sounds;
