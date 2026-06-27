import React from 'react'
import { Input as BaseInput } from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

type InputVariant = 'white' | 'gray'

interface StyleClass {
  root?: string
  input?: string
  prefix?: string
  suffix?: string
}

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  variant?: InputVariant
  onEnter?: () => void
  styleClass?: StyleClass
}

const variantStyles: Record<InputVariant, { root: string; input: string }> = {
  white: {
    root: 'bg-white border border-[#e2e8f0] rounded-[16px] focus-within:border-[#06b6d4] focus-within:ring-2 focus-within:ring-[#06b6d4]/20 transition-all duration-150 shadow-[0px_2px_8px_-2px_rgba(15,23,42,0.04)]',
    input: 'bg-transparent px-6 py-4 text-[#0f172a] placeholder:text-[#94a3b8]',
  },
  gray: {
    root: 'bg-[#f8fafc] border border-[#f1f5f9] rounded-[16px] focus-within:border-[#06b6d4] focus-within:ring-2 focus-within:ring-[#06b6d4]/20 transition-all duration-150',
    input: 'bg-transparent px-6 py-4 text-[#0f172a] placeholder:text-[#94a3b8]',
  },
}

/**
 * # Input
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 Input 래퍼
 * - `variant`: `'white'`(흰 배경, 카드 스타일) / `'gray'`(회색 배경) 프리셋
 * ---
 * @param variant 입력 스타일 프리셋 (`'white'` | `'gray'`)
 * ---
 * @example
 * <Input variant="white" placeholder="금액 입력" suffix={<span>원</span>} />
 * <Input variant="gray" prefix={<SearchIcon />} placeholder="종목명 검색" />
 */
function Input({ variant, styleClass, prefix, suffix, ...props }: Props) {
  const vs = variant ? variantStyles[variant] : undefined
  return (
    <BaseInput
      prefix={prefix}
      suffix={suffix}
      styleClass={{
        root: twMerge(vs?.root, styleClass?.root),
        input: twMerge(vs?.input, 'focus:outline-none', styleClass?.input),
        prefix: twMerge('!left-0 !top-0 !translate-y-0 h-full w-14 flex items-center justify-center text-[#94a3b8]', styleClass?.prefix),
        suffix: twMerge('!right-0 !top-0 !translate-y-0 h-full w-14 flex items-center justify-center text-[#94a3b8]', styleClass?.suffix),
      }}
      {...props}
    />
  )
}

export default Input
