import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/apiClient'

/**
 * # useRemoveWatchlistMutation
 * ---
 * - 간단설명: 관심종목 항목을 삭제하는 mutation 훅, 성공 시 목록 캐시 무효화
 * ---
 * @example
 * const { mutate } = useRemoveWatchlistMutation()
 * mutate('item-uuid')
 */
export function useRemoveWatchlistMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await apiClient(`/api/watchlist/${id}`, { method: 'DELETE' })
      const body = await res.json() as { success: boolean; error?: string }
      if (!body.success) throw new Error(body.error ?? '관심종목 삭제에 실패했습니다')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}
