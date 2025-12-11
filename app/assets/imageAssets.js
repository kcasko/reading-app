// Static image asset map to avoid dynamic requires (Metro bundler safe)
const imageAssets = {
  // existing images
  cat: require('./images/cat.png'),
  dog: require('./images/dog.png'),
  sun: require('./images/sun.png'),
  ball: require('./images/ball.png'),
  tree: require('./images/tree.png'),

  // map word keys to available placeholder images so ImageReward finds a source
  i: require('./images/cat.png'),
  a: require('./images/dog.png'),
  the: require('./images/tree.png'),
  is: require('./images/sun.png'),
  it: require('./images/ball.png'),
  can: require('./images/dog.png'),
  see: require('./images/sun.png'),
  like: require('./images/ball.png'),
  go: require('./images/dog.png'),
  said: require('./images/cat.png'),
};

// default export for backward compatibility
export default imageAssets;
