import { defineConfig } from 'vitest/config'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

/**
 * CSS와 SVG 파일을 테스트 환경에서 빈/모의 모듈로 처리하는 플러그인
 * - .css → 빈 문자열
 * - .svg → React 컴포넌트 mock
 */
const mockStaticAssetsPlugin: Plugin = {
  name: 'mock-static-assets',
  resolveId(id: string) {
    if (id.endsWith('.css')) return '\0mock-css'
    const cleanId = id.split('?')[0] ?? id
    if (cleanId.endsWith('.svg')) return '\0mock-svg'
  },
  load(id: string) {
    if (id === '\0mock-css') return ''
    if (id === '\0mock-svg') {
      return `
        import React from 'react';
        const SvgMock = (props) => React.createElement('svg', props);
        export default SvgMock;
        export const ReactComponent = SvgMock;
      `
    }
  },
}

/**
 * # defineReactConfig
 * ---
 * - 간단설명: React/jsdom 환경 vitest 공통 설정 프리셋
 * - 제약사항: environment는 'jsdom'으로 고정, globals:true, @testing-library/jest-dom 자동 포함
 * - CSS/SVG 파일은 자동으로 mock 처리됨
 * ---
 * @param overrides vitest UserConfig 오버라이드 (setupFiles는 기본값에 추가됨)
 * ---
 * @example
 * // vitest.config.ts
 * import { defineReactConfig } from '@fblg/testing-config'
 * export default defineReactConfig({
 *   test: { setupFiles: ['@fblg/testing-config/setup/radix-polyfill'] }
 * })
 */
export function defineReactConfig(overrides: UserConfig = {}): ReturnType<typeof defineConfig> {
  const { test: overrideTest, plugins: extraPlugins = [], ...restOverrides } = overrides
  const { setupFiles: extraSetup, ...restTest } = (overrideTest ?? {}) as UserConfig['test'] & {
    setupFiles?: string | string[]
  }

  const extraSetupArray = extraSetup
    ? Array.isArray(extraSetup)
      ? extraSetup
      : [extraSetup]
    : []

  return defineConfig({
    plugins: [react(), mockStaticAssetsPlugin, ...extraPlugins],
    ...restOverrides,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['@fblg/testing-config/setup/jest-dom', ...extraSetupArray],
      exclude: ['**/node_modules/**', '**/dist/**'],
      ...restTest,
    },
  })
}
