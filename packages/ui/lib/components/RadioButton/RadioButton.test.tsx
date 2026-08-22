import { render, screen, fireEvent } from '@testing-library/react';
import RadioButton from '.';

describe('RadioButton', () => {
  describe('RadioButton.Group', () => {
    it('렌더링된다', () => {
      const { container } = render(
        <RadioButton.Group>
          <RadioButton.Item value="a" id="rb-a" label="옵션 A" />
        </RadioButton.Group>,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('RadioButton.Item', () => {
    it('radio input이 렌더링된다', () => {
      render(
        <RadioButton.Group>
          <RadioButton.Item value="a" id="rb1" />
        </RadioButton.Group>,
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('label이 렌더링된다', () => {
      render(
        <RadioButton.Group>
          <RadioButton.Item value="a" id="rb1" label="옵션 A" />
        </RadioButton.Group>,
      );
      expect(screen.getByText('옵션 A')).toBeInTheDocument();
    });

    it('checked 상태가 적용된다', () => {
      render(
        <RadioButton.Group value="a">
          <RadioButton.Item value="a" id="rb1" />
        </RadioButton.Group>,
      );
      expect(screen.getByRole('radio')).toBeChecked();
    });

    it('unchecked 상태가 적용된다', () => {
      render(
        <RadioButton.Group value="b">
          <RadioButton.Item value="a" id="rb1" />
        </RadioButton.Group>,
      );
      expect(screen.getByRole('radio')).not.toBeChecked();
    });

    it('onValueChange가 호출된다', () => {
      const onValueChange = vi.fn();
      render(
        <RadioButton.Group onValueChange={onValueChange}>
          <RadioButton.Item value="a" id="rb1" />
        </RadioButton.Group>,
      );
      fireEvent.click(screen.getByRole('radio'));
      expect(onValueChange).toHaveBeenCalledWith('a');
    });

    it('disabled 상태가 적용된다', () => {
      render(
        <RadioButton.Group>
          <RadioButton.Item value="a" id="rb1" disabled />
        </RadioButton.Group>,
      );
      expect(screen.getByRole('radio')).toBeDisabled();
    });

    it('label htmlFor가 id와 연결된다', () => {
      render(
        <RadioButton.Group>
          <RadioButton.Item value="a" id="my-rb" label="선택" />
        </RadioButton.Group>,
      );
      const label = screen.getByText('선택');
      expect(label).toHaveAttribute('for', 'my-rb');
    });
  });
});
