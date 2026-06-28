import { test, expect } from '@playwright/test'

test.describe('JWT 인증 테스트 페이지', () => {
  test('auth-test 페이지 접근 및 기본 UI 렌더링', async ({ page }) => {
    await page.goto('/auth-test')

    await expect(
      page.getByRole('heading', { name: 'JWT 인증 테스트' }),
    ).toBeVisible()
    await expect(page.getByPlaceholder('이메일')).toBeVisible()
    await expect(page.getByPlaceholder('비밀번호 (최소 6자)')).toBeVisible()
    await expect(page.getByRole('button', { name: '회원가입' })).toBeVisible()
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible()
  })

  test('토큰 없이 내 정보 조회 시 에러 메시지 표시', async ({ page }) => {
    await page.goto('/auth-test')

    await page.getByRole('tab', { name: '토큰 액션' }).click()
    await page.getByRole('button', { name: /내 정보 조회/ }).click()

    await expect(page.getByText('로그인 먼저 해주세요')).toBeVisible()
  })

  test('탭 전환 동작 확인', async ({ page }) => {
    await page.goto('/auth-test')

    await page.getByRole('tab', { name: '토큰 액션' }).click()
    await expect(page.getByRole('button', { name: /토큰 갱신/ })).toBeVisible()

    await page.getByRole('tab', { name: '토큰 상태' }).click()
    await expect(page.getByText('토큰 없음')).toBeVisible()
  })

  test('홈 페이지 정상 렌더링', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()
  })
})
