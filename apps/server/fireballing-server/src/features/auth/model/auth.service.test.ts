import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UserProfile } from '../../../entities/user/index.js'

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

import {
  signup,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  mapToUserProfile,
  getGoogleOAuthUrl,
  exchangeOAuthCode,
} from './auth.service.js'

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signup', () => {
    it('이메일과 비밀번호로 회원가입하고 유저와 토큰을 반환한다', async () => {
      mockSignUp.mockResolvedValue({
        data: {
          user: {
            id: 'user-1',
            email: 'test@test.com',
            user_metadata: { name: '홍길동' },
          },
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
            expires_in: 3600,
          },
        },
        error: null,
      })

      const result = await signup({
        email: 'test@test.com',
        password: 'password123',
        name: '홍길동',
      })

      expect(result.user.email).toBe('test@test.com')
      expect(result.user.name).toBe('홍길동')
      expect(result.tokens.accessToken).toBe('access-token')
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        options: { data: { name: '홍길동' } },
      })
    })

    it('Supabase 에러 시 에러를 던진다', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      })

      await expect(
        signup({ email: 'test@test.com', password: 'password123' }),
      ).rejects.toThrow('User already registered')
    })
  })

  describe('login', () => {
    it('이메일과 비밀번호로 로그인하고 유저와 토큰을 반환한다', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: {
          user: {
            id: 'user-1',
            email: 'test@test.com',
            user_metadata: {},
          },
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
            expires_in: 3600,
          },
        },
        error: null,
      })

      const result = await login({
        email: 'test@test.com',
        password: 'password123',
      })

      expect(result.user.email).toBe('test@test.com')
      expect(result.tokens.accessToken).toBe('access-token')
    })

    it('잘못된 자격증명이면 에러를 던진다', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      })

      await expect(
        login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow('Invalid login credentials')
    })
  })

  describe('logout', () => {
    it('로그아웃에 성공한다', async () => {
      mockSignOut.mockResolvedValue({ error: null })

      await expect(logout('access-token')).resolves.not.toThrow()
      expect(mockSignOut).toHaveBeenCalled()
    })
  })

  describe('getCurrentUser', () => {
    it('토큰으로 현재 유저 정보를 반환한다', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-1',
            email: 'test@test.com',
            user_metadata: { name: '홍길동', avatar_url: 'https://img.com/a.png' },
          },
        },
        error: null,
      })

      const user = await getCurrentUser('access-token')

      expect(user.id).toBe('user-1')
      expect(user.email).toBe('test@test.com')
      expect(user.name).toBe('홍길동')
      expect(user.profileImage).toBe('https://img.com/a.png')
    })

    it('유저가 없으면 에러를 던진다', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      })

      await expect(getCurrentUser('invalid-token')).rejects.toThrow('Invalid token')
    })
  })

  describe('refreshToken', () => {
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

      const tokens = await refreshToken('old-refresh-token')

      expect(tokens.accessToken).toBe('new-access-token')
      expect(tokens.refreshToken).toBe('new-refresh-token')
    })
  })

  describe('mapToUserProfile', () => {
    it('Supabase User를 UserProfile로 변환한다', () => {
      const supabaseUser = {
        id: 'user-1',
        email: 'test@test.com',
        user_metadata: { name: '홍길동', avatar_url: 'https://img.com/a.png' },
      }

      const profile = mapToUserProfile(supabaseUser as any)

      expect(profile).toEqual({
        id: 'user-1',
        email: 'test@test.com',
        name: '홍길동',
        profileImage: 'https://img.com/a.png',
      })
    })

    it('메타데이터가 없으면 null로 채운다', () => {
      const supabaseUser = {
        id: 'user-1',
        email: 'test@test.com',
        user_metadata: {},
      }

      const profile = mapToUserProfile(supabaseUser as any)

      expect(profile.name).toBeNull()
      expect(profile.profileImage).toBeNull()
    })
  })

  describe('getGoogleOAuthUrl', () => {
    it('Google OAuth URL과 codeVerifier를 반환한다', async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: {
          url: 'https://accounts.google.com/o/oauth2/auth?...',
          provider: 'google',
        },
        error: null,
      })

      const result = await getGoogleOAuthUrl('http://localhost:8080/api/auth/oauth/callback')

      expect(result.url).toBe('https://accounts.google.com/o/oauth2/auth?...')
      expect(result.codeVerifier).toBeDefined()
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:8080/api/auth/oauth/callback',
          skipBrowserRedirect: true,
        },
      })
    })

    it('Supabase 에러 시 에러를 던진다', async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: null, provider: 'google' },
        error: { message: 'OAuth provider not enabled' },
      })

      await expect(
        getGoogleOAuthUrl('http://localhost:8080/api/auth/oauth/callback'),
      ).rejects.toThrow('OAuth provider not enabled')
    })

    it('URL이 반환되지 않으면 에러를 던진다', async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: null, provider: 'google' },
        error: null,
      })

      await expect(
        getGoogleOAuthUrl('http://localhost:8080/api/auth/oauth/callback'),
      ).rejects.toThrow()
    })
  })

  describe('exchangeOAuthCode', () => {
    it('인가 코드를 토큰으로 교환하고 유저와 토큰을 반환한다', async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        data: {
          user: {
            id: 'google-user-1',
            email: 'google@gmail.com',
            user_metadata: { name: '구글유저', avatar_url: 'https://lh3.google.com/photo.jpg' },
          },
          session: {
            access_token: 'google-access-token',
            refresh_token: 'google-refresh-token',
            expires_in: 3600,
          },
        },
        error: null,
      })

      const result = await exchangeOAuthCode('auth-code-123', 'code-verifier-456')

      expect(result.user.email).toBe('google@gmail.com')
      expect(result.user.name).toBe('구글유저')
      expect(result.user.profileImage).toBe('https://lh3.google.com/photo.jpg')
      expect(result.tokens.accessToken).toBe('google-access-token')
      expect(result.tokens.refreshToken).toBe('google-refresh-token')
      expect(mockExchangeCodeForSession).toHaveBeenCalledWith('auth-code-123')
    })

    it('Supabase 에러 시 에러를 던진다', async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid code' },
      })

      await expect(
        exchangeOAuthCode('invalid-code', 'verifier'),
      ).rejects.toThrow('Invalid code')
    })

    it('세션이 없으면 에러를 던진다', async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      })

      await expect(
        exchangeOAuthCode('code', 'verifier'),
      ).rejects.toThrow()
    })
  })
})
