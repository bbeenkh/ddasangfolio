import type { IWatchlistItem } from '@fblg/types'
import type { AddWatchlistRequest } from '@fblg/schemas'
import { createSupabaseClientWithToken } from '../../../shared/lib/supabase'
import { HttpError } from '../../../shared/errors/http-error'
import { SupabaseConnectionError } from '../../../shared/errors/supabase-connection-error'

/**
 * # getWatchlist
 * ---
 * - 간단설명: 사용자의 관심종목 목록을 조회
 * - 제약사항: RLS로 인해 accessToken 소유 유저의 데이터만 반환됨
 * ---
 * @param accessToken JWT access token
 * ---
 * @example
 * const items = await getWatchlist('eyJ...')
 */
export async function getWatchlist(accessToken: string): Promise<IWatchlistItem[]> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let data, error
  try {
    ;({ data, error } = await supabase.from('watchlist').select('*').order('created_at', { ascending: false }))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(500, error.message)
  }

  return (data ?? []) as IWatchlistItem[]
}

/**
 * # addWatchlistItem
 * ---
 * - 간단설명: 관심종목 항목을 추가하고 생성된 항목을 반환
 * - 제약사항: 동일 user_id + ticker 중복 시 Supabase unique 제약 에러 발생
 * ---
 * @param accessToken JWT access token
 * @param userId 인증된 사용자 ID
 * @param body 추가할 종목 정보 (ticker, name, quantity, avg_buy_price)
 * ---
 * @example
 * const item = await addWatchlistItem('eyJ...', 'user-1', { ticker: 'AAPL', name: 'Apple', quantity: 10, avg_buy_price: 150 })
 */
export async function addWatchlistItem(
  accessToken: string,
  userId: string,
  body: AddWatchlistRequest,
): Promise<IWatchlistItem> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let data, error
  try {
    ;({ data, error } = await supabase
      .from('watchlist')
      .insert({ ...body, user_id: userId })
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
  if (!data) throw new HttpError(400, '관심종목 추가에 실패했습니다')

  return data as IWatchlistItem
}

/**
 * # removeWatchlistItem
 * ---
 * - 간단설명: 관심종목 항목을 삭제
 * - 제약사항: RLS로 인해 본인 데이터만 삭제 가능
 * ---
 * @param accessToken JWT access token
 * @param id 삭제할 항목 UUID
 * ---
 * @example
 * await removeWatchlistItem('eyJ...', 'uuid-1')
 */
export async function removeWatchlistItem(accessToken: string, id: string): Promise<void> {
  const supabase = createSupabaseClientWithToken(accessToken)

  let error
  try {
    ;({ error } = await supabase.from('watchlist').delete().eq('id', id))
  } catch (e) {
    if (SupabaseConnectionError.isConnectionError(e)) throw new SupabaseConnectionError(e)
    throw e
  }

  if (error) {
    if (SupabaseConnectionError.isConnectionError(error)) throw new SupabaseConnectionError(error)
    throw new HttpError(400, error.message)
  }
}
