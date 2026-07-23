'use client'

import { Button } from '@/shared/ui'
import useLogoutMutation from './useLogoutMutation'

/**
 * # LogoutButton
 * ---
 * - 간단설명: 로그아웃 버튼 — 클릭 시 NextAuth signOut 호출
 * ---
 * @example
 * <LogoutButton />
 */
export default function LogoutButton() {
  const { mutate, isPending } = useLogoutMutation()

  return (
    <Button
      variant="ghost"
      onClick={() => mutate()}
      disabled={isPending}
      styleClass={{ root: 'text-sm px-3 py-1' }}
    >
      {isPending ? '로그아웃 중...' : '로그아웃'}
    </Button>
  )
}
