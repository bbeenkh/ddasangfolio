import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/apiClient'
import type { AddHoldingRequest } from '@fblg/schemas'
import type { IHolding } from '@fblg/types'

/**
 * # useAddHoldingMutation
 * ---
 * - 간단설명: 포트폴리오에 종목을 추가하는 mutation 훅, 성공 시 포트폴리오 캐시 무효화
 * ---
 * @param portfolioId 포트폴리오 UUID
 * ---
 * @example
 * const { mutate } = useAddHoldingMutation('portfolio-1')
 * mutate({ symbol: 'AAPL', name: 'Apple Inc.', market: 'NASDAQ', quantity: 10, avg_buy_price: 150 })
 */
export function useAddHoldingMutation(portfolioId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddHoldingRequest): Promise<IHolding> => {
      const res = await apiClient(`/api/portfolio/${portfolioId}/holding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json() as { success: boolean; data?: { holding: IHolding }; error?: string }
      if (!body.success || !body.data) throw new Error(body.error ?? '종목 추가에 실패했습니다')
      return body.data.holding
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}
