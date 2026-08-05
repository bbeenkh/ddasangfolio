import type { UserProfile } from '@fblg/types'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    /** 백엔드(Supabase) access token */
    accessToken?: string
    /** 토큰 갱신용 refresh token */
    refreshToken?: string
    /** 백엔드에서 반환한 유저 프로필 */
    backendUser?: UserProfile
  }

  interface User {
    /** Credentials 로그인 시 authorize에서 전달하는 access token */
    accessToken?: string
    /** Credentials 로그인 시 authorize에서 전달하는 refresh token */
    refreshToken?: string
    /** 토큰 만료 시간(초) */
    expiresIn?: number
    /** 백엔드 유저 프로필 */
    backendUser?: UserProfile
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
    backendUser?: UserProfile
  }
}
