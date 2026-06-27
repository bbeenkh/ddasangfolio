# Gutter 컴포넌트 설계

## 개요

자식 요소를 감싸서 padding과 gap을 기존 spacing 토큰(`--space-xs` ~ `--space-2xl`) 기반으로 일관 적용하는 Wrapper 컴포넌트.
`packages/ui`(`@fblg/core-ui`)에 추가하여 프로젝트 전반의 여백을 통일한다.

## Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `padding` | `SpaceToken` | - | 상하좌우 동일 padding |
| `paddingX` | `SpaceToken` | - | 좌우 padding (`padding`보다 우선) |
| `paddingY` | `SpaceToken` | - | 상하 padding (`padding`보다 우선) |
| `gap` | `SpaceToken` | - | 자식 요소 간 간격 (flex gap) |
| `direction` | `'row' \| 'column'` | `'column'` | flex 방향 |
| `className` | `string` | - | 추가 Tailwind 클래스 (`cn()`으로 병합) |
| `children` | `ReactNode` | - | 자식 요소 |

### SpaceToken

```ts
type SpaceToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

기존 CSS 변수에 매핑:

| Token | CSS Variable | 값 |
|-------|-------------|-----|
| `xs` | `--space-xs` | 4px |
| `sm` | `--space-sm` | 8px |
| `md` | `--space-md` | 16px |
| `lg` | `--space-lg` | 24px |
| `xl` | `--space-xl` | 32px |
| `2xl` | `--space-2xl` | 48px |

## 스타일 적용 방식

- CSS 변수(`var(--space-md)` 등)를 inline style로 매핑
- `paddingX`/`paddingY`가 있으면 `padding`보다 우선 적용
- `cn()` 유틸로 외부 className 병합
- `div` 태그 고정, `display: flex` 기본
- 반응형은 외부에서 Tailwind 클래스로 별도 처리

## 사용 예시

```tsx
// 섹션 간 수직 여백 + 내부 padding
<Gutter padding="lg" gap="md">
  <Card />
  <Card />
</Gutter>

// 페이지 좌우 마진 + 컨텐츠 간격
<Gutter paddingX="xl" paddingY="md" gap="sm">
  <Header />
  <Content />
</Gutter>

// 가로 배치
<Gutter direction="row" gap="sm">
  <Button>A</Button>
  <Button>B</Button>
</Gutter>
```

## 파일 위치

```
packages/ui/lib/components/Gutter/
├── index.tsx
└── Gutter.test.tsx
```

## 결정 사항

- Wrapper 방식 (Spacer 방식 제외)
- 단일 prop + 축별 분리 (`padding` / `paddingX` / `paddingY`)
- 반응형 미지원 (Tailwind로 별도 처리)
- HTML 태그 `div` 고정 (`as` prop 미지원)
