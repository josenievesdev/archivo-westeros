import { Link, useParams } from 'react-router-dom'
import { useHouse } from '../api/use_houses'

export function CasaDetallePage() {
  const { id } = useParams()
  const house = useHouse(id)

  if (!id) {
    return <p className="text-red-300">El identificador de la casa no es válido.</p>
  }

  if (house.isPending) {
    return <p className="text-stone-400">Cargando casa...</p>
  }

  if (house.isError) {
    return <p className="text-red-300">No fue posible obtener esta casa.</p>
  }

  return (
    <article className="max-w-3xl space-y-8">
      <Link className="text-sm text-stone-500 hover:text-stone-300" to="/casas">
        Volver a casas
      </Link>
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-200/70">Casa</p>
        <h1 className="font-serif text-4xl text-stone-100 sm:text-5xl">
          {house.data.name}
        </h1>
        <p className="text-stone-400">{house.data.region || 'Región no indicada'}</p>
      </header>
      <dl className="grid gap-6 rounded-lg border border-stone-800 bg-stone-900/50 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-stone-500">Lema</dt>
          <dd className="mt-1 text-stone-200">{house.data.words || 'No indicado'}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Asientos</dt>
          <dd className="mt-1 text-stone-200">
            {house.data.seats.join(', ') || 'No indicados'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Títulos</dt>
          <dd className="mt-1 text-stone-200">
            {house.data.titles.join(', ') || 'No indicados'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Armas ancestrales</dt>
          <dd className="mt-1 text-stone-200">
            {house.data.ancestralWeapons.join(', ') || 'No indicadas'}
          </dd>
        </div>
      </dl>
    </article>
  )
}
