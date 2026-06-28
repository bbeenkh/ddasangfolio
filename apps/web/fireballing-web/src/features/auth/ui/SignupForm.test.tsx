// apps/web/fireballing-web/src/features/auth/ui/SignupForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from './SignupForm'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}))

vi.mock('@fblg/core-ui', async () => {
  const actual = await vi.importActual('@fblg/core-ui')
  return { ...actual, Spinner: () => <div data-testid="spinner" /> }
})

vi.mock('../api/auth.api', () => ({
  signup: vi.fn(),
}))

vi.mock('../model/auth.store', () => ({
  setTokens: vi.fn(),
  setUser: vi.fn(),
}))

import { signup } from '../api/auth.api'
import { setTokens, setUser } from '../model/auth.store'

const mockSignup = vi.mocked(signup)
const mockSetTokens = vi.mocked(setTokens)
const mockSetUser = vi.mocked(setUser)

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('이메일, 비밀번호, 이름 입력 필드와 회원가입 버튼을 렌더링한다', () => {
    render(<SignupForm />)

    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호 (최소 6자)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('이름 (선택)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })

  it('회원가입 성공 시 토큰과 유저 정보를 저장한다', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      data: {
        user: { id: '1', email: 'test@test.com', name: '홍길동', profileImage: null },
        tokens: { accessToken: 'a', refreshToken: 'r', expiresIn: 3600 },
      },
    }
    mockSignup.mockResolvedValue(mockResponse)

    render(<SignupForm />)

    await user.type(screen.getByPlaceholderText('이메일'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('비밀번호 (최소 6자)'), 'password123')
    await user.type(screen.getByPlaceholderText('이름 (선택)'), '홍길동')
    await user.click(screen.getByRole('button', { name: '회원가입' }))

    expect(mockSignup).toHaveBeenCalledWith('test@test.com', 'password123', '홍길동')
    expect(mockSetTokens).toHaveBeenCalledWith(mockResponse.data.tokens)
    expect(mockSetUser).toHaveBeenCalledWith(mockResponse.data.user)
  })

  it('회원가입 실패 시 에러 메시지를 표시한다', async () => {
    const user = userEvent.setup()
    mockSignup.mockResolvedValue({
      success: false,
      error: '이미 가입된 이메일입니다',
    })

    render(<SignupForm />)

    await user.type(screen.getByPlaceholderText('이메일'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('비밀번호 (최소 6자)'), 'password123')
    await user.click(screen.getByRole('button', { name: '회원가입' }))

    expect(await screen.findByText('이미 가입된 이메일입니다')).toBeInTheDocument()
  })

  it('로그인 링크를 렌더링한다', () => {
    render(<SignupForm />)

    expect(screen.getByText('로그인')).toBeInTheDocument()
  })
})
