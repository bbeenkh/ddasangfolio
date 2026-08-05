'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signupSchema } from '@fblg/schemas'
import { Card, Typo, Input, Button } from '@/shared/ui'

/**
 * # SignupPage
 * ---
 * - 간단설명: 회원가입 페이지 — 이메일/비밀번호로 가입 후 자동 로그인
 * - 제약사항: 백엔드 /api/auth/signup 호출 후 signIn('credentials')로 세션 생성
 * ---
 * @example
 * // /signup 경로로 접근
 */
export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const payload = {
      email: form.email,
      password: form.password,
      ...(form.name ? { name: form.name } : {}),
    }
    const parsed = signupSchema.safeParse(payload)
    if (!parsed.success) {
      setError('입력값을 확인해주세요 (비밀번호 최소 6자)')
      return
    }

    setLoading(true)

    // 1. 백엔드 회원가입
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      },
    )
    const data = await res.json()

    if (!data.success) {
      setLoading(false)
      setError(data.error || '회원가입에 실패했습니다')
      return
    }

    // 2. 자동 로그인
    const loginRes = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)

    if (loginRes?.error) {
      setError('회원가입 성공, 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.')
      return
    }
    router.push('/')
  }

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>
            <Typo.HM as="span" className="font-bold">회원가입</Typo.HM>
          </Card.Title>
        </Card.Header>
        <Card.Body className="flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="이름 (선택)"
              value={form.name}
              onChange={set('name')}
            />
            <Input
              type="email"
              placeholder="이메일"
              value={form.email}
              onChange={set('email')}
            />
            <Input
              type="password"
              placeholder="비밀번호 (최소 6자)"
              value={form.password}
              onChange={set('password')}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>
          <Link
            href="/login"
            className="text-sm text-center text-lf-on-surface-muted hover:underline"
          >
            이미 계정이 있으신가요? 로그인
          </Link>
        </Card.Body>
      </Card>
    </main>
  )
}
