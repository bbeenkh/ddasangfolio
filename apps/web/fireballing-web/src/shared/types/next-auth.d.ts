import type { UserProfile } from '@fblg/types'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    /** 백엔드(Supabase) access token */
    accessToken?: string
    /** 백엔드에서 반환한 유저 프로필 */
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
