import { describe, it, expectTypeOf } from 'vitest'
import type { AuthTokens, UserProfile, ApiResponse } from './authTypes'

describe('auth types', () => {
  it('AuthTokens는 accessToken, refreshToken, expiresIn을 가진다', () => {
    expectTypeOf<AuthTokens>().toHaveProperty('accessToken')
    expectTypeOf<AuthTokens>().toHaveProperty('refreshToken')
    expectTypeOf<AuthTokens>().toHaveProperty('expiresIn')
  })

  it('UserProfile은 id, email, name, profileImage를 가진다', () => {
    expectTypeOf<UserProfile>().toHaveProperty('id')
    expectTypeOf<UserProfile>().toHaveProperty('email')
    expectTypeOf<UserProfile>().toHaveProperty('name')
    expectTypeOf<UserProfile>().toHaveProperty('profileImage')
  })

  it('ApiResponse는 제네릭 data를 가진다', () => {
    expectTypeOf<ApiResponse<{ user: UserProfile }>>().toHaveProperty('success')
    expectTypeOf<ApiResponse<{ user: UserProfile }>>().toHaveProperty('data')
  })
})
