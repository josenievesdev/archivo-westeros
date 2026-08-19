import { Outlet, useLocation } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { cx } from '../../lib/utils/cx'
import { AppHeader } from './AppHeader'
import { MobileNavigation } from './MobileNavigation'

export function AppLayout() {
  const { pathname } = useLocation()
  // Pantallas que traen su propia composición a sangre (Hero a ancho completo,
  // bandas de borde a borde y pie propio): el layout no les añade caja ni pie.
  const isImmersive =
    pathname === '/' ||
    pathname === '/mesa-de-guerra' ||
    /^\/casas\/[^/]+$/.test(pathname) ||
    /^\/personajes\/[^/]+$/.test(pathname)

  return (
    <div className="flex min-h-screen flex-col bg-void text-bone">
      <a
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-etched bg-gold px-4 py-3 font-sans text-sm font-semibold text-void transition-transform focus:translate-y-0"
        href="#contenido-principal"
      >
        Saltar al contenido
      </a>

      <AppHeader />

      <main
        className={cx('archive-main flex-1', !isImmersive && 'py-8 sm:py-12 lg:py-16')}
        id="contenido-principal"
      >
        {isImmersive ? <Outlet /> : <Container><Outlet /></Container>}
      </main>

      <footer className={cx('hidden border-t border-etch bg-stone md:block', isImmersive && 'md:hidden')}>
        <Container className="flex items-center justify-between gap-8 py-8 font-sans text-xs text-parchment">
          <div>
            <p className="font-display font-semibold uppercase tracking-[0.08em] text-bone">
              Archivo de Westeros
            </p>
            <p className="mt-1 text-parchment">Guía viva de los Siete Reinos</p>
          </div>
          <p className="max-w-md text-right leading-5">
            Foundation visual en evolución. Datos públicos de An API of Ice and Fire.
          </p>
        </Container>
      </footer>

      <MobileNavigation />
    </div>
  )
}
