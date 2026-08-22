'use client'

import React, { useState } from 'react'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { Market, Currency } from '@fblg/enums'
import { useAddHoldingMutation } from '../api/useAddHoldingMutation'

/**
 * # AddHoldingForm
 * ---
 * - 간단설명: 포트폴리오 종목 추가 폼 (종목코드, 종목명, 시장, 통화, 수량, 매입가)
 * - 제약사항: portfolioId 필수, 성공 시 폼 초기화 및 onSuccess 콜백 호출
 * ---
 * @param portfolioId 포트폴리오 UUID
 * @param onSuccess 추가 성공 시 콜백 (모달 닫기 등)
 * ---
 * @example
 * <AddHoldingForm portfolioId="portfolio-1" onSuccess={() => setOpen(false)} />
 */
export function AddHoldingForm({
  portfolioId,
  onSuccess,
}: {
  portfolioId: string
  onSuccess?: () => void
}) {
  const [form, setForm] = useState({
    symbol: '',
    name: '',
    market: Market.KOSPI as Market,
    currency: Currency.KRW as Currency,
    quantity: '',
    avg_buy_price: '',
  })
  const { mutate, isPending, error } = useAddHoldingMutation(portfolioId)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(
      {
        symbol: form.symbol.trim(),
        name: form.name.trim(),
        market: form.market,
        currency: form.currency,
        quantity: Number(form.quantity),
        avg_buy_price: Number(form.avg_buy_price),
      },
      {
        onSuccess: () => {
          setForm({ symbol: '', name: '', market: Market.KOSPI, currency: Currency.KRW, quantity: '', avg_buy_price: '' })
          onSuccess?.()
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          name="symbol"
          value={form.symbol}
          onChange={handleChange}
          placeholder="종목코드 (예: 005930, AAPL)"
          required
          variant="white"
        />
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="종목명 (예: 삼성전자)"
          required
          variant="white"
        />
        <select
          name="market"
          value={form.market}
          onChange={handleChange}
          className="rounded-lg border border-fb-border bg-fb-surface px-3 py-2 text-sm text-fb-text-primary"
        >
          {(Object.values(Market) as Market[]).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="rounded-lg border border-fb-border bg-fb-surface px-3 py-2 text-sm text-fb-text-primary"
        >
          {(Object.values(Currency) as Currency[]).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Input
          name="quantity"
          type="number"
          min="1"
          step="1"
          value={form.quantity}
          onChange={handleChange}
          placeholder="보유 수량"
          required
          variant="white"
        />
        <Input
          name="avg_buy_price"
          type="number"
          min="0.01"
          step="any"
          value={form.avg_buy_price}
          onChange={handleChange}
          placeholder="평균 매입가"
          required
          variant="white"
        />
      </div>
      {error && <p className="text-sm text-red-500">{(error as Error).message}</p>}
      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? '추가 중...' : '종목 추가'}
      </Button>
    </form>
  )
}
