import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: {} })),
}))

vi.mock('../config/env', () => ({
  loadEnv: () => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_JWT_SECRET: 'test-jwt-secret',
    PORT: 3001,
  }),
}))

describe('Supabase 클라이언트', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getSupabaseClient는 anon key로 생성된 클라이언트를 반환한다', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const { getSupabaseClient } = await import('./supabase')

    const client = getSupabaseClient()

    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
    )
    expect(client).toBeDefined()
  })

  it('createSupabaseClientWithToken은 사용자 토큰으로 클라이언트를 생성한다', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const { createSupabaseClientWithToken } = await import('./supabase')

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
})
