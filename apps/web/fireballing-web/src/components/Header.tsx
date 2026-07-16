'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@fblg/core-ui'
import { useAuthStore } from '@/features/auth'

/**
 * # Header
 * ---
 * - 간단설명: 전역 네비게이션 헤더
 * - 제약사항 및 특이사항:
 *   - zustand 스토어로 로그인 상태 구독 (리액티브)
 *   - _isHydrated false 동안 로그인 영역 미렌더링 (SSR 대응)
 * ---
 * @example
 * <Header />
 */
export default function Header() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.user)
  const isHydrated = useAuthStore((s) => s._isHydrated)
  const logout = useAuthStore((s) => s.logout)

  function handleLogout() {
    logout()
    router.push('/')
  }

  const userName = user?.name ?? user?.email

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4">
      <nav className="mx-auto flex max-w-5xl items-center gap-x-4 py-3">
        <h2 className="m-0 text-base font-semibold tracking-tight">
          <Link href="/" className="text-gray-900 no-underline">
            fireballing
          </Link>
        </h2>

        <div className="flex items-center gap-x-4 text-sm font-medium">
          <Link
            href="/"
            className="text-gray-500 no-underline hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-500 no-underline hover:text-gray-900"
          >
            About
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-x-3 text-sm">
          {isHydrated ? (
            isLoggedIn ? (
              <>
                <span className="text-gray-700">{userName}</span>
                <Button
                  onClick={handleLogout}
                  styleClass={{
                    root: 'text-gray-500 hover:text-gray-900 text-sm',
                  }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-500 no-underline hover:text-gray-900"
              >
                로그인
              </Link>
            )
          ) : null}
        </div>
      </nav>
    </header>
  )
}
