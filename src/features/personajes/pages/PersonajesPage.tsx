import { UserRoundX, WifiOff } from 'lucide-react'
import { CharacterCard } from '../../../components/ui/CharacterCard'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { SectionTitle } from '../../../components/ui/SectionTitle'
import { createCharacterViewModel } from '../../../content/character_localization'
import { useCharacters, useCharacter } from '../api/use_characters'
import { useThronesCharactersList } from '../../../hooks/use-thrones-characters-list'
import { getCharacterMediaFromList } from '../../../services/character_media_service'
import type { CanonicalCharacter } from '../../../lib/domain/canonical_entities'

export function PersonajesPage() {
  const characters = useCharacters({ page: 1, pageSize: 12 })
  const thronesCharacters = useThronesCharactersList()
  const featuredIds = ['583', '1303', '1052', '148', '238'] as const

  // Custom hook to get queries for each featured character
  function useFeaturedCharacters() {
    return [
      useCharacter('583'),
      useCharacter('1303'),
      useCharacter('1052'),
      useCharacter('148'),
      useCharacter('238'),
    ]
  }
  const [query583, query1303, query1052, query148, query238] = useFeaturedCharacters()
  const featuredCharacters = [query583, query1303, query1052, query148, query238]

  // Check if any of the featured character queries is pending
  const featuredPending = featuredCharacters.some((c) => c.isPending)
  // Check if any of the featured character queries has an error
  const featuredError = featuredCharacters.some((c) => c.isError)
  // Get the successfully fetched featured characters
  const featuredData = featuredCharacters
    .map((c) => c.data)
    .filter((d): d is NonNullable<typeof d> => d !== null) as any[]

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

      {/* Featured Characters Section */}
      <section>
        <SectionTitle
          eyebrow="Destacados"
          headingAs="h2"
          title="Personajes destacados"
          size="section"
        />
        {featuredPending && (
          <div aria-label="Cargando personajes destacados" role="status">
            <span className="sr-only">Cargando personajes destacados...</span>
            <div className="flex gap-4 sm:gap-6 justify-center">
              {featuredIds.map((_, index) => (
                <div key={index} className="flex-1 sm:flex-0 sm:w-[20%]">
                  <Skeleton className="h-36 sm:h-[25rem]" />
                </div>
              ))}
            </div>
          </div>
        )}
        {featuredError && (
          <EmptyState
            description="No se pudieron cargar algunos personajes destacados. El archivo completo permanece disponible."
            icon={<WifiOff aria-hidden="true" className="size-5" />}
            role="alert"
            title="Error al cargar destacados"
          />
        )}
        {featuredData.length > 0 && (
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            {featuredData.map((character: CanonicalCharacter) => {
              const view = createCharacterViewModel(character)
              const media = thronesCharacters.data
                ? getCharacterMediaFromList(thronesCharacters.data, character)
                : undefined

              return (
                <div key={character.id} className="flex-1 sm:flex-0 sm:w-[20%]">
                  <CharacterCard
                    actor={view.playedBy[0]}
                    alias={view.aliases[0]?.value}
                    description={view.culture?.value || 'Cultura no indicada'}
                    name={view.name}
                    image={media ? { src: media.portraitUrl, alt: view.name } : undefined}
                    to={`/personajes/${character.source.externalId}`}
                    variant="featured"
                  />
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Archive of Characters (existing) */}
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