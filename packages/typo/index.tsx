'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * # TypoProps
 * - 타이포그래피 컴포넌트 공통 Props
 * - as: 렌더링할 HTML 태그 지정
 */
export interface TypoProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
}

/**
 * # createTypoComponent
 * ---
 * - 간단설명: Tailwind 클래스 기반 타이포그래피 컴포넌트를 생성하는 팩토리 함수
 * - 제약사항: tailwind-merge 의존
 * ---
 * @param defaultClassName 기본 적용될 Tailwind 클래스
 * @param displayName React DevTools 표시명
 * ---
 * @example
 * const Heading = createTypoComponent('text-2xl font-bold', 'Heading')
 * <Heading as="h1">제목</Heading>
 */
export function createTypoComponent(defaultClassName: string, displayName: string) {
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
