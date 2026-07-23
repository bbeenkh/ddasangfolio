'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import LogoutButton from '@/features/logout/LogoutButton'

/**
 * # Header
 * ---
 * - 간단설명: 전역 네비게이션 헤더 — 세션 상태에 따라 프로필/로그인 표시
 * ---
 * @example
 * <Header />
 */
export default function Header() {
  const { data: session, status } = useSession()

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
          {status === 'loading' ? null : session ? (
            <>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-7 w-7 rounded-full"
                />
              )}
              <span className="text-gray-700">
                {session.user?.name ?? session.user?.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-gray-500 no-underline hover:text-gray-900"
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
