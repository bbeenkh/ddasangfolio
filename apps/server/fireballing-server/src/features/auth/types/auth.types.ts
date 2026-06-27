import { z } from 'zod'

/**
 * # signupSchema
 * ---
 * - 간단설명: 회원가입 요청 바디 검증 스키마
 * - 제약사항: 비밀번호 최소 6자, name은 선택값
 */
export const signupSchema = z.object({
  /** 이메일 주소 */
  email: z.string().email(),
  /** 비밀번호 (최소 6자) */
  password: z.string().min(6),
  /** 사용자 이름 (선택) */
  name: z.string().min(1).optional(),
})

/**
 * # loginSchema
 * ---
 * - 간단설명: 로그인 요청 바디 검증 스키마
 */
export const loginSchema = z.object({
  /** 이메일 주소 */
  email: z.string().email(),
  /** 비밀번호 */
  password: z.string().min(1),
})

/**
 * # refreshSchema
 * ---
 * - 간단설명: 토큰 갱신 요청 바디 검증 스키마
 */
export const refreshSchema = z.object({
  /** 리프레시 토큰 */
  refreshToken: z.string().min(1),
})

export type SignupRequest = z.infer<typeof signupSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type RefreshRequest = z.infer<typeof refreshSchema>

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
