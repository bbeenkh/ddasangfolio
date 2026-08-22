import type { IPortfolio, IHolding } from '@fblg/types'
import type { AddHoldingRequest } from '@fblg/schemas'
import { createSupabaseClientWithToken } from '../../../shared/lib/supabase'
import { HttpError } from '../../../shared/errors/http-error'
import { SupabaseConnectionError } from '../../../shared/errors/supabase-connection-error'

/**
 * # getOrCreateDefaultPortfolio
 * ---
 * - 간단설명: 기본 포트폴리오를 조회하고, 없으면 자동 생성
 * - 제약사항: 사용자당 첫 포트폴리오를 기본으로 사용
 * ---
 * @param accessToken JWT access token
 * @param userId 인증된 사용자 ID
 * ---
 * @example
 * const portfolio = await getOrCreateDefaultPortfolio('eyJ...', 'user-1')
 */
export async function getOrCreateDefaultPortfolio(
  accessToken: string,
  userId: string,
): Promise<IPortfolio> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let data, error
  try {
    ;({ data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single())
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  // PGRST116 = no rows found
  if (error && error.code === 'PGRST116') {
    return createDefaultPortfolio(supabase)
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(500, error.message)
  }

  return data as IPortfolio
}

async function createDefaultPortfolio(supabase: ReturnType<typeof createSupabaseClientWithToken>): Promise<IPortfolio> {
  const { data, error } = await supabase
    .from('portfolios')
    .insert({ name: '내 포트폴리오' })
    .select()
    .single()

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(500, error.message)
  }
  if (!data) throw new HttpError(500, '포트폴리오 생성에 실패했습니다')

  return data as IPortfolio
}

/**
 * # getHoldings
 * ---
 * - 간단설명: 포트폴리오의 보유 종목 목록 조회
 * - 제약사항: RLS로 인해 accessToken 소유 유저의 포트폴리오만 접근 가능
 * ---
 * @param accessToken JWT access token
 * @param portfolioId 포트폴리오 UUID
 * ---
 * @example
 * const holdings = await getHoldings('eyJ...', 'portfolio-1')
 */
export async function getHoldings(accessToken: string, portfolioId: string): Promise<IHolding[]> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let data, error
  try {
    ;({ data, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false }))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(500, error.message)
  }

  return (data ?? []) as IHolding[]
}

/**
 * # addHolding
 * ---
 * - 간단설명: 포트폴리오에 종목을 추가하고 생성된 항목 반환
 * - 제약사항: portfolio_id + symbol 조합 중복 시 DB unique 제약 에러
 * ---
 * @param accessToken JWT access token
 * @param portfolioId 포트폴리오 UUID
 * @param body 추가할 종목 정보
 * ---
 * @example
 * const holding = await addHolding('eyJ...', 'portfolio-1', { symbol: 'AAPL', ... })
 */
export async function addHolding(
  accessToken: string,
  portfolioId: string,
  body: AddHoldingRequest,
): Promise<IHolding> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let data, error
  try {
    ;({ data, error } = await supabase
      .from('holdings')
      .insert({ ...body, portfolio_id: portfolioId })
      .select()
      .single())
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(400, error.message)
  }
  if (!data) throw new HttpError(400, '종목 추가에 실패했습니다')

  return data as IHolding
}

/**
 * # removeHolding
 * ---
 * - 간단설명: 보유 종목 삭제
 * - 제약사항: RLS로 인해 본인 포트폴리오의 종목만 삭제 가능
 * ---
 * @param accessToken JWT access token
 * @param holdingId 삭제할 종목 UUID
 * ---
 * @example
 * await removeHolding('eyJ...', 'holding-1')
 */
export async function removeHolding(accessToken: string, holdingId: string): Promise<void> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let error
  try {
    ;({ error } = await supabase.from('holdings').delete().eq('id', holdingId))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(400, error.message)
  }
}
