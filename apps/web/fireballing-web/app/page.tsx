'use client'

import { Button } from '@fblg/core-ui'
import { getCurDate } from '@fblg/utils'

/**
 * # HomePage
 * ---
 * - 간단설명: 메인 홈 페이지
 */
export default function HomePage() {
  return (
    <main>
      <Button onClick={() => alert(getCurDate())}>버튼</Button>
    </main>
  )
}
