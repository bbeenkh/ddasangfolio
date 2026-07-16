import { describe, it, expect, beforeEach } from 'vitest'
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

  it('login 시 토큰과 유저가 저장되고 로그인 상태가 된다', () => {
    useAuthStore.getState().login(mockTokens, mockUser)
    const state = useAuthStore.getState()

    expect(state.isLoggedIn).toBe(true)
    expect(state.tokens).toEqual(mockTokens)
    expect(state.user).toEqual(mockUser)
  })

  it('logout 시 상태가 초기화된다', () => {
    useAuthStore.getState().login(mockTokens, mockUser)
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()

    expect(state.isLoggedIn).toBe(false)
    expect(state.tokens).toBeNull()
    expect(state.user).toBeNull()
  })

  it('setHydrated 호출 시 _isHydrated가 true가 된다', () => {
    useAuthStore.getState().setHydrated()

    expect(useAuthStore.getState()._isHydrated).toBe(true)
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
  })
})
