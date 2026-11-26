import { Eye, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Container } from '@/components/Container'
import { useAdmin } from './adminContext'
import { logout } from './logout'

const barButton =
  'text-moon-100 hover:text-aurora-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400'

export function AdminBar() {
  const { status, visitorView, setVisitorView } = useAdmin()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (status !== 'admin') return null

  // En modo visitante se oculta la barra, salvo dentro del panel
  if (visitorView && !pathname.startsWith('/admin')) {
    return (
      <button
        type="button"
        onClick={() => setVisitorView(false)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-aurora-400/60 bg-space-900 px-4 py-2 text-sm text-moon-100 shadow-lg hover:border-aurora-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-400"
      >
        <Eye size={16} aria-hidden="true" />
        Vista de visitante · Volver al modo admin
      </button>
    )
  }

  return (
    <div className="border-b border-aurora-400/40 bg-space-900">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2 text-sm">
        <span className="inline-flex items-center gap-2 text-aurora-400">
          <ShieldCheck size={16} aria-hidden="true" />
          Modo administrador
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link to="/admin" className={barButton}>
            Panel
          </Link>
          <button
            type="button"
            onClick={() => {
              setVisitorView(true)
              navigate('/')
            }}
            className={barButton}
          >
            Ver como visitante
          </button>
          <button type="button" onClick={logout} className={barButton}>
            Cerrar sesión
          </button>
        </div>
      </Container>
    </div>
  )
}