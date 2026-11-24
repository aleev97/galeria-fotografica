import { Hono } from 'hono'
import { validate } from '../middlewares/validate'
import { listPhotosQuery, photoIdParam } from '../schemas/photos'
import { getPhoto, listPhotos } from '../services/photosService'

export const photosRoute = new Hono<{ Bindings: CloudflareBindings }>()
  .get('/', validate('query', listPhotosQuery), async (c) => {
    const params = c.req.valid('query')
    const result = await listPhotos(c.env.DB, {
      collection: params.collection,
      query: params.q,
      featured: params.featured === undefined ? undefined : params.featured === 'true',
      ids: params.ids,
      limit: params.limit,
      offset: params.offset,
    })
    c.header('Cache-Control', 'public, max-age=60')
    return c.json(result)
  })
  .get('/:id', validate('param', photoIdParam), async (c) => {
    const { id } = c.req.valid('param')
    const result = await getPhoto(c.env.DB, id)
    if (!result) return c.json({ error: 'not_found' }, 404)
    c.header('Cache-Control', 'public, max-age=60')
    return c.json(result)
  })