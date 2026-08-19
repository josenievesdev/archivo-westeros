import { UserRoundX, WifiOff } from 'lucide-react'
import { CharacterCard } from '../../../components/ui/CharacterCard'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { SectionTitle } from '../../../components/ui/SectionTitle'
import { createCharacterViewModel } from '../../../content/character_localization'
import { useCharacters } from '../api/use_characters'

export function PersonajesPage() {
  const characters = useCharacters({ page: 1, pageSize: 12 })

  return (
    <section aria-labelledby="characters-title" className="space-y-8 sm:space-y-10">
      <SectionTitle
        description="Consulta la primera colección normalizada. La búsqueda global, los filtros y el Spoiler Shield llegarán en fases posteriores."
        eyebrow="Archivo de almas"
        headingAs="h1"
        headingId="characters-title"
        size="page"
        title="Personajes"
      />

      {characters.isPending && (
        <div aria-label="Cargando personajes" role="status">
          <span className="sr-only">Cargando personajes...</span>
          <ul
            aria-hidden="true"
            className="grid-even-rows grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-36 sm:h-[25rem]" />
              </li>
            ))}
          </ul>
        </div>
      )}
      {characters.isError && (
        <EmptyState
          description="La fuente externa no respondió. La navegación local permanece disponible."
          icon={<WifiOff aria-hidden="true" className="size-5" />}
          role="alert"
          title="No fue posible obtener los personajes"
        />
      )}
      {characters.data?.length === 0 && (
        <EmptyState
          description="No se recibieron personajes para esta primera página del archivo."
          icon={<UserRoundX aria-hidden="true" className="size-5" />}
          title="El archivo está vacío"
        />
      )}
      {characters.data && characters.data.length > 0 && (
        <ul className="grid-even-rows grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {characters.data.map((character) => {
            const view = createCharacterViewModel(character)

            return (
              <li key={character.id}>
                <CharacterCard
                  actor={view.playedBy[0]}
                  alias={view.aliases[0]?.value}
                  description={view.culture?.value || 'Cultura no indicada'}
                  name={view.name}
                  to={`/personajes/${character.source.externalId}`}
                />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
