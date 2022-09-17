const path = require('path');
const defaultConfig = require('./webpack.base.js');
const { merge } = require('webpack-merge');

const output = merge(defaultConfig, {
  mode: 'production',
  context: path.resolve(__dirname, '../src'),
  entry: {
    iplayer: './index.js',
  },
  externals: {
    'video.js': {
      root: 'videojs',
      commonjs: 'video.js',
      commonjs2: 'video.js',
      amd: 'videojs',
    },
  },
  output: {
    filename: '[name].js',
    library: 'IPlayer',
    libraryTarget: 'umd',
    clean: true,
  },
});
module.exports = output;
