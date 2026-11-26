import { useState } from 'react'
import { Link, Outlet } from 'react-router'
import { Button } from '@/components/Button'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'
import { LoadingMessage } from '@/components/StatusMessage'
import { useApi } from '@/hooks/useApi'

export function AdminGate() {
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
    <Container className="py-16">
      <title>Administración</title>
      <meta name="robots" content="noindex" />

      {session.status === 'loading' && <LoadingMessage />}

      {session.status === 'error' && (
        <div className="flex flex-col items-start gap-4 py-8">
          <h1 className="text-4xl">Administración</h1>
          <p className="text-moon-300">No hay una sesión iniciada.</p>
          <a href="/api/admin/auth/login" className={buttonStyles('primary')}>
            Iniciar sesión con GitHub
          </a>
        </div>
      )}

      {session.status === 'success' && (
        <>
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-moon-100/10 pb-6">
            <Link to="/admin" className="font-display text-2xl">
              Administración
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/" className={buttonStyles('ghost')}>
                Ver sitio
              </Link>
              <Button variant="ghost" onClick={logout} disabled={loggingOut}>
                Cerrar sesión
              </Button>
            </div>
          </div>
          <Outlet />
        </>
      )}
    </Container>
  )
}