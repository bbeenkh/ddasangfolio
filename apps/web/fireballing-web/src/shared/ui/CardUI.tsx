import React from 'react'
import {
  CardUI as BaseCardUI,
  CardHeader as BaseCardHeader,
  CardTitle as BaseCardTitle,
  CardDescription as BaseCardDescription,
  CardAction as BaseCardAction,
  CardContent as BaseCardContent,
  CardFooter as BaseCardFooter,
} from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

const cardStyle = [
  'bg-white border border-[#f1f5f9] rounded-[16px]',
  'shadow-[0px_2px_8px_-2px_rgba(15,23,42,0.04)]',
  'text-[#0f172a]',
].join(' ')

/**
 * # CardUI
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 CardUI (shadcn 스타일) 래퍼
 * ---
 * @example
 * <CardUI>
 *   <CardHeader><CardTitle>제목</CardTitle></CardHeader>
 *   <CardContent>내용</CardContent>
 * </CardUI>
 */
function CardUI({ className, ...props }: React.ComponentProps<'div'>) {
  return <BaseCardUI className={twMerge(cardStyle, className)} {...props} />
}

function CardHeader(props: React.ComponentProps<'div'>) {
  return <BaseCardHeader {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <BaseCardTitle
      className={twMerge('font-[Plus_Jakarta_Sans,ui-sans-serif,system-ui,sans-serif]', className)}
      {...props}
    />
  )
}

function CardDescription(props: React.ComponentProps<'div'>) {
  return <BaseCardDescription {...props} />
}

function CardAction(props: React.ComponentProps<'div'>) {
  return <BaseCardAction {...props} />
}

function CardContent(props: React.ComponentProps<'div'>) {
  return <BaseCardContent {...props} />
}

function CardFooter(props: React.ComponentProps<'div'>) {
  return <BaseCardFooter {...props} />
}

export { CardUI, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter }
