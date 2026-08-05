'use client'

import { Trash2 } from 'lucide-react'
import { AddWatchlistForm, useWatchlistQuery, useRemoveWatchlistMutation } from '@/features/watchlist'

/**
 * # WatchlistPage
 * ---
 * - 간단설명: 관심종목 목록 조회 및 추가/삭제 페이지
 * ---
 * @example
 * // /watchlist 라우트에 마운트
 */
export default function WatchlistPage() {
  const { data: watchlist = [], isLoading, error } = useWatchlistQuery()
  const { mutate: remove, isPending: isRemoving } = useRemoveWatchlistMutation()

  return (
    <main className="px-5 pt-4 pb-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-bold text-fb-on-primary leading-[30px] m-0">
          관심종목
        </h1>
        <p className="text-[13px] text-fb-cool-charcoal leading-[18px] m-0">
          보유 종목을 등록하고 관리합니다
        </p>
      </div>

      {/* 종목 추가 폼 */}
      <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
        <h2 className="text-base font-bold text-fb-on-primary m-0">종목 추가</h2>
        <AddWatchlistForm />
      </div>

      {/* 종목 목록 */}
      <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
        <h2 className="text-base font-bold text-fb-on-primary m-0">
          보유 종목 {watchlist.length > 0 && <span className="text-sm font-normal text-fb-cool-charcoal">({watchlist.length})</span>}
        </h2>

        {isLoading && (
          <p className="text-sm text-fb-cool-charcoal text-center py-4">불러오는 중...</p>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-4">{(error as Error).message}</p>
        )}

        {!isLoading && !error && watchlist.length === 0 && (
          <p className="text-sm text-fb-cool-charcoal text-center py-4">등록된 종목이 없습니다</p>
        )}

        {watchlist.map((item, index) => (
          <div key={item.id}>
            {index > 0 && <hr className="border-gray-200 m-0 mb-4" />}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-fb-on-primary">{item.ticker}</span>
                  <span className="text-xs text-fb-cool-charcoal truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-fb-cool-charcoal">
                  <span>수량 {item.quantity.toLocaleString()}</span>
                  <span>평단가 {item.avg_buy_price.toLocaleString()}원</span>
                </div>
              </div>
              <button
                onClick={() => remove(item.id)}
                disabled={isRemoving}
                className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-0 cursor-pointer"
                aria-label={`${item.ticker} 삭제`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
