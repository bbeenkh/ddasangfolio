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

interface Props extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'prefix'
> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  variant?: InputVariant
  onEnter?: () => void
  styleClass?: StyleClass
}

const variantStyles: Record<InputVariant, { root: string; input: string }> = {
  white: {
    root: 'bg-white border border-lf-outline rounded-[16px] focus-within:border-lf-primary-container focus-within:ring-2 focus-within:ring-lf-primary-container/20 transition-all duration-150 shadow-[0px_2px_8px_-2px_rgba(15,23,42,0.04)]',
    input:
      'bg-transparent px-6 py-4 text-lf-on-surface placeholder:text-lf-on-surface-muted',
  },
  gray: {
    root: 'bg-lf-surface-low border border-lf-outline-variant rounded-[16px] focus-within:border-lf-primary-container focus-within:ring-2 focus-within:ring-lf-primary-container/20 transition-all duration-150',
    input:
      'bg-transparent px-6 py-4 text-lf-on-surface placeholder:text-lf-on-surface-muted',
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
function Input({ variant = 'white', styleClass, prefix, suffix, ...props }: Props) {
  const vs = variant ? variantStyles[variant] : undefined
  return (
    <BaseInput
      prefix={prefix}
      suffix={suffix}
      styleClass={{
        root: twMerge(vs?.root, styleClass?.root),
        input: twMerge(vs?.input, 'focus:outline-none', styleClass?.input),
        prefix: twMerge(
          '!left-0 !top-0 !translate-y-0 h-full w-14 flex items-center justify-center text-lf-on-surface-muted',
          styleClass?.prefix,
        ),
        suffix: twMerge(
          '!right-0 !top-0 !translate-y-0 h-full w-14 flex items-center justify-center text-lf-on-surface-muted',
          styleClass?.suffix,
        ),
      }}
      {...props}
    />
  )
}

export default Input
