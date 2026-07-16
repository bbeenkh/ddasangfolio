'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../model/authStore'

/**
 * # AuthHydration
 * ---
 * - 간단설명: 클라이언트에서 localStorage 토큰을 스토어로 복원하는 컴포넌트
 * - 제약사항 및 특이사항:
 *   - root layout에 한 번만 배치
 * ---
 * @example
 * <AuthHydration />
 */
export default function AuthHydration() {
  useEffect(() => {
    useAuthStore.getState().hydrate()
  }, [])

  return null
}
