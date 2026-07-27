import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthManager } from './authManager.js'
import type { Tokens } from './authManager.types.js'

const MOCK_TOKENS: Tokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
}

describe('AuthManager', () => {
  describe('constructor', () => {
    it('토큰이 있으면 isLogined = true', () => {
      const manager = new AuthManager(MOCK_TOKENS)
      expect(manager.isLogined).toBe(true)
      expect(manager.accessToken).toBe('access-token')
      expect(manager.refreshToken).toBe('refresh-token')
    })

    it('토큰이 없으면 isLogined = false', () => {
      const manager = new AuthManager({ accessToken: null, refreshToken: null })
      expect(manager.isLogined).toBe(false)
    })
  })

  describe('setTokens', () => {
    it('정상 저장', () => {
      const manager = new AuthManager({ accessToken: null, refreshToken: null })
      manager.setTokens(MOCK_TOKENS)
      expect(manager.accessToken).toBe('access-token')
      expect(manager.refreshToken).toBe('refresh-token')
      expect(manager.isLogined).toBe(true)
    })

    it('null 전달 시 throw', () => {
      const manager = new AuthManager(MOCK_TOKENS)
      expect(() =>
        manager.setTokens({ accessToken: null, refreshToken: null }),
      ).toThrow('token not found')
    })
  })

  describe('clearToken', () => {
    it('토큰 초기화 및 isLogined = false', () => {
      const manager = new AuthManager(MOCK_TOKENS)
      manager.clearToken()
      expect(manager.accessToken).toBeNull()
      expect(manager.refreshToken).toBeNull()
      expect(manager.isLogined).toBe(false)
    })
  })

  describe('revalidateTokens', () => {
    let manager: AuthManager

    beforeEach(() => {
      manager = new AuthManager(MOCK_TOKENS)
    })

    it('정상 재발급 → 토큰 저장, isRefreshing = false 복구', async () => {
      const newTokens: Tokens = {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      }
      const revalidateFn = vi.fn().mockResolvedValue(newTokens)

      const result = await manager.revalidateTokens(revalidateFn)

      expect(result).toBe('new-access')
      expect(manager.accessToken).toBe('new-access')
      expect(manager.isRefreshing).toBe(false)
    })

    it('refresh 중 중복 호출 → 큐 대기 후 동일 토큰 반환', async () => {
      const newTokens: Tokens = {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      }
      let resolveRefresh!: (tokens: Tokens) => void
      const revalidateFn = vi
        .fn()
        .mockReturnValue(
          new Promise<Tokens>((res) => {
            resolveRefresh = res
          }),
        )

      const firstCall = manager.revalidateTokens(revalidateFn)
      const secondCall = manager.revalidateTokens(revalidateFn)

      resolveRefresh(newTokens)

      const [first, second] = await Promise.all([firstCall, secondCall])

      expect(first).toBe('new-access')
      expect(second).toBe('new-access')
      expect(revalidateFn).toHaveBeenCalledTimes(1)
    })

    it('refreshToken 없을 때 NO_REFRESH_TOKEN throw', async () => {
      const noTokenManager = new AuthManager({
        accessToken: null,
        refreshToken: null,
      })
      await expect(
        noTokenManager.revalidateTokens(vi.fn()),
      ).rejects.toThrow('NO_REFRESH_TOKEN')
    })

    it('revalidateFn 실패 시 TOKEN_REFRESH_FAILED throw, clearToken 호출', async () => {
      const revalidateFn = vi.fn().mockRejectedValue(new Error('network error'))

      await expect(manager.revalidateTokens(revalidateFn)).rejects.toThrow(
        'TOKEN_REFRESH_FAILED',
      )
      expect(manager.accessToken).toBeNull()
      expect(manager.isLogined).toBe(false)
    })
  })
})
