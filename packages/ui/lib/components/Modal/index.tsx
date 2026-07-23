import React, { Suspense, useState, useCallback } from 'react';
import ReactModal from 'react-modal';
import { twMerge } from 'tailwind-merge';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';

const SIZE_MAP = {
  md: '37.5rem',
  lg: '56.25rem',
  xl: '75rem',
} as const;

export interface IModalProps {
  children?: React.ReactNode;
  /** 트리거 요소 (클릭 시 모달 열림, 비제어 모드) */
  triggerUI?: React.ReactNode;
  className?: string;
  /** true 시 우상단 닫기 버튼 숨김 */
  hideCloseButton?: boolean;
  overlayClassName?: string;
  /** overlay z-index */
  overlayZIndex?: number;
  /**
   * 모달 사이즈
   * md: 600px, lg: 900px, xl: 1200px
   */
  size?: 'md' | 'lg' | 'xl';
  /** true 시 외부 클릭으로 모달이 닫히지 않음 */
  preventOutsideClose?: boolean;
  /** 제어 모드: 열림 여부 */
  open?: boolean;
  /** 제어 모드: 열림/닫힘 콜백 */
  onOpenChange?: (open: boolean) => void;
}

/**
 * # Modal UI
 * ---
 * - 간단설명: react-modal 기반 모달 컴포넌트
 * - `triggerUI`로 트리거 요소를 주입하거나, `open`/`onOpenChange`로 제어 모드로 사용
 * - `preventOutsideClose=true` 시 overlay 클릭, Escape 키로 닫히지 않음
 * ---
 * @param triggerUI 트리거로 사용할 ReactNode (생략 시 제어 모드)
 * @param size 모달 너비 `'md'`(600px) | `'lg'`(900px) | `'xl'`(1200px), 기본값 `'md'`
 * @param hideCloseButton true 시 우상단 닫기 버튼 숨김
 * @param overlayZIndex overlay z-index (기본값 50)
 * @param preventOutsideClose true 시 외부 클릭·Escape로 닫히지 않음, 기본값 `false`
 * @example
 * <Modal triggerUI={<Button>열기</Button>} size="lg">
 *   <Modal.Header>
 *     <Modal.Title>제목</Modal.Title>
 *   </Modal.Header>
 *   <Modal.Body>본문</Modal.Body>
 *   <Modal.Footer>
 *     <Button>닫기</Button>
 *   </Modal.Footer>
 * </Modal>
 */
export default function Modal({
  children,
  triggerUI,
  className,
  hideCloseButton,
  overlayClassName,
  overlayZIndex = 50,
  size = 'md',
  preventOutsideClose = false,
  open: controlledOpen,
  onOpenChange,
}: IModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleClose = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
  }, [isControlled, onOpenChange]);

  const handleOpen = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
    }
  }, [isControlled, onOpenChange]);

  return (
    <>
      {triggerUI && (
        <span onClick={handleOpen} style={{ cursor: 'pointer' }}>
          {triggerUI}
        </span>
      )}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={preventOutsideClose ? undefined : handleClose}
        shouldCloseOnOverlayClick={!preventOutsideClose}
        shouldCloseOnEsc={!preventOutsideClose}
        ariaHideApp={false}
        style={{
          overlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: overlayZIndex,
          },
          content: {
            position: 'relative',
            inset: 'unset',
            width: SIZE_MAP[size],
            maxWidth: '96vw',
            maxHeight: '85vh',
            overflow: 'hidden',
            borderRadius: '0.5rem',
            border: 'none',
            padding: 0,
            backgroundColor: 'transparent',
          },
        }}
        overlayClassName={overlayClassName}
      >
        <div
          className={twMerge(
            'relative flex flex-col gap-4 bg-white p-6 rounded-lg',
            className,
          )}
        >
          {!hideCloseButton && <CloseButton onClick={handleClose} />}
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </ReactModal>
    </>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="absolute right-6 top-6 hover:opacity-70 cursor-pointer bg-transparent border-none p-0"
      onClick={onClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge('flex flex-col items-start justify-start gap-2', className)}>
      {children}
    </div>
  );
}

function Footer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge('flex items-center justify-end gap-2 w-full pt-2', className)}>
      {children}
    </div>
  );
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={twMerge(
        'scrollbar-hide flex w-full flex-1 flex-col items-start justify-start gap-2 self-stretch overflow-y-auto p-px',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={twMerge('text-xl font-bold text-primary', className)}>
      {children}
    </h2>
  );
}

function Description({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={twMerge('text-sm font-normal text-secondary', className)}>
      {children}
    </p>
  );
}

function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-6">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <p className="text-center text-xl text-gray-600">실행 도중 문제가 발생하였습니다</p>
      {resetErrorBoundary && (
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-80"
        >
          재실행
        </button>
      )}
    </div>
  );
}

Modal.Header = Header;
Modal.Footer = Footer;
Modal.Title = Title;
Modal.Body = Body;
Modal.Description = Description;
Modal.ErrorFallback = ErrorFallback;
