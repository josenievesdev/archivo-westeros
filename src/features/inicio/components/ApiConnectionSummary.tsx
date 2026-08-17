import { useHouses } from '../../casas/api/use_houses'
import { useCharacters } from '../../personajes/api/use_characters'

export function ApiConnectionSummary() {
  const characters = useCharacters({ page: 1, pageSize: 5 })
  const houses = useHouses({ page: 1, pageSize: 5 })
  const isPending = characters.isPending || houses.isPending
  const isError = characters.isError || houses.isError

  return (
    <section
      aria-labelledby="api-status-title"
      className="rounded-lg border border-stone-800 bg-stone-900/60 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
            Fuente de datos
          </p>
          <h2 id="api-status-title" className="mt-2 font-serif text-2xl text-stone-100">
            An API of Ice and Fire
          </h2>
        </div>
        <span className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-400">
          {isPending
            ? 'Comprobando conexión'
            : isError
              ? 'Conexión no disponible'
              : 'Conexión disponible'}
        </span>
      </div>

      {isPending && (
        <p className="mt-5 text-sm text-stone-400">Consultando personajes y casas...</p>
      )}

      {isError && (
        <p className="mt-5 text-sm text-red-300">
          No se pudo consultar la API. La navegación local sigue disponible.
        </p>
      )}

      {!isPending && !isError && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-stone-500">
              Muestra de personajes ({characters.data?.length ?? 0})
            </p>
            <p className="mt-2 text-stone-300">
              {characters.data
                ?.map((character) =>
                  character.name || character.aliases[0] || 'Sin nombre conocido',
                )
                .join(', ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-stone-500">
              Muestra de casas ({houses.data?.length ?? 0})
            </p>
            <p className="mt-2 text-stone-300">
              {houses.data?.map((house) => house.name).join(', ')}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
