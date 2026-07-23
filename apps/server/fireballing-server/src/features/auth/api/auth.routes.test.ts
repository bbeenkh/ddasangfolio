import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

const mockSignUp = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignInWithIdToken = vi.fn()
const mockSignOut = vi.fn()
const mockGetUser = vi.fn()
const mockRefreshSession = vi.fn()

vi.mock('../../../shared/lib/supabase.js', () => ({
  getSupabaseClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signInWithIdToken: mockSignInWithIdToken,
      refreshSession: mockRefreshSession,
    },
  }),
  createSupabaseClientWithToken: () => ({
    auth: {
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
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

import { authRoutes } from './auth.routes.js'

function createTestApp() {
  const app = new Hono()
  app.route('/api/auth', authRoutes)
  return app
}

const validUser = {
  id: 'user-1',
  email: 'test@test.com',
  user_metadata: { name: '홍길동' },
}

const validSession = {
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  expires_in: 3600,
}

describe('auth.routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/signup', () => {
    it('유효한 데이터로 회원가입하면 201과 유저/토큰을 반환한다', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: validUser, session: validSession },
        error: null,
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'password123',
          name: '홍길동',
        }),
      })

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('test@test.com')
      expect(body.data.tokens.accessToken).toBe('access-token')
    })

    it('잘못된 이메일 형식이면 400을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid',
          password: 'password123',
        }),
      })

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    it('유효한 자격증명으로 로그인하면 200과 유저/토큰을 반환한다', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: validUser, session: validSession },
        error: null,
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'password123',
        }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('test@test.com')
    })

    it('잘못된 자격증명이면 401을 반환한다', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'wrong',
        }),
      })

      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {
    it('유효한 토큰으로 현재 유저 정보를 반환한다', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: validUser },
        error: null,
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/me', {
        headers: { Authorization: 'Bearer valid-token' },
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('test@test.com')
    })

    it('토큰이 없으면 401을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/auth/me')

      expect(res.status).toBe(401)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('로그아웃에 성공하면 200을 반환한다', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: validUser },
        error: null,
      })
      mockSignOut.mockResolvedValue({ error: null })

      const app = createTestApp()
      const res = await app.request('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-token' },
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('리프레시 토큰으로 새 토큰을 발급한다', async () => {
      mockRefreshSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            expires_in: 3600,
          },
        },
        error: null,
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'old-refresh-token' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data.tokens.accessToken).toBe('new-access-token')
    })

    it('refreshToken이 비어있으면 400을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: '' }),
      })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/auth/oauth/google', () => {
    it('Google ID 토큰으로 로그인하면 200과 유저/토큰을 반환한다', async () => {
      mockSignInWithIdToken.mockResolvedValue({
        data: {
          user: {
            id: 'google-user-1',
            email: 'google@gmail.com',
            user_metadata: { name: '구글유저', avatar_url: 'https://photo.jpg' },
          },
          session: validSession,
        },
        error: null,
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'google-id-token-123' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data.user.email).toBe('google@gmail.com')
      expect(body.data.tokens.accessToken).toBe('access-token')
    })

    it('idToken이 없으면 400을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(res.status).toBe(400)
    })

    it('잘못된 ID 토큰이면 401을 반환한다', async () => {
      mockSignInWithIdToken.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid ID token' },
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'invalid' }),
      })

      expect(res.status).toBe(401)
    })
  })
})
