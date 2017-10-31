/* eslint-env node */
/* eslint import/no-nodejs-modules: 0 import/no-commonjs: 0 */

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
      'test/**': ['rollup', 'sourcemap'],
    },
    rollupPreprocessor: {
      plugins: [
        require('rollup-plugin-node-resolve')({
          jsnext: true,
          main: true,
        }),
        require('rollup-plugin-commonjs')(),
        require('rollup-plugin-replace')({
          'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        require('rollup-plugin-babel')({
          exclude: 'node_modules/**',
        }),
      ],
      format: 'iife',
      name: 'reactdygraphs',
      sourcemap: 'inline',
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
