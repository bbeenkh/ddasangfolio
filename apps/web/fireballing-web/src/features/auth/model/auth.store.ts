import type { AuthTokens, UserProfile } from '../types/auth.types'

const TOKENS_KEY = 'auth_tokens'
const USER_KEY = 'auth_user'

/**
 * # setTokens
 * ---
 * - 간단설명: localStorage에 인증 토큰 저장
 * ---
 * @param tokens 저장할 인증 토큰
 */
export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

/**
 * # getTokens
 * ---
 * - 간단설명: localStorage에서 인증 토큰 조회
 * ---
 * @example
 * const tokens = getTokens()
 */
export function getTokens(): AuthTokens | null {
  const raw = localStorage.getItem(TOKENS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

/**
 * # clearTokens
 * ---
 * - 간단설명: localStorage에서 인증 토큰 삭제
 */
export function clearTokens(): void {
  localStorage.removeItem(TOKENS_KEY)
}

/**
 * # setUser
 * ---
 * - 간단설명: localStorage에 유저 프로필 정보 저장
 * ---
 * @param user 저장할 유저 프로필
 */
export function setUser(user: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * # getUser
 * ---
 * - 간단설명: localStorage에서 유저 프로필 정보 조회
 * ---
 * @example
 * const user = getUser()
 */
export function getUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

/**
 * # clearUser
 * ---
 * - 간단설명: localStorage에서 유저 프로필 정보 삭제
 */
export function clearUser(): void {
  localStorage.removeItem(USER_KEY)
}

/**
 * # isLoggedIn
 * ---
 * - 간단설명: 로그인 여부 확인 (토큰 존재 여부로 판단)
 * ---
 * @example
 * if (isLoggedIn()) { ... }
 */
export function isLoggedIn(): boolean {
  return getTokens() !== null
}

/**
 * # logoutAndClear
 * ---
 * - 간단설명: 토큰과 유저 정보를 모두 삭제하여 로그아웃 처리
 */
export function logoutAndClear(): void {
  clearTokens()
  clearUser()
}
