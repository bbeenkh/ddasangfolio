import { QueryClient } from '@tanstack/react-query'

/**
 * # makeQueryClient
 * ---
 * - 간단설명: QueryClient 인스턴스를 생성하는 팩토리 함수
 * - 제약사항 및 특이사항: SSR 환경에서 요청마다 새 인스턴스 생성 필요
 * ---
 * @example
 * const queryClient = makeQueryClient()
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  },
})

export default queryClient;