import { create } from 'zustand'
import AuthManager from './AuthManager'
import type { Tokens } from './AuthManager'
import type { AuthTokens, UserProfile } from '../types/authTypes'

const TOKENS_STORAGE_KEY = 'auth_tokens'

/**
 * 인증 스토어 상태
 * - isLoggedIn = 로그인 여부
 * - tokens = 인증 토큰
 * - user = 사용자 프로필
 * - _isHydrated = localStorage 복원 완료 여부 (SSR 대응)
 */
interface AuthState {
  /** 로그인 여부 */
  isLoggedIn: boolean
  /** 인증 토큰 */
  tokens: AuthTokens | null
  /** 사용자 프로필 */
  user: UserProfile | null
  /** localStorage 복원 완료 여부 */
  _isHydrated: boolean
}

/**
 * 인증 스토어 액션
 */
interface AuthActions {
  /** 로그인 처리 (토큰 + 유저 저장) */
  login: (tokens: AuthTokens, user: UserProfile) => void
  /** 로그아웃 처리 */
  logout: () => void
  /** 토큰 재발급 (AuthManager 큐 관리 위임) */
  revalidateTokens: (revalidateFn: () => Promise<Tokens>) => Promise<string>
  /** localStorage에서 토큰을 복원하여 스토어 초기화 */
  hydrate: () => void
}

/** AuthManager 싱글턴 — 토큰 보관 및 refresh 큐 관리 담당 */
const authManager = new AuthManager({ accessToken: null, refreshToken: null })

/**
 * # saveTokensToStorage
 * ---
 * - 간단설명: localStorage에 토큰만 저장
 */
function saveTokensToStorage(tokens: AuthTokens) {
  localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens))
}

/**
 * # clearTokensFromStorage
 * ---
 * - 간단설명: localStorage에서 토큰 삭제
 */
function clearTokensFromStorage() {
  localStorage.removeItem(TOKENS_STORAGE_KEY)
}

/**
 * # loadTokensFromStorage
 * ---
 * - 간단설명: localStorage에서 토큰 조회
 */
function loadTokensFromStorage(): AuthTokens | null {
  const raw = localStorage.getItem(TOKENS_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

/**
 * # useAuthStore
 * ---
 * - 간단설명: zustand 기반 인증 상태 관리 스토어
 * - 제약사항 및 특이사항:
 *   - AuthManager에 토큰/큐 로직을 위임하여 기능 중복 방지
 *   - localStorage에는 토큰만 저장 (유저 정보는 메모리에만 유지)
 *   - hydrate()를 호출하여 클라이언트에서 localStorage 복원
 * ---
 * @example
 * const isLoggedIn = useAuthStore(s => s.isLoggedIn)
 * const { login, logout } = useAuthStore()
 */
export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  isLoggedIn: false,
  tokens: null,
  user: null,
  _isHydrated: false,

  login: (tokens: AuthTokens, user: UserProfile) => {
    authManager.setTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
    saveTokensToStorage(tokens)
    set({ isLoggedIn: true, tokens, user })
  },

  logout: () => {
    authManager.clearToken()
    clearTokensFromStorage()
    set({ isLoggedIn: false, tokens: null, user: null })
  },

  revalidateTokens: async (revalidateFn: () => Promise<Tokens>) => {
    try {
      const newAccessToken = await authManager.revalidateTokens(revalidateFn)
      const prevTokens = get().tokens
      if (prevTokens && authManager.refreshToken) {
        const updatedTokens: AuthTokens = {
          ...prevTokens,
          accessToken: newAccessToken,
          refreshToken: authManager.refreshToken,
        }
        saveTokensToStorage(updatedTokens)
        set({ tokens: updatedTokens })
      }
      return newAccessToken
    } catch (e) {
      clearTokensFromStorage()
      set({ isLoggedIn: false, tokens: null, user: null })
      throw e
    }
  },

  hydrate: () => {
    const tokens = loadTokensFromStorage()
    if (tokens) {
      authManager.setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
      set({ isLoggedIn: true, tokens, _isHydrated: true })
    } else {
      set({ _isHydrated: true })
    }
  },
}))

/** AuthManager 인스턴스 접근 (API 인터셉터 등에서 사용) */
export { authManager }
