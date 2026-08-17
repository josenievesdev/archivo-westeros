import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'Personajes', to: '/personajes' },
  { label: 'Casas', to: '/casas' },
  { label: 'Linajes', to: '/linajes' },
  { label: 'Mapa', to: '/mapa' },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <header className="border-b border-stone-800 bg-stone-950/95">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <NavLink className="font-serif text-xl tracking-wide text-stone-100" to="/">
            Realms of Westeros
          </NavLink>
          <nav aria-label="Navegación principal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-400">
              {navigation.map((item) => (
                <li key={item.to}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'text-amber-200'
                        : 'transition-colors hover:text-stone-100'
                    }
                    end={item.to === '/'}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">
        <Outlet />
      </main>

      <footer className="mx-auto w-full max-w-6xl border-t border-stone-800 px-5 py-6 text-sm text-stone-500">
        Proyecto en fase de arquitectura. Datos públicos de An API of Ice and Fire.
      </footer>
    </div>
  )
}
