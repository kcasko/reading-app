// Static image asset map to avoid dynamic requires (Metro bundler safe)
const images = {
  cat: require('./images/cat.png'),
  dog: require('./images/dog.png'),
  sun: require('./images/sun.png'),
  ball: require('./images/ball.png'),
  tree: require('./images/tree.png'),
};

export default images;
