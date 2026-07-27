import type { IAuthManager, Tokens } from './authManager.types.js'

/**
 * # AuthManager
 * ---
 * - 간단설명: Access / Refresh Token 인메모리 관리 및 동시 갱신 큐 처리 클래스
 * - 제약사항:
 *   - Storage / API에 직접 의존하지 않음
 *   - revalidateTokens의 실제 갱신 함수(revalidateFn)는 외부(API Layer)에서 주입
 *   - 동시에 여러 갱신 요청이 오면 첫 요청만 API를 호출하고 나머지는 큐에서 대기
 * @example
 * const manager = new AuthManager({ accessToken: 'aaa', refreshToken: 'bbb' })
 * await manager.revalidateTokens(() => api.refresh(manager.refreshToken!))
 */
export class AuthManager implements IAuthManager {
  private _accessToken: string | null
  private _refreshToken: string | null

  isLogined = false
  isRefreshing = false
  failedQueue: Array<{
    resolve: (token: string) => void
    reject: (reason?: unknown) => void
  }> = []

  constructor({ accessToken, refreshToken }: Tokens) {
    this._accessToken = accessToken
    this._refreshToken = refreshToken
    this.isLogined = !!(accessToken && refreshToken)
  }

  get accessToken() {
    return this._accessToken
  }

  get refreshToken() {
    return this._refreshToken
  }

  /**
   * 토큰 저장
   * @param accessToken 새 액세스 토큰
   * @param refreshToken 새 리프레시 토큰
   * @throws token not found - 둘 중 하나라도 falsy일 때
   */
  setTokens({ accessToken, refreshToken }: Tokens) {
    if (!accessToken || !refreshToken) {
      throw new Error('token not found')
    }

    this._accessToken = accessToken
    this._refreshToken = refreshToken
    this.isLogined = true
  }

  /**
   * 대기 큐 일괄 처리 (성공/실패 분기)
   */
  private processQueue(error?: unknown, token?: string) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token!)
      }
    })

    this.failedQueue = []
  }

  /**
   * Refresh Token을 이용한 토큰 재발급
   * ---
   * - 간단설명: isRefreshing 플래그로 동시 갱신을 방지하고, 대기 중인 요청은 큐에서 처리
   * - 제약사항: revalidateFn은 호출자가 주입 (API Layer 의존성 역전)
   * @param revalidateFn 실제 갱신 API를 호출하는 함수
   * @example
   * const token = await manager.revalidateTokens(() =>
   *   fetch('/auth/refresh').then(r => r.json())
   * )
   */
  async revalidateTokens(revalidateFn: () => Promise<Tokens>): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject })
      })
    }

    if (!this.refreshToken) {
      this.clearToken()
      const error = new Error('NO_REFRESH_TOKEN')
      this.processQueue(error)
      throw error
    }

    this.isRefreshing = true

    try {
      const tokens = await revalidateFn()

      this.setTokens(tokens)
      this.processQueue(undefined, tokens.accessToken!)

      return tokens.accessToken!
    } catch (e) {
      this.processQueue(e)
      this.clearToken()
      throw new Error('TOKEN_REFRESH_FAILED')
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * 로그아웃 / 토큰 전체 초기화
   */
  clearToken() {
    this._accessToken = null
    this._refreshToken = null
    this.isLogined = false
  }
}
