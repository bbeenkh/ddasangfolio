// @ts-check
import nextPlugin from '@next/eslint-plugin-next'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  nextPlugin.flatConfig.coreWebVitals,
  {
    ignores: ['eslint.config.js', 'prettier.config.js', '.next/**'],
  },
]

export default eslintConfig
