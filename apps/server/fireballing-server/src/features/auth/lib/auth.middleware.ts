import { createMiddleware } from 'hono/factory'
import { createSupabaseClientWithToken } from '../../../shared/lib/supabase.js'

/**
 * # authMiddleware
 * ---
 * - 간단설명: Authorization 헤더의 Bearer 토큰을 검증하고 userId를 컨텍스트에 설정
 * - 제약사항: Supabase Auth의 getUser API로 토큰을 검증하므로 네트워크 호출 발생
 * ---
 * @example
 * app.use('/protected/*', authMiddleware)
 */
export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ success: false, error: '인증 토큰이 필요합니다' }, 401)
  }

  const token = authHeader.slice(7)
  const supabase = createSupabaseClientWithToken(token)
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return c.json({ success: false, error: '유효하지 않은 토큰입니다' }, 401)
  }

  c.set('userId' as any, data.user.id)
  await next()
})
