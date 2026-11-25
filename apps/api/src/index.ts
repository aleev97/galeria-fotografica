import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { secureHeaders } from 'hono/secure-headers'
import { collectionsRoute } from './routes/collections'
import { photosRoute } from './routes/photos'
import { adminRoute } from './routes/admin'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use('*', secureHeaders())

app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/photos', photosRoute)
app.route('/api/collections', collectionsRoute)
app.route('/api/admin', adminRoute)

app.notFound((c) => c.json({ error: 'not_found' }, 404))

app.onError((error, c) => {
  if (error instanceof HTTPException && error.status === 400) {
    return c.json({ error: error.message }, 400)
  }
  // El detalle queda en los logs del servidor; al cliente nunca le mostramos el error interno
  console.error(error)
  return c.json({ error: 'internal_error' }, 500)
})

export default app