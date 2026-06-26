import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { errorHandler } from './middleware/error-handler.js'
import { authRoutes } from '../features/auth/index.js'

/**
 * # app
 * ---
 * - 간단설명: Hono 앱 인스턴스 생성, 미들웨어 등록 및 라우터 마운트
 * - 제약사항: 이 파일에서는 serve()를 호출하지 않음 (엔트리포인트에서 분리)
 * ---
 * @example
 * import { app } from './app/index.js'
 * serve({ fetch: app.fetch, port: 3001 })
 */
export const app = new Hono()

app.onError(errorHandler)

app.use('/*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

// 기능 라우트 마운트
app.route('/api/auth', authRoutes)

/**
 * # GET /
 * ---
 * - 간단설명: 헬스체크 엔드포인트
 */
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

/**
 * # GET /api/hello
 * ---
 * - 간단설명: Hello World 메시지를 JSON으로 반환하는 테스트 API
 * ---
 * @example GET /api/hello → { "message": "Hello World!" }
 */
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello World!' })
})
