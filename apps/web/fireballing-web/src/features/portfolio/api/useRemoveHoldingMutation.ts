import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/apiClient'

/**
 * # useRemoveHoldingMutation
 * ---
 * - 간단설명: 보유 종목을 삭제하는 mutation 훅, 성공 시 포트폴리오 캐시 무효화
 * ---
 * @param portfolioId 포트폴리오 UUID
 * ---
 * @example
 * const { mutate } = useRemoveHoldingMutation('portfolio-1')
 * mutate('holding-uuid')
 */
export function useRemoveHoldingMutation(portfolioId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (holdingId: string): Promise<void> => {
      const res = await apiClient(`/api/portfolio/${portfolioId}/holding/${holdingId}`, {
        method: 'DELETE',
      })
      const body = await res.json() as { success: boolean; error?: string }
      if (!body.success) throw new Error(body.error ?? '종목 삭제에 실패했습니다')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}
