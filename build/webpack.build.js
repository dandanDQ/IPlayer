const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '../src'),
  entry: {
    'iplayer': './index.js',
  },
  externals: {
    'video.js': {
        root: 'videojs',
        commonjs: 'video.js',
        commonjs2: 'video.js',
        amd: 'videojs'
    },
  },
  output: {
    filename: '[name].js',
    library: 'IPlayer',
    libraryTarget: 'umd',
    clean: true
  },
  module: {
    rules: [
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.js$/,
            loader: 'babel-loader'
        },
        {
          test: /\.(s)?css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [new VueLoaderPlugin()],
};