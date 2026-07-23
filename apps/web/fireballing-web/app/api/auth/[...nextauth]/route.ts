import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

const API_BASE = process.env.NEXT_PUBLIC_API_URL

/**
 * # authOptions
 * ---
 * - 간단설명: NextAuth 설정 — Google OAuth + 백엔드 토큰 연동
 * - 제약사항: NEXT_PUBLIC_API_URL, GOOGLE_OAUTH 환경변수 필요
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    /**
     * 최초 로그인 시 백엔드에 Google ID 토큰을 전달하여 Supabase 토큰을 발급받아 JWT에 저장
     */
    async jwt({ token, account }) {
      if (account?.id_token) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/oauth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: account.id_token }),
          })
          const data = await res.json()

          if (data.success && data.data) {
            token.accessToken = data.data.tokens.accessToken
            token.refreshToken = data.data.tokens.refreshToken
            token.expiresIn = data.data.tokens.expiresIn
            token.backendUser = data.data.user
          }
        } catch (e) {
          console.error('백엔드 토큰 교환 실패:', e)
        }
      }
      return token
    },
    /**
     * 클라이언트 세션에 백엔드 토큰과 유저 정보를 노출
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      if (token.backendUser) {
        session.backendUser = token.backendUser as {
          id: string
          email: string
          name: string | null
          profileImage: string | null
        }
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
