/**
 * # ApiResponse
 * ---
 * - 간단설명: 모든 API 엔드포인트의 표준 응답 형식
 * - 제약사항: success가 true이면 data 포함, false이면 error 포함
 * ---
 * @example
 * const response: ApiResponse<{ user: User }> = { success: true, data: { user } }
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
