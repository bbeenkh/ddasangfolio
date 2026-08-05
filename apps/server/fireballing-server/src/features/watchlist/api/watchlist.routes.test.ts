import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

const { mockGetUser, mockGetWatchlist, mockAddWatchlistItem, mockRemoveWatchlistItem } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetWatchlist: vi.fn(),
  mockAddWatchlistItem: vi.fn(),
  mockRemoveWatchlistItem: vi.fn(),
}))

vi.mock('../../../shared/lib/supabase.js', () => ({
  createSupabaseClientWithToken: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

vi.mock('../../../shared/config/env.js', () => ({
  loadEnv: () => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
    PORT: 3001,
  }),
}))

vi.mock('../model/watchlist.service.js', () => ({
  getWatchlist: mockGetWatchlist,
  addWatchlistItem: mockAddWatchlistItem,
  removeWatchlistItem: mockRemoveWatchlistItem,
}))

import { watchlistRoutes } from './watchlist.routes.js'

function createTestApp() {
  const app = new Hono()
  app.route('/api/watchlist', watchlistRoutes)
  return app
}

const validUser = { id: 'user-1', email: 'test@test.com' }

const validItem = {
  id: 'item-1',
  ticker: 'AAPL',
  name: 'Apple Inc.',
  quantity: 10,
  avg_buy_price: 150,
  created_at: '2026-01-01T00:00:00Z',
}

function authHeader() {
  return { Authorization: 'Bearer valid-token' }
}

describe('watchlist.routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: validUser }, error: null })
  })

  describe('GET /api/watchlist', () => {
    it('관심종목 목록을 반환한다', async () => {
      mockGetWatchlist.mockResolvedValue([validItem])

      const app = createTestApp()
      const res = await app.request('/api/watchlist', {
        headers: authHeader(),
      })
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.watchlist).toEqual([validItem])
    })

    it('토큰 없으면 401을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/watchlist')

      expect(res.status).toBe(401)
    })

    it('서비스 에러 시 500을 반환한다', async () => {
      mockGetWatchlist.mockRejectedValue(new Error('DB 오류'))

      const app = createTestApp()
      const res = await app.request('/api/watchlist', { headers: authHeader() })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/watchlist', () => {
    const validBody = {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      quantity: 10,
      avg_buy_price: 150,
    }

    it('관심종목을 추가하고 201을 반환한다', async () => {
      mockAddWatchlistItem.mockResolvedValue(validItem)

      const app = createTestApp()
      const res = await app.request('/api/watchlist', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
      const body = await res.json()

      expect(res.status).toBe(201)
      expect(body.success).toBe(true)
      expect(body.data.item).toEqual(validItem)
      expect(mockAddWatchlistItem).toHaveBeenCalledWith('valid-token', 'user-1', validBody)
    })

    it('입력값이 잘못되면 400을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/watchlist', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: '' }),
      })

      expect(res.status).toBe(400)
    })

    it('토큰 없으면 401을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })

      expect(res.status).toBe(401)
    })
  })

  describe('DELETE /api/watchlist/:id', () => {
    it('관심종목을 삭제하고 200을 반환한다', async () => {
      mockRemoveWatchlistItem.mockResolvedValue(undefined)

      const app = createTestApp()
      const res = await app.request('/api/watchlist/item-1', {
        method: 'DELETE',
        headers: authHeader(),
      })
      const body = await res.json()

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(mockRemoveWatchlistItem).toHaveBeenCalledWith('valid-token', 'item-1')
    })

    it('토큰 없으면 401을 반환한다', async () => {
      const app = createTestApp()
      const res = await app.request('/api/watchlist/item-1', { method: 'DELETE' })

      expect(res.status).toBe(401)
    })
  })
})
