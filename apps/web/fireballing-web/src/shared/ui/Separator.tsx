import React from 'react'
import { Separator as BaseSeparator } from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

type Props = React.ComponentPropsWithoutRef<typeof BaseSeparator>

/**
 * # Separator
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 구분선 래퍼
 * - 기본 보더 색상: #f1f5f9
 * ---
 * @example
 * <Separator className="my-4" />
 */
const Separator = React.forwardRef<HTMLElement, Props>(function Separator(
  { className, ...props },
  ref,
) {
  return (
    <BaseSeparator
      ref={ref as React.Ref<HTMLElement>}
      className={twMerge('border-lf-outline-variant', className)}
      {...props}
    />
  )
})

export default Separator
