import { createFileRoute } from '@tanstack/react-router'
import { AuthTestPanel } from '#/features/auth-test'

export const Route = createFileRoute('/auth-test')({
  component: AuthTestPage,
})

/**
 * # AuthTestPage
 * ---
 * - 간단설명: JWT 인증 API 테스트 페이지
 * - 제약사항 및 특이사항:
 *   - 개발/테스트 전용 페이지
 *   - 서버(localhost:8080)가 실행 중이어야 정상 동작
 * ---
 * @example
 * // /auth-test 경로에서 접근
 */
function AuthTestPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <section className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">Dev Tools</p>
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
          JWT 인증 테스트
        </h1>
        <p className="m-0 max-w-2xl text-sm leading-7 text-gray-600">
          서버의 인증 API를 테스트합니다. 회원가입, 로그인, 토큰 갱신, 내 정보 조회, 로그아웃 기능을
          확인할 수 있습니다.
        </p>
      </section>
      <AuthTestPanel />
    </main>
  )
}
