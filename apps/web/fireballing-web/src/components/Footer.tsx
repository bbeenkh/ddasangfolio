'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart, TrendingUp, User } from 'lucide-react'

/**
 * # BottomNav 항목 정의
 * - HOME = 홈
 * - PORTFOLIO = 포트폴리오
 * - SIMULATOR = 시뮬레이터
 * - MYPAGE = 마이페이지
 */
const NAV_ITEMS = [
  { href: '/', label: '홈', icon: Home },
  { href: '/portfolio', label: '포트폴리오', icon: PieChart },
  { href: '/simulator', label: '시뮬레이터', icon: TrendingUp },
  { href: '/mypage', label: '마이페이지', icon: User },
] as const

/**
 * # Footer (BottomNavigationBar)
 * ---
 * - 간단설명: 하단 네비게이션 바 — 4개 탭으로 페이지 이동
 * ---
 * @example
 * <Footer />
 */
export default function Footer() {
  const pathname = usePathname()

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <nav className="flex items-center justify-around px-5 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl no-underline text-xs font-medium ${
                isActive
                  ? 'bg-fb-primary/10 text-fb-primary'
                  : 'text-gray-400'
              }`}
            >
              <Icon className="size-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}
