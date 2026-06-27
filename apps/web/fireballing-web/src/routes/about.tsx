import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold">About</h1>
    </main>
  )
}
