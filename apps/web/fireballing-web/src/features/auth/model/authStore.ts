import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AuthManager from './AuthManager'
import type { Tokens } from './AuthManager'
import type { AuthTokens, UserProfile } from '../types/authTypes'

/**
 * 인증 스토어 상태
 * - isLoggedIn = 로그인 여부
 * - tokens = 인증 토큰
 * - user = 사용자 프로필
 * - _isHydrated = persist 복원 완료 여부 (SSR 대응)
 */
interface AuthState {
  /** 로그인 여부 */
  isLoggedIn: boolean
  /** 인증 토큰 */
  tokens: AuthTokens | null
  /** 사용자 프로필 */
  user: UserProfile | null
  /** persist hydration 완료 여부 */
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
  /** hydration 완료 마킹 */
  setHydrated: () => void
}

/** AuthManager 싱글턴 — 토큰 보관 및 refresh 큐 관리 담당 */
const authManager = new AuthManager({ accessToken: null, refreshToken: null })

/**
 * # useAuthStore
 * ---
 * - 간단설명: zustand 기반 인증 상태 관리 스토어
 * - 제약사항 및 특이사항:
 *   - AuthManager에 토큰/큐 로직을 위임하여 기능 중복 방지
 *   - persist 미들웨어로 localStorage 자동 동기화
 *   - skipHydration: true로 SSR hydration 안전 처리
 * ---
 * @example
 * const isLoggedIn = useAuthStore(s => s.isLoggedIn)
 * const { login, logout } = useAuthStore()
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      tokens: null,
      user: null,
      _isHydrated: false,

      login: (tokens: AuthTokens, user: UserProfile) => {
        authManager.setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
        set({ isLoggedIn: true, tokens, user })
      },

      logout: () => {
        authManager.clearToken()
        set({ isLoggedIn: false, tokens: null, user: null })
      },

      revalidateTokens: async (revalidateFn: () => Promise<Tokens>) => {
        try {
          const newAccessToken = await authManager.revalidateTokens(revalidateFn)
          const prevTokens = get().tokens
          if (prevTokens && authManager.refreshToken) {
            set({
              tokens: {
                ...prevTokens,
                accessToken: newAccessToken,
                refreshToken: authManager.refreshToken,
              },
            })
          }
          return newAccessToken
        } catch (e) {
          set({ isLoggedIn: false, tokens: null, user: null })
          throw e
        }
      },

      setHydrated: () => set({ _isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state?.tokens) {
          authManager.setTokens({
            accessToken: state.tokens.accessToken,
            refreshToken: state.tokens.refreshToken,
          })
        }
        state?.setHydrated()
      },
    },
  ),
)

/** AuthManager 인스턴스 접근 (API 인터셉터 등에서 사용) */
export { authManager }
