import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

/**
 * # AboutPage
 * ---
 * - 간단설명: About 페이지 (Server Component)
 * ---
 * @example
 * // /about 경로에서 접근
 */
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold">About</h1>
    </main>
  )
}
