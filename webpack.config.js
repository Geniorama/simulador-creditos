const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js']
  },

  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/'),
  },
  
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};