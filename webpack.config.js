var path = require('path');
var jsSrc = path.join(__dirname, '/src');

module.exports = {
  entry: {
    index: path.join(jsSrc, '/index.jsx')
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/www'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders:  ['babel-loader'],
        include: [jsSrc]
      },
      {
        test: /\.md$/,
        loaders:  ['raw-loader']
      },
      {
        test: /\.jsx$/,
        loaders:  ['babel-loader', 'jsx-loader'],
        include: [jsSrc]
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  }
};
