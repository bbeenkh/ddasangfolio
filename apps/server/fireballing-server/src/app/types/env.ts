import type { UserProfile } from '../../entities/user/index.js'

/**
 * # AppEnv
 * ---
 * - 간단설명: Hono 앱의 제네릭 타입 파라미터로 사용되는 환경 타입
 * - userId: 인증 미들웨어에서 설정하는 사용자 ID
 * - user: 인증 미들웨어에서 설정하는 사용자 프로필 (선택적)
 */
export type AppEnv = {
  Variables: {
    userId: string
    user: UserProfile
  }
}
