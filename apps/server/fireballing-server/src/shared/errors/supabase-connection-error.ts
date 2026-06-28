/**
 * # SupabaseConnectionError
 * ---
 * - 간단설명: Supabase 연결 실패 시 사용하는 커스텀 에러 클래스
 * - 제약사항: fetch failed, network error 등 연결 관련 에러를 감지하여 래핑
 * ---
 * @param originalError 원본 에러 객체
 * ---
 * @example
 * throw new SupabaseConnectionError(error)
 */
export class SupabaseConnectionError extends Error {
  public readonly statusCode = 503

  constructor(originalError?: unknown) {
    super('supabase connection error')
    this.name = 'SupabaseConnectionError'
    if (originalError instanceof Error) {
      this.cause = originalError
    }
  }

  /**
   * # isConnectionError
   * ---
   * - 간단설명: 주어진 에러가 Supabase 연결 실패인지 판별
   * ---
   * @param error 판별할 에러 객체
   */
  static isConnectionError(error: unknown): boolean {
    if (error instanceof TypeError && error.message === 'fetch failed') {
      return true
    }
    if (error instanceof Error) {
      if (error.message.includes('fetch failed')) {
        return true
      }
      if (error.cause && SupabaseConnectionError.isConnectionError(error.cause)) {
        return true
      }
    }
    return false
  }
}
