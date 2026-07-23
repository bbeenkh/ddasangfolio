import { Hono } from 'hono'
import { signupSchema, loginSchema, refreshSchema } from '../types/auth.types.js'
import * as authService from '../model/auth.service.js'
import { authMiddleware } from '../lib/auth.middleware.js'
import { HttpError } from '../../../shared/errors/http-error.js'
import { SupabaseConnectionError } from '../../../shared/errors/supabase-connection-error.js'

/**
 * # authRoutes
 * ---
 * - 간단설명: 인증 관련 API 라우트 (/api/auth/*에 마운트)
 * - 제약사항: signup, login, refresh는 공개, me와 logout은 인증 필요
 * ---
 * @example
 * app.route('/api/auth', authRoutes)
 */
export const authRoutes = new Hono()

/**
 * # POST /signup
 * ---
 * - 간단설명: 이메일/비밀번호로 회원가입
 * ---
 * @param email 이메일 주소
 * @param password 비밀번호 (최소 6자)
 * @param name 사용자 이름 (선택)
 */
authRoutes.post('/signup', async (c) => {
  const body = await c.req.json()
  const parsed = signupSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: '입력값이 올바르지 않습니다' }, 400)
  }

  try {
    const result = await authService.signup(parsed.data)
    return c.json({ success: true, data: result }, 201)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '회원가입에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # POST /login
 * ---
 * - 간단설명: 이메일/비밀번호로 로그인
 */
authRoutes.post('/login', async (c) => {
  const body = await c.req.json()
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: '입력값이 올바르지 않습니다' }, 400)
  }

  try {
    const result = await authService.login(parsed.data)
    return c.json({ success: true, data: result }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '로그인에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # POST /refresh
 * ---
 * - 간단설명: 리프레시 토큰으로 새 액세스 토큰 발급
 */
authRoutes.post('/refresh', async (c) => {
  const body = await c.req.json()
  const parsed = refreshSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: '입력값이 올바르지 않습니다' }, 400)
  }

  try {
    const tokens = await authService.refreshToken(parsed.data.refreshToken)
    return c.json({ success: true, data: { tokens } }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '토큰 갱신에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

// 인증 필요 라우트
authRoutes.use('/me', authMiddleware)
authRoutes.use('/logout', authMiddleware)

/**
 * # GET /me
 * ---
 * - 간단설명: 현재 인증된 유저 정보 조회
 */
authRoutes.get('/me', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)

  try {
    const user = await authService.getCurrentUser(token)
    return c.json({ success: true, data: { user } }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '유저 정보 조회에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # POST /logout
 * ---
 * - 간단설명: 현재 세션 로그아웃
 */
authRoutes.post('/logout', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)

  try {
    await authService.logout(token)
    return c.json({ success: true, message: '로그아웃 되었습니다' }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '로그아웃에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})
