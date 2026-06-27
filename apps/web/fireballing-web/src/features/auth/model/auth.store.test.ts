import { describe, it, expect, beforeEach } from 'vitest'
import {
  setTokens,
  getTokens,
  clearTokens,
  setUser,
  getUser,
  clearUser,
  isLoggedIn,
  logoutAndClear,
} from './auth.store'
import type { AuthTokens, UserProfile } from '../types/auth.types'

const mockTokens: AuthTokens = {
  accessToken: 'access-123',
  refreshToken: 'refresh-456',
  expiresIn: 3600,
}

const mockUser: UserProfile = {
  id: 'user-1',
  email: 'test@test.com',
  name: '홍길동',
  profileImage: null,
}

describe('auth.store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('setTokens로 저장한 토큰을 getTokens로 조회할 수 있다', () => {
    setTokens(mockTokens)
    expect(getTokens()).toEqual(mockTokens)
  })

  it('토큰이 없으면 getTokens는 null을 반환한다', () => {
    expect(getTokens()).toBeNull()
  })

  it('clearTokens로 토큰을 삭제할 수 있다', () => {
    setTokens(mockTokens)
    clearTokens()
    expect(getTokens()).toBeNull()
  })

  it('setUser로 저장한 유저를 getUser로 조회할 수 있다', () => {
    setUser(mockUser)
    expect(getUser()).toEqual(mockUser)
  })

  it('유저가 없으면 getUser는 null을 반환한다', () => {
    expect(getUser()).toBeNull()
  })

  it('clearUser로 유저 정보를 삭제할 수 있다', () => {
    setUser(mockUser)
    clearUser()
    expect(getUser()).toBeNull()
  })

  it('토큰이 있으면 isLoggedIn은 true를 반환한다', () => {
    setTokens(mockTokens)
    expect(isLoggedIn()).toBe(true)
  })

  it('토큰이 없으면 isLoggedIn은 false를 반환한다', () => {
    expect(isLoggedIn()).toBe(false)
  })

  it('logoutAndClear는 토큰과 유저 정보를 모두 삭제한다', () => {
    setTokens(mockTokens)
    setUser(mockUser)
    logoutAndClear()
    expect(getTokens()).toBeNull()
    expect(getUser()).toBeNull()
    expect(isLoggedIn()).toBe(false)
  })
})
