const API_BASE = 'http://localhost:8080/api/auth'

/**
 * # AuthTokens
 * ---
 * - 간단설명: 서버에서 반환하는 인증 토큰 구조
 */
interface AuthTokens {
  /** 액세스 토큰 */
  accessToken: string
  /** 리프레시 토큰 */
  refreshToken: string
  /** 만료 시간 (초) */
  expiresIn: number
}

/**
 * # UserProfile
 * ---
 * - 간단설명: 인증된 사용자 프로필 정보
 */
interface UserProfile {
  /** 사용자 ID */
  id: string
  /** 이메일 */
  email: string
  /** 이름 */
  name: string | null
  /** 프로필 이미지 URL */
  profileImage: string | null
}

/**
 * # ApiResponse
 * ---
 * - 간단설명: 서버 API 공통 응답 형식
 */
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * # signup
 * ---
 * - 간단설명: 회원가입 API 호출
 * ---
 * @param email 이메일
 * @param password 비밀번호 (최소 6자)
 * @param name 이름 (선택)
 * ---
 * @example
 * const res = await signup('test@test.com', 'password123', '홍길동')
 */
async function signup(email: string, password: string, name?: string) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  return res.json() as Promise<
    ApiResponse<{ user: UserProfile; tokens: AuthTokens }>
  >
}

/**
 * # login
 * ---
 * - 간단설명: 로그인 API 호출
 * ---
 * @param email 이메일
 * @param password 비밀번호
 * ---
 * @example
 * const res = await login('test@test.com', 'password123')
 */
async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json() as Promise<
    ApiResponse<{ user: UserProfile; tokens: AuthTokens }>
  >
}

/**
 * # getMe
 * ---
 * - 간단설명: 현재 인증된 사용자 정보 조회
 * ---
 * @param accessToken 액세스 토큰
 * ---
 * @example
 * const res = await getMe('eyJhbGci...')
 */
async function getMe(accessToken: string) {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.json() as Promise<ApiResponse<{ user: UserProfile }>>
}

/**
 * # refreshToken
 * ---
 * - 간단설명: 리프레시 토큰으로 새 액세스 토큰 발급
 * ---
 * @param token 리프레시 토큰
 * ---
 * @example
 * const res = await refreshToken('eyJhbGci...')
 */
async function refreshToken(token: string) {
  const res = await fetch(`${API_BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: token }),
  })
  return res.json() as Promise<ApiResponse<{ tokens: AuthTokens }>>
}

/**
 * # logout
 * ---
 * - 간단설명: 로그아웃 API 호출
 * ---
 * @param accessToken 액세스 토큰
 * ---
 * @example
 * const res = await logout('eyJhbGci...')
 */
async function logout(accessToken: string) {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.json() as Promise<ApiResponse<{ message: string }>>
}

export { signup, login, getMe, refreshToken, logout }
export type { AuthTokens, UserProfile, ApiResponse }
