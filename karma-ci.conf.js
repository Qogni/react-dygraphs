module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'test/index.ts',
      { pattern: 'test/specs/**/*' },
    ],
    exclude: [],
    preprocessors: {
      'test/**': ['webpack', 'sourcemap'],
    },
    webpack: {
      target: 'web',
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
          '@src': __dirname + '/src',
        },
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
