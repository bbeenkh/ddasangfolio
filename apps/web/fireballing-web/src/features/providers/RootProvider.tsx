'use client'

import { AuthManagerSync } from '@/entities/auth'
import queryClient from '@/shared/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import React from 'react'

const SessionProvider = dynamic(
  () => import('next-auth/react').then((m) => ({ default: m.SessionProvider })),
  { ssr: false }
)

/**
 * 전역 Provider
 */
export default function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
        <AuthManagerSync />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}
