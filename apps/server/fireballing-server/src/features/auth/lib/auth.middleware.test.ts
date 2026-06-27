import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

const mockGetUser = vi.fn()

vi.mock('../../../shared/lib/supabase.js', () => ({
  createSupabaseClientWithToken: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

vi.mock('../../../shared/config/env.js', () => ({
  loadEnv: () => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
    SUPABASE_JWT_SECRET: 'test-secret',
    PORT: 3001,
  }),
}))

import { authMiddleware } from './auth.middleware.js'

function createTestApp() {
  const app = new Hono()
  app.use('/protected/*', authMiddleware)
  app.get('/protected/test', (c) => {
    return c.json({ userId: c.get('userId' as any) })
  })
  return app
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Authorization 헤더가 없으면 401을 반환한다', async () => {
    const app = createTestApp()
    const res = await app.request('/protected/test')

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.error).toBe('인증 토큰이 필요합니다')
  })

  it('Bearer 형식이 아니면 401을 반환한다', async () => {
    const app = createTestApp()
    const res = await app.request('/protected/test', {
      headers: { Authorization: 'Basic abc123' },
    })

    expect(res.status).toBe(401)
  })

  it('유효한 토큰이면 userId를 설정하고 다음 핸들러를 호출한다', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@test.com',
          user_metadata: {},
        },
      },
      error: null,
    })

    const app = createTestApp()
    const res = await app.request('/protected/test', {
      headers: { Authorization: 'Bearer valid-token' },
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.userId).toBe('user-123')
  })

  it('유효하지 않은 토큰이면 401을 반환한다', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token' },
    })

    const app = createTestApp()
    const res = await app.request('/protected/test', {
      headers: { Authorization: 'Bearer invalid-token' },
    })

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})
