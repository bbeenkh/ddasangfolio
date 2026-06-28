import React from 'react'
import { Card as BaseCard } from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

const cardStyle =
  'bg-white border-lf-outline-variant rounded-[16px] shadow-[0px_2px_8px_-2px_rgba(15,23,42,0.04)]'
const titleStyle =
  'text-lf-on-surface font-[Plus_Jakarta_Sans,ui-sans-serif,system-ui,sans-serif]'

interface ILayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * # Card
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 Card 래퍼
 * - 흰색 배경, #f1f5f9 보더, 16px 라운딩, 앰비언트 쉐도우
 * ---
 * @example
 * <Card>
 *   <Card.Header><Card.Title>제목</Card.Title></Card.Header>
 *   <Card.Body>내용</Card.Body>
 * </Card>
 */
const Card = ({ className, children }: ILayoutProps) => (
  <BaseCard className={twMerge(cardStyle, className)}>{children}</BaseCard>
)

Card.Header = BaseCard.Header

Card.Title = ({ className, children }: ILayoutProps) => (
  <BaseCard.Title className={twMerge(titleStyle, className)}>
    {children}
  </BaseCard.Title>
)

Card.Body = BaseCard.Body
Card.Footer = BaseCard.Footer

export default Card
