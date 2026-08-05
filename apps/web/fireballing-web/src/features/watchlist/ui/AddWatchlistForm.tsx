'use client'

import React, { useState } from 'react'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { useAddWatchlistMutation } from '../api/useAddWatchlistMutation'

/**
 * # AddWatchlistForm
 * ---
 * - 간단설명: 관심종목 추가 폼 컴포넌트 (티커, 종목명, 수량, 평단가 입력)
 * - 제약사항: useAddWatchlistMutation 성공 시 폼 초기화
 * ---
 * @example
 * <AddWatchlistForm />
 */
export function AddWatchlistForm() {
  const [form, setForm] = useState({ ticker: '', name: '', quantity: '', avg_buy_price: '' })
  const { mutate, isPending, error } = useAddWatchlistMutation()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(
      {
        ticker: form.ticker.trim(),
        name: form.name.trim(),
        quantity: Number(form.quantity),
        avg_buy_price: Number(form.avg_buy_price),
      },
      {
        onSuccess: () => setForm({ ticker: '', name: '', quantity: '', avg_buy_price: '' }),
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Input
          name="ticker"
          value={form.ticker}
          onChange={handleChange}
          placeholder="티커 (예: AAPL)"
          required
          variant="white"
        />
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="종목명 (예: Apple Inc.)"
          required
          variant="white"
        />
        <Input
          name="quantity"
          type="number"
          min="0"
          step="any"
          value={form.quantity}
          onChange={handleChange}
          placeholder="보유 수량"
          required
          variant="white"
        />
        <Input
          name="avg_buy_price"
          type="number"
          min="0"
          step="any"
          value={form.avg_buy_price}
          onChange={handleChange}
          placeholder="평균 매수가"
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
