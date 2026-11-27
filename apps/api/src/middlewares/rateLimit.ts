import { createMiddleware } from 'hono/factory'

type LimiterName = 'LOGIN_LIMITER' | 'ADMIN_LIMITER' | 'PUBLIC_LIMITER'

export const rateLimit = (name: LimiterName) =>
  createMiddleware<{ Bindings: CloudflareBindings }>(async (c, next) => {
    const ip = c.req.header('CF-Connecting-IP') ?? 'local'

    try {
      const { success } = await c.env[name].limit({ key: `${name}:${ip}` })
      if (!success) {
        c.header('Retry-After', '60')
        return c.json({ error: 'rate_limited' }, 429)
      }
    } catch {
      // Si el limitador falla, dejamos pasar: es una defensa extra, no la única
    }

    await next()
  })