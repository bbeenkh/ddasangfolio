import { defineConfig } from 'vitest/config'

/**
 * # defineNodeConfig
 * ---
 * - 간단설명: Node 환경 vitest 공통 설정 프리셋
 * - 제약사항: environment는 'node'로 고정, globals:true
 * ---
 * @param overrides vitest UserConfig 오버라이드 (deep merge)
 * ---
 * @example
 * // vitest.config.ts
 * import { defineNodeConfig } from '@fblg/testing-config'
 * export default defineNodeConfig()
 */
export function defineNodeConfig(
  overrides: { test?: { setupFiles?: string | string[]; [key: string]: unknown }; [key: string]: unknown } = {}
): ReturnType<typeof defineConfig> {
  const { test: overrideTest, ...restOverrides } = overrides
  const { setupFiles: extraSetup, ...restTest } = overrideTest ?? {}

  const extraSetupArray = extraSetup
    ? Array.isArray(extraSetup)
      ? extraSetup
      : [extraSetup]
    : []

  return defineConfig({
    ...restOverrides,
    test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      setupFiles: [...extraSetupArray],
      ...restTest,
    },
  })
}
