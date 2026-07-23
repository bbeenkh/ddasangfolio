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
    openDialog: _openDialog, // eslint-disable-line @typescript-eslint/no-unused-vars
    closeDialog,
  } = useStore(useConfirmDialog);

  const handleOk = useCallback(() => {
    if (okFn) {
      okFn();
      if (autoClose) {
        closeDialog();
      }
    } else {
      closeDialog();
    }

    useConfirmDialog.getState().reset();
  }, [okFn, autoClose, closeDialog]);

  const handleCancel = useCallback(() => {
    if (cancelFn) {
      cancelFn();
      if (autoClose) {
        closeDialog();
      }
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
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
      }
    };

    if (isOpenDialog) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpenDialog, handleOk, closeDialog]);

  return (
    <Modal
      open={isOpenDialog}
      onOpenChange={closeDialog}
      hideCloseButton
      overlayZIndex={9999}
      className="w-fit max-w-[600px] sm:w-[90vw] sm:max-w-[600px] !h-auto sm:!h-auto sm:!max-h-[90vh] overflow-hidden"
    >
      <Modal.Body className="overflow-y-auto scrollbar-hide">
        <Modal.Header>
          {title && <p className="text-xl font-bold">{title}</p>}
        </Modal.Header>
        {message && <div className="mb-2 text-sm text-ods-secondary w-full">{message}</div>}
        {!message && <div className="pt-2" />}
        <Modal.Footer>
          <div className="w-full flex justify-end gap-2">
            {type === 'confirm' && (
              <Button
                styleClass={{ root: 'px-4 py-2 rounded text-sm hover:opacity-80' }}
                onClick={handleCancel}
                type="button"
              >
                {cancelLabel || '취소'}
              </Button>
            )}
            <Button
              onClick={handleOk}
              type="button"
              styleClass={{ root: okClassName || 'bg-blue-500 text-white px-4 py-2 rounded text-sm hover:opacity-80' }}
            >
              {okLabel || '확인'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
}
