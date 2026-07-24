export { default } from 'next-auth/middleware'

/**
 * # middleware config
 * ---
 * - 간단설명: 인증이 필요한 페이지 경로 설정
 * - 제약사항: matcher에 추가된 경로만 인증 미들웨어가 적용됨
 */
export const config = {
  matcher: ['/my'],
}
