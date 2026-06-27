import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface StyleClass {
  root?: string;
}

const shimmerBase = 'bg-[#f1f5f9] animate-pulse rounded-[8px]';

/**
 * # Skeleton.Box
 * ---
 * - 간단설명: 사각형 로딩 플레이스홀더
 * ---
 * @param styleClass.root 추가 Tailwind 클래스
 */
const Box = ({ styleClass }: { styleClass?: StyleClass }) => {
  return <div className={twMerge(shimmerBase, 'h-4 w-full', styleClass?.root)} />;
};

/**
 * # Skeleton.Circle
 * ---
 * - 간단설명: 원형 로딩 플레이스홀더
 * ---
 * @param styleClass.root 추가 Tailwind 클래스
 */
const Circle = ({ styleClass }: { styleClass?: StyleClass }) => {
  return <div className={twMerge(shimmerBase, 'rounded-full w-10 h-10', styleClass?.root)} />;
};

/**
 * # Skeleton.Container
 * ---
 * - 간단설명: 스켈레톤 래퍼 컨테이너
 * ---
 * @param styleClass.root 추가 Tailwind 클래스
 */
const Container = ({
  children,
  styleClass,
}: {
  children: React.ReactNode;
  styleClass?: StyleClass;
}) => {
  return <div className={twMerge('flex flex-col gap-3', styleClass?.root)}>{children}</div>;
};

/**
 * # Skeleton UI
 * ---
 * - 간단설명: 로딩 중 콘텐츠 자리를 채우는 스켈레톤 컴포넌트 (Compound Component 패턴)
 * - `Skeleton.Box`: 사각형 스켈레톤 (`#f1f5f9` 배경 + pulse 애니메이션)
 * - `Skeleton.Circle`: 원형 스켈레톤
 * - `Skeleton.Container`: 스켈레톤 래퍼 컨테이너
 * ---
 * @example
 * <Skeleton.Container>
 *   <Skeleton.Circle />
 *   <Skeleton.Box styleClass={{ root: 'w-full h-4' }} />
 *   <Skeleton.Box styleClass={{ root: 'w-3/4 h-4' }} />
 * </Skeleton.Container>
 */
const Skeleton = { Box, Circle, Container };

export default Skeleton;
