/* eslint-env node */
/* eslint import/no-nodejs-modules: 0 import/no-commonjs: 0 */

const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  target: 'web',
  entry: {
    main: [
      './demo/index.js',
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'React Dygraphs Demo',
      template: 'demo/index.ejs',
    }),
  ],
}

module.exports = config
