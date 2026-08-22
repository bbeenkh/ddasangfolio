// @fblg/enums — 공통 열거형 모듈

/**
 * 주식 시장 구분
 * - KOSPI = 코스피
 * - KOSDAQ = 코스닥
 * - NYSE = 뉴욕증권거래소
 * - NASDAQ = 나스닥
 * - ETF = 상장지수펀드
 */
export enum Market {
  /** 코스피 */
  KOSPI = 'KOSPI',
  /** 코스닥 */
  KOSDAQ = 'KOSDAQ',
  /** 뉴욕증권거래소 */
  NYSE = 'NYSE',
  /** 나스닥 */
  NASDAQ = 'NASDAQ',
  /** 상장지수펀드 */
  ETF = 'ETF',
}

/**
 * 통화 구분
 * - KRW = 원화
 * - USD = 달러
 */
export enum Currency {
  /** 원화 */
  KRW = 'KRW',
  /** 달러 */
  USD = 'USD',
}
