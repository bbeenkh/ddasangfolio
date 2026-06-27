import { render, screen } from '@testing-library/react';
import Gutter from '.';

describe('Gutter', () => {
  describe('기본 렌더링', () => {
    it('children을 렌더링한다', () => {
      render(
        <Gutter>
          <span>내용</span>
        </Gutter>,
      );
      expect(screen.getByText('내용')).toBeInTheDocument();
    });

    it('div 요소로 렌더링된다', () => {
      render(
        <Gutter data-testid="gutter">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.tagName).toBe('DIV');
    });

    it('기본 direction이 column이다', () => {
      render(
        <Gutter data-testid="gutter">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.flexDirection).toBe('column');
    });

    it('display가 flex이다', () => {
      render(
        <Gutter data-testid="gutter">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el).toHaveStyle({ display: 'flex' });
    });
  });

  describe('padding', () => {
    it('padding prop이 상하좌우에 적용된다', () => {
      render(
        <Gutter data-testid="gutter" padding="md">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.padding).toBe('var(--space-md)');
    });

    it('paddingX가 좌우 padding에 적용된다', () => {
      render(
        <Gutter data-testid="gutter" paddingX="lg">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.paddingLeft).toBe('var(--space-lg)');
      expect(el.style.paddingRight).toBe('var(--space-lg)');
    });

    it('paddingY가 상하 padding에 적용된다', () => {
      render(
        <Gutter data-testid="gutter" paddingY="sm">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.paddingTop).toBe('var(--space-sm)');
      expect(el.style.paddingBottom).toBe('var(--space-sm)');
    });

    it('paddingX/paddingY가 padding보다 우선 적용된다', () => {
      render(
        <Gutter data-testid="gutter" padding="xs" paddingX="xl" paddingY="lg">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.paddingLeft).toBe('var(--space-xl)');
      expect(el.style.paddingRight).toBe('var(--space-xl)');
      expect(el.style.paddingTop).toBe('var(--space-lg)');
      expect(el.style.paddingBottom).toBe('var(--space-lg)');
    });

    it('paddingX만 지정하면 상하는 padding 값이 적용된다', () => {
      render(
        <Gutter data-testid="gutter" padding="sm" paddingX="xl">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.paddingLeft).toBe('var(--space-xl)');
      expect(el.style.paddingRight).toBe('var(--space-xl)');
      expect(el.style.paddingTop).toBe('var(--space-sm)');
      expect(el.style.paddingBottom).toBe('var(--space-sm)');
    });
  });

  describe('gap', () => {
    it('gap prop이 적용된다', () => {
      render(
        <Gutter data-testid="gutter" gap="md">
          <span>A</span>
          <span>B</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.gap).toBe('var(--space-md)');
    });

    it('gap이 없으면 gap 스타일이 설정되지 않는다', () => {
      render(
        <Gutter data-testid="gutter">
          <span>A</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.gap).toBe('');
    });
  });

  describe('direction', () => {
    it('direction="row"이 적용된다', () => {
      render(
        <Gutter data-testid="gutter" direction="row">
          <span>A</span>
          <span>B</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.flexDirection).toBe('row');
    });

    it('direction="column"이 적용된다', () => {
      render(
        <Gutter data-testid="gutter" direction="column">
          <span>A</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.flexDirection).toBe('column');
    });
  });

  describe('className 병합', () => {
    it('className이 cn()을 통해 병합된다', () => {
      render(
        <Gutter data-testid="gutter" className="bg-red-500 rounded-lg">
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el).toHaveClass('bg-red-500');
      expect(el).toHaveClass('rounded-lg');
    });

    it('className 없이도 렌더링된다', () => {
      render(
        <Gutter data-testid="gutter">
          <span>내용</span>
        </Gutter>,
      );
      expect(screen.getByTestId('gutter')).toBeInTheDocument();
    });
  });

  describe('모든 SpaceToken 값', () => {
    const tokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

    it.each(tokens)('padding="%s"가 올바른 CSS 변수로 매핑된다', (token) => {
      render(
        <Gutter data-testid="gutter" padding={token}>
          <span>내용</span>
        </Gutter>,
      );
      const el = screen.getByTestId('gutter');
      expect(el.style.padding).toBe(`var(--space-${token})`);
    });
  });
});
