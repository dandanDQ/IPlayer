const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '../examples'),
  entry: {
    home: './index.js',
  },
  output: {
    filename: 'examples.js',
    clean: true
  },
  module: {
    rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.js$/,
            loader: 'babel-loader'
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-loader',
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
  plugins: [new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
        publicPath: 'auto',
        title: 'Iplayer',
        template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
};