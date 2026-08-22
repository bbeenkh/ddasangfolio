import { z } from 'zod'
import { Market, Currency } from '@fblg/enums'

/**
 * # addHoldingSchema
 * ---
 * - 간단설명: 종목 추가 요청 바디 검증 스키마
 * - 제약사항: avg_buy_price > 0, quantity > 0
 */
export const addHoldingSchema = z.object({
  /** 종목코드 */
  symbol: z.string().min(1),
  /** 종목명 */
  name: z.string().min(1),
  /** 시장 구분 */
  market: z.nativeEnum(Market),
  /** 통화 */
  currency: z.nativeEnum(Currency).default(Currency.KRW),
  /** 평균 매입 단가 */
  avg_buy_price: z.number().positive(),
  /** 보유 수량 */
  quantity: z.number().int().positive(),
})

export type AddHoldingRequest = z.infer<typeof addHoldingSchema>
