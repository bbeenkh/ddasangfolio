import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

const mockSignUp = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignInWithOAuth = vi.fn()
const mockSignOut = vi.fn()
const mockGetUser = vi.fn()
const mockRefreshSession = vi.fn()
const mockExchangeCodeForSession = vi.fn()

vi.mock('../../../shared/lib/supabase.js', () => ({
  getSupabaseClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signInWithOAuth: mockSignInWithOAuth,
      refreshSession: mockRefreshSession,
    },
  }),
  createSupabaseClientWithToken: () => ({
    auth: {
      signOut: mockSignOut,
      getUser: mockGetUser,
    },
  }),
  createSupabaseClientWithCodeVerifier: () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  }),
}))

vi.mock('../../../shared/config/env.js', () => ({
  loadEnv: () => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
    SUPABASE_JWT_SECRET: 'test-secret',
    WEB_BASE_URL: 'http://localhost:3000',
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

  describe('GET /api/auth/oauth/google', () => {
    it('Google OAuth URL을 반환하고 code_verifier 쿠키를 설정한다', async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: {
          url: 'https://accounts.google.com/o/oauth2/auth?client_id=xxx',
          provider: 'google',
          codeVerifier: 'pkce-verifier-123',
        },
        error: null,
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/google')

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data.url).toContain('accounts.google.com')

      const setCookie = res.headers.get('set-cookie')
      expect(setCookie).toContain('oauth_code_verifier')
      expect(setCookie).toContain('HttpOnly')
    })

    it('Supabase 에러 시 400을 반환한다', async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: null, provider: 'google' },
        error: { message: 'OAuth provider not enabled' },
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/google')

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.success).toBe(false)
    })
  })

  describe('GET /api/auth/oauth/callback', () => {
    it('인가 코드와 code_verifier로 토큰을 교환하고 웹으로 리다이렉트한다', async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        data: {
          user: {
            id: 'google-user-1',
            email: 'google@gmail.com',
            user_metadata: { name: '구글유저', avatar_url: 'https://photo.jpg' },
          },
          session: {
            access_token: 'google-access-token',
            refresh_token: 'google-refresh-token',
            expires_in: 3600,
          },
        },
        error: null,
      })

      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/callback?code=auth-code-123', {
        headers: {
          Cookie: 'oauth_code_verifier=pkce-verifier-123',
        },
      })

      expect(res.status).toBe(302)
      const location = res.headers.get('location')
      expect(location).toContain('http://localhost:3000/auth/callback')
      expect(location).toContain('access_token=google-access-token')
      expect(location).toContain('refresh_token=google-refresh-token')
    })

    it('code가 없으면 로그인 페이지로 리다이렉트한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/callback', {
        headers: {
          Cookie: 'oauth_code_verifier=pkce-verifier-123',
        },
      })

      expect(res.status).toBe(302)
      const location = res.headers.get('location')
      expect(location).toContain('/login')
      expect(location).toContain('error=')
    })

    it('code_verifier 쿠키가 없으면 로그인 페이지로 리다이렉트한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/auth/oauth/callback?code=auth-code-123')

      expect(res.status).toBe(302)
      const location = res.headers.get('location')
      expect(location).toContain('/login')
      expect(location).toContain('error=')
    })
  })
})
