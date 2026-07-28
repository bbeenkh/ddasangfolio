import { Meta, StoryObj } from '@storybook/react';
import Button from '.';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    children: {
      name: '내용',
      control: 'text',
      description: '버튼에 나타낼 내용',
    },
    disabled: {
      name: '비활성화',
      control: 'boolean',
      description: '비활성화 사용 여부 선택',
    },
    asChild: {
      name: 'asChild',
      control: 'boolean',
      description: 'Radix Slot 패턴으로 children 컴포넌트가 button을 대체',
    },
    isLoading: {
      name: '로딩 중',
      control: 'boolean',
      description: 'true 시 children 대신 loadingUI(없으면 Spinner) 표시, 버튼 비활성화',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const DefaultButton: Story = {
  args: {
    children: 'I am Button',
    disabled: false,
    asChild: false,
    styleClass: { root: 'bg-blue-500 text-white px-4 py-2 rounded' },
  },
};

export const LoadingButton: Story = {
  args: {
    children: 'I am Button',
    isLoading: true,
    styleClass: { root: 'bg-blue-500 text-white px-4 py-2 rounded' },
  },
};

export const LoadingWithCustomUI: Story = {
  args: {
    children: 'I am Button',
    isLoading: true,
    loadingUI: <span>로딩 중...</span>,
    styleClass: { root: 'bg-blue-500 text-white px-4 py-2 rounded' },
  },
};
