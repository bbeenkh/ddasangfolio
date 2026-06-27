import React from 'react'
import { Input as BaseInput } from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

type InputVariant = 'default' | 'search'

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
  default: {
    root: 'bg-white border border-[#e2e8f0] rounded-[8px] focus-within:border-[#06b6d4] focus-within:ring-2 focus-within:ring-[#06b6d4]/20 transition-all duration-150',
    input: 'bg-transparent px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8]',
  },
  search: {
    root: 'bg-[#f8fafc] border border-[#f1f5f9] rounded-full focus-within:border-[#06b6d4] focus-within:ring-2 focus-within:ring-[#06b6d4]/20 transition-all duration-150',
    input: 'bg-transparent px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8]',
  },
}

/**
 * # Input
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 Input 래퍼
 * - `variant`: `'default'`(기본) / `'search'`(pill 검색바) 프리셋
 * ---
 * @param variant 입력 스타일 프리셋
 * ---
 * @example
 * <Input variant="default" placeholder="금액 입력" suffix={<span>원</span>} />
 * <Input variant="search" prefix={<SearchIcon />} placeholder="종목명 검색" />
 */
function Input({ variant, styleClass, prefix, suffix, ...props }: Props) {
  const vs = variant ? variantStyles[variant] : undefined
  return (
    <BaseInput
      prefix={prefix}
      suffix={suffix}
      styleClass={{
        root: twMerge(vs?.root, styleClass?.root),
        input: twMerge(vs?.input, prefix ? 'pl-10' : '', suffix ? 'pr-10' : '', styleClass?.input),
        prefix: twMerge('text-[#94a3b8]', styleClass?.prefix),
        suffix: twMerge('text-[#94a3b8]', styleClass?.suffix),
      }}
      {...props}
    />
  )
}

export default Input
