import { defineWorkspace } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineWorkspace([
  {
    resolve: {
      alias: {
        '@src': __dirname + '/src',
      },
    },
    test: {
      globals: true,
      include: [
        __dirname + '/test/node/**/*.{test,spec}.ts',
        __dirname + '/test/node/**/*.{test,spec}.tsx',
      ],
      name: 'unit',
      environment: 'jsdom',
    },
  },
  {
    plugins: [react()],
    resolve: {
      alias: {
        '@src': __dirname + '/src',
      },
    },
    test: {
      globals: true,
      include: [
        __dirname + '/test/browser/**/*.{test,spec}.ts',
        __dirname + '/test/browser/**/*.{test,spec}.tsx',
      ],
      name: 'browser',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        // https://vitest.dev/guide/browser/playwright
        instances: [
          {
            browser: 'chromium',
          },
        ],
      },
    },
  },
])
