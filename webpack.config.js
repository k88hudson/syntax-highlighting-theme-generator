var jsSrc = __dirname + '/src';
var tests = __dirname + '/tests';

module.exports = {
  entry: {
    index: jsSrc + '/index.jsx',
    tests: tests + '/index.jsx'
  },
  devtool: 'source-map', // To support Firefox, switch to exec
  output: {
    path: __dirname + '/www',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders:  ['babel-loader'],
        include: [jsSrc, tests, __dirname + '/node_modules/react-composable-form']
      },
      {
        test: /\.md$/,
        loaders:  ['raw-loader']
      },
      {
        test: /\.jsx$/,
        loaders:  ['babel-loader', 'jsx-loader'],
        include: [jsSrc, tests, __dirname + '/node_modules/react-composable-form']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  }
};
