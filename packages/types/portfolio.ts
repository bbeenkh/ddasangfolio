import type { Market, Currency } from '@fblg/enums'

/**
 * # IPortfolio
 * ---
 * - 간단설명: 포트폴리오 엔티티 인터페이스
 * - 제약사항: user_id당 여러 포트폴리오 가능
 */
export interface IPortfolio {
  /** 포트폴리오 UUID */
  id: string
  /** 소유자 UUID */
  user_id: string
  /** 포트폴리오명 */
  name: string
  /** 설명 */
  description: string | null
  /** 생성 시각 (ISO 8601) */
  created_at: string
  /** 수정 시각 (ISO 8601) */
  updated_at: string
}

/**
 * # IHolding
 * ---
 * - 간단설명: 보유 종목 엔티티 인터페이스
 * - 제약사항: portfolio_id + symbol 조합은 유니크
 */
export interface IHolding {
  /** 종목 UUID */
  id: string
  /** 소속 포트폴리오 UUID */
  portfolio_id: string
  /** 종목코드 (예: 005930, AAPL) */
  symbol: string
  /** 종목명 (예: 삼성전자, Apple Inc.) */
  name: string
  /** 시장 구분 */
  market: Market
  /** 통화 */
  currency: Currency
  /** 평균 매입 단가 */
  avg_buy_price: number
  /** 보유 수량 */
  quantity: number
  /** 생성 시각 (ISO 8601) */
  created_at: string
  /** 수정 시각 (ISO 8601) */
  updated_at: string
}
