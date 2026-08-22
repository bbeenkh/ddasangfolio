import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/apiClient'
import type { IPortfolio, IHolding } from '@fblg/types'

/**
 * # usePortfolioQuery
 * ---
 * - 간단설명: 기본 포트폴리오와 보유 종목 목록을 조회하는 React Query 훅
 * - 제약사항: 로그인된 사용자만 사용 가능
 * ---
 * @example
 * const { data, isLoading } = usePortfolioQuery()
 */
export function usePortfolioQuery() {
  return useQuery({
    queryKey: ['portfolio', 'default'],
    queryFn: async (): Promise<{ portfolio: IPortfolio; holdings: IHolding[] }> => {
      const res = await apiClient('/api/portfolio/default')
      const body = await res.json() as {
        success: boolean
        data?: { portfolio: IPortfolio; holdings: IHolding[] }
        error?: string
      }
      if (!body.success || !body.data) throw new Error(body.error ?? '포트폴리오 조회에 실패했습니다')
      return body.data
    },
  })
}
