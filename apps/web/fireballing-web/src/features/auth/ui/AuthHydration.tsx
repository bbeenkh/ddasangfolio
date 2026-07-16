'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../model/authStore'
import type { AuthTokens, UserProfile } from '../types/authTypes'

const OLD_TOKENS_KEY = 'auth_tokens'
const OLD_USER_KEY = 'auth_user'

/**
 * # AuthHydration
 * ---
 * - 간단설명: 클라이언트에서 persist 스토어를 복원하는 컴포넌트
 * - 제약사항 및 특이사항:
 *   - root layout에 한 번만 배치
 *   - 기존 localStorage 키에서 신규 스토어로 마이그레이션 처리
 * ---
 * @example
 * <AuthHydration />
 */
export default function AuthHydration() {
  useEffect(() => {
    migrateOldStorage()
    useAuthStore.persist.rehydrate()
  }, [])

  return null
}

/**
 * # migrateOldStorage
 * ---
 * - 간단설명: 기존 localStorage 키(auth_tokens, auth_user)를 신규 persist 스토어로 마이그레이션
 */
function migrateOldStorage() {
  const newStoreKey = 'auth-storage'
  if (localStorage.getItem(newStoreKey)) return

  const rawTokens = localStorage.getItem(OLD_TOKENS_KEY)
  const rawUser = localStorage.getItem(OLD_USER_KEY)

  if (!rawTokens) return

  try {
    const tokens = JSON.parse(rawTokens) as AuthTokens
    const user = rawUser ? (JSON.parse(rawUser) as UserProfile) : null

    const state = {
      state: {
        tokens,
        user,
        isLoggedIn: true,
      },
      version: 0,
    }

    localStorage.setItem(newStoreKey, JSON.stringify(state))
    localStorage.removeItem(OLD_TOKENS_KEY)
    localStorage.removeItem(OLD_USER_KEY)
  } catch {
    // 파싱 실패 시 기존 키만 제거
    localStorage.removeItem(OLD_TOKENS_KEY)
    localStorage.removeItem(OLD_USER_KEY)
  }
}
