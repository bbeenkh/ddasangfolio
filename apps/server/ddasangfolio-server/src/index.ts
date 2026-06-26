import { serve } from '@hono/node-server'
import { app } from './app/index.js'
import { loadEnv } from './shared/config/env.js'

const env = loadEnv()

serve({
  fetch: app.fetch,
  port: env.PORT,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
