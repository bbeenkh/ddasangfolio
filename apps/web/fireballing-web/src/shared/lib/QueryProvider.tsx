'use client'

import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { makeQueryClient } from './queryClient'

/**
 * # QueryProvider
 * ---
 * - 간단설명: TanStack Query의 QueryClientProvider를 감싸는 클라이언트 컴포넌트
 * - 제약사항 및 특이사항: 브라우저에서는 싱글턴, 서버에서는 요청마다 새 인스턴스 생성
 * ---
 * @param children React children
 * ---
 * @example
 * <QueryProvider>{children}</QueryProvider>
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
