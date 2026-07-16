'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../api/auth.api'
import { setTokens, setUser } from '../model/auth.store'
import { Button, Card, Input, Typo } from '@/shared/ui'

/**
 * # LoginForm
 * ---
 * - 간단설명: 이메일/비밀번호 로그인 폼 컴포넌트
 * - 제약사항 및 특이사항:
 *   - @fblg/core-ui 컴포넌트만 사용
 *   - 로그인 성공 시 토큰/유저 저장 후 홈으로 이동
 *   - 서버(localhost:8080) 실행 필요
 * ---
 * @example
 * <LoginForm />
 */
export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result.success && result.data) {
        setTokens(result.data.tokens)
        setUser(result.data.user)
        window.location.href = '/'
      } else {
        setError(result.error ?? '로그인에 실패했습니다')
      }
    } catch {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title>
          <Typo.HM as="span" className='font-bold'>로그인</Typo.HM>
        </Card.Title>
      </Card.Header>
      <Card.Body className="flex-col gap-4">
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
          {error && (
            <p className="m-0 text-sm text-red-500">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : '로그인'}
          </Button>
        </form>
        <p className="m-0 text-center text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="font-medium text-gray-900 underline">
            회원가입
          </Link>
        </p>
      </Card.Body>
    </Card>
  )
}
