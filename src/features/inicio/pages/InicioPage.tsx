import { Link } from 'react-router-dom'
import { ApiConnectionSummary } from '../components/ApiConnectionSummary'

export function InicioPage() {
  return (
    <div className="space-y-12">
      <section className="max-w-3xl space-y-5">
        <p className="text-sm uppercase tracking-[0.22em] text-amber-200/70">
          Nombre provisional
        </p>
        <h1 className="font-serif text-5xl leading-tight text-stone-100 sm:text-6xl">
          Realms of Westeros
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-stone-400">
          Una experiencia para consultar personajes, casas y relaciones mientras ves
          Game of Thrones, sin convertir la exploración en una wiki tradicional.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            className="rounded border border-stone-600 px-4 py-2 text-sm text-stone-200 transition-colors hover:border-stone-400"
            to="/personajes"
          >
            Explorar personajes
          </Link>
          <Link
            className="rounded border border-stone-800 px-4 py-2 text-sm text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-200"
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
