import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

const {
  mockGetUser,
  mockGetOrCreateDefaultPortfolio,
  mockGetHoldings,
  mockAddHolding,
  mockRemoveHolding,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetOrCreateDefaultPortfolio: vi.fn(),
  mockGetHoldings: vi.fn(),
  mockAddHolding: vi.fn(),
  mockRemoveHolding: vi.fn(),
}))

vi.mock('../../../shared/lib/supabase', () => ({
  createSupabaseClientWithToken: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

vi.mock('../../../shared/config/env', () => ({
  loadEnv: () => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
    PORT: 3001,
  }),
}))

vi.mock('../model/portfolio.service', () => ({
  getOrCreateDefaultPortfolio: mockGetOrCreateDefaultPortfolio,
  getHoldings: mockGetHoldings,
  addHolding: mockAddHolding,
  removeHolding: mockRemoveHolding,
}))

import { portfolioRoutes } from './portfolio.routes'

function createTestApp() {
  const app = new Hono()
  app.route('/api/portfolio', portfolioRoutes)
  return app
}

const validUser = { id: 'user-1', email: 'test@test.com' }

const mockPortfolio = {
  id: 'portfolio-1',
  user_id: 'user-1',
  name: '내 포트폴리오',
  description: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockHolding = {
  id: 'holding-1',
  portfolio_id: 'portfolio-1',
  symbol: 'AAPL',
  name: 'Apple Inc.',
  market: 'NASDAQ',
  currency: 'USD',
  avg_buy_price: 150,
  quantity: 10,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

function authHeader() {
  return { Authorization: 'Bearer valid-token' }
}

describe('portfolio.routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: validUser }, error: null })
  })

  describe('GET /api/portfolio/:id', () => {
    it('포트폴리오 상세와 종목 목록을 반환한다', async () => {
      mockGetOrCreateDefaultPortfolio.mockResolvedValue(mockPortfolio)
      mockGetHoldings.mockResolvedValue([mockHolding])

      const app = createTestApp()
      const res = await app.request('/api/portfolio/portfolio-1', {
        headers: authHeader(),
      })
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.holdings).toEqual([mockHolding])
    })

    it('토큰 없으면 401을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/portfolio/portfolio-1')

      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/portfolio/default', () => {
    it('기본 포트폴리오와 종목 목록을 반환한다', async () => {
      mockGetOrCreateDefaultPortfolio.mockResolvedValue(mockPortfolio)
      mockGetHoldings.mockResolvedValue([mockHolding])

      const app = createTestApp()
      const res = await app.request('/api/portfolio/default', {
        headers: authHeader(),
      })
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.portfolio).toEqual(mockPortfolio)
      expect(body.data.holdings).toEqual([mockHolding])
    })
  })

  describe('POST /api/portfolio/:id/holding', () => {
    const validBody = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      market: 'NASDAQ',
      currency: 'USD',
      avg_buy_price: 150,
      quantity: 10,
    }

    it('종목을 추가하고 201을 반환한다', async () => {
      mockAddHolding.mockResolvedValue(mockHolding)

      const app = createTestApp()
      const res = await app.request('/api/portfolio/portfolio-1/holding', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.success).toBe(true)
      expect(body.data.holding).toEqual(mockHolding)
      expect(mockAddHolding).toHaveBeenCalledWith('valid-token', 'portfolio-1', validBody)
    })

    it('입력값이 잘못되면 400을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/portfolio/portfolio-1/holding', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: '' }),
      })

      expect(res.status).toBe(400)
    })

    it('토큰 없으면 401을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/portfolio/portfolio-1/holding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })

      expect(res.status).toBe(401)
    })
  })

  describe('DELETE /api/portfolio/:id/holding/:hid', () => {
    it('종목을 삭제하고 200을 반환한다', async () => {
      mockRemoveHolding.mockResolvedValue(undefined)

      const app = createTestApp()
      const res = await app.request('/api/portfolio/portfolio-1/holding/holding-1', {
        method: 'DELETE',
        headers: authHeader(),
      })
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(mockRemoveHolding).toHaveBeenCalledWith('valid-token', 'holding-1')
    })

    it('토큰 없으면 401을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/portfolio/portfolio-1/holding/holding-1', {
        method: 'DELETE',
      })

      expect(res.status).toBe(401)
    })
  })
})
