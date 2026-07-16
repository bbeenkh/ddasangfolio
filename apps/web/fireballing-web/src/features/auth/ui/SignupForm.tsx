'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Card, Input, Typo } from '@/shared/ui'
import { signup } from '../api/auth.api'
import { setTokens, setUser } from '../model/auth.store'

/**
 * # SignupForm
 * ---
 * - 간단설명: 이메일/비밀번호/이름 회원가입 폼 컴포넌트
 * - 제약사항 및 특이사항:
 *   - @fblg/core-ui 컴포넌트만 사용
 *   - 회원가입 성공 시 토큰/유저 저장 후 홈으로 이동
 *   - 비밀번호 최소 6자
 *   - 이름은 선택 입력
 * ---
 * @example
 * <SignupForm />
 */
export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signup(email, password, name || undefined)

      if (result.success && result.data) {
        setTokens(result.data.tokens)
        setUser(result.data.user)
        window.location.href = '/'
      } else {
        setError(result.error ?? '회원가입에 실패했습니다')
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
          <Typo.HM as="span" className='font-bold'>회원가입</Typo.HM>
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
            placeholder="비밀번호 (최소 6자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="text"
            placeholder="이름 (선택)"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            ) : '회원가입'}
          </Button>
        </form>
        <p className="m-0 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-gray-900 underline">
            로그인
          </Link>
        </p>
      </Card.Body>
    </Card>
  )
}
