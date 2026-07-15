'use client'

import React from 'react'
import { Skeleton as BaseSkeleton } from '@fblg/core-ui'
import { twMerge } from 'tailwind-merge'

interface StyleClass {
  root?: string
}

const shimmerBase = 'bg-lf-outline-variant animate-pulse rounded-[8px]'

/**
 * # Skeleton
 * ---
 * - 간단설명: Luminous Fintech 스타일이 적용된 스켈레톤 래퍼
 * - 기본 스타일 내장: #f1f5f9 배경 + pulse 애니메이션
 * ---
 * @example
 * <Skeleton.Container>
 *   <Skeleton.Circle />
 *   <Skeleton.Box styleClass={{ root: 'w-full h-4' }} />
 * </Skeleton.Container>
 */
const Box = ({ styleClass }: { styleClass?: StyleClass }) => (
  <BaseSkeleton.Box
    styleClass={{ root: twMerge(shimmerBase, 'h-4 w-full', styleClass?.root) }}
  />
)

const Circle = ({ styleClass }: { styleClass?: StyleClass }) => (
  <BaseSkeleton.Circle
    styleClass={{
      root: twMerge(shimmerBase, 'rounded-full w-10 h-10', styleClass?.root),
    }}
  />
)

const Container = ({
  children,
  styleClass,
}: {
  children: React.ReactNode
  styleClass?: StyleClass
}) => (
  <BaseSkeleton.Container
    styleClass={{ root: twMerge('flex flex-col gap-3', styleClass?.root) }}
  >
    {children}
  </BaseSkeleton.Container>
)

const Skeleton = { Box, Circle, Container }

export default Skeleton
