interface IAuthManager {
  accessToken: string | null;
  refreshToken: string | null;
  isLogined: boolean;

  isRefreshing: boolean;

  failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (reason?: unknown) => void;
  }>;
}

export type Tokens = Pick<IAuthManager, 'accessToken' | 'refreshToken'>;

/**
 * # AuthManager
 * ---
 * - 간단설명: 인증 상태를 추상화하는 클래스 (Storage/API 비의존)
 * - 제약사항 및 특이사항:
 *   - Access/Refresh Token 인메모리 관리
 *   - 동시 Refresh 요청 큐 관리
 *   - zustand 스토어에서 싱글턴으로 사용
 * ---
 * @example
 * const manager = new AuthManager({ accessToken: null, refreshToken: null })
 * manager.setTokens({ accessToken: '...', refreshToken: '...' })
 */
export default class AuthManager implements IAuthManager {
  private _accessToken: string | null;
  private _refreshToken: string | null;

  isLogined = false;

  isRefreshing = false;

  failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor({ accessToken, refreshToken }: Tokens) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    this.isLogined = !!(accessToken && refreshToken);
  }

  get accessToken() {
    return this._accessToken;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  /**
   * 토큰 저장
   */
  setTokens({ accessToken, refreshToken }: Tokens) {
    if (!accessToken || !refreshToken) {
      throw new Error('token not found');
    }

    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    this.isLogined = true;
  }

  /**
   * Queue 처리
   */
  private processQueue(error?: unknown, token?: string) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Refresh Token을 이용한 토큰 재발급
   *
   * revalidateFn은 외부(API Layer)가 주입
   */
  async revalidateTokens(
    revalidateFn: () => Promise<Tokens>,
  ): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    if (!this.refreshToken) {
      this.clearToken();
      const error = new Error('NO_REFRESH_TOKEN');
      this.processQueue(error);
      throw error;
    }

    this.isRefreshing = true;

    try {
      const tokens = await revalidateFn();

      this.setTokens(tokens);

      this.processQueue(undefined, tokens.accessToken!);

      return tokens.accessToken!;
    } catch (e) {
      this.processQueue(e);

      this.clearToken();

      throw new Error('TOKEN_REFRESH_FAILED');
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * 로그아웃
   */
  clearToken() {
    this._accessToken = null;
    this._refreshToken = null;
    this.isLogined = false;
  }
}