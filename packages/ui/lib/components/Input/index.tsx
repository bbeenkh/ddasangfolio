import React from 'react';
import { twMerge } from 'tailwind-merge';

type InputVariant = 'default' | 'search';

interface StyleClass {
  root?: string;
  input?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
}

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  variant?: InputVariant;
  onEnter?: () => void;
  styleClass?: StyleClass;
}

const inputVariantStyles: Record<InputVariant, { root: string; input: string }> = {
  default: {
    root: 'bg-white border border-[#e2e8f0] rounded-[8px] focus-within:border-[#06b6d4] focus-within:ring-2 focus-within:ring-[#06b6d4]/20 transition-all duration-150',
    input: 'bg-transparent px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8] font-[Inter,ui-sans-serif,system-ui,sans-serif]',
  },
  search: {
    root: 'bg-[#f8fafc] border border-[#f1f5f9] rounded-full focus-within:border-[#06b6d4] focus-within:ring-2 focus-within:ring-[#06b6d4]/20 transition-all duration-150',
    input: 'bg-transparent px-4 py-3 text-[#0f172a] placeholder:text-[#94a3b8] font-[Inter,ui-sans-serif,system-ui,sans-serif]',
  },
};

/**
 * # Input UI
 * ---
 * - `prefix`: input 좌측에 렌더링할 ReactNode (아이콘, 텍스트 등)
 * - `suffix`: input 우측에 렌더링할 ReactNode (단위, 버튼 등)
 * - `onEnter`: Enter 키 입력 시 호출되는 콜백
 * - `variant`: `'default'`(기본 입력) / `'search'`(검색바 pill 형태) 스타일 프리셋
 * - variant 미지정 시 기본 스타일 없음 — 모든 스타일은 `styleClass`로 주입
 * ---
 * @param prefix input 좌측에 렌더링할 ReactNode
 * @param suffix input 우측에 렌더링할 ReactNode
 * @param variant 입력 스타일 프리셋 (`'default'` | `'search'`)
 * @param onEnter Enter 키 입력 시 호출되는 콜백
 * @param styleClass 커스텀 스타일 클래스 객체
 * ---
 * @example
 * <Input variant="default" placeholder="금액 입력" suffix={<span>원</span>} />
 * <Input variant="search" prefix={<SearchIcon />} placeholder="종목명 검색" />
 */
function Input({ prefix, suffix, variant, onEnter, styleClass, ...props }: Props) {
  const variantStyle = variant ? inputVariantStyles[variant] : undefined;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className={twMerge('relative flex items-center', variantStyle?.root, styleClass?.root)}>
      {prefix && (
        <div className={twMerge('absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]', styleClass?.prefix)}>
          {prefix}
        </div>
      )}
      <input
        className={twMerge('w-full outline-none', variantStyle?.input, prefix ? 'pl-10' : '', suffix ? 'pr-10' : '', styleClass?.input)}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {suffix && (
        <div className={twMerge('absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]', styleClass?.suffix)}>
          {suffix}
        </div>
      )}
    </div>
  );
}

export default Input;
