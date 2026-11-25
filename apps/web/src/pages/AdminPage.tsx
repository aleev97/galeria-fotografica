import { useState } from 'react'
import { Button } from '@/components/Button'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'
import { LoadingMessage } from '@/components/StatusMessage'
import { useApi } from '@/hooks/useApi'

export default function AdminPage() {
  const session = useApi<{ authenticated: true }>('/admin/me')
  const [loggingOut, setLoggingOut] = useState(false)

  const logout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } finally {
      window.location.assign('/admin')
    }
  }

  return (
    <Container className="py-24">
      <title>Administración</title>
      <meta name="robots" content="noindex" />

      <h1 className="text-4xl md:text-5xl">Administración</h1>

      <div className="mt-10">
        {session.status === 'loading' && <LoadingMessage />}

        {session.status === 'error' && (
          <div className="flex flex-col items-start gap-4">
            <p className="text-moon-300">No hay una sesión iniciada.</p>
            <a href="/api/admin/auth/login" className={buttonStyles('primary')}>
              Iniciar sesión con GitHub
            </a>
          </div>
        )}

        {session.status === 'success' && (
          <div className="flex flex-col items-start gap-4">
            <p className="text-moon-300">Sesión iniciada. El panel llega en la próxima etapa.</p>
            <Button variant="ghost" onClick={logout} disabled={loggingOut}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </Container>
  )
}