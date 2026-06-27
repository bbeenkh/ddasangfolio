# @fblg/core-ui 컴포넌트 레퍼런스

UI 컴포넌트를 사용하거나 새로 만들 때 이 스킬을 참조하세요.
기존 컴포넌트를 우선 활용하고, 없는 경우에만 새로 만드세요.

---

## 패키지 정보

- **패키지명**: `@fblg/core-ui`
- **경로**: `packages/ui/lib/`
- **엔트리**: `packages/ui/lib/index.tsx`
- **스타일**: `@fblg/core-ui/styles.css` (CSS 변수 + 기본 스타일)
- **테마**: `@fblg/core-ui/theme.css` (Tailwind 4 @theme 통합)

---

## 컴포넌트 목록

### 1. Button
- **패턴**: 단일 | **기반**: Radix Slot
- **Props**: `children`, `type?`, `styleClass?: { root }`, `asChild?`
- **설명**: 스타일 없는 헤드리스 버튼. `asChild`로 Link 등 Slot 패턴 지원
```tsx
<Button styleClass={{ root: "bg-primary text-white px-4 py-2" }}>클릭</Button>
<Button asChild><Link to="/home">홈으로</Link></Button>
```

### 2. Card (레거시)
- **패턴**: Compound | **기반**: 순수 React
- **하위**: `Card.Header`, `Card.Title`, `Card.Body`, `Card.Footer`
- **Props**: `className?`, `children`
- **스타일**: `bg-white border-[#E2E2E2] rounded-lg`
```tsx
<Card>
  <Card.Header><Card.Title>제목</Card.Title></Card.Header>
  <Card.Body>본문</Card.Body>
  <Card.Footer>하단</Card.Footer>
</Card>
```

### 3. CardUI (shadcn 스타일)
- **패턴**: Named export | **기반**: 순수 React
- **하위**: `CardUI`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`
- **스타일**: `bg-card rounded-xl py-6 gap-6`, `data-slot` 속성 사용
```tsx
import { CardUI, CardHeader, CardTitle, CardContent } from '@fblg/core-ui';
<CardUI>
  <CardHeader><CardTitle>제목</CardTitle></CardHeader>
  <CardContent>내용</CardContent>
</CardUI>
```

### 4. Checkbox
- **패턴**: 단일 | **기반**: Radix Checkbox
- **Props**: `id`, `label?`, `checked?`, `defaultChecked?`, `disabled?`, `onCheckedChange?`, `checkedIcon?`, `uncheckedIcon?`, `disabledIcon?`
```tsx
<Checkbox id="agree" label="동의합니다" onCheckedChange={(v) => setChecked(v)} />
```

### 5. RadioButton
- **패턴**: Compound | **기반**: Radix RadioGroup
- **하위**: `RadioButton.Group`, `RadioButton.Item`
- **Group Props**: Radix RadioGroup.Root 확장 + `className?`
- **Item Props**: `value`, `label?`, `disabled?`, `checkedIcon?`, `uncheckedIcon?`, `disabledIcon?`
```tsx
<RadioButton.Group value={val} onValueChange={setVal}>
  <RadioButton.Item value="a" label="옵션A" />
  <RadioButton.Item value="b" label="옵션B" />
</RadioButton.Group>
```

### 6. Input
- **패턴**: 단일 | **기반**: 순수 React
- **Props**: `prefix?`, `suffix?`, `onEnter?`, `styleClass?: { root, input, icon, prefix, suffix }`
```tsx
<Input prefix={<SearchIcon />} placeholder="검색..." onEnter={handleSearch} />
```

### 7. Skeleton
- **패턴**: Compound | **기반**: 순수 React
- **하위**: `Skeleton.Box`, `Skeleton.Circle`, `Skeleton.Container`
- **Props**: `styleClass?: { root }`
```tsx
<Skeleton.Container>
  <Skeleton.Circle styleClass={{ root: "w-12 h-12" }} />
  <Skeleton.Box styleClass={{ root: "w-full h-4" }} />
</Skeleton.Container>
```

### 8. Fallback
- **패턴**: 단일 | **기반**: 순수 React
- **Props**: `message`, `icon?`, `styleClass?: { root, icon, message }`
```tsx
<Fallback message="검색 결과가 없습니다" icon={<EmptyIcon />} />
```

### 9. Modal
- **패턴**: Compound | **기반**: Radix Dialog
- **하위**: `Modal.Header`, `Modal.Title`, `Modal.Description`, `Modal.Body`, `Modal.Footer`
- **Props**: `triggerUI?`, `hideCloseButton?`, `size?: 'md'|'lg'|'xl'`, `preventOutsideClose?`, `overlayZIndex?`
- **내장**: ErrorBoundary + Suspense
```tsx
<Modal triggerUI={<Button>열기</Button>} size="md">
  <Modal.Header><Modal.Title>모달 제목</Modal.Title></Modal.Header>
  <Modal.Body>내용</Modal.Body>
  <Modal.Footer><Button>확인</Button></Modal.Footer>
</Modal>
```

### 10. Separator
- **패턴**: 단일 | **기반**: Radix Separator
- **Props**: `orientation?: 'horizontal'|'vertical'`, `decorative?`, `className?`
```tsx
<Separator />
<Separator orientation="vertical" className="h-6" />
```

### 11. SwitchButton
- **패턴**: 단일 | **기반**: Radix Switch
- **Props**: Radix Switch.Root 확장 + `styleClass?: { root, thumb }`
- **기본 스타일 포함**: `bg-gray-200` → `bg-gray-900` (체크시)
```tsx
<SwitchButton checked={on} onCheckedChange={setOn} />
```

### 12. Anim
- **패턴**: Compound | **기반**: framer-motion
- **하위**: `Anim.Fade`, `Anim.ScaleFade`
- **Fade Props**: `type?: 'in'|'out'`, `direction?: 'up'|'down'|'left'|'right'`, `duration?`, `delay?`
- **ScaleFade Props**: `type?`, `duration?`, `delay?` (direction 없음)
```tsx
<Anim.Fade type="in" direction="up" duration={0.5}>
  <div>페이드 인</div>
</Anim.Fade>
```

### 13. Layout
- **패턴**: Compound | **기반**: 순수 React
- **하위**: `Layout` (main), `Layout.Header`, `Layout.Body` (flex-1), `Layout.Footer`
- **Props**: `maxWidth?`, `minWidth?`, `styleClass?: { root }`
```tsx
<Layout maxWidth="1200px">
  <Layout.Header>헤더</Layout.Header>
  <Layout.Body>메인 콘텐츠</Layout.Body>
  <Layout.Footer>푸터</Layout.Footer>
</Layout>
```

### 14. Popover
- **패턴**: Compound | **기반**: Radix Popover
- **하위**: `Popover.Root`, `Popover.Trigger`, `Popover.Content`, `Popover.Close`, `Popover.Arrow`, `Popover.Portal`, `Popover.Anchor`
- **Content**: Portal + Arrow 자동 포함, `side='bottom'`, `sideOffset=8`
```tsx
<Popover.Root>
  <Popover.Trigger>열기</Popover.Trigger>
  <Popover.Content>팝오버 내용</Popover.Content>
</Popover.Root>
```

### 15. Selectbox
- **패턴**: 단일 | **기반**: Radix Select
- **Props**: `value?`, `options: { label, value }[]`, `onSelect`, `placeholder?`, `styleClass?: { trigger, content, item, viewport }`
```tsx
<Selectbox options={[{ label: "A", value: "a" }]} onSelect={setVal} placeholder="선택" />
```

### 16. Spinner
- **패턴**: 단일 | **기반**: 순수 React (SVG)
- **Props**: `size?: 'xs'|'sm'|'lg'|'xl'`, `className?`
- **크기**: xs=16px, sm=20px, lg=24px(기본), xl=32px
```tsx
<Spinner size="sm" />
```

### 17. Tab
- **패턴**: Compound | **기반**: Radix Tabs
- **하위**: `Tab.Root`, `Tab.List`, `Tab.Trigger`, `Tab.Content`
```tsx
<Tab.Root defaultValue="tab1">
  <Tab.List>
    <Tab.Trigger value="tab1">탭1</Tab.Trigger>
    <Tab.Trigger value="tab2">탭2</Tab.Trigger>
  </Tab.List>
  <Tab.Content value="tab1">탭1 내용</Tab.Content>
  <Tab.Content value="tab2">탭2 내용</Tab.Content>
</Tab.Root>
```

### 18. Toast
- **패턴**: Compound | **기반**: Radix Toast
- **하위**: `Toast.Provider`
- **Props**: `open`, `onOpenChange`, `message`, `styleClass?: { root, viewport }`
```tsx
<Toast.Provider open={show} onOpenChange={setShow} message="저장되었습니다">
  {children}
</Toast.Provider>
```

### 19. Gutter
- **패턴**: 단일 | **기반**: 순수 React
- **Props**: `padding?`, `paddingX?`, `paddingY?`, `gap?`, `direction?: 'row'|'column'`
- **SpaceToken**: `'xs'|'sm'|'md'|'lg'|'xl'|'2xl'` (4/8/16/24/32/48px)
```tsx
<Gutter padding="md" gap="sm" direction="column">
  <div>아이템1</div>
  <div>아이템2</div>
</Gutter>
```

### 20. Accordion
- **패턴**: Compound | **기반**: Radix Accordion
- **하위**: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- **스타일**: 하단 보더, 셰브론 아이콘 회전 애니메이션
```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>섹션 1</AccordionTrigger>
    <AccordionContent>내용 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

### 21. ContextMenu
- **패턴**: Compound | **기반**: Radix ContextMenu
- **하위**: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuGroup`, `ContextMenuPortal`, `ContextMenuRadioGroup`
```tsx
<ContextMenu>
  <ContextMenuTrigger>우클릭 영역</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>항목1</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>항목2</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### 22. DropdownMenu
- **패턴**: Compound | **기반**: Radix DropdownMenu
- **하위**: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuRadioGroup`
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>항목1</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>항목2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Hooks

### useInfiniteScroll
- **Props**: `onTriggered`, `isLoading?`, `hasNextPage?`, `threshold?` (0~1, 기본 0.1)
- **반환**: `{ InfiniteScrollWrapper }`
```tsx
const { InfiniteScrollWrapper } = useInfiniteScroll({
  onTriggered: fetchNextPage,
  isLoading,
  hasNextPage,
});
return <InfiniteScrollWrapper>{items}</InfiniteScrollWrapper>;
```

---

## 유틸리티

| 함수 | 설명 | 사용법 |
|------|------|--------|
| `cn(...inputs)` | classnames + tailwind-merge | `cn("p-4", active && "bg-blue")` |
| `formatedDate(date, format?)` | dayjs 포맷 (기본 'YYYY-MM-DD') | `formatedDate(new Date(), 'MM/DD')` |
| `today` | 현재 날짜 Date 객체 | `formatedDate(today)` |
| `truncateString({ value, limit?, attach? })` | 문자열 자르기 (기본 3자, '...') | `truncateString({ value: "긴텍스트", limit: 5 })` |

---

## 디자인 토큰 (CSS 변수)

### 스페이싱
| 토큰 | 값 |
|------|-----|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

### 컬러 (Luminous Fintech)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | #00687a | 주요 색상 |
| `--color-primary-container` | #06b6d4 | 주요 컨테이너 |
| `--color-secondary` | #006b5f | 보조 색상 |
| `--color-error` | #ba1a1a | 에러 |
| `--color-profit` | #ef4444 | 수익 (빨강) |
| `--color-loss` | #3b82f6 | 손실 (파랑) |

### 타이포그래피
- **Heading**: "Plus Jakarta Sans"
- **Body**: "Inter"
- 스케일: Display Large, Headline Large/Medium, Body Large/Medium/Small, Label Medium/Small

### 라운딩
| 토큰 | 값 |
|------|-----|
| `--rounded-sm` | 0.25rem |
| `--rounded-default` | 0.5rem |
| `--rounded-md` | 0.75rem |
| `--rounded-lg` | 1rem |
| `--rounded-xl` | 1.5rem |
| `--rounded-full` | 9999px |

### 레이아웃
| 토큰 | 값 |
|------|-----|
| `--drawer-width` | 12.5em |
| `--header-height` | 4em |
| `--footer-height` | 6em |
| `--layout-padding` | 1.5em |
| `--body-padding` | 1.5em |

---

## 아키텍처 패턴

1. **헤드리스 디자인**: 대부분 기본 스타일 없음. `styleClass` 또는 `className` + `cn()`으로 스타일링
2. **Compound Component**: Modal, Card, Anim, Layout, Tab 등 하위 컴포넌트 패턴
3. **Radix UI 기반**: 인터랙티브 컴포넌트는 Radix 프리미티브 사용 (접근성 보장)
4. **CSS Custom Properties**: 스페이싱·컬러 토큰은 CSS 변수로 일관 관리
5. **Tailwind 4 통합**: `@theme` 블록으로 커스텀 토큰 값 매핑

## 새 컴포넌트 추가 체크리스트

1. `packages/ui/lib/components/<Name>/index.tsx` 생성
2. JSDoc 작성 (한국어, CLAUDE.md 양식 준수)
3. `packages/ui/lib/index.tsx`에 export 추가
4. Radix 프리미티브 우선 사용, 순수 React는 단순 UI만
5. `styleClass` 패턴으로 스타일 주입 지원
6. Compound 패턴 사용 시 하위 컴포넌트를 dot notation으로 노출
