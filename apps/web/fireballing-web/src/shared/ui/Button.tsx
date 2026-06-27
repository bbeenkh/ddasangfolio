import React from 'react'
import { Button as BaseButton } from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  styleClass?: { root?: string }
  asChild?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-r from-lf-primary-container to-lf-primary-gradient-end text-white font-semibold',
    'rounded-lg px-6 py-3',
    'shadow-sm not-disabled:hover:shadow-md',
    'transition-all duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'not-disabled:hover:opacity-70',
  ].join(' '),
  secondary: [
    'bg-lf-outline-variant text-lf-on-surface font-medium',
    'rounded-lg px-6 py-3',
    'not-disabled:hover:bg-lf-outline not-disabled:hover:opacity-70 transition-colors duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-lf-on-surface-variant font-medium',
    'rounded-lg px-6 py-3',
    'not-disabled:hover:bg-lf-surface-low not-disabled:hover:opacity-70 transition-colors duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
}

/**
 * # Button
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 버튼 래퍼
 * - variant 미지정 시 @fblg/core-ui 기본 동작 (스타일 없음)
 * ---
 * @param variant 버튼 스타일 프리셋 (`'primary'` | `'secondary'` | `'ghost'`)
 * @param styleClass.root 추가 Tailwind 클래스 (variant 위에 병합)
 * ---
 * @example
 * <Button variant="primary">확인</Button>
 * <Button variant="secondary">취소</Button>
 */
function Button({ variant, styleClass, ...props }: Props) {
  const merged = twMerge(variant ? variantStyles[variant] : '', styleClass?.root)
  return <BaseButton styleClass={{ root: merged }} {...props} />
}

export default Button
