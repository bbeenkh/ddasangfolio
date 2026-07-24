/**
 * # AuthTokens
 * ---
 * - 간단설명: 인증 토큰 응답 데이터
 * - accessToken: JWT access token
 * - refreshToken: 토큰 갱신용 refresh token
 * - expiresIn: access token 만료 시간 (초)
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}
