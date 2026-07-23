import QueryProvider from '@/shared/lib/QueryProvider'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

/**
 * 전역 Provider
 */
export default function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </SessionProvider>
    </>
  )
}
