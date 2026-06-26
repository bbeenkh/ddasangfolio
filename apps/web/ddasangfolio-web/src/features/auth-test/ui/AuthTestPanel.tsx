import { useState } from 'react'
import { Button, Card, Input, Tab } from '@ddsf/core-ui'
import { signup, login, getMe, refreshToken, logout } from '../api/auth-test.api'
import type { AuthTokens } from '../api/auth-test.api'

/**
 * # AuthTestPanel
 * ---
 * - 간단설명: JWT 인증 API 테스트용 패널 컴포넌트
 * - 제약사항 및 특이사항:
 *   - 서버가 localhost:8080에서 실행 중이어야 함
 *   - 개발/테스트 전용 UI
 *   - @ddsf/core-ui 컴포넌트 기반
 * ---
 * @example
 * <AuthTestPanel />
 */
export default function AuthTestPanel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleRequest(request: () => Promise<unknown>) {
    setLoading(true)
    setResponse('')
    try {
      const result = await request()
      setResponse(JSON.stringify(result, null, 2))
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setResponse(JSON.stringify({ error: message }, null, 2))
      return null
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup() {
    const result = await handleRequest(() => signup(email, password, name || undefined))
    if (result && typeof result === 'object' && 'data' in result) {
      const data = (result as { data?: { tokens?: AuthTokens } }).data
      if (data?.tokens) setTokens(data.tokens)
    }
  }

  async function handleLogin() {
    const result = await handleRequest(() => login(email, password))
    if (result && typeof result === 'object' && 'data' in result) {
      const data = (result as { data?: { tokens?: AuthTokens } }).data
      if (data?.tokens) setTokens(data.tokens)
    }
  }

  async function handleGetMe() {
    if (!tokens?.accessToken) {
      setResponse(JSON.stringify({ error: '로그인 먼저 해주세요' }, null, 2))
      return
    }
    await handleRequest(() => getMe(tokens.accessToken))
  }

  async function handleRefresh() {
    if (!tokens?.refreshToken) {
      setResponse(JSON.stringify({ error: '로그인 먼저 해주세요' }, null, 2))
      return
    }
    const result = await handleRequest(() => refreshToken(tokens.refreshToken))
    if (result && typeof result === 'object' && 'data' in result) {
      const data = (result as { data?: { tokens?: AuthTokens } }).data
      if (data?.tokens) setTokens(data.tokens)
    }
  }

  async function handleLogout() {
    if (!tokens?.accessToken) {
      setResponse(JSON.stringify({ error: '로그인 먼저 해주세요' }, null, 2))
      return
    }
    await handleRequest(() => logout(tokens.accessToken))
    setTokens(null)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 lg:flex-row">
      {/* 좌측: 입력 및 액션 */}
      <div className="flex flex-1 flex-col gap-6">
        <Tab.Root defaultValue="auth">
          <Tab.List styleClass={{ root: 'flex gap-1 border-b border-gray-200' }}>
            <Tab.Trigger value="auth">
              인증
            </Tab.Trigger>
            <Tab.Trigger value="token">
              토큰 액션
            </Tab.Trigger>
            <Tab.Trigger value="status">
              토큰 상태
            </Tab.Trigger>
          </Tab.List>

          {/* 인증 탭 */}
          <Tab.Content value="auth" styleClass={{ root: 'pt-4' }}>
            <Card className="border-gray-200 bg-white">
              <Card.Header>
                <Card.Title className="text-base text-gray-900">인증 정보</Card.Title>
              </Card.Header>
              <Card.Body className="flex-col gap-3">
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
                  placeholder="이름 (선택, 회원가입용)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    onClick={handleSignup}
                    disabled={loading}
                  >
                    회원가입
                  </Button>
                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    로그인
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Tab.Content>

          {/* 토큰 액션 탭 */}
          <Tab.Content value="token" styleClass={{ root: 'pt-4' }}>
            <Card className="border-gray-200 bg-white">
              <Card.Header>
                <Card.Title className="text-base text-gray-900">토큰 액션</Card.Title>
              </Card.Header>
              <Card.Body className="flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleGetMe}
                    disabled={loading}
                  >
                    내 정보 조회 (GET /me)
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    토큰 갱신 (POST /refresh)
                  </Button>
                  <Button
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    로그아웃 (POST /logout)
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Tab.Content>

          {/* 토큰 상태 탭 */}
          <Tab.Content value="status" styleClass={{ root: 'pt-4' }}>
            <Card className="border-gray-200 bg-white">
              <Card.Header>
                <Card.Title className="text-base text-gray-900">현재 토큰</Card.Title>
              </Card.Header>
              <Card.Body className="flex-col gap-2">
                {tokens ? (
                  <>
                    <div className="text-xs">
                      <span className="font-semibold text-gray-900">Access Token: </span>
                      <code className="break-all">{tokens.accessToken.slice(0, 40)}...</code>
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-gray-900">Refresh Token: </span>
                      <code className="break-all">{tokens.refreshToken.slice(0, 40)}...</code>
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-gray-900">Expires In: </span>
                      <code>{tokens.expiresIn}초</code>
                    </div>
                  </>
                ) : (
                  <p className="m-0 text-sm text-gray-500">
                    토큰 없음 — 로그인 해주세요
                  </p>
                )}
              </Card.Body>
            </Card>
          </Tab.Content>
        </Tab.Root>
      </div>

      {/* 우측: 서버 응답 */}
      <div className="flex-1">
        <Card className="sticky top-20 border-gray-200 bg-white">
          <Card.Header>
            <Card.Title className="text-base text-gray-900">서버 응답</Card.Title>
          </Card.Header>
          <Card.Body className="flex-col">
            {loading && (
              <p className="m-0 text-sm text-blue-600">요청 중...</p>
            )}
            <pre className="m-0 max-h-[60vh] overflow-auto rounded-lg bg-gray-50 p-4 text-xs leading-relaxed text-gray-900">
              {response || '아직 요청이 없습니다'}
            </pre>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
