import { UserRoundX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../../../components/ui/Container'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { normalizeIceAndFireExternalId } from '../../../lib/domain/canonical_entities'
import { useCharacter } from '../api/use_characters'
import { useCharacterMedia } from '../../../hooks/use-character-media.ts'
import { CharacterDetailView } from '../character-detail/CharacterDetailView'
import type {
  CharacterDetailViewModel,
  CharacterFact,
  CharacterSectionCopy,
  CharacterTimelineItem,
} from '../character-detail/character-detail.types'
import type { CanonicalCharacter } from '../../../lib/domain/canonical_entities'
import type { CharacterMedia } from '../../../lib/domain/character_media'

/**
 * La ficha se sirve a sangre, así que `AppLayout` no le pone caja. Los estados
 * transitorios sí la necesitan para no quedar pegados al canto de la ventana.
 */
function TransientState({ children }: { children: ReactNode }) {
  return <Container className="py-8 sm:py-12 lg:py-16">{children}</Container>
}

/**
 * Construye el ViewModel de la ficha a partir del personaje canónico y su media.
 * Omite los bloques para los que no se tenga información segura.
 */
function buildCharacterDetailViewModel(
   canonicalCharacter: CanonicalCharacter,
   characterMedia: CharacterMedia | undefined
): CharacterDetailViewModel {
   const id = canonicalCharacter.id

   const displayName =
     canonicalCharacter.editorial?.preferredName ?? canonicalCharacter.name ?? id

   const media = characterMedia
     ? {
         altText: characterMedia.altText,
         portraitUrl: characterMedia.portraitUrl,
       }
     : undefined

   // timeline: we don't have safe timeline data, so empty array
   const timeline: CharacterTimelineItem[] = []

   // timelineCopy: we keep the title for the section
   const timelineCopy: CharacterSectionCopy = { title: "Línea de vida" }

   // facts: we will build an array of CharacterFact
   const facts: CharacterFact[] = []

   // Birth
   if (canonicalCharacter.born) {
     facts.push({
       icon: 'birth',
       label: 'Nacimiento',
       value: canonicalCharacter.born,
     })
   }

   // Culture
   if (canonicalCharacter.culture) {
     facts.push({
       label: 'Cultura',
       value: canonicalCharacter.culture,
     })
   }

   // Titles
   if (canonicalCharacter.titles?.length) {
     facts.push({
       icon: 'title',
       label: 'Títulos',
       value: canonicalCharacter.titles.join(', '),
     })
   }

   // Actor
   if (canonicalCharacter.playedBy?.length) {
     facts.push({
       icon: 'actor',
       label: 'Intérprete',
       value: canonicalCharacter.playedBy.join(', '),
     })
   }

   // secondaryName: first alias if available
   const secondaryName = canonicalCharacter.aliases?.[0]

   return {
     id,
     displayName,
     media,
     timeline,
     timelineCopy,
     facts: facts.length > 0 ? facts : undefined,
     secondaryName,
   }
}

export function PersonajeDetallePage() {
   const { id } = useParams()
   const sourceId = normalizeIceAndFireExternalId(id)
   const character = useCharacter(sourceId ?? undefined)

   // Obtener la media del personaje solo si tenemos el canonicalCharacter resuelto
   const characterMedia = useCharacterMedia(
     character.data?.id ?? undefined
   )

   if (!sourceId) {
     return (
       <TransientState>
         <EmptyState
           description="La URL no contiene un identificador que podamos consultar."
           headingAs="h1"
           icon={<UserRoundX aria-hidden="true" className="size-5" />}
           role="alert"
           title="El identificador del personaje no es válido"
         />
       </TransientState>
     )
   }

   if (character.isPending) {
      return (
        <TransientState>
          <div aria-label="Cargando personaje" className="max-w-4xl space-y-6" role="status">
            <span className="sr-only">Cargando personaje...</span>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-20 max-w-xl" />
            <Skeleton className="h-72" />
          </div>
        </TransientState>
      )
   }

   // If we have data, show it (even if there is an error, to avoid flashing error on refetch failure)
   if (character.data !== undefined) {
      const viewModel = buildCharacterDetailViewModel(
        character.data,
        characterMedia
      )
      return <CharacterDetailView character={viewModel} />
   }

   if (character.isError) {
      return (
        <TransientState>
          <EmptyState
            description="La fuente externa no devolvió una ficha válida para esta ruta."
            headingAs="h1"
            icon={<UserRoundX aria-hidden="true" className="size-5" />}
            role="alert"
            title="No fue posible obtener este personaje"
          />
        </TransientState>
      )
   }

   // Fallback: should not happen, but show invalid identifier state
   return (
     <TransientState>
       <EmptyState
         description="La URL no contiene un identificador que podamos consultar."
         headingAs="h1"
         icon={<UserRoundX aria-hidden="true" className="size-5" />}
         role="alert"
         title="El identificador del personaje no es válido"
       />
     </TransientState>
   )
}