'use client'

import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { usePortfolioQuery, useRemoveHoldingMutation, AddHoldingForm } from '@/features/portfolio'

/**
 * # PortfolioPage
 * ---
 * - 간단설명: 포트폴리오 보유 종목 목록 조회 및 추가/삭제 페이지
 * ---
 * @example
 * // /portfolio 라우트에 마운트
 */
export default function PortfolioPage() {
  const { data, isLoading, error } = usePortfolioQuery()
  const portfolio = data?.portfolio
  const holdings = data?.holdings ?? []
  const { mutate: remove, isPending: isRemoving } = useRemoveHoldingMutation(portfolio?.id ?? '')
  const [showForm, setShowForm] = useState(false)

  return (
    <main className="px-5 pt-4 pb-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-fb-on-primary leading-[30px] m-0">
            포트폴리오
          </h1>
          <p className="text-[13px] text-fb-cool-charcoal leading-[18px] m-0">
            보유 종목을 등록하고 관리합니다
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-fb-primary text-white text-sm font-medium border-0 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" />
          종목 추가
        </button>
      </div>

      {/* 종목 추가 폼 */}
      {showForm && portfolio && (
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
          <h2 className="text-base font-bold text-fb-on-primary m-0">종목 추가</h2>
          <AddHoldingForm portfolioId={portfolio.id} onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* 종목 목록 */}
      <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
        <h2 className="text-base font-bold text-fb-on-primary m-0">
          보유 종목 {holdings.length > 0 && <span className="text-sm font-normal text-fb-cool-charcoal">({holdings.length})</span>}
        </h2>

        {isLoading && (
          <p className="text-sm text-fb-cool-charcoal text-center py-4">불러오는 중...</p>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-4">{(error as Error).message}</p>
        )}

        {!isLoading && !error && holdings.length === 0 && (
          <p className="text-sm text-fb-cool-charcoal text-center py-4">등록된 종목이 없습니다</p>
        )}

        {holdings.map((item, index) => (
          <div key={item.id}>
            {index > 0 && <hr className="border-gray-200 m-0 mb-4" />}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-fb-on-primary">{item.symbol}</span>
                  <span className="text-xs text-fb-cool-charcoal truncate">{item.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-fb-cool-charcoal">{item.market}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-fb-cool-charcoal">
                  <span>수량 {item.quantity.toLocaleString()}</span>
                  <span>매입가 {item.avg_buy_price.toLocaleString()}{item.currency === 'KRW' ? '원' : '$'}</span>
                </div>
              </div>
              <button
                onClick={() => remove(item.id)}
                disabled={isRemoving}
                className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-0 cursor-pointer"
                aria-label={`${item.symbol} 삭제`}
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
