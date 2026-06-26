import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { errorHandler } from './error-handler.js'
import { HttpError } from '../../shared/errors/http-error.js'

function createTestApp() {
  const app = new Hono()
  app.onError(errorHandler)

  app.get('/http-error', () => {
    throw new HttpError(404, '찾을 수 없습니다')
  })
  app.get('/unknown-error', () => {
    throw new Error('예상치 못한 오류')
  })
  return app
}

describe('errorHandler', () => {
  it('HttpError를 해당 상태코드와 메시지로 응답한다', async () => {
    const app = createTestApp()
    const res = await app.request('/http-error')

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toBe('찾을 수 없습니다')
  })

  it('알 수 없는 에러는 500으로 응답한다', async () => {
    const app = createTestApp()
    const res = await app.request('/unknown-error')

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toBe('서버 내부 오류가 발생했습니다')
  })
})
