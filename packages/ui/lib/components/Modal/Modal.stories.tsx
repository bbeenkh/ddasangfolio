import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from '.';
import useModalState from './useModalState';
import Button from '../Button';
import Input from '../Input';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'lg', 'xl'],
      description: '모달 너비 (md: 600px, lg: 900px, xl: 1200px)',
    },
    hideCloseButton: {
      control: 'boolean',
      description: '우상단 닫기 버튼 숨김',
    },
    preventOutsideClose: {
      control: 'boolean',
      description: 'true 시 외부 클릭·Escape로 닫히지 않음',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

/** 기본 — 제목 + 본문 + 푸터 */
export const Default: Story = {
  render: (args) => {
    const { openModal, dialogProps } = useModalState();
    return (
      <>
        <Button onClick={openModal}>모달 열기</Button>
        <Modal {...args} {...dialogProps}>
          <Modal.Header>
            <Modal.Title>모달 제목</Modal.Title>
            <Modal.Description>모달에 대한 부가 설명을 여기에 작성합니다.</Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-gray-700">모달 본문 내용입니다.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button>취소</Button>
            <Button>확인</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  args: { size: 'md' },
};

/** 사이즈 — lg (900px) */
export const LargeSize: Story = {
  render: (args) => {
    const { openModal, dialogProps } = useModalState();
    return (
      <>
        <Button onClick={openModal}>큰 모달 열기</Button>
        <Modal {...args} {...dialogProps}>
          <Modal.Header>
            <Modal.Title>넓은 모달</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-gray-700">size=&quot;lg&quot;로 지정된 모달입니다 (900px).</p>
          </Modal.Body>
        </Modal>
      </>
    );
  },
  args: { size: 'lg' },
};

/** 닫기 버튼 숨김 — 푸터 버튼으로만 닫기 */
export const HideCloseButton: Story = {
  render: () => {
    const { openModal, closeModal, dialogProps } = useModalState();
    return (
      <>
        <Button onClick={openModal}>열기</Button>
        <Modal {...dialogProps} hideCloseButton>
          <Modal.Header>
            <Modal.Title>닫기 버튼 없음</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-gray-700">푸터의 버튼으로만 닫을 수 있습니다.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModal}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

/** 외부 클릭 닫힘 방지 */
export const PreventOutsideClose: Story = {
  render: (args) => {
    const { openModal, dialogProps } = useModalState();
    return (
      <>
        <Button onClick={openModal}>열기</Button>
        <Modal {...args} {...dialogProps}>
          <Modal.Header>
            <Modal.Title>외부 클릭 방지</Modal.Title>
            <Modal.Description>overlay 클릭 또는 Escape 키로 닫히지 않습니다.</Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-gray-700">닫기 버튼(×)으로만 닫을 수 있습니다.</p>
          </Modal.Body>
        </Modal>
      </>
    );
  },
  args: { preventOutsideClose: true },
};

/** 제어 모드 (useModalState) */
export const Controlled: Story = {
  render: () => {
    const { isOpen, openModal, closeModal, dialogProps } = useModalState();
    return (
      <div className="flex flex-col gap-4">
        <Button onClick={openModal}>외부에서 열기</Button>
        <Modal {...dialogProps}>
          <Modal.Header>
            <Modal.Title>제어 모드 모달</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-gray-700">open 상태: {String(isOpen)}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModal}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};

/** 테이블 행 편집 — CTA 버튼으로 모달 열어 데이터 수정 */
export const TableEditModal: Story = {
  render: () => {
    const { initData, openModalWithData, closeModalWithData, dialogProps } =
      useModalState<{ id: number; name: string; email: string; role: string }>();

    const [rows, setRows] = useState([
      { id: 1, name: '김철수', email: 'cs@example.com', role: '관리자' },
      { id: 2, name: '이영희', email: 'yh@example.com', role: '편집자' },
      { id: 3, name: '박민수', email: 'ms@example.com', role: '뷰어' },
    ]);

    const [draft, setDraft] = useState({ name: '', email: '', role: '' });

    const handleOpen = (row: (typeof rows)[number]) => {
      setDraft({ name: row.name, email: row.email, role: row.role });
      openModalWithData(row);
    };

    const handleSave = () => {
      if (!initData) return;
      setRows((prev) => prev.map((r) => (r.id === initData.id ? { ...r, ...draft } : r)));
      closeModalWithData();
    };

    const cellStyle = 'border border-gray-200 px-4 py-2 text-sm';

    return (
      <>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className={cellStyle}>이름</th>
              <th className={cellStyle}>이메일</th>
              <th className={cellStyle}>역할</th>
              <th className={cellStyle}>관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={cellStyle}>{row.name}</td>
                <td className={cellStyle}>{row.email}</td>
                <td className={cellStyle}>{row.role}</td>
                <td className={cellStyle}>
                  <Button onClick={() => handleOpen(row)}>설정</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal {...dialogProps}>
          <Modal.Header>
            <Modal.Title>{initData?.name} 정보 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-3 w-full">
              <label className="flex flex-col gap-1 text-sm">
                이름
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                이메일
                <Input
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                역할
                <Input
                  value={draft.role}
                  onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                />
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModalWithData}>취소</Button>
            <Button onClick={handleSave}>저장</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

/** initData를 활용한 모달 — openModalWithData로 데이터 전달 */
export const WithInitData: Story = {
  render: () => {
    const { initData, closeModalWithData, openModalWithData, dialogProps } =
      useModalState<{ name: string; id: number }>();
    return (
      <div className="flex gap-2">
        {[
          { name: '항목 A', id: 1 },
          { name: '항목 B', id: 2 },
        ].map((item) => (
          <Button key={item.id} onClick={() => openModalWithData(item)}>
            {item.name} 열기
          </Button>
        ))}
        <Modal {...dialogProps}>
          <Modal.Header>
            <Modal.Title>데이터 전달 모달</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-gray-700">
              선택: {initData?.name} (id: {initData?.id})
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeModalWithData}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};
