/**
 * # IWatchlistItem
 * ---
 * - 간단설명: 관심종목 항목 인터페이스
 * - 제약사항: user_id당 ticker는 유니크
 */
export interface IWatchlistItem {
  /** 항목 UUID */
  id: string
  /** 티커 심볼 (예: 005930, AAPL) */
  ticker: string
  /** 종목명 (예: 삼성전자, Apple Inc.) */
  name: string
  /** 보유 수량 */
  quantity: number
  /** 평균 매수가 */
  avg_buy_price: number
  /** 생성 시각 (ISO 8601) */
  created_at: string
}
