/**
 * # HttpError
 * ---
 * - 간단설명: HTTP 상태코드를 포함하는 커스텀 에러 클래스
 * - 제약사항: Error를 상속하며, statusCode와 message를 필수로 가짐
 * ---
 * @param statusCode HTTP 상태코드
 * @param message 에러 메시지
 * ---
 * @example
 * throw new HttpError(404, '찾을 수 없습니다')
 */
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}
