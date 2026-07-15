// @ts-check
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const nextConfig = require('eslint-config-next/core-web-vitals')

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...(Array.isArray(nextConfig) ? nextConfig : [nextConfig]),
  {
    ignores: ['eslint.config.js', 'prettier.config.js', '.next/**'],
  },
]

export default eslintConfig
