'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@fblg/core-ui'
import { isLoggedIn, getUser, logoutAndClear } from '@/features/auth'

/**
 * # Header
 * ---
 * - 간단설명: 전역 네비게이션 헤더
 * - 제약사항 및 특이사항:
 *   - 로그인 상태에 따라 로그인 링크 또는 유저 이름 + 로그아웃 버튼 표시
 * ---
 * @example
 * <Header />
 */
export default function Header() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(isLoggedIn())
    const user = getUser()
    if (user) setUserName(user.name ?? user.email)
  }, [])

  function handleLogout() {
    logoutAndClear()
    router.push('/')
  }

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
          {loggedIn ? (
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
          )}
        </div>
      </nav>
    </header>
  )
}
