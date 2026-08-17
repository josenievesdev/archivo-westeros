import { Crown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { cx } from '../../lib/utils/cx'
import { desktopNavigation } from '../navigation'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-etch bg-[#0b0d11f2] backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
        <NavLink
          aria-label="Archivo de Westeros, inicio"
          className="group flex min-h-11 min-w-0 items-center gap-3 no-underline"
          to="/"
        >
          <Crown
            aria-hidden="true"
            className="size-5 flex-none text-gold transition-colors group-hover:text-gold-light"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-bone sm:text-sm">
              Archivo de Westeros
            </span>
            <span className="mt-0.5 hidden font-sans text-[0.625rem] tracking-[0.08em] text-parchment lg:block">
              Guía viva de los Siete Reinos
            </span>
          </span>
        </NavLink>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1 lg:gap-4">
            {desktopNavigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    cx(
                      'relative flex min-h-11 items-center px-2 font-sans text-xs transition-colors after:absolute after:right-1/2 after:bottom-0 after:h-px after:w-0 after:translate-x-1/2 after:bg-gold after:transition-[width] hover:text-bone lg:px-3',
                      isActive ? 'text-bone after:w-4' : 'text-parchment',
                    )
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
