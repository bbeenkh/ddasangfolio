import { z } from 'zod'

/**
 * # envSchema
 * ---
 * - 간단설명: 서버 환경변수 검증을 위한 Zod 스키마
 * - 제약사항: SUPABASE_URL은 유효한 URL이어야 하며, ANON_KEY와 JWT_SECRET은 비어있을 수 없음
 * ---
 */
const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1),
  /** OAuth 콜백 후 리다이렉트할 웹 앱 URL (예: http://localhost:3000) */
  WEB_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(8080),
})

/**
 * # Env
 * ---
 * - 간단설명: 파싱된 환경변수 타입
 */
export type Env = z.infer<typeof envSchema>

/**
 * # loadEnv
 * ---
 * - 간단설명: process.env에서 환경변수를 읽어 Zod 스키마로 검증 후 반환
 * - 제약사항: 필수 환경변수 누락 또는 잘못된 형식이면 ZodError를 던짐
 * ---
 * @example
 * const env = loadEnv()
 * console.log(env.SUPABASE_URL)
 */
export function loadEnv(): Env {
  return envSchema.parse(process.env)
}
