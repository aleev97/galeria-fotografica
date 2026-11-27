import { Link, NavLink, Outlet } from 'react-router'
import { Suspense } from 'react'
import { LoadingMessage } from '@/components/StatusMessage'
import { Container } from '@/components/Container'
import { ScrollToTop } from '@/components/ScrollToTop'
import { SpaceBackground } from '@/components/SpaceBackground'
import { AdminBar } from '@/features/admin/AdminBar'
import { useAdmin } from '@/features/admin/adminContext'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/colecciones', label: 'Colecciones' },
  { to: '/explorador', label: 'Explorador' },
  { to: '/behind-the-lens', label: 'Behind the Lens' },
  { to: '/sobre-mi', label: 'Sobre mí' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/contacto', label: 'Contacto' },
]

export default function RootLayout() {
  const { status } = useAdmin()

  return (
    <>
      <ScrollToTop />
      <SpaceBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <AdminBar />

        <header className="border-b border-moon-100/10">
          <Container>
            <nav aria-label="Principal" className="flex flex-wrap gap-x-6 gap-y-2 py-4 text-sm">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'text-aurora-400' : 'text-moon-300 hover:text-moon-100'
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </Container>
        </header>

        <main className="flex-1">
          <Suspense fallback={<LoadingMessage />}>
            <Outlet />
          </Suspense>
        </main>

        <footer className="border-t border-moon-100/10 py-6 text-sm text-moon-300">
          <Container className="flex flex-wrap items-center justify-between gap-4">
            <span>© 2026 Astrogaia</span>
            {status === 'guest' && (
              <Link to="/admin" className="text-xs text-moon-300/60 hover:text-moon-100">
                Acceso
              </Link>
            )}
          </Container>
        </footer>
      </div>
    </>
  )
}