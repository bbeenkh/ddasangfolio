import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '../../../entities/user/index.js'
import type { SignupRequest, LoginRequest, AuthTokens } from '../types/auth.types.js'
import { getSupabaseClient, createSupabaseClientWithToken, createSupabaseClientWithCodeVerifier } from '../../../shared/lib/supabase.js'
import { HttpError } from '../../../shared/errors/http-error.js'
import { SupabaseConnectionError } from '../../../shared/errors/supabase-connection-error.js'

/**
 * # signup
 * ---
 * - 간단설명: 이메일/비밀번호로 회원가입 후 유저 정보와 토큰을 반환
 * - 제약사항: Supabase Auth 에러 시 HttpError를 던짐
 * ---
 * @param data 회원가입 요청 데이터 (email, password, name?)
 * ---
 * @example
 * const { user, tokens } = await signup({ email: 'a@b.com', password: '123456' })
 */
export async function signup(data: SignupRequest): Promise<{ user: UserProfile; tokens: AuthTokens }> {
  const supabase = getSupabaseClient()

  let result, error
  try {
    ({ data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: data.name ? { data: { name: data.name } } : undefined,
    }))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(400, error.message)
  }
  if (!result.user || !result.session) throw new HttpError(400, '회원가입에 실패했습니다')

  return {
    user: mapToUserProfile(result.user),
    tokens: {
      accessToken: result.session.access_token,
      refreshToken: result.session.refresh_token,
      expiresIn: result.session.expires_in,
    },
  }
}

/**
 * # login
 * ---
 * - 간단설명: 이메일/비밀번호로 로그인 후 유저 정보와 토큰을 반환
 * ---
 * @param data 로그인 요청 데이터 (email, password)
 * ---
 * @example
 * const { user, tokens } = await login({ email: 'a@b.com', password: '123456' })
 */
export async function login(data: LoginRequest): Promise<{ user: UserProfile; tokens: AuthTokens }> {
  const supabase = getSupabaseClient()

  let result, error
  try {
    ({ data: result, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    }))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(401, error.message)
  }
  if (!result.user || !result.session) throw new HttpError(401, '로그인에 실패했습니다')

  return {
    user: mapToUserProfile(result.user),
    tokens: {
      accessToken: result.session.access_token,
      refreshToken: result.session.refresh_token,
      expiresIn: result.session.expires_in,
    },
  }
}

/**
 * # logout
 * ---
 * - 간단설명: 사용자 토큰으로 로그아웃 처리
 * ---
 * @param accessToken JWT access token
 */
export async function logout(accessToken: string): Promise<void> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let error
  try {
    ({ error } = await supabase.auth.signOut())
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(500, error.message)
  }
}

/**
 * # getCurrentUser
 * ---
 * - 간단설명: 토큰으로 현재 인증된 유저 정보를 조회
 * ---
 * @param accessToken JWT access token
 * ---
 * @example
 * const user = await getCurrentUser('eyJ...')
 */
export async function getCurrentUser(accessToken: string): Promise<UserProfile> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let data, error
  try {
    ({ data, error } = await supabase.auth.getUser())
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(401, error.message)
  }
  if (!data.user) throw new HttpError(401, '유저를 찾을 수 없습니다')

  return mapToUserProfile(data.user)
}

/**
 * # refreshToken
 * ---
 * - 간단설명: 리프레시 토큰으로 새로운 액세스 토큰을 발급
 * ---
 * @param token 리프레시 토큰
 */
export async function refreshToken(token: string): Promise<AuthTokens> {
  const supabase = getSupabaseClient()

  let data, error
  try {
    ({ data, error } = await supabase.auth.refreshSession({ refresh_token: token }))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(401, error.message)
  }
  if (!data.session) throw new HttpError(401, '토큰 갱신에 실패했습니다')

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in,
  }
}

/**
 * # mapToUserProfile
 * ---
 * - 간단설명: Supabase User 객체를 UserProfile 인터페이스로 변환
 * ---
 * @param user Supabase Auth User 객체
 */
/**
 * # getGoogleOAuthUrl
 * ---
 * - 간단설명: Google OAuth 로그인 URL과 PKCE code_verifier를 생성하여 반환
 * - 제약사항: Supabase 대시보드에서 Google OAuth 프로바이더가 활성화되어 있어야 함
 * ---
 * @param redirectTo OAuth 인증 후 리다이렉트될 콜백 URL
 * ---
 * @example
 * const { url, codeVerifier } = await getGoogleOAuthUrl('http://localhost:8080/api/auth/oauth/callback')
 */
export async function getGoogleOAuthUrl(redirectTo: string): Promise<{ url: string; codeVerifier: string }> {
  const supabase = getSupabaseClient()

  let data, error
  try {
    ({ data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    }))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(400, error.message)
  }
  if (!data.url) throw new HttpError(500, 'OAuth URL 생성에 실패했습니다')

  return {
    url: data.url,
    codeVerifier: (data as any).codeVerifier ?? '',
  }
}

/**
 * # exchangeOAuthCode
 * ---
 * - 간단설명: OAuth 인가 코드를 세션 토큰으로 교환하여 유저 정보와 토큰을 반환
 * ---
 * @param code OAuth 인가 코드
 * @param codeVerifier PKCE code_verifier
 * ---
 * @example
 * const { user, tokens } = await exchangeOAuthCode('auth-code', 'verifier')
 */
export async function exchangeOAuthCode(code: string, codeVerifier: string): Promise<{ user: UserProfile; tokens: AuthTokens }> {
  const supabase = createSupabaseClientWithCodeVerifier(codeVerifier)

  let data, error
  try {
    ({ data, error } = await supabase.auth.exchangeCodeForSession(code))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(401, error.message)
  }
  if (!data.user || !data.session) throw new HttpError(401, 'OAuth 인증에 실패했습니다')

  return {
    user: mapToUserProfile(data.user),
    tokens: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    },
  }
}

export function mapToUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email!,
    name: (user.user_metadata?.['name'] as string) ?? null,
    profileImage: (user.user_metadata?.['avatar_url'] as string) ?? null,
  }
}
