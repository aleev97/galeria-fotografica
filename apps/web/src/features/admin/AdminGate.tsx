import { Outlet } from 'react-router'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'
import { LoadingMessage } from '@/components/StatusMessage'
import { useAdmin } from './adminContext'

export function AdminGate() {
  const { status } = useAdmin()

  return (
    <Container className="py-16">
      <title>Administración</title>
      <meta name="robots" content="noindex" />

      {status === 'checking' && <LoadingMessage />}

      {status === 'guest' && (
        <div className="flex flex-col items-start gap-4 py-8">
          <h1 className="text-4xl">Administración</h1>
          <p className="text-moon-300">No hay una sesión iniciada.</p>
          <a href="/api/admin/auth/login" className={buttonStyles('primary')}>
            Iniciar sesión con GitHub
          </a>
        </div>
      )}

      {status === 'admin' && <Outlet />}
    </Container>
  )
}