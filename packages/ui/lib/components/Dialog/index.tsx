'use client';
import React, { useEffect, useCallback } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import Modal from '../Modal';
import Button from '../Button';

/**
 * Dialog modal 리뉴얼 props
 * - ALERT = 확인 버튼만 표시
 * - CONFIRM = 확인, 취소 버튼 표시
 */
export interface IDialogParams {
  /** dialog 열림 여부 */
  isOpenDialog: boolean;
  /** alert: 확인 버튼만, confirm: 확인, 취소 버튼 표시 */
  type: 'alert' | 'confirm';
  /** dialog 제목 */
  title: string;
  /** dialog 내용 */
  message: React.ReactNode;
  /** ok 버튼 텍스트 */
  okLabel?: string;
  /** cancel 버튼 텍스트 */
  cancelLabel?: string;
  /** ok 버튼에 적용할 스타일 클래스 */
  okClassName?: string;
  /** ok 버튼 클릭 시 실행 함수, 속성 추가 시 closeDialog 수동추가 필요 */
  okFn?: () => void;
  /** cancel 버튼 클릭 시 실행 함수, 속성 추가 시 closeDialog 수동추가 필요 */
  cancelFn?: () => void;
  /** 확인, 취소 클릭 시 다이얼로그 자동 닫힘, 기본 true, 만약 API 호출 등 다른 액션 원할 경우 false로 지정 */
  autoClose: boolean;
}

interface DialogStore extends IDialogParams {
  openDialog: (params: Partial<IDialogParams>) => void;
  closeDialog: () => void;
  reset: () => void;
}

const initialState: Omit<DialogStore, 'openDialog' | 'closeDialog' | 'reset'> = {
  isOpenDialog: false,
  type: 'alert',
  title: '',
  message: '',
  okLabel: '확인',
  cancelLabel: '취소',
  autoClose: true,
  okFn: undefined,
  cancelFn: undefined,
  okClassName: undefined,
};

export const useConfirmDialog = createStore<DialogStore>((set) => ({
  ...initialState,
  openDialog: (params) => set({ ...params, isOpenDialog: true }),
  closeDialog: () => set({ isOpenDialog: false }),
  reset: () => set(initialState),
}));

/**
 * # openDialog
 * ---
 * - 간단설명: alert, confirm dialog를 표시하는 함수
 * ---
 * @param params - 다이얼로그에 전달할 파라미터 (IDialogParams의 일부)
 * @example
 * openDialog({ type: 'confirm', title: '삭제', message: '정말 삭제하시겠습니까?' });
 */
export const openDialog = (params: Partial<IDialogParams>) => {
  useConfirmDialog.getState().openDialog({
    type: 'alert',
    title: '',
    message: '',
    okLabel: '확인',
    cancelLabel: '취소',
    ...params,
  });
};

/**
 * # closeDialog
 * ---
 * - 간단설명: 열린 dialog를 닫는 함수
 * ---
 */
export const closeDialog = () => {
  useConfirmDialog.getState().closeDialog();
};

/**
 * # Dialog
 * ---
 * - 간단설명: 전역 alert/confirm dialog 컴포넌트
 * - 제약사항 및 특이사항: 앱 루트에 한 번만 배치하여 사용
 * ---
 * @example
 * // 앱 루트에 배치
 * <Dialog />
 *
 * // 사용
 * openDialog({ type: 'confirm', title: '삭제', message: '삭제하시겠습니까?' });
 */
export default function Dialog() {
  const {
    isOpenDialog,
    type,
    title,
    message,
    okLabel,
    cancelLabel,
    autoClose,
    okFn,
    okClassName,
    cancelFn,
    closeDialog,
  } = useStore(useConfirmDialog);

  const handleOk = useCallback(() => {
    if (okFn) {
      okFn();
      if (autoClose) closeDialog();
    } else {
      closeDialog();
    }
    useConfirmDialog.getState().reset();
  }, [okFn, autoClose, closeDialog]);

  const handleCancel = useCallback(() => {
    if (cancelFn) {
      cancelFn();
      if (autoClose) closeDialog();
    } else {
      closeDialog();
    }
    useConfirmDialog.getState().reset();
  }, [cancelFn, autoClose, closeDialog]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleOk();
      }
    };

    if (isOpenDialog) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpenDialog, handleOk]);

  return (
    <Modal
      open={isOpenDialog}
      onOpenChange={(open) => { if (!open) closeDialog(); }}
      hideCloseButton
      overlayZIndex={9999}
      size="md"
    >
      {title && <p className="text-xl font-bold">{title}</p>}
      {message && <div className="text-sm text-ods-secondary overflow-y-auto scrollbar-hide">{message}</div>}
      {!message && <div className="pt-2" />}
      <div className="flex w-full justify-end gap-2">
        {type === 'confirm' && (
          <Button
            onClick={handleCancel}
            type="button"
          >
            {cancelLabel || '취소'}
          </Button>
        )}
        <Button
          onClick={handleOk}
          type="button"
        >
          {okLabel || '확인'}
        </Button>
      </div>
    </Modal>
  );
}
