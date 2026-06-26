import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('loadEnv', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('유효한 환경변수가 있으면 파싱된 설정을 반환한다', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key')
    vi.stubEnv('SUPABASE_JWT_SECRET', 'test-jwt-secret')

    const { loadEnv } = await import('./env.js')
    const env = loadEnv()

    expect(env.SUPABASE_URL).toBe('https://test.supabase.co')
    expect(env.SUPABASE_ANON_KEY).toBe('test-anon-key')
    expect(env.SUPABASE_JWT_SECRET).toBe('test-jwt-secret')
    expect(env.PORT).toBe(3001)
  })

  it('PORT 환경변수가 있으면 해당 값을 사용한다', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key')
    vi.stubEnv('SUPABASE_JWT_SECRET', 'test-jwt-secret')
    vi.stubEnv('PORT', '4000')

    const { loadEnv } = await import('./env.js')
    const env = loadEnv()

    expect(env.PORT).toBe(4000)
  })

  it('필수 환경변수가 없으면 에러를 던진다', async () => {
    vi.stubEnv('SUPABASE_URL', '')
    vi.stubEnv('SUPABASE_ANON_KEY', '')
    vi.stubEnv('SUPABASE_JWT_SECRET', '')

    const { loadEnv } = await import('./env.js')

    expect(() => loadEnv()).toThrow()
  })

  it('SUPABASE_URL이 유효한 URL이 아니면 에러를 던진다', async () => {
    vi.stubEnv('SUPABASE_URL', 'not-a-url')
    vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key')
    vi.stubEnv('SUPABASE_JWT_SECRET', 'test-jwt-secret')

    const { loadEnv } = await import('./env.js')

    expect(() => loadEnv()).toThrow()
  })
})
