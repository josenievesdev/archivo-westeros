import { Crown, Flame, Snowflake, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cx } from '../../lib/utils/cx'
import { desktopNavigation } from '../navigation'

export function AppHeader() {
  const [atmosphere, setAtmosphere] = useState<'fire' | 'ice'>('fire')
  const [lifted, setLifted] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.atmosphere = atmosphere
    return () => {
      delete document.documentElement.dataset.atmosphere
    }
  }, [atmosphere])

  // En reposo la barra es transparente, como en Pen: la atmósfera del Hero la
  // atraviesa. Solo al desplazar aparece el velo que garantiza la lectura.
  useEffect(() => {
    function syncLift() {
      setLifted(window.scrollY > 8)
    }

    syncLift()
    window.addEventListener('scroll', syncLift, { passive: true })
    return () => window.removeEventListener('scroll', syncLift)
  }, [])

  return (
    <header
      className={cx(
        'sticky top-0 z-40 h-16 border-b transition-[background-color,border-color] duration-300 md:h-20',
        lifted
          ? 'border-etch bg-[#0b0d11f2] backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 xl:px-12">
        <NavLink
          aria-label="Archivo de Westeros, inicio"
          className="group flex min-h-11 min-w-0 items-center gap-3 no-underline"
          to="/"
        >
          <Crown
            aria-hidden="true"
            className="size-[1.375rem] flex-none text-gold transition-colors group-hover:text-gold-light"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-[0.8125rem] font-semibold leading-normal tracking-[0.08em] text-bone xl:text-[0.9375rem] xl:tracking-[0.226em]">
              Archivo de Westeros
            </span>
            <span className="mt-px hidden font-sans text-[0.59375rem] leading-normal tracking-[0.1rem] text-ash lg:block">
              Guía viva de los Siete Reinos
            </span>
          </span>
        </NavLink>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-[2.125rem]">
            {desktopNavigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    cx(
                      'relative flex min-h-11 items-center font-sans text-[0.78125rem] tracking-[0.09375rem] transition-colors after:absolute after:right-1/2 after:bottom-[0.4375rem] after:h-px after:w-0 after:translate-x-1/2 after:bg-gold after:transition-[width] hover:text-bone',
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

        <div aria-label="Controles secundarios" className="hidden items-center gap-3.5 xl:flex">
          <div aria-label="Atmósfera visual" className="flex h-[2.0625rem] overflow-hidden rounded-etched border border-etch" role="group">
            <button
              aria-label="Atmósfera de hielo"
              aria-pressed={atmosphere === 'ice'}
              className={cx(
                'grid w-[2.5625rem] place-items-center text-parchment transition-colors',
                atmosphere === 'ice' && 'bg-ice/[0.12] text-ice',
              )}
              onClick={() => setAtmosphere('ice')}
              type="button"
            >
              <Snowflake aria-hidden="true" className="size-[0.9375rem]" />
            </button>
            <button
              aria-label="Atmósfera de fuego"
              aria-pressed={atmosphere === 'fire'}
              className={cx(
                'grid w-[2.5625rem] place-items-center text-parchment transition-colors',
                atmosphere === 'fire' && 'bg-ember/[0.12] text-flame',
              )}
              onClick={() => setAtmosphere('fire')}
              type="button"
            >
              <Flame aria-hidden="true" className="size-[0.9375rem]" />
            </button>
          </div>
          <button
            aria-label="Cuenta no disponible en esta fase"
            className="grid size-[1.0625rem] place-items-center text-parchment"
            disabled
            title="Cuenta disponible en una fase posterior"
            type="button"
          >
            <UserRound aria-hidden="true" className="size-[1.0625rem]" />
          </button>
        </div>
      </div>
    </header>
  )
}
