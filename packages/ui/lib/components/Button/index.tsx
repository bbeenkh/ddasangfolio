import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { twMerge } from "tailwind-merge";
import Spinner from "../Spinner";

interface StyleClass {
  root?: string;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  styleClass?: StyleClass;
  asChild?: boolean;
  isLoading?: boolean;
  loadingUI?: React.ReactNode;
}

/**
 * # Button UI
 * ---
 * - `styleClass.root`: 버튼 루트 요소에 적용할 Tailwind 클래스
 * - `asChild`: true 시 children 컴포넌트가 button을 대체 (Radix Slot 패턴)
 * - `type`: 버튼 타입 (기본값 `'button'`)
 * - isLoading : loading 여부 플래그
 * - loadingUI : 로딩중일때 나올 fallback ui, 없으면 Spinner 등장
 * - 기본 스타일 없음 — 모든 스타일은 `styleClass`로 주입
 * ---
 * @param children 버튼 내부 콘텐츠
 * @param type 버튼 타입 (기본값: `'button'`)
 * @param styleClass 커스텀 스타일 클래스 객체
 * @param asChild true 시 children 컴포넌트로 button 대체 (Radix Slot 패턴)
 * @example
 * // 기본 버튼
 * <Button styleClass={{ root: 'bg-primary text-white px-4 py-2 rounded' }}>확인</Button>
 *
 * // asChild: Link 컴포넌트를 버튼처럼 렌더
 * <Button asChild styleClass={{ root: 'text-blue-500 underline' }}>
 *   <Link href="/about">About</Link>
 * </Button>
 */
function Button({
  children,
  type = "button",
  styleClass,
  asChild = false,
  disabled,
  isLoading,
  loadingUI,
  ...props
}: Props) {
  const Comp = asChild ? Slot : "button";
  const _loadingUI = loadingUI || <Spinner size="sm" />;
  const _disabled = isLoading || disabled;
  return (
    <Comp
      type={asChild ? undefined : type}
      className={twMerge(
        "relative",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        styleClass?.root,
      )}
      disabled={_disabled}
      {...props}
    >
      <div className={isLoading ? "opacity-0" : ""}>{children}</div>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          {_loadingUI}
        </div>
      )}
    </Comp>
  );
}

export default Button;
