// apps/web/fireballing-web/src/features/auth/ui/LoginForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

const mockLogin = vi.fn()
const mockStoreLogin = vi.fn()
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../api/authApi', () => ({
  login: (...args: unknown[]) => mockLogin(...args),
}))

vi.mock('../model/authStore', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ login: mockStoreLogin }),
}))

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

  it('로그인 성공 시 zustand 스토어에 토큰과 유저를 저장하고 홈으로 이동한다', async () => {
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
    expect(mockStoreLogin).toHaveBeenCalledWith(
      mockResponse.data.tokens,
      mockResponse.data.user,
    )
    expect(mockPush).toHaveBeenCalledWith('/')
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
