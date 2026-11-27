import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { adminPhotosRoute } from './adminPhotos'
import { SESSION_COOKIE, SESSION_HOURS, STATE_COOKIE } from '../config/auth'
import { randomToken, sha256Hex, timingSafeEqual } from '../lib/crypto'
import { requireAdmin } from '../middlewares/requireAdmin'
import { requireSameOrigin } from '../middlewares/requireSameOrigin'
import { validate } from '../middlewares/validate'
import { createSession, deleteSession, writeAudit } from '../repositories/adminRepository'
import { callbackQuery } from '../schemas/auth'
import { buildAuthorizeUrl, fetchGitHubUser } from '../services/authService'
import { rateLimit } from '../middlewares/rateLimit'

export const adminRoute = new Hono<{
  Bindings: CloudflareBindings
  Variables: { adminId: number }
}>()

adminRoute.use('*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'no-store')
})
adminRoute.use('*', requireSameOrigin)

adminRoute.use('/auth/*', rateLimit('LOGIN_LIMITER'))
adminRoute.use('/photos/*', rateLimit('ADMIN_LIMITER'))
adminRoute.use('/me', rateLimit('ADMIN_LIMITER'))

adminRoute.get('/auth/login', (c) => {
  const state = randomToken(16)
  setCookie(c, STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/api/admin/auth',
    maxAge: 600,
  })
  return c.redirect(buildAuthorizeUrl(c.env, state))
})

adminRoute.get('/auth/callback', validate('query', callbackQuery), async (c) => {
  const { code, state } = c.req.valid('query')

  const expected = getCookie(c, STATE_COOKIE)
  deleteCookie(c, STATE_COOKIE, { path: '/api/admin/auth' })
  if (!expected || !timingSafeEqual(expected, state)) {
    return c.json({ error: 'forbidden' }, 403)
  }

  const user = await fetchGitHubUser(c.env, code)
  if (!user) return c.json({ error: 'unauthorized' }, 401)

  if (String(user.id) !== c.env.ADMIN_GITHUB_ID) {
    await writeAudit(c.env.DB, 'login_denied', `github_id=${user.id}`)
    return c.json({ error: 'forbidden' }, 403)
  }

  const token = randomToken()
  await createSession(c.env.DB, await sha256Hex(token), user.id)
  await writeAudit(c.env.DB, 'login')

  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  })
  return c.redirect('/admin')
})

adminRoute.get('/me', requireAdmin, (c) => c.json({ authenticated: true }))

adminRoute.post('/auth/logout', requireAdmin, async (c) => {
  const token = getCookie(c, SESSION_COOKIE)
  if (token) await deleteSession(c.env.DB, await sha256Hex(token))
  await writeAudit(c.env.DB, 'logout')
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
  return c.json({ ok: true })
})

adminRoute.route('/photos', adminPhotosRoute)