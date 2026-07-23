'use client'

import queryClient from '@/shared/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

/**
 * 전역 Provider
 */
export default function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}
