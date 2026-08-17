import { Link, useParams } from 'react-router-dom'
import { useCharacter } from '../api/use_characters'

export function PersonajeDetallePage() {
  const { id } = useParams()
  const character = useCharacter(id)

  if (!id) {
    return <p className="text-red-300">El identificador del personaje no es válido.</p>
  }

  if (character.isPending) {
    return <p className="text-stone-400">Cargando personaje...</p>
  }

  if (character.isError) {
    return <p className="text-red-300">No fue posible obtener este personaje.</p>
  }

  const displayName =
    character.data.name || character.data.aliases[0] || 'Sin nombre conocido'

  return (
    <article className="max-w-3xl space-y-8">
      <Link className="text-sm text-stone-500 hover:text-stone-300" to="/personajes">
        Volver a personajes
      </Link>
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-200/70">
          Personaje
        </p>
        <h1 className="font-serif text-4xl text-stone-100 sm:text-5xl">{displayName}</h1>
        <p className="text-stone-400">
          {character.data.culture || 'Cultura no indicada'}
        </p>
      </header>
      <dl className="grid gap-6 rounded-lg border border-stone-800 bg-stone-900/50 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-stone-500">Alias</dt>
          <dd className="mt-1 text-stone-200">
            {character.data.aliases.join(', ') || 'No indicados'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Títulos</dt>
          <dd className="mt-1 text-stone-200">
            {character.data.titles.join(', ') || 'No indicados'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Nacimiento</dt>
          <dd className="mt-1 text-stone-200">{character.data.born || 'No indicado'}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Interpretado por</dt>
          <dd className="mt-1 text-stone-200">
            {character.data.playedBy.join(', ') || 'No indicado'}
          </dd>
        </div>
      </dl>
    </article>
  )
}
