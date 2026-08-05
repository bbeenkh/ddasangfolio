import type { UserProfile } from '@fblg/types'
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

/**
 * # authOptions
 * ---
 * - 간단설명: NextAuth 설정 — Google OAuth + 이메일/비밀번호 + 백엔드 토큰 연동
 * - 제약사항: NEXT_PUBLIC_API_URL, GOOGLE_OAUTH 환경변수 필요
 */
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        })
        const data = await res.json()

        if (!data.success || !data.data) return null

        return {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
          expiresIn: data.data.tokens.expiresIn,
          backendUser: data.data.user,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    /**
     * 최초 로그인 시 백엔드 토큰을 JWT에 저장
     * - Google: account.id_token으로 백엔드 교환
     * - Credentials: authorize에서 이미 받은 토큰을 user 객체에서 추출
     */
    async jwt({ token, account, user }) {
      // Google OAuth 플로우
      if (account?.id_token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/oauth/google`, {
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

      // Credentials 플로우 (authorize에서 토큰을 user에 실어서 전달)
      if (user?.accessToken) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresIn = user.expiresIn
        token.backendUser = user.backendUser
      }

      return token
    },
    /**
     * 클라이언트 세션에 백엔드 토큰과 유저 정보를 노출
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      if (token.backendUser) {
        session.backendUser = token.backendUser as UserProfile
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
