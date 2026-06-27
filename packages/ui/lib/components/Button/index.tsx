import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface StyleClass {
  root?: string;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  styleClass?: StyleClass;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-r from-[#06b6d4] to-[#2dd4bf] text-white font-semibold',
    'rounded-lg px-6 py-3',
    'shadow-sm hover:shadow-md',
    'active:scale-[0.97] transition-all duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
  ].join(' '),
  secondary: [
    'bg-[#f1f5f9] text-[#0f172a] font-medium',
    'rounded-lg px-6 py-3',
    'hover:bg-[#e2e8f0] transition-colors duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-[#475569] font-medium',
    'rounded-lg px-6 py-3',
    'hover:bg-[#f8fafc] transition-colors duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
};

/**
 * # Button UI
 * ---
 * - 간단설명: Luminous Fintech 디자인 시스템 버튼 컴포넌트
 * - `variant`: `'primary'`(그라디언트) / `'secondary'`(서피스) / `'ghost'`(투명) 스타일 프리셋
 * - `styleClass.root`: 버튼 루트 요소에 적용할 추가 Tailwind 클래스 (variant 위에 병합)
 * - `asChild`: true 시 children 컴포넌트가 button을 대체 (Radix Slot 패턴)
 * - `type`: 버튼 타입 (기본값 `'button'`)
 * ---
 * @param children 버튼 내부 콘텐츠
 * @param variant 버튼 스타일 프리셋 (기본값: `undefined` — 스타일 없음)
 * @param type 버튼 타입 (기본값: `'button'`)
 * @param styleClass 커스텀 스타일 클래스 객체
 * @param asChild true 시 children 컴포넌트로 button 대체 (Radix Slot 패턴)
 * ---
 * @example
 * <Button variant="primary">확인</Button>
 * <Button variant="secondary">취소</Button>
 * <Button variant="ghost">더보기</Button>
 */
function Button({ children, type = 'button', variant, styleClass, asChild = false, ...props }: Props) {
  const Comp = asChild ? Slot : 'button';
  const baseClass = variant ? variantStyles[variant] : '';
  return (
    <Comp
      type={asChild ? undefined : type}
      className={twMerge(baseClass, styleClass?.root)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Button;
