import { Hono } from 'hono'
import { requireAdmin } from '../middlewares/requireAdmin'
import { validate } from '../middlewares/validate'
import { adminListQuery, moveBody, updatePhotoBody } from '../schemas/adminPhotos'
import { photoIdParam } from '../schemas/photos'
import {
  deleteAdminPhoto,
  getAdminPhoto,
  listAdminPhotos,
  moveAdminPhoto,
  updateAdminPhoto,
} from '../services/adminPhotosService'

export const adminPhotosRoute = new Hono<{
  Bindings: CloudflareBindings
  Variables: { adminId: number }
}>()
  .use('*', requireAdmin)
  .get('/', validate('query', adminListQuery), async (c) => {
    const { limit, offset } = c.req.valid('query')
    return c.json(await listAdminPhotos(c.env.DB, limit, offset))
  })
  .get('/:id', validate('param', photoIdParam), async (c) => {
    const { id } = c.req.valid('param')
    const photo = await getAdminPhoto(c.env.DB, id)
    if (!photo) return c.json({ error: 'not_found' }, 404)
    return c.json({ photo })
  })
  .patch('/:id', validate('param', photoIdParam), validate('json', updatePhotoBody), async (c) => {
    const { id } = c.req.valid('param')
    const input = c.req.valid('json')
    const result = await updateAdminPhoto(c.env.DB, id, input)
    if (!result.ok) {
      return c.json({ error: result.reason }, result.reason === 'not_found' ? 404 : 422)
    }
    return c.json({ photo: result.photo })
  })
  .post('/:id/move', validate('param', photoIdParam), validate('json', moveBody), async (c) => {
    const { id } = c.req.valid('param')
    const { direction } = c.req.valid('json')
    const result = await moveAdminPhoto(c.env.DB, id, direction)
    if (result === 'not_found') return c.json({ error: 'not_found' }, 404)
    return c.json({ ok: true })
  })
  .delete('/:id', validate('param', photoIdParam), async (c) => {
    const { id } = c.req.valid('param')
    const result = await deleteAdminPhoto(c.env.DB, id)
    if (result === 'not_found') return c.json({ error: 'not_found' }, 404)
    if (result === 'published') return c.json({ error: 'unpublish_first' }, 409)
    return c.json({ ok: true })
  })