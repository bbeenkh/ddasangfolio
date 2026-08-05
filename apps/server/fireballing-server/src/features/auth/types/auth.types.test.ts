import { describe, it, expect } from 'vitest'
import { signupSchema, loginSchema, refreshSchema } from './auth.types'

describe('signupSchema', () => {
  it('유효한 이메일, 비밀번호, 이름이면 파싱에 성공한다', () => {
    const result = signupSchema.safeParse({
      email: 'test@test.com',
      password: 'password123',
      name: '홍길동',
    })
    expect(result.success).toBe(true)
  })

  it('name은 선택값이다', () => {
    const result = signupSchema.safeParse({
      email: 'test@test.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('이메일 형식이 잘못되면 실패한다', () => {
    const result = signupSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('비밀번호가 6자 미만이면 실패한다', () => {
    const result = signupSchema.safeParse({
      email: 'test@test.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('유효한 이메일과 비밀번호면 파싱에 성공한다', () => {
    const result = loginSchema.safeParse({
      email: 'test@test.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('비밀번호가 비어있으면 실패한다', () => {
    const result = loginSchema.safeParse({
      email: 'test@test.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('refreshSchema', () => {
  it('refreshToken이 있으면 파싱에 성공한다', () => {
    const result = refreshSchema.safeParse({
      refreshToken: 'some-refresh-token',
    })
    expect(result.success).toBe(true)
  })

  it('refreshToken이 비어있으면 실패한다', () => {
    const result = refreshSchema.safeParse({
      refreshToken: '',
    })
    expect(result.success).toBe(false)
  })
})
