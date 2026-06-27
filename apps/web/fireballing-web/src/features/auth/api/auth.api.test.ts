import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, signup } from './auth.api'

const mockSuccessResponse = {
  success: true,
  data: {
    user: { id: '1', email: 'test@test.com', name: '홍길동', profileImage: null },
    tokens: { accessToken: 'access-123', refreshToken: 'refresh-456', expiresIn: 3600 },
  },
}

const mockErrorResponse = {
  success: false,
  error: '이메일 또는 비밀번호가 올바르지 않습니다',
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('login', () => {
  it('올바른 자격증명으로 로그인하면 유저와 토큰을 반환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockSuccessResponse),
    }))

    const result = await login('test@test.com', 'password123')

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    })
    expect(result).toEqual(mockSuccessResponse)
  })

  it('잘못된 자격증명으로 로그인하면 에러를 반환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockErrorResponse),
    }))

    const result = await login('test@test.com', 'wrong')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})

describe('signup', () => {
  it('회원가입하면 유저와 토큰을 반환한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockSuccessResponse),
    }))

    const result = await signup('test@test.com', 'password123', '홍길동')

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password123', name: '홍길동' }),
    })
    expect(result).toEqual(mockSuccessResponse)
  })

  it('이름 없이 회원가입할 수 있다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockSuccessResponse),
    }))

    await signup('test@test.com', 'password123')

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    })
  })
})
