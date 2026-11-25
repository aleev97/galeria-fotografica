import { createMiddleware } from 'hono/factory'

export const requireSameOrigin = createMiddleware<{ Bindings: CloudflareBindings }>(
  async (c, next) => {
    const method = c.req.method
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      if (c.req.header('Origin') !== c.env.PUBLIC_ORIGIN) {
        return c.json({ error: 'forbidden' }, 403)
      }
    }
    await next()
  },
)