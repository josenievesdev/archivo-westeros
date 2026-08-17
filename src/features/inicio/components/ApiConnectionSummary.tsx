import { Badge } from '../../../components/ui/Badge'
import { Surface } from '../../../components/ui/Surface'
import { useHouses } from '../../casas/api/use_houses'
import { useCharacters } from '../../personajes/api/use_characters'

export function ApiConnectionSummary() {
  const characters = useCharacters({ page: 1, pageSize: 5 })
  const houses = useHouses({ page: 1, pageSize: 5 })
  const isPending = characters.isPending || houses.isPending
  const isError = characters.isError || houses.isError

  return (
    <Surface
      aria-labelledby="api-status-title"
      as="section"
      className="p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-gold">
            Fuente de datos
          </p>
          <h2 id="api-status-title" className="mt-2 font-display text-xl font-semibold text-bone sm:text-2xl">
            An API of Ice and Fire
          </h2>
        </div>
        <Badge tone={isError ? 'danger' : isPending ? 'neutral' : 'success'}>
          {isPending
            ? 'Comprobando conexión'
            : isError
              ? 'Conexión no disponible'
              : 'Conexión disponible'}
        </Badge>
      </div>

      {isPending && (
        <p className="mt-5 text-sm text-parchment" role="status">
          Consultando personajes y casas...
        </p>
      )}

      {isError && (
        <p className="mt-5 text-sm text-fallen" role="alert">
          No se pudo consultar la API. La navegación local sigue disponible.
        </p>
      )}

      {!isPending && !isError && (
        <div className="mt-6 grid gap-6 border-t border-etch pt-6 sm:grid-cols-2">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-parchment">
              Muestra de personajes ({characters.data?.length ?? 0})
            </p>
            <p className="mt-2 font-serif text-lg leading-7 text-parchment">
              {characters.data
                ?.map((character) =>
                  character.name || character.aliases[0] || 'Sin nombre conocido',
                )
                .join(', ')}
            </p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.12em] text-parchment">
              Muestra de casas ({houses.data?.length ?? 0})
            </p>
            <p className="mt-2 font-serif text-lg leading-7 text-parchment">
              {houses.data?.map((house) => house.name).join(', ')}
            </p>
          </div>
        </div>
      )}
    </Surface>
  )
}
