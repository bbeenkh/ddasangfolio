import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthHydration } from '@/features/auth'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })

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
      <body className={`${inter.variable} ${plusJakartaSans.variable}`}>
        <AuthHydration />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
