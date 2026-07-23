'use client'

import Link from 'next/link'

/**
 * # Header
 * ---
 * - 간단설명: 전역 네비게이션 헤더
 * ---
 * @example
 * <Header />
 */
export default function Header() {
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
      </nav>
    </header>
  )
}
