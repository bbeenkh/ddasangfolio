import { Hono } from 'hono'
import { addWatchlistSchema } from '@fblg/schemas'
import { authMiddleware } from '../../auth/index.js'
import * as watchlistService from '../model/watchlist.service.js'
import { HttpError } from '../../../shared/errors/http-error.js'
import { SupabaseConnectionError } from '../../../shared/errors/supabase-connection-error.js'

/**
 * # watchlistRoutes
 * ---
 * - 간단설명: 관심종목 CRUD API 라우트 (/api/watchlist에 마운트)
 * - 제약사항: 모든 라우트 인증 필수
 * ---
 * @example
 * app.route('/api/watchlist', watchlistRoutes)
 */
export const watchlistRoutes = new Hono<{ Variables: { userId: string } }>()

watchlistRoutes.use('/*', authMiddleware)

/**
 * # GET /api/watchlist
 * ---
 * - 간단설명: 인증된 사용자의 관심종목 목록 조회
 */
watchlistRoutes.get('/', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)

  try {
    const watchlist = await watchlistService.getWatchlist(token)
    return c.json({ success: true, data: { watchlist } }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '관심종목 조회에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # POST /api/watchlist
 * ---
 * - 간단설명: 관심종목 항목 추가
 * ---
 * @param ticker 티커 심볼
 * @param name 종목명
 * @param quantity 보유 수량
 * @param avg_buy_price 평균 매수가
 */
watchlistRoutes.post('/', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)
  const userId = c.get('userId')
  const body = await c.req.json()
  const parsed = addWatchlistSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: '입력값이 올바르지 않습니다' }, 400)
  }

  try {
    const item = await watchlistService.addWatchlistItem(token, userId, parsed.data)
    return c.json({ success: true, data: { item } }, 201)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '관심종목 추가에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # DELETE /api/watchlist/:id
 * ---
 * - 간단설명: 관심종목 항목 삭제
 * ---
 * @param id 삭제할 항목 UUID
 */
watchlistRoutes.delete('/:id', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)
  const id = c.req.param('id')

  try {
    await watchlistService.removeWatchlistItem(token, id)
    return c.json({ success: true }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '관심종목 삭제에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})
