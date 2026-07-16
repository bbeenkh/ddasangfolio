/**
 * # AuthTokens
 * ---
 * - 간단설명: 서버에서 반환하는 JWT 인증 토큰 구조
 * - accessToken = 액세스 토큰
 * - refreshToken = 리프레시 토큰
 * - expiresIn = 만료 시간 (초)
 */
export interface AuthTokens {
  /** 액세스 토큰 */
  accessToken: string
  /** 리프레시 토큰 */
  refreshToken: string
  /** 만료 시간 (초) */
  expiresIn: number
}

/**
 * # UserProfile
 * ---
 * - 간단설명: 인증된 사용자 프로필 정보
 * - id = 사용자 ID
 * - email = 이메일
 * - name = 이름 (nullable)
 * - profileImage = 프로필 이미지 URL (nullable)
 */
export interface UserProfile {
  /** 사용자 ID */
  id: string
  /** 이메일 */
  email: string
  /** 이름 */
  name: string | null
  /** 프로필 이미지 URL */
  profileImage: string | null
}

/**
 * # ApiResponse
 * ---
 * - 간단설명: 서버 API 공통 응답 형식
 * - success = 성공 여부
 * - data = 응답 데이터 (제네릭)
 * - error = 에러 메시지
 */
export interface ApiResponse<T = unknown> {
  /** 성공 여부 */
  success: boolean
  /** 응답 데이터 */
  data?: T
  /** 에러 메시지 */
  error?: string
}
