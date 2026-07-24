import { Meta, StoryObj } from '@storybook/react';
import Dialog, { openDialog } from '.';
import Button from '../Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Dialog />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Dialog>;

/** Alert — 확인 버튼만 표시 */
export const Alert: Story = {
  render: () => (
    <Button
      styleClass={{ root: 'px-4 py-2 bg-gray-900 text-white rounded-lg text-sm' }}
      onClick={() =>
        openDialog({
          type: 'alert',
          title: '알림',
          message: '작업이 완료되었습니다.',
        })
      }
    >
      Alert 열기
    </Button>
  ),
};

/** Confirm — 확인 + 취소 버튼 표시 */
export const Confirm: Story = {
  render: () => (
    <Button
      styleClass={{ root: 'px-4 py-2 bg-gray-900 text-white rounded-lg text-sm' }}
      onClick={() =>
        openDialog({
          type: 'confirm',
          title: '삭제 확인',
          message: '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
          okLabel: '삭제',
          cancelLabel: '취소',
          okClassName: 'bg-red-500 text-white px-4 py-2 rounded text-sm hover:opacity-80',
        })
      }
    >
      Confirm 열기
    </Button>
  ),
};

/** 커스텀 콜백 — okFn, cancelFn 지정 */
export const WithCallbacks: Story = {
  render: () => (
    <Button
      styleClass={{ root: 'px-4 py-2 bg-gray-900 text-white rounded-lg text-sm' }}
      onClick={() =>
        openDialog({
          type: 'confirm',
          title: '저장',
          message: '변경 사항을 저장하시겠습니까?',
          okLabel: '저장',
          okFn: () => alert('저장 완료'),
          cancelFn: () => alert('취소됨'),
        })
      }
    >
      콜백 Dialog 열기
    </Button>
  ),
};

/** ReactNode 메시지 — message에 JSX 전달 */
export const WithReactNodeMessage: Story = {
  render: () => (
    <Button
      styleClass={{ root: 'px-4 py-2 bg-gray-900 text-white rounded-lg text-sm' }}
      onClick={() =>
        openDialog({
          type: 'alert',
          title: '상세 안내',
          message: (
            <div className="flex flex-col gap-2">
              <p>다음 항목을 확인해주세요:</p>
              <ul className="list-disc pl-4">
                <li>이름이 올바른지 확인</li>
                <li>이메일 형식이 맞는지 확인</li>
              </ul>
            </div>
          ),
        })
      }
    >
      JSX 메시지 Dialog 열기
    </Button>
  ),
};
