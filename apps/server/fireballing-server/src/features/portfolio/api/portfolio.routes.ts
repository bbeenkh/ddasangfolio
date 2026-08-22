import { Hono } from 'hono'
import { addHoldingSchema } from '@fblg/schemas'
import { authMiddleware } from '../../auth/index'
import * as portfolioService from '../model/portfolio.service'
import { HttpError } from '../../../shared/errors/http-error'
import { SupabaseConnectionError } from '../../../shared/errors/supabase-connection-error'

/**
 * # portfolioRoutes
 * ---
 * - 간단설명: 포트폴리오 및 보유 종목 API 라우트 (/api/portfolio에 마운트)
 * - 제약사항: 모든 라우트 인증 필수
 * ---
 * @example
 * app.route('/api/portfolio', portfolioRoutes)
 */
export const portfolioRoutes = new Hono<{ Variables: { userId: string } }>()

portfolioRoutes.use('/*', authMiddleware)

/**
 * # GET /api/portfolio/default
 * ---
 * - 간단설명: 기본 포트폴리오와 보유 종목 목록 조회 (없으면 자동 생성)
 */
portfolioRoutes.get('/default', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)
  const userId = c.get('userId')

  try {
    const portfolio = await portfolioService.getOrCreateDefaultPortfolio(token, userId)
    const holdings = await portfolioService.getHoldings(token, portfolio.id)
    return c.json({ success: true, data: { portfolio, holdings } }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '포트폴리오 조회에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # GET /api/portfolio/:id
 * ---
 * - 간단설명: 포트폴리오 상세 조회 (보유 종목 포함)
 * ---
 * @param id 포트폴리오 UUID
 */
portfolioRoutes.get('/:id', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)
  const portfolioId = c.req.param('id')

  try {
    const holdings = await portfolioService.getHoldings(token, portfolioId)
    return c.json({ success: true, data: { holdings } }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '포트폴리오 조회에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # POST /api/portfolio/:id/holding
 * ---
 * - 간단설명: 포트폴리오에 종목 추가
 * ---
 * @param id 포트폴리오 UUID
 */
portfolioRoutes.post('/:id/holding', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)
  const portfolioId = c.req.param('id')
  const body = await c.req.json()
  const parsed = addHoldingSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: '입력값이 올바르지 않습니다' }, 400)
  }

  try {
    const holding = await portfolioService.addHolding(token, portfolioId, parsed.data)
    return c.json({ success: true, data: { holding } }, 201)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '종목 추가에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})

/**
 * # DELETE /api/portfolio/:id/holding/:hid
 * ---
 * - 간단설명: 보유 종목 삭제
 * ---
 * @param id 포트폴리오 UUID
 * @param hid 종목 UUID
 */
portfolioRoutes.delete('/:id/holding/:hid', async (c) => {
  const token = c.req.header('Authorization')!.slice(7)
  const holdingId = c.req.param('hid')

  try {
    await portfolioService.removeHolding(token, holdingId)
    return c.json({ success: true }, 200)
  } catch (e) {
    if (e instanceof SupabaseConnectionError) {
      return c.json({ success: false, error: 'supabase connection error' }, 503)
    }
    const status = e instanceof HttpError ? e.statusCode : 500
    const message = e instanceof Error ? e.message : '종목 삭제에 실패했습니다'
    return c.json({ success: false, error: message }, status as any)
  }
})
