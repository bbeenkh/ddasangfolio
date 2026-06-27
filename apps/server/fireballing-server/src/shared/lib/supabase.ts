import { createClient } from '@supabase/supabase-js'
import { loadEnv } from '../config/env.js'

/**
 * # getSupabaseClient
 * ---
 * - 간단설명: anon key 기반 서버 공용 Supabase 클라이언트를 반환
 * ---
 * @example
 * const supabase = getSupabaseClient()
 * const { data } = await supabase.auth.signUp({ email, password })
 */
export function getSupabaseClient() {
  const env = loadEnv()
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}

/**
 * # createSupabaseClientWithToken
 * ---
 * - 간단설명: 사용자 access token을 포함한 Supabase 클라이언트를 생성
 * - 제약사항: 인증된 사용자의 요청 처리에만 사용할 것
 * ---
 * @param accessToken JWT access token
 * ---
 * @example
 * const supabase = createSupabaseClientWithToken(token)
 * const { data } = await supabase.auth.getUser()
 */
export function createSupabaseClientWithToken(accessToken: string) {
  const env = loadEnv()
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  })
}
