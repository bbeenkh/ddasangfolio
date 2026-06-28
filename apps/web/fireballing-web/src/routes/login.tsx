import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '#/features/auth'

export const Route = createFileRoute('/login')({ component: LoginPage })

/**
 * # LoginPage
 * ---
 * - 간단설명: 로그인 페이지
 * - 제약사항 및 특이사항:
 *   - 화면 중앙에 카드형 로그인 폼 배치
 * ---
 * @example
 * // /login 경로에서 접근
 */
function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <LoginForm />
    </main>
  )
}
