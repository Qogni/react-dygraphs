import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    root: './demo',
    resolve: {
      alias: {
        '@src': __dirname + '/src',
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      react({
        include: [
          './demo/*.{jsx,tsx}',
          './src/*.{jsx,tsx}',
        ],
      }),
    ],
    server: {
      port: 3000, // To run the app on port 3000
    },
  }
})
