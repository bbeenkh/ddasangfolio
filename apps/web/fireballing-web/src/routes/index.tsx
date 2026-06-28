import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@fblg/core-ui'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <Button>버튼</Button>
    </main>
  )
}
