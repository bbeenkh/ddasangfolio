import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';

/**
 * 모달, popover Open/close 상태 관리 hook
 * @example
 * <Modal {...dialogProps}>
 * <Popover {...dialogProps}>
 */
export default function useModalState<T>(defaultInitData: T = null) {
  const [isOpen, setIsOpen] = React.useState(false);
  /**
   * 모달에 전달할 id
   * 각 리스트의 정보를 통해 모달 초기화 시 사용
   */
  const [initData, setInitData] = React.useState<T | null>(defaultInitData);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  /**
   * 초기화 데이터와 함께 모달 오픈
   */
  const openModalWithData = (data: T) => {
    setInitData(data);
    setIsOpen(true);
  };

  /**
   * 초기화 데이터 초기화 후 모달 닫기
   */
  const closeModalWithData = () => {
    setInitData(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    dialogProps: {
      open: isOpen,
      onOpenChange: (open: boolean) => setIsOpen(open),
    },
    initData,
    openModalWithData,
    closeModalWithData,
  };
}
