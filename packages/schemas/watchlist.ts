import { z } from 'zod'

/**
 * # addWatchlistSchema
 * ---
 * - 간단설명: 관심종목 추가 요청 바디 검증 스키마
 * - 제약사항: quantity, avg_buy_price는 0 이상
 */
export const addWatchlistSchema = z.object({
  /** 티커 심볼 */
  ticker: z.string().min(1),
  /** 종목명 */
  name: z.string().min(1),
  /** 보유 수량 */
  quantity: z.number().nonnegative(),
  /** 평균 매수가 */
  avg_buy_price: z.number().nonnegative(),
})

export type AddWatchlistRequest = z.infer<typeof addWatchlistSchema>
