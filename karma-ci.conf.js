/* eslint-env node */

var path = require('path')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'test/index.js',
    ],
    exclude: [],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      module: {
        rules: [{
          test: /\.jsx?$/,
          enforce: 'pre',
          exclude: path.resolve('node_modules/'),
          loader: 'babel-loader'
        }]
      },
      resolve: {
        extensions: ['.js', '.json', '.jsx']
      },
      devtool: 'inline-source-map'
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  })
}
