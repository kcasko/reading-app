// Static image asset map to avoid dynamic requires (Metro bundler safe)
export const imageAssets = {
  cat: require('./images/cat.png'),
  dog: require('./images/dog.png'),
  sun: require('./images/sun.png'),
  ball: require('./images/ball.png'),
  tree: require('./images/tree.png'),
};

// default export for backward compatibility
export default imageAssets;
