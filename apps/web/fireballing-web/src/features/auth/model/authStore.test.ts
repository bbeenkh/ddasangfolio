import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './authStore'
import type { AuthTokens, UserProfile } from '../types/authTypes'

const mockTokens: AuthTokens = {
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  expiresIn: 3600,
}

const mockUser: UserProfile = {
  id: '1',
  email: 'test@test.com',
  name: '테스트',
  profileImage: null,
}

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      isLoggedIn: false,
      tokens: null,
      user: null,
      _isHydrated: false,
    })
  })

  it('초기 상태는 비로그인이다', () => {
    const state = useAuthStore.getState()

    expect(state.isLoggedIn).toBe(false)
    expect(state.tokens).toBeNull()
    expect(state.user).toBeNull()
  })

  it('login 시 토큰과 유저가 저장되고 localStorage에는 토큰만 저장된다', () => {
    useAuthStore.getState().login(mockTokens, mockUser)
    const state = useAuthStore.getState()

    expect(state.isLoggedIn).toBe(true)
    expect(state.tokens).toEqual(mockTokens)
    expect(state.user).toEqual(mockUser)

    const stored = JSON.parse(localStorage.getItem('auth_tokens')!)
    expect(stored).toEqual(mockTokens)
  })

  it('logout 시 상태가 초기화되고 localStorage에서 토큰이 삭제된다', () => {
    useAuthStore.getState().login(mockTokens, mockUser)
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()

    expect(state.isLoggedIn).toBe(false)
    expect(state.tokens).toBeNull()
    expect(state.user).toBeNull()
    expect(localStorage.getItem('auth_tokens')).toBeNull()
  })

  it('hydrate 시 localStorage에서 토큰을 복원한다', () => {
    localStorage.setItem('auth_tokens', JSON.stringify(mockTokens))

    useAuthStore.getState().hydrate()
    const state = useAuthStore.getState()

    expect(state.isLoggedIn).toBe(true)
    expect(state.tokens).toEqual(mockTokens)
    expect(state.user).toBeNull()
    expect(state._isHydrated).toBe(true)
  })

  it('hydrate 시 localStorage에 토큰이 없으면 비로그인 상태를 유지한다', () => {
    useAuthStore.getState().hydrate()
    const state = useAuthStore.getState()

    expect(state.isLoggedIn).toBe(false)
    expect(state._isHydrated).toBe(true)
  })

  it('revalidateTokens 성공 시 토큰이 갱신된다', async () => {
    useAuthStore.getState().login(mockTokens, mockUser)

    const newTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    }

    const result = await useAuthStore
      .getState()
      .revalidateTokens(() => Promise.resolve(newTokens))

    expect(result).toBe('new-access-token')

    const state = useAuthStore.getState()
    expect(state.tokens?.accessToken).toBe('new-access-token')
    expect(state.tokens?.refreshToken).toBe('new-refresh-token')

    const stored = JSON.parse(localStorage.getItem('auth_tokens')!)
    expect(stored.accessToken).toBe('new-access-token')
  })

  it('revalidateTokens 실패 시 로그아웃 처리된다', async () => {
    useAuthStore.getState().login(mockTokens, mockUser)

    await expect(
      useAuthStore
        .getState()
        .revalidateTokens(() => Promise.reject(new Error('fail'))),
    ).rejects.toThrow('TOKEN_REFRESH_FAILED')

    const state = useAuthStore.getState()
    expect(state.isLoggedIn).toBe(false)
    expect(state.tokens).toBeNull()
    expect(localStorage.getItem('auth_tokens')).toBeNull()
  })
})
