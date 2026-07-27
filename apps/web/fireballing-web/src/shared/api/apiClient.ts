import { authManager } from '@/entities/auth'
import devFetch from '@/shared/lib/devFetch'
import type { Tokens } from '@fblg/authmanager'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

/**
 * 백엔드 refresh 엔드포인트 호출 — authManager.revalidateTokens에 주입
 */
async function revalidateFn(): Promise<Tokens> {
  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: authManager.refreshToken }),
  })
  const data = (await res.json()) as {
    success: boolean
    data?: { tokens: { accessToken: string; refreshToken: string } }
  }
  if (!data.success || !data.data) throw new Error('token refresh failed')
  return data.data.tokens
}

/**
 * # apiClient
 * ---
 * - 간단설명: 백엔드 API 호출용 fetch 래퍼 — Authorization 헤더 자동 주입 및 401 시 토큰 재발급 후 재시도
 * - 제약사항: 서버 컴포넌트에서는 사용 불가 (authManager는 클라이언트 싱글톤)
 * @param path 백엔드 경로 (예: '/api/user/profile')
 * @param init fetch RequestInit 옵션
 * @example
 * const res = await apiClient('/api/posts', { method: 'GET' })
 */
export async function apiClient(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (authManager.accessToken) {
    headers.set('Authorization', `Bearer ${authManager.accessToken}`)
  }

  const res = await devFetch(`${BASE_URL}${path}`, { ...init, headers })

  if (res.status !== 401 || !authManager.isLogined) {
    return res
  }

  // 401: 토큰 재발급 후 재시도
  const newToken = await authManager.revalidateTokens(revalidateFn)
  const retryHeaders = new Headers(init?.headers)
  retryHeaders.set('Authorization', `Bearer ${newToken}`)
  return devFetch(`${BASE_URL}${path}`, { ...init, headers: retryHeaders })
}
