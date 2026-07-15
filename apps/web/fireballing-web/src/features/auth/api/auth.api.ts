import type { ApiResponse, AuthTokens, UserProfile } from '../types/auth.types'

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`

/**
 * # login
 * ---
 * - 간단설명: 이메일/비밀번호로 로그인 API 호출
 * ---
 * @param email 이메일
 * @param password 비밀번호
 * ---
 * @example
 * const res = await login('test@test.com', 'password123')
 */
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json() as Promise<ApiResponse<{ user: UserProfile; tokens: AuthTokens }>>
}

/**
 * # signup
 * ---
 * - 간단설명: 이메일/비밀번호/이름으로 회원가입 API 호출
 * ---
 * @param email 이메일
 * @param password 비밀번호 (최소 6자)
 * @param name 이름 (선택)
 * ---
 * @example
 * const res = await signup('test@test.com', 'password123', '홍길동')
 */
export async function signup(email: string, password: string, name?: string) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, ...(name && { name }) }),
  })
  return res.json() as Promise<ApiResponse<{ user: UserProfile; tokens: AuthTokens }>>
}
