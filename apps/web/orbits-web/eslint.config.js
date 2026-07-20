// @ts-check
import { config } from '@fblg/eslint-config/react-internal'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...config,
  {
    ignores: ['eslint.config.js', 'dist/**'],
  },
]

export default eslintConfig
