# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 작업 순서: 신규 작업 시, 반드시 다음 플로우를 준수하여 작업 진행할 것
1. 기획&요구사항 정리
- atlassian mcp 사용해 Jira 접근하여 기획 확인
- 전반적 작업 내용은 jira에서 확인
- 브랜치 명은 티켓 이름을 그대로 사용

<!-- - 세부 기획, 제약사항 등은 confluence에서 확인(현재 세팅 안되었으므로 무시)
  - PDR: 기획 및 제약사항 어떻게, 어째서 했는지를 정리하는 문서
  - ADR: 특정 기술 도입 결정을 왜 하였는지 정리하는 문서 -->

2. 디자인: stitch mcp 사용해 화면, ui배치 구성
- 반드시 존재하는 디자인 시스템 기반으로 제작할것, 새로 제작 필요할시는 별도 생성 질문후 진행

3. 개발: Jira, confluence, stitch mcp 통해 작업사항 바탕으로 하여  작업내용 파악
- 개발 과정은 red green refactor 원칙 기반 TDD로 작업 진행할 것
- superpowers의 brainstorming skill 사용하여 기획 구체화 진행
- 커밋 메세지: 내용은 전부 한글로 작성할것

- 개발 방법론: superpowers의 test-driven-development skill 사용하여 TDD로 진행
1. 테스트 desc 작성, 작성후 검토 요청하기
2. 구현하려는 기능의 테스트 작성 
3. 테스트를 통과시키는 최소한의 코드 작성
4. 리팩토링 및 개선

- 중요!: Jsdoc 작성
- 각 작성한 요소의 스펙에 대해 jsdoc 형식의 간단 문서를 작성해야 한다
- 한국어로 작성하며, 함수, 변수, 클래스 등의 경우 요소 바로 위에 작성한다

- 아래의 양식에 따라 작성한다
/** 
 * # 컴포넌트/함수/클래스 이름
   ---
 * - 간단설명: 무슨역할인지 1줄로 설명
   - 제약사항 및 특이사항: 있으면 목록별로 나열
   ---
   @param: 쿼리파라미터
   ex) @param children react children
   ---
 * @example: 간단예제
 * 
 */
 
- type, interface, enum의 경우, jsdoc은 다음과 같은 형태로 작성한다
/**
 * 도서 검색 목록 정렬 기준
 * - ACCURACY = 정확도순
 * - LATEST = 발간일순
 */
export enum FETCH_BOOK_SORT {
	/** 정확도순 */
  ACCURACY = "accuracy",
  /** 발간일순 */
  LATEST = "latest",
}


4. 작업 마무리 및 PR
- 티켓 검토중으로 작업상태 변경
- 각 테스트 진행후 PR 
- AI 가 기본 내용 검토
- 사용자가 최종 검토


## Package Manager & Runtime

- **Package manager**: pnpm 9.0.0 (use `pnpm`, not `npm` or `yarn`)
- **Node.js**: >= 18 required
- **Monorepo tool**: Turborepo — all tasks run through `turbo`

## Common Commands

```bash
# Development
pnpm dev               # Start all dev servers

# Build
pnpm build             # Build all apps and packages

# Lint & Type-check
pnpm lint              # ESLint across all packages
pnpm check-types       # TypeScript type-check across all packages
pnpm format            # Prettier format (*.ts, *.tsx, *.md)

# Run tasks for a specific package only
pnpm --filter @repo/ui build
pnpm --filter web dev
```

## Architecture

This is a **Turborepo monorepo** structured as:

```
apps/         # Applications (web, docs, mobile — currently stubs)
packages/
  ui/         # @repo/ui — shared React 19 component library
  eslint-config/   # Shared ESLint configs (base, next, react-internal)
  typescript-config/  # Shared tsconfig presets (base, nextjs, react-library)
  api/         # stub
  shared/      # stub
  types/       # stub
```

**Key patterns:**
- Apps consume `@repo/ui` components and extend shared configs from `@repo/eslint-config` and `@repo/typescript-config`
- TypeScript strict mode + ES2022 target is enforced via `packages/typescript-config/base.json`
- Turbo task pipeline: `build` depends on upstream `^build`; `dev` runs persistently with no cache

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript 5.9
- **Styling**: (not yet configured — add when decided)
