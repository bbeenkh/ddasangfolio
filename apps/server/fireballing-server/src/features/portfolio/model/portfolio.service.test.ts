import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSelect = vi.fn()
const mockInsert = vi.fn()
const mockDelete = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockOrder = vi.fn()
const mockLimit = vi.fn()

const mockFrom = vi.fn()

vi.mock('../../../shared/lib/supabase', () => ({
  createSupabaseClientWithToken: () => ({
    from: mockFrom,
  }),
}))

import {
  getOrCreateDefaultPortfolio,
  getHoldings,
  addHolding,
  removeHolding,
} from './portfolio.service'

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

describe('portfolio.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOrCreateDefaultPortfolio', () => {
    it('기존 포트폴리오가 있으면 반환한다', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
              }),
            }),
          }),
        }),
      })

      const result = await getOrCreateDefaultPortfolio('token', 'user-1')

      expect(result).toEqual(mockPortfolio)
      expect(mockFrom).toHaveBeenCalledWith('portfolios')
    })

    it('포트폴리오가 없으면 기본 포트폴리오를 생성한다', async () => {
      const mockInsertChain = {
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
        }),
      }

      mockFrom
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: vi.fn().mockReturnValue(mockInsertChain),
        })

      const result = await getOrCreateDefaultPortfolio('token', 'user-1')

      expect(result).toEqual(mockPortfolio)
    })
  })

  describe('getHoldings', () => {
    it('포트폴리오의 종목 목록을 반환한다', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [mockHolding], error: null }),
          }),
        }),
      })

      const result = await getHoldings('token', 'portfolio-1')

      expect(result).toEqual([mockHolding])
      expect(mockFrom).toHaveBeenCalledWith('holdings')
    })

    it('종목이 없으면 빈 배열을 반환한다', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      const result = await getHoldings('token', 'portfolio-1')

      expect(result).toEqual([])
    })

    it('Supabase 에러 시 HttpError를 던진다', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB 오류' } }),
          }),
        }),
      })

      await expect(getHoldings('token', 'portfolio-1')).rejects.toThrow('DB 오류')
    })
  })

  describe('addHolding', () => {
    it('종목을 추가하고 반환한다', async () => {
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockHolding, error: null }),
          }),
        }),
      })

      const result = await addHolding('token', 'portfolio-1', {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        market: 'NASDAQ' as any,
        currency: 'USD' as any,
        avg_buy_price: 150,
        quantity: 10,
      })

      expect(result).toEqual(mockHolding)
      expect(mockFrom).toHaveBeenCalledWith('holdings')
    })

    it('Supabase 에러(중복 등) 시 HttpError를 던진다', async () => {
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'duplicate key value violates unique constraint' },
            }),
          }),
        }),
      })

      await expect(
        addHolding('token', 'portfolio-1', {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          market: 'NASDAQ' as any,
          currency: 'USD' as any,
          avg_buy_price: 150,
          quantity: 10,
        }),
      ).rejects.toThrow()
    })

    it('data가 null이면 HttpError를 던진다', async () => {
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      await expect(
        addHolding('token', 'portfolio-1', {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          market: 'NASDAQ' as any,
          currency: 'USD' as any,
          avg_buy_price: 150,
          quantity: 10,
        }),
      ).rejects.toThrow('종목 추가에 실패했습니다')
    })
  })

  describe('removeHolding', () => {
    it('종목을 삭제한다', async () => {
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })

      await expect(removeHolding('token', 'holding-1')).resolves.not.toThrow()
      expect(mockFrom).toHaveBeenCalledWith('holdings')
    })

    it('Supabase 에러 시 HttpError를 던진다', async () => {
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: '삭제 실패' } }),
        }),
      })

      await expect(removeHolding('token', 'holding-1')).rejects.toThrow('삭제 실패')
    })
  })
})
