/// <reference types="vitest/globals" />
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * # server
 * ---
 * - 간단설명: vitest 테스트용 MSW Node 서버
 * - 제약사항: vitest setupFiles에서 자동으로 생명주기 등록됨
 * ---
 */
export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
