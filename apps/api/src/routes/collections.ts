import { Hono } from 'hono'
import { listCollections } from '../services/collectionsService'

export const collectionsRoute = new Hono<{ Bindings: CloudflareBindings }>().get('/', async (c) =>
  c.json({ items: await listCollections(c.env.DB) }),
)