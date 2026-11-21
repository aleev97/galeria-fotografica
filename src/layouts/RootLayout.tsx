import { NavLink, Outlet } from 'react-router'

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
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="border-b border-white/10">
        <nav
          aria-label="Principal"
          className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-2 px-6 py-4"
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive ? 'text-sky-400' : 'text-white/70 hover:text-white'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-sm text-white/50">
        © 2026 Galería fotográfica
      </footer>
    </div>
  )
}