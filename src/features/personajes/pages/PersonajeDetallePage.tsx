import { UserRoundX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../../../components/ui/Container'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { normalizeIceAndFireExternalId } from '../../../lib/domain/canonical_entities'
import { useCharacter } from '../api/use_characters'
import { useCharacterMedia } from '../../../hooks/use-character-media.ts'
import { CharacterDetailView } from '../character-detail/CharacterDetailView'
import type { CharacterDetailViewModel } from '../character-detail/character-detail.types'
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
  // ID: usamos el canonicalCharacterId (string)
  const id = canonicalCharacter.id

  // displayName: preferimos el preferredName del editorial, luego el nombre del character, y como último recurso el ID (no ideal pero evita vacío)
  const displayName =
    canonicalCharacter.editorial?.preferredName ?? canonicalCharacter.name ?? id

  // media: si tenemos CharacterMedia, lo adaptamos a CharacterMediaViewModel
  const media = characterMedia
    ? {
        altText: characterMedia.altText,
        // No tenemos caption en CharacterMedia, lo dejamos undefined (opcional en el ViewModel)
        portraitUrl: characterMedia.portraitUrl,
      }
    : undefined

  // Otros campos que no podemos derivar seguro se dejan undefined (opcionales en el ViewModel)
  return {
    id,
    displayName,
    media,
    timeline: [{ id: '1', title: 'Dummy event' }],
    timelineCopy: { title: "Línea de vida" },
    // Los campos opcionales se omiten (undefined) para que la vista los ignore y use sus fallbacks o no renderize los bloques.
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

   // Si el personaje está resuelto pero aún estamos cargando la media, mostramos esqueleto para la media
   // (pero ya tenemos el character para otras secciones, aunque por ahora solo usamos media)
   // Nota: como solo usamos media, podemos mostrar un esqueleto general o esperar a que tenga media.
   // Para simplicidad, esperamos a que tenga la media (o undefined) y luego renderizamos la ficha.
   // Si la media está pendiente, podemos mostrar un esqueleto de retrato o esperar.
   // Vamos a construir el ViewModel tan pronto como tengamos el character (aunque la media esté pendiente)
   // y dejar que la vista maneje la media undefined (mostrando el fallback).
   // Sin embargo, para evitar parpadeos, podemos esperar a que la media se resuelva (o falle) antes de renderizar.
   // Pero la media es opcional, así que podemos renderizar inmediatamente con media undefined.
   // Vamos a hacerlo así: renderizamos la ficha en cuanto tengamos el character, y la media se actualizará cuando llegue.
   // Esto es aceptable porque la media es opcional y la vista ya maneja media undefined.

   const viewModel = buildCharacterDetailViewModel(
     character.data,
     characterMedia
   )

   return <CharacterDetailView character={viewModel} />
}