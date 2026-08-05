import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/apiClient'
import type { AddWatchlistRequest } from '@fblg/schemas'
import type { IWatchlistItem } from '@fblg/types'

/**
 * # useAddWatchlistMutation
 * ---
 * - 간단설명: 관심종목 항목을 추가하는 mutation 훅, 성공 시 목록 캐시 무효화
 * ---
 * @example
 * const { mutate } = useAddWatchlistMutation()
 * mutate({ ticker: 'AAPL', name: 'Apple Inc.', quantity: 10, avg_buy_price: 150 })
 */
export function useAddWatchlistMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddWatchlistRequest): Promise<IWatchlistItem> => {
      const res = await apiClient('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json() as { success: boolean; data?: { item: IWatchlistItem }; error?: string }
      if (!body.success || !body.data) throw new Error(body.error ?? '관심종목 추가에 실패했습니다')
      return body.data.item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}
