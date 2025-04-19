const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  mode: 'development',
  target: 'web',
  entry: {
    main: [
      './demo/index.js',
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', 'ts', 'tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(d\.ts)$/,
        use: [
          {
            loader: 'null-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        loader: 'ts-loader',
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
