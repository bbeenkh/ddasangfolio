import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

/**
 * # 사이트 메타데이터
 * ---
 * - 간단설명: 전체 사이트의 기본 SEO 메타데이터
 */
export const metadata: Metadata = {
  title: {
    default: 'Fireballing',
    template: '%s | Fireballing',
  },
  description: '개인 포트폴리오 사이트',
}

/**
 * # RootLayout
 * ---
 * - 간단설명: 모든 페이지의 공통 레이아웃 (Header + children + Footer)
 * ---
 * @param children 페이지 콘텐츠
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
