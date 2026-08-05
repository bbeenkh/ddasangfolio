import type { ErrorHandler } from 'hono'
import { HttpError } from '../../shared/errors/http-error'

/**
 * # errorHandler
 * ---
 * - 간단설명: 전역 에러 핸들러로, HttpError는 해당 상태코드로, 그 외는 500으로 응답
 * ---
 * @example
 * app.onError(errorHandler)
 */
export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HttpError) {
    return c.json({ success: false, error: err.message }, err.statusCode as any)
  }

  return c.json({ success: false, error: '서버 내부 오류가 발생했습니다' }, 500)
}
