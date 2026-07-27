/**
 * # IAuthManager
 * ---
 * - 간단설명: AuthManager 클래스의 공개 인터페이스
 * - 제약사항: accessToken / refreshToken은 초기화 전 null
 */
export interface IAuthManager {
  accessToken: string | null
  refreshToken: string | null
  isLogined: boolean
  isRefreshing: boolean
  failedQueue: Array<{
    resolve: (token: string) => void
    reject: (reason?: unknown) => void
  }>
}

/**
 * 토큰 저장/복원에 사용하는 최소 토큰 쌍
 * - accessToken: JWT 액세스 토큰 (null = 미인증)
 * - refreshToken: 갱신용 토큰 (null = 미인증)
 */
export type Tokens = Pick<IAuthManager, 'accessToken' | 'refreshToken'>
