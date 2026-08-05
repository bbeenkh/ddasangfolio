'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Card, Typo, Separator } from '@/shared/ui'
import GoogleLoginButton from '@/features/login/googleLogin/GoogleLoginButton'
import CredentialsLoginForm from '@/features/login/credentialsLogin/CredentialsLoginForm'

/**
 * # LoginPage
 * ---
 * - 간단설명: 로그인 페이지 — 이메일/비밀번호 및 Google OAuth 로그인 제공
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
          <CredentialsLoginForm />
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-sm text-lf-on-surface-muted">또는</span>
            <Separator className="flex-1" />
          </div>
          <GoogleLoginButton />
          <Link
            href="/signup"
            className="text-sm text-center text-lf-on-surface-muted hover:underline"
          >
            계정이 없으신가요? 회원가입
          </Link>
        </Card.Body>
      </Card>
    </main>
  )
}

