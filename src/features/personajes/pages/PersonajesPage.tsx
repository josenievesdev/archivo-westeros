import { Link } from 'react-router-dom'
import { useCharacters } from '../api/use_characters'

export function PersonajesPage() {
  const characters = useCharacters({ page: 1, pageSize: 12 })

  return (
    <section className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-200/70">
          Archivo inicial
        </p>
        <h1 className="font-serif text-4xl text-stone-100 sm:text-5xl">Personajes</h1>
        <p className="leading-7 text-stone-400">
          Primera lectura normalizada de personajes. Búsqueda, filtros y Spoiler
          Shield llegarán en fases posteriores.
        </p>
      </header>

      {characters.isPending && <p className="text-stone-400">Cargando personajes...</p>}
      {characters.isError && (
        <p className="text-red-300">No fue posible obtener los personajes.</p>
      )}
      {characters.data && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.data.map((character) => {
            const displayName =
              character.name || character.aliases[0] || 'Sin nombre conocido'

            return (
              <li key={character.id}>
                <Link
                  className="block h-full rounded-lg border border-stone-800 bg-stone-900/50 p-5 transition-colors hover:border-stone-600"
                  to={`/personajes/${character.id}`}
                >
                  <h2 className="font-serif text-xl text-stone-100">{displayName}</h2>
                  <p className="mt-2 text-sm text-stone-500">
                    {character.culture || 'Cultura no indicada'}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
