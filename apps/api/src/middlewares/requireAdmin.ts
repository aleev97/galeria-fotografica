import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

import { SESSION_COOKIE } from '../config/auth'
import { sha256Hex } from '../lib/crypto'
import { findSession } from '../repositories/adminRepository'

export const requireAdmin = createMiddleware<{
  Bindings: CloudflareBindings
  Variables: { adminId: number }
}>(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE)
  if (!token) return c.json({ error: 'unauthorized' }, 401)

  const session = await findSession(c.env.DB, await sha256Hex(token))
  // Además de la sesión, el ID tiene que seguir siendo el autorizado
  if (!session || String(session.github_id) !== c.env.ADMIN_GITHUB_ID) {
    return c.json({ error: 'unauthorized' }, 401)
  }

  c.set('adminId', session.github_id)
  await next()
})