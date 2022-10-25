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
    publicPath: '/',
    path: path.resolve(__dirname, '../docs'),
    filename: 'index.js',
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    open: true,
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
