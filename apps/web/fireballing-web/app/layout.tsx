import type { Metadata } from 'next'
import { Outfit, Geist_Mono } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'
import RootProvider from '@/features/providers/RootProvider'
import { DevFab } from '@/shared/ui'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

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
  description: '파이어볼링, 배당성장 특화 포트폴리오',
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
      <body className={`${outfit.variable} ${geistMono.variable}`}>
        <RootProvider>
          <Header />
          {children}
          <Footer />
          <DevFab />
        </RootProvider>
      </body>
    </html>
  )
}
