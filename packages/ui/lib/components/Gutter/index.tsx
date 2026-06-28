import React from 'react';
import { cn } from '../../utils/cn';

/**
 * 여백 토큰 타입
 * - xs = 4px
 * - sm = 8px
 * - md = 16px
 * - lg = 24px
 * - xl = 32px
 * - 2xl = 48px
 */
export type SpaceToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SPACE_VALUES: Record<SpaceToken, string> = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

interface GutterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 상하좌우 동일 padding */
  padding?: SpaceToken;
  /** 좌우 padding (padding보다 우선) */
  paddingX?: SpaceToken;
  /** 상하 padding (padding보다 우선) */
  paddingY?: SpaceToken;
  /** 자식 요소 간 간격 */
  gap?: SpaceToken;
  /** flex 방향 */
  direction?: 'row' | 'column';
  children: React.ReactNode;
}

/**
 * # Gutter
 * ---
 * - 간단설명: 자식 요소를 감싸서 spacing 토큰 기반으로 padding과 gap을 일관 적용하는 래퍼 컴포넌트
 * - 제약사항 및 특이사항:
 *   - 4px 기반 spacing scale(xs~2xl) 사용
 *   - paddingX/paddingY가 padding보다 우선 적용됨
 *   - 반응형은 className을 통해 Tailwind 클래스로 별도 처리
 * ---
 * @param padding 상하좌우 동일 padding 토큰
 * @param paddingX 좌우 padding 토큰 (padding보다 우선)
 * @param paddingY 상하 padding 토큰 (padding보다 우선)
 * @param gap 자식 요소 간 간격 토큰
 * @param direction flex 방향 (기본값: 'column')
 * @param className 추가 Tailwind 클래스
 * @param children 자식 요소
 * ---
 * @example
 * <Gutter padding="lg" gap="md">
 *   <Card />
 *   <Card />
 * </Gutter>
 */
function Gutter({
  padding,
  paddingX,
  paddingY,
  gap,
  direction = 'column',
  className,
  children,
  style,
  ...rest
}: GutterProps) {
  const toValue = (token: SpaceToken) => SPACE_VALUES[token];

  const hasPaddingAxis = paddingX || paddingY;

  const gutterStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    ...(padding && !hasPaddingAxis && { padding: toValue(padding) }),
    ...((paddingX || (hasPaddingAxis && padding)) && {
      paddingLeft: toValue(paddingX ?? padding!),
      paddingRight: toValue(paddingX ?? padding!),
    }),
    ...((paddingY || (hasPaddingAxis && padding)) && {
      paddingTop: toValue(paddingY ?? padding!),
      paddingBottom: toValue(paddingY ?? padding!),
    }),
    ...(gap && { gap: toValue(gap) }),
    ...style,
  };

  return (
    <div className={cn(className)} style={gutterStyle} {...rest}>
      {children}
    </div>
  );
}

export default Gutter;
