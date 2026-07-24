'use client'

import Link from 'next/link'
import { Flame, Bell } from 'lucide-react'

/**
 * # Header
 * ---
 * - 간단설명: 상단 앱바 — 로고와 알림 아이콘을 포함한 고정 헤더
 * ---
 * @example
 * <Header />
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <nav className="flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Flame className="size-[25px] text-fb-primary" />
          <span className="text-xl font-medium tracking-[-1px] text-fb-on-primary">
            fireballing
          </span>
        </Link>
        <button className="px-2 pt-2 pb-3.5" aria-label="알림">
          <Bell className="size-5 text-fb-on-primary" />
        </button>
      </nav>
    </header>
  )
}
