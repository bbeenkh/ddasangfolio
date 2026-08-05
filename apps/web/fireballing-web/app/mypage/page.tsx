'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui'
import LogoutButton from '@/features/logout/LogoutButton'

/**
 * # MyPage
 * ---
 * - 간단설명: 마이페이지 — 프로필, 계정 정보, 고객 지원 메뉴 표시
 * ---
 * @example
 * <MyPage />
 */
export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'unauthenticated') {
    return (
      <main className="px-5 pt-4 pb-8 flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-57px)]">
        <p className="text-base text-fb-cool-charcoal">로그인해주세요</p>
        <Button onClick={() => router.push('/login')}>로그인</Button>
      </main>
    )
  }

  const userName = session?.user?.name ?? '게스트'
  const userEmail = session?.user?.email ?? '-'
  const userInitial = userName.charAt(0)

  return (
    <main className="px-5 pt-4 pb-8 flex flex-col gap-6">
      {/* 섹션 타이틀 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-bold text-fb-on-primary leading-[30px] m-0">
          마이페이지
        </h1>
        <p className="text-[13px] text-fb-cool-charcoal leading-[18px] m-0">
          파이어볼링 자산 및 계정 정보를 관리합니다
        </p>
      </div>

      {/* 프로필 카드 */}
      <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-6 shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
        {/* 프로필 상단 */}
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-fb-white-smoke flex items-center justify-center shrink-0">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-fb-on-primary">
                {userInitial}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-lg font-bold text-fb-on-primary leading-6 m-0 truncate">
              {userName}
            </p>
            <p className="text-sm text-fb-cool-charcoal leading-[18px] m-0 truncate">
              {userEmail}
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-gray-200 m-0" />

        {/* 상세 정보 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-fb-cool-charcoal">
              로그인 유형
            </span>
            <span className="text-sm font-semibold text-fb-on-primary">
              Google
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-fb-cool-charcoal">
              앱 버전
            </span>
            <span className="text-sm font-semibold text-fb-on-primary">
              v0.0.1
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-gray-200 m-0" />

        {/* 로그아웃 */}
        <div className="flex justify-center py-1">
          <LogoutButton />
        </div>
      </div>

      {/* 고객 지원 */}
      <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-base font-bold text-fb-on-primary m-0">
          고객 지원
        </h2>
        <button className="flex items-center justify-between w-full text-left bg-transparent border-0 p-0 cursor-pointer">
          <span className="text-sm font-medium text-[#1a2b4a]">
            자주 묻는 질문 (FAQ)
          </span>
          <ChevronRight className="size-4 text-gray-400" />
        </button>
        <hr className="border-gray-200 m-0" />
        <button className="flex items-center justify-between w-full text-left bg-transparent border-0 p-0 cursor-pointer">
          <span className="text-sm font-medium text-[#1a2b4a]">
            1:1 문의하기
          </span>
          <ChevronRight className="size-4 text-gray-400" />
        </button>
      </div>
    </main>
  )
}
