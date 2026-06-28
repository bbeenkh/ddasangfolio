import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Button,
  Card,
  Input,
  Separator,
  Checkbox,
  Skeleton,
  SwitchButton,
  Typo,
} from '../shared/ui'

export const Route = createFileRoute('/component-test')({
  component: ComponentTestPage,
})

/**
 * # ComponentTestPage
 * ---
 * - 간단설명: Luminous Fintech 디자인 시스템 컴포넌트 프리뷰 페이지
 * - 제약사항: 개발 전용 페이지, 프로덕션 배포 시 제외 권장
 */
function ComponentTestPage() {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [switchOn, setSwitchOn] = useState(false)

  return (
    <div className="min-h-screen bg-lf-surface py-8 px-4">
      <div className="max-w-[600px] mx-auto space-y-12">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.01em] text-lf-on-surface font-[Plus_Jakarta_Sans,ui-sans-serif,system-ui,sans-serif]">
            Component Test
          </h1>
          <p className="text-[16px] text-lf-on-surface-variant mt-2">
            Luminous Fintech 디자인 시스템 컴포넌트 프리뷰
          </p>
        </div>

        {/* ===== Button ===== */}
        <section className="space-y-4">
          <SectionTitle>Button</SectionTitle>

          <div className="space-y-3">
            <SubLabel>Primary</SubLabel>
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary">확인</Button>
              <Button variant="primary" disabled>
                비활성
              </Button>
            </div>

            <SubLabel>Secondary</SubLabel>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary">취소</Button>
              <Button variant="secondary" disabled>
                비활성
              </Button>
            </div>

            <SubLabel>Ghost</SubLabel>
            <div className="flex gap-3 flex-wrap">
              <Button variant="ghost">더보기</Button>
              <Button variant="ghost" disabled>
                비활성
              </Button>
            </div>

            <SubLabel>Full Width Primary</SubLabel>
            <Button
              variant="primary"
              styleClass={{ root: 'w-full py-5 text-lg rounded-xl' }}
            >
              내 스노우볼에 추가하기 →
            </Button>
          </div>
        </section>

        <Separator />

        {/* ===== Card ===== */}
        <section className="space-y-4">
          <SectionTitle>Card</SectionTitle>

          <Card>
            <Card.Header>
              <Card.Title>총 자산</Card.Title>
              <span className="text-sm font-semibold text-lf-primary-container">
                +1.8%
              </span>
            </Card.Header>
            <Card.Body>
              <div>
                <p className="text-[28px] font-bold text-lf-on-surface">
                  158,420,000원
                </p>
                <p className="text-sm text-lf-on-surface-variant mt-1">
                  평가 손익
                </p>
                <p className="text-lg font-semibold text-lf-profit">
                  +2,450,000원
                </p>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>이번 달 배당금</Card.Title>
            </Card.Header>
            <Card.Body>
              <div>
                <p className="text-sm text-lf-on-surface-variant">
                  세후 기준 예상 금액
                </p>
                <p className="text-[32px] font-bold text-lf-on-surface">
                  1,240,500<span className="text-lg">원</span>
                </p>
              </div>
            </Card.Body>
            <Card.Footer className="relative p-6">
              <span className="text-sm text-lf-on-surface-variant">
                다음 배당일: 2024.07.15
              </span>
            </Card.Footer>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="h-auto">
              <Card.Header>
                <Card.Title className="text-sm">스노우볼 성장</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="h-16 w-full bg-gradient-to-r from-lf-primary-container/10 to-lf-primary-gradient-end/10 rounded-lg" />
              </Card.Body>
            </Card>
            <Card className="h-auto">
              <Card.Header>
                <Card.Title className="text-sm">절세 혜택</Card.Title>
              </Card.Header>
              <Card.Body>
                <div>
                  <p className="text-2xl font-bold text-lf-on-surface">
                    42.5<span className="text-sm">%</span>
                  </p>
                  <p className="text-xs text-lf-on-surface-variant mt-1">
                    ISA 한도 활용중
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ===== Input ===== */}
        <section className="space-y-4">
          <SectionTitle>Input</SectionTitle>

          <SubLabel>White</SubLabel>
          <Input variant="white" placeholder="금액을 입력하세요" />

          <SubLabel>White with suffix</SubLabel>
          <Input
            variant="white"
            placeholder="0"
            suffix={
              <span className="text-lf-on-surface-variant text-sm font-medium">
                원
              </span>
            }
          />

          <SubLabel>Gray</SubLabel>
          <Input variant="gray" placeholder="종목명 또는 티커 검색" />

          <SubLabel>Gray with prefix</SubLabel>
          <Input
            variant="gray"
            placeholder="종목명 또는 티커 검색"
            prefix={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            }
          />

          <SubLabel>Disabled</SubLabel>
          <Input
            variant="white"
            placeholder="비활성 입력"
            disabled
            styleClass={{ root: 'opacity-50 cursor-not-allowed' }}
          />
        </section>

        <Separator />

        {/* ===== Checkbox ===== */}
        <section className="space-y-4">
          <SectionTitle>Checkbox</SectionTitle>

          <div className="space-y-3">
            <Checkbox
              id="check-1"
              label="미체크 상태"
              checked={checked1}
              onCheckedChange={setChecked1}
            />
            <Checkbox
              id="check-2"
              label="체크 상태"
              checked={checked2}
              onCheckedChange={setChecked2}
            />
            <Checkbox id="check-3" label="비활성 상태" disabled />
          </div>
        </section>

        <Separator />

        {/* ===== SwitchButton ===== */}
        <section className="space-y-4">
          <SectionTitle>SwitchButton</SectionTitle>

          <div className="flex items-center gap-4">
            <SwitchButton checked={switchOn} onCheckedChange={setSwitchOn} />
            <span className="text-sm text-lf-on-surface-variant">
              {switchOn ? 'ON' : 'OFF'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <SwitchButton defaultChecked disabled />
            <span className="text-sm text-lf-on-surface-variant">
              비활성 (ON)
            </span>
          </div>
        </section>

        <Separator />

        {/* ===== Skeleton ===== */}
        <section className="space-y-4">
          <SectionTitle>Skeleton</SectionTitle>

          <Card className="h-auto">
            <Card.Body>
              <Skeleton.Container styleClass={{ root: 'space-y-4 w-full' }}>
                <div className="flex items-center gap-4">
                  <Skeleton.Circle />
                  <div className="flex-1 space-y-2">
                    <Skeleton.Box styleClass={{ root: 'w-3/4 h-4' }} />
                    <Skeleton.Box styleClass={{ root: 'w-1/2 h-3' }} />
                  </div>
                </div>
                <Skeleton.Box styleClass={{ root: 'w-full h-20' }} />
                <div className="flex gap-3">
                  <Skeleton.Box
                    styleClass={{ root: 'w-1/3 h-8 rounded-full' }}
                  />
                  <Skeleton.Box
                    styleClass={{ root: 'w-1/3 h-8 rounded-full' }}
                  />
                </div>
              </Skeleton.Container>
            </Card.Body>
          </Card>
        </section>

        <Separator />

        {/* ===== Separator ===== */}
        <section className="space-y-4">
          <SectionTitle>Separator</SectionTitle>

          <div className="bg-white rounded-[16px] p-6 border border-lf-outline-variant">
            <p className="text-sm text-lf-on-surface-variant">항목 A</p>
            <Separator className="my-4" />
            <p className="text-sm text-lf-on-surface-variant">항목 B</p>
            <Separator className="my-4" />
            <p className="text-sm text-lf-on-surface-variant">항목 C</p>
          </div>
        </section>

        {/* ===== 컬러팔레트 ===== */}
        <section className="space-y-4">
          <SectionTitle>Color Palette</SectionTitle>

          <SubLabel>Primary</SubLabel>
          <div className="flex gap-2 flex-wrap">
            <ColorSwatch color="#00687a" label="Primary" />
            <ColorSwatch color="#06b6d4" label="Primary Container" />
            <ColorSwatch color="#4cd7f6" label="Inverse Primary" />
            <ColorSwatch color="#acedff" label="Primary Fixed" />
          </div>

          <SubLabel>Secondary</SubLabel>
          <div className="flex gap-2 flex-wrap">
            <ColorSwatch color="#006b5f" label="Secondary" />
            <ColorSwatch color="#62fae3" label="Secondary Container" />
            <ColorSwatch color="#3cddc7" label="Secondary Fixed Dim" />
          </div>

          <SubLabel>Surface</SubLabel>
          <div className="flex gap-2 flex-wrap">
            <ColorSwatch color="#f8f9ff" label="Surface" border />
            <ColorSwatch color="#ffffff" label="Container Lowest" border />
            <ColorSwatch color="#e6eeff" label="Container" />
            <ColorSwatch color="#d5e3fc" label="Container Highest" />
          </div>

          <SubLabel>Financial Status</SubLabel>
          <div className="flex gap-2 flex-wrap">
            <ColorSwatch color="#ef4444" label="Profit (상승)" />
            <ColorSwatch color="#3b82f6" label="Loss (하락)" />
          </div>

          <SubLabel>Error</SubLabel>
          <div className="flex gap-2 flex-wrap">
            <ColorSwatch color="#ba1a1a" label="Error" />
            <ColorSwatch color="#ffdad6" label="Error Container" />
          </div>
        </section>

        {/* 
        ===== 타이포그래피 ===== 
        
        
        
        */}
        <section className="space-y-4">
          <SectionTitle>Typography</SectionTitle>

          <div className="space-y-6 bg-white rounded-[16px] p-6 border border-lf-outline-variant">
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Display Large — Plus Jakarta Sans 48/60 Bold
              </span>
              <Typo.DL>1,240,500원</Typo.DL>
            </div>
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Headline Large — Plus Jakarta Sans 32/40 Bold
              </span>
              <Typo.HL>내 포트폴리오</Typo.HL>
            </div>
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Headline Medium — Plus Jakarta Sans 24/32 Semibold
              </span>
              <Typo.HM>보유 종목</Typo.HM>
            </div>
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Body Large — Inter 18/28 Regular
              </span>
              <Typo.BL>
                현재 배당금을 전액 재투자할 경우, 5년 뒤 월 배당금은 약
                245만원으로 성장합니다.
              </Typo.BL>
            </div>
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Body Medium — Inter 16/24 Regular
              </span>
              <Typo.BM>
                추정치이며 투자·세무 자문이 아닙니다. 데이터 지연이 발생할 수
                있습니다.
              </Typo.BM>
            </div>
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Body Small — Inter 14/20 Regular
              </span>
              <Typo.BS>1,240주 · 평균단가 10,240원</Typo.BS>
            </div>
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Label Medium — Inter 14/20 Semibold
              </span>
              <Typo.LM>전체보기</Typo.LM>
            </div>
            <div>
              <span className="text-xs text-lf-on-surface-muted uppercase tracking-wide">
                Label Small — Inter 12/16 Medium
              </span>
              <Typo.LS>ISA 한도 활용중</Typo.LS>
            </div>
          </div>
        </section>

        <div className="h-16" />
      </div>
    </div>
  )
}

/** 섹션 제목 */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[24px] font-semibold leading-[32px] font-[Plus_Jakarta_Sans,ui-sans-serif,system-ui,sans-serif] text-lf-on-surface">
      {children}
    </h2>
  )
}

/** 소제목 라벨 */
function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-medium text-lf-on-surface-muted uppercase tracking-wide mt-2">
      {children}
    </p>
  )
}

/** 컬러 스워치 */
function ColorSwatch({
  color,
  label,
  border,
}: {
  color: string
  label: string
  border?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-14 h-14 rounded-lg ${border ? 'border border-lf-outline' : ''}`}
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] text-lf-on-surface-variant text-center leading-tight max-w-[60px]">
        {label}
      </span>
      <span className="text-[10px] text-lf-on-surface-muted font-mono">
        {color}
      </span>
    </div>
  )
}
