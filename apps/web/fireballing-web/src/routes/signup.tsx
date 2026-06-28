import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '#/features/auth'

export const Route = createFileRoute('/signup')({ component: SignupPage })

/**
 * # SignupPage
 * ---
 * - 간단설명: 회원가입 페이지
 * - 제약사항 및 특이사항:
 *   - 화면 중앙에 카드형 회원가입 폼 배치
 * ---
 * @example
 * // /signup 경로에서 접근
 */
function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <SignupForm />
    </main>
  )
}
