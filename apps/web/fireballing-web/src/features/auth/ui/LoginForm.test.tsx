// apps/web/fireballing-web/src/features/auth/ui/LoginForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}))

vi.mock('@fblg/core-ui', async () => {
  const actual = await vi.importActual('@fblg/core-ui')
  return { ...actual, Spinner: () => <div data-testid="spinner" /> }
})

vi.mock('../api/auth.api', () => ({
  login: vi.fn(),
}))

vi.mock('../model/auth.store', () => ({
  setTokens: vi.fn(),
  setUser: vi.fn(),
}))

import { login } from '../api/auth.api'
import { setTokens, setUser } from '../model/auth.store'

const mockLogin = vi.mocked(login)
const mockSetTokens = vi.mocked(setTokens)
const mockSetUser = vi.mocked(setUser)

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('이메일, 비밀번호 입력 필드와 로그인 버튼을 렌더링한다', () => {
    render(<LoginForm />)

    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('로그인 성공 시 토큰과 유저 정보를 저장한다', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      data: {
        user: { id: '1', email: 'test@test.com', name: '홍길동', profileImage: null },
        tokens: { accessToken: 'a', refreshToken: 'r', expiresIn: 3600 },
      },
    }
    mockLogin.mockResolvedValue(mockResponse)

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('이메일'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('비밀번호'), 'password123')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123')
    expect(mockSetTokens).toHaveBeenCalledWith(mockResponse.data.tokens)
    expect(mockSetUser).toHaveBeenCalledWith(mockResponse.data.user)
  })

  it('로그인 실패 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue({
      success: false,
      error: '이메일 또는 비밀번호가 올바르지 않습니다',
    })

    render(<LoginForm />)

    await user.type(screen.getByPlaceholderText('이메일'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('비밀번호'), 'wrong')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(await screen.findByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument()
  })

  it('회원가입 링크를 렌더링한다', () => {
    render(<LoginForm />)

    expect(screen.getByText('회원가입')).toBeInTheDocument()
  })
})
