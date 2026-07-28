import { defineReactConfig } from '@fblg/testing-config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineReactConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    setupFiles: ['./src/mocks/server.ts'],
    passWithNoTests: true,
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
    env: {
      NEXT_PUBLIC_API_URL: 'http://localhost:8080',
    },
  },
})
