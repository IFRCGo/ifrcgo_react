var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'main/static/main/js');
var APP_DIR = path.resolve(__dirname, 'main/jsx');

var config = {
  devtool: 'source-map',
  entry: {
  	helloworld: APP_DIR + '/hello_world.jsx'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  }
};

module.exports = config;