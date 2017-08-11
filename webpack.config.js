var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, './');
const JSX_DIR = path.resolve(__dirname, 'main/jsx');
const SCSS_DIR = path.resolve(__dirname, 'main/scss');

const config = {
  devtool: 'source-map',
  entry: {
  	'main/static/main/js/build/helloworld.js': JSX_DIR + '/hello_world.jsx',
    'main/static/main/css/build/main.css': SCSS_DIR + '/main.scss'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : JSX_DIR,
        loader : 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]',
      allChunks: true,
    })
  ],
  output: {
    path: BUILD_DIR,
    filename: '[name]'
  }
};

module.exports = config;