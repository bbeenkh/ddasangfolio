import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockOrder = vi.fn()
const mockSelect = vi.fn()
const mockInsert = vi.fn()
const mockDelete = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()

const mockFrom = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({ order: mockOrder }),
  insert: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({ single: mockSingle }),
  }),
  delete: vi.fn().mockReturnValue({ eq: mockEq }),
})

vi.mock('../../../shared/lib/supabase.js', () => ({
  createSupabaseClientWithToken: () => ({
    from: mockFrom,
  }),
}))

import { getWatchlist, addWatchlistItem, removeWatchlistItem } from './watchlist.service.js'

const mockItem = {
  id: 'item-1',
  ticker: 'AAPL',
  name: 'Apple Inc.',
  quantity: 10,
  avg_buy_price: 150,
  created_at: '2026-01-01T00:00:00Z',
}

describe('watchlist.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // 기본 체인 재설정
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({ order: mockOrder }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ single: mockSingle }),
      }),
      delete: vi.fn().mockReturnValue({ eq: mockEq }),
    })
  })

  describe('getWatchlist', () => {
    it('관심종목 목록을 반환한다', async () => {
      mockOrder.mockResolvedValue({ data: [mockItem], error: null })

      const result = await getWatchlist('access-token')

      expect(result).toEqual([mockItem])
      expect(mockFrom).toHaveBeenCalledWith('watchlist')
    })

    it('데이터가 없으면 빈 배열을 반환한다', async () => {
      mockOrder.mockResolvedValue({ data: null, error: null })

      const result = await getWatchlist('access-token')

      expect(result).toEqual([])
    })

    it('Supabase 에러 시 HttpError를 던진다', async () => {
      mockOrder.mockResolvedValue({ data: null, error: { message: 'DB 오류' } })

      await expect(getWatchlist('access-token')).rejects.toThrow('DB 오류')
    })
  })

  describe('addWatchlistItem', () => {
    it('관심종목 항목을 추가하고 반환한다', async () => {
      mockSingle.mockResolvedValue({ data: mockItem, error: null })

      const result = await addWatchlistItem('access-token', 'user-1', {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        avg_buy_price: 150,
      })

      expect(result).toEqual(mockItem)
    })

    it('Supabase 에러(중복 티커 등) 시 HttpError를 던진다', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'duplicate key value violates unique constraint' },
      })

      await expect(
        addWatchlistItem('access-token', 'user-1', {
          ticker: 'AAPL',
          name: 'Apple Inc.',
          quantity: 10,
          avg_buy_price: 150,
        }),
      ).rejects.toThrow()
    })

    it('data가 null이면 HttpError를 던진다', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null })

      await expect(
        addWatchlistItem('access-token', 'user-1', {
          ticker: 'AAPL',
          name: 'Apple Inc.',
          quantity: 10,
          avg_buy_price: 150,
        }),
      ).rejects.toThrow('관심종목 추가에 실패했습니다')
    })
  })

  describe('removeWatchlistItem', () => {
    it('관심종목 항목을 삭제한다', async () => {
      mockEq.mockResolvedValue({ error: null })

      await expect(removeWatchlistItem('access-token', 'item-1')).resolves.not.toThrow()
      expect(mockEq).toHaveBeenCalledWith('id', 'item-1')
    })

    it('Supabase 에러 시 HttpError를 던진다', async () => {
      mockEq.mockResolvedValue({ error: { message: '삭제 실패' } })

      await expect(removeWatchlistItem('access-token', 'item-1')).rejects.toThrow('삭제 실패')
    })
  })
})
