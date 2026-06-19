import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors({
  origin: 'http://localhost:3000',
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

/**
 * # /api/hello
 * ---
 * - 간단설명: Hello World 메시지를 JSON으로 반환하는 테스트 API
 * ---
 * @example GET /api/hello → { "message": "Hello World!" }
 */
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello World!' })
})

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
