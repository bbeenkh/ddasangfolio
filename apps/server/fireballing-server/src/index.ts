import { serve } from '@hono/node-server'
import { app } from './app/index'
import { loadEnv } from './shared/config/env'

const env = loadEnv()

serve({
  fetch: app.fetch,
  port: env.PORT,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
