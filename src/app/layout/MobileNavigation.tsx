import { Ellipsis, Home, Search, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cx } from '../../lib/utils/cx'

interface MobileNavigationItem {
  icon: LucideIcon
  isActive: (pathname: string) => boolean
  label: string
  to: string
}

const moreRoutes = ['/mas', '/linajes', '/mapa', '/cronologia', '/mesa-de-guerra']
const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`)

const mobileNavigation: MobileNavigationItem[] = [
  { icon: Home, isActive: (pathname) => pathname === '/', label: 'Inicio', to: '/' },
  {
    icon: Search,
    isActive: (pathname) => matchesRoute(pathname, '/personajes'),
    label: 'Buscar',
    to: '/personajes',
  },
  {
    icon: Shield,
    isActive: (pathname) => matchesRoute(pathname, '/casas'),
    label: 'Casas',
    to: '/casas',
  },
  {
    icon: Ellipsis,
    isActive: (pathname) => moreRoutes.some((route) => matchesRoute(pathname, route)),
    label: 'Más',
    to: '/mas',
  },
]

export function MobileNavigation() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Navegación móvil"
      className="mobile-navigation fixed inset-x-0 bottom-0 z-50 border-t border-etch bg-[#0b0d11f5] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-4">
        {mobileNavigation.map((item) => {
          const Icon = item.icon
          const isActive = item.isActive(pathname)

          return (
            <li key={item.label}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'relative flex min-h-16 flex-col items-center justify-center gap-1 px-2 py-2 font-sans text-[0.625rem] transition-colors before:absolute before:top-0 before:h-px before:w-0 before:bg-gold before:transition-[width]',
                  isActive ? 'text-bone before:w-5' : 'text-parchment',
                )}
                to={item.to}
              >
                <Icon
                  aria-hidden="true"
                  className={cx('size-5', isActive && 'text-gold')}
                  strokeWidth={1.7}
                />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
