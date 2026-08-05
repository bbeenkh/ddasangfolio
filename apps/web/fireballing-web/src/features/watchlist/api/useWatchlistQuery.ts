import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/apiClient'
import type { IWatchlistItem } from '@fblg/types'

/**
 * # useWatchlistQuery
 * ---
 * - 간단설명: 관심종목 목록을 조회하는 React Query 훅
 * - 제약사항: 로그인된 사용자만 사용 가능 (apiClient가 Bearer 토큰 자동 주입)
 * ---
 * @example
 * const { data, isLoading } = useWatchlistQuery()
 */
export function useWatchlistQuery() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: async (): Promise<IWatchlistItem[]> => {
      const res = await apiClient('/api/watchlist')
      const body = await res.json() as { success: boolean; data?: { watchlist: IWatchlistItem[] }; error?: string }
      if (!body.success || !body.data) throw new Error(body.error ?? '관심종목 조회에 실패했습니다')
      return body.data.watchlist
    },
  })
}
