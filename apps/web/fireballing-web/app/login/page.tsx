'use client'

import { signIn } from 'next-auth/react'
import { Card, Button, Typo } from '@/shared/ui'
import GoogleLoginButton from '@/features/login/googleLogin/GoogleLoginButton'

/**
 * # LoginPage
 * ---
 * - 간단설명: 로그인 페이지 — Google OAuth 로그인 버튼 제공
 * ---
 * @example
 * // /login 경로로 접근
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>
            <Typo.HM as="span" className="font-bold">로그인</Typo.HM>
          </Card.Title>
        </Card.Header>
        <Card.Body className="flex-col gap-4">
          <GoogleLoginButton />
        </Card.Body>
      </Card>
    </main>
  )
}

/** Google 로고 SVG 아이콘 */

