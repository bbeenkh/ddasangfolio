import type { HttpHandler } from 'msw'

/**
 * # handlers
 * ---
 * - 간단설명: MSW request handler 목록
 * - 제약사항: 테스트별로 server.use()로 핸들러 추가 가능
 * ---
 * @example
 * // 특정 테스트에서 핸들러 추가
 * import { server } from '@/mocks/server'
 * import { http, HttpResponse } from 'msw'
 * server.use(http.get('/api/user', () => HttpResponse.json({ id: 1 })))
 */
export const handlers: HttpHandler[] = []
