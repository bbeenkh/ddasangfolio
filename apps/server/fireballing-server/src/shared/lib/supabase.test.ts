import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: {} })),
}))

vi.mock('../config/env.js', () => ({
  loadEnv: () => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_JWT_SECRET: 'test-jwt-secret',
    WEB_BASE_URL: 'http://localhost:3000',
    PORT: 3001,
  }),
}))

describe('Supabase 클라이언트', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getSupabaseClient는 anon key와 PKCE flowType으로 생성된 클라이언트를 반환한다', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const { getSupabaseClient } = await import('./supabase.js')

    const client = getSupabaseClient()

    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      { auth: { flowType: 'pkce' } },
    )
    expect(client).toBeDefined()
  })

  it('createSupabaseClientWithToken은 사용자 토큰으로 클라이언트를 생성한다', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const { createSupabaseClientWithToken } = await import('./supabase.js')

    const client = createSupabaseClientWithToken('user-access-token')

    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      {
        global: {
          headers: { Authorization: 'Bearer user-access-token' },
        },
      },
    )
    expect(client).toBeDefined()
  })

  it('createSupabaseClientWithCodeVerifier는 PKCE code_verifier를 storage에 주입한 클라이언트를 생성한다', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const { createSupabaseClientWithCodeVerifier } = await import('./supabase.js')

    const client = createSupabaseClientWithCodeVerifier('test-verifier')

    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        auth: expect.objectContaining({
          flowType: 'pkce',
          storage: expect.objectContaining({
            getItem: expect.any(Function),
            setItem: expect.any(Function),
            removeItem: expect.any(Function),
          }),
        }),
      }),
    )
    expect(client).toBeDefined()

    // storage.getItem이 code_verifier 키에 대해 올바른 값을 반환하는지 확인
    const storageArg = (createClient as any).mock.calls.at(-1)[2].auth.storage
    expect(storageArg.getItem('some-key-code_verifier')).toBe('test-verifier')
    expect(storageArg.getItem('other-key')).toBeNull()
  })
})
