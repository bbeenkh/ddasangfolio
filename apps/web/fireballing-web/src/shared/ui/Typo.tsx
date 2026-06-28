import React from 'react'
import { twMerge } from 'tailwind-merge'

interface TypoProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
}

/**
 * # Typo
 * ---
 * - 간단설명: Luminous Fintech 디자인 시스템 타이포그래피 합성 컴포넌트
 * - 제약사항: Display/Headline 계열은 Plus Jakarta Sans, Body/Label 계열은 Inter 폰트 사용
 * ---
 * @example
 * <Typo.DL>1,240,500원</Typo.DL>
 * <Typo.HL>내 포트폴리오</Typo.HL>
 * <Typo.BM>본문 텍스트</Typo.BM>
 */

function createTypoComponent(defaultClassName: string, displayName: string) {
  const Component = React.forwardRef<HTMLElement, TypoProps>(
    function TypoVariant(
      { as: Tag = 'p', className, children, ...props },
      ref,
    ) {
      return (
        <Tag
          ref={ref}
          className={twMerge(defaultClassName, className)}
          {...props}
        >
          {children}
        </Tag>
      )
    },
  )
  Component.displayName = displayName
  return Component
}

const HEADING_FONT =
  "font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]"

/**
 * Display Large — Plus Jakarta Sans 48/60 Bold, tracking -0.02em
 */
const DL = createTypoComponent(
  `text-[48px] font-bold leading-[60px] tracking-[-0.02em] ${HEADING_FONT} text-lf-on-surface`,
  'Typo.DL',
)

/**
 * Headline Large — Plus Jakarta Sans 32/40 Bold, tracking -0.01em
 */
const HL = createTypoComponent(
  `text-[32px] font-bold leading-[40px] tracking-[-0.01em] ${HEADING_FONT} text-lf-on-surface`,
  'Typo.HL',
)

/**
 * Headline Medium — Plus Jakarta Sans 24/32 Semibold
 */
const HM = createTypoComponent(
  `text-[24px] font-semibold leading-[32px] ${HEADING_FONT} text-lf-on-surface`,
  'Typo.HM',
)

/**
 * Body Large — Inter 18/28 Regular
 */
const BL = createTypoComponent(
  'text-[18px] leading-[28px] text-lf-on-surface-variant',
  'Typo.BL',
)

/**
 * Body Medium — Inter 16/24 Regular
 */
const BM = createTypoComponent(
  'text-[16px] leading-[24px] text-lf-on-surface-variant',
  'Typo.BM',
)

/**
 * Body Small — Inter 14/20 Regular
 */
const BS = createTypoComponent(
  'text-[14px] leading-[20px] text-lf-on-surface-variant',
  'Typo.BS',
)

/**
 * Label Medium — Inter 14/20 Semibold
 */
const LM = createTypoComponent(
  'text-[14px] leading-[20px] font-semibold text-lf-on-surface',
  'Typo.LM',
)

/**
 * Label Small — Inter 12/16 Medium
 */
const LS = createTypoComponent(
  'text-[12px] leading-[16px] font-medium text-lf-on-surface-variant',
  'Typo.LS',
)

const Typo = { DL, HL, HM, BL, BM, BS, LM, LS }

export default Typo
