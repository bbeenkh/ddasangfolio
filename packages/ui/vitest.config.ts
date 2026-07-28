import { defineReactConfig } from '@fblg/testing-config'

export default defineReactConfig({
  test: {
    setupFiles: ['@fblg/testing-config/setup/radix-polyfill'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib/components/original/**',
    ],
  },
})
