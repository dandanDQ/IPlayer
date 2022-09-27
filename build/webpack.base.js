const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: path.resolve(__dirname, '../src/assets/icons'),
        // options: {
        //   symbolId: '[name]',
        // },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(s)?css$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [new VueLoaderPlugin()],
};
