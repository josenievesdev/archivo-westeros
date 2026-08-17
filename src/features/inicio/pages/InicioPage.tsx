import { Link } from 'react-router-dom'
import { ApiConnectionSummary } from '../components/ApiConnectionSummary'

export function InicioPage() {
  return (
    <div className="space-y-10 sm:space-y-14">
      <section className="archive-hero px-5 py-14 text-center sm:px-10 sm:py-20 lg:py-24">
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.24em] text-gold">
          Archivo abierto · Guía viva de los Siete Reinos
        </p>
        <span aria-hidden="true" className="mx-auto my-5 flex w-36 items-center gap-3">
          <span className="h-px flex-1 bg-etched-gold" />
          <span className="size-1.5 rotate-45 border border-old-gold" />
          <span className="h-px flex-1 bg-etched-gold" />
        </span>
        <h1 className="mx-auto max-w-4xl font-display text-[clamp(2.25rem,9vw,4.125rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-bone">
          Nadie recuerda todos los nombres
        </h1>
        <p className="mt-2 font-serif text-[clamp(2rem,8vw,3.5rem)] leading-tight italic text-gold">
          Nosotros sí.
        </p>
        <p className="mx-auto mt-5 max-w-2xl font-serif text-lg leading-7 text-parchment sm:text-xl sm:leading-8">
          Consulta personajes, casas y relaciones sin abandonar el episodio ni perderte
          en una wiki tradicional.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-etched border border-transparent bg-gradient-to-b from-gold-light to-gold-shadow px-6 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-void transition-[filter] hover:brightness-110"
            to="/personajes"
          >
            Explorar personajes
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-etched border border-etch bg-white/[0.04] px-6 font-sans text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:border-old-gold hover:bg-white/[0.07]"
            to="/casas"
          >
            Explorar casas
          </Link>
        </div>
      </section>

      <ApiConnectionSummary />
    </div>
  )
}
