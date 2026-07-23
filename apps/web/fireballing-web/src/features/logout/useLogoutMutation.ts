import { useMutation } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'

/**
 * # useLogoutMutation
 * ---
 * - 간단설명: NextAuth signOut을 호출하는 로그아웃 mutation 훅
 * ---
 * @example
 * const { mutate } = useLogoutMutation()
 * mutate()
 */
export default function useLogoutMutation() {
  return useMutation({
    mutationFn: () => signOut({ callbackUrl: '/' }),
  })
}
