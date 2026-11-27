import { Hono } from 'hono'

import { listCollections } from '../services/collectionsService'

export const collectionsRoute = new Hono<{ Bindings: CloudflareBindings }>().get('/', async (c) => {
  const items = await listCollections(c.env.DB)
  c.header('Cache-Control', 'public, max-age=60')
  return c.json({ items })
})