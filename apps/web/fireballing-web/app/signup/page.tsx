import type { Metadata } from 'next'
import { SignupForm } from '@/features/auth'

export const metadata: Metadata = {
  title: '회원가입',
}

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
export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      <SignupForm />
    </main>
  )
}
