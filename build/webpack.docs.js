const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = require('./webpack.base.js');
const { merge } = require('webpack-merge');

const output = merge(defaultConfig, {
  mode: 'development',
  context: path.resolve(__dirname, '../examples'),
  entry: {
    home: './index.js',
  },
  output: {
    publicPath: '/IPlayer',
    path: path.resolve(__dirname, '../docs'),
    filename: 'index.js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      publicPath: 'auto',
      title: 'IPlayer',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
});

module.exports = output;
