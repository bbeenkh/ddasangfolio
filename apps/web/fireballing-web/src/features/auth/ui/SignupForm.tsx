import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Card, Input } from '@fblg/core-ui'
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
        <Card.Title>회원가입</Card.Title>
      </Card.Header>
      <Card.Body className="flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            styleClass={{
              root: 'border border-gray-300 rounded-lg h-10',
              input: 'px-3 text-sm',
            }}
          />
          <Input
            type="password"
            placeholder="비밀번호 (최소 6자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            styleClass={{
              root: 'border border-gray-300 rounded-lg h-10',
              input: 'px-3 text-sm',
            }}
          />
          <Input
            type="text"
            placeholder="이름 (선택)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            styleClass={{
              root: 'border border-gray-300 rounded-lg h-10',
              input: 'px-3 text-sm',
            }}
          />
          {error && (
            <p className="m-0 text-sm text-red-500">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            styleClass={{
              root: 'w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50',
            }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-1">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </span>
            ) : '회원가입'}
          </Button>
        </form>
        <p className="m-0 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-medium text-gray-900 underline">
            로그인
          </Link>
        </p>
      </Card.Body>
    </Card>
  )
}
