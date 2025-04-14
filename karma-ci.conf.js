module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'test/index.js',
      { pattern: 'test/specs/**' },
    ],
    exclude: [],
    preprocessors: {
      'test/**': ['webpack', 'sourcemap'],
    },
    webpack: {
      target: 'web',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
          },
        ],
      },
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
    },
    webpackMiddleware: {
      noInfo: true,
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
  })
}
