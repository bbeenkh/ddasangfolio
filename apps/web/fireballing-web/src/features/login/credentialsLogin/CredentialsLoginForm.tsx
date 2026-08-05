'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loginSchema } from '@fblg/schemas'
import { Button, Input } from '@/shared/ui'

/**
 * # CredentialsLoginForm
 * ---
 * - 간단설명: 이메일/비밀번호 로그인 폼
 * - 제약사항: NextAuth CredentialsProvider와 연동, loginSchema로 클라이언트 검증
 * ---
 * @example
 * <CredentialsLoginForm />
 */
export default function CredentialsLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError('이메일과 비밀번호를 확인해주세요')
      return
    }

    setLoading(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (res?.error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
      return
    }
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}
