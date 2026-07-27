'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import authManager from './authManager'

/**
 * # AuthManagerSync
 * ---
 * - 간단설명: NextAuth 세션을 authManager 싱글톤과 동기화하는 렌더링 없는 컴포넌트
 * - 제약사항: RootProvider 내부에서 한 번만 마운트할 것
 * @example
 * <AuthManagerSync />
 */
export default function AuthManagerSync() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken && session?.refreshToken) {
      authManager.setTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })
    } else if (status === 'unauthenticated') {
      authManager.clearToken()
    }
  }, [session, status])

  return null
}
