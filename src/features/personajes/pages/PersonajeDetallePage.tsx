import { UserRoundX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../../../components/ui/Container'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { normalizeIceAndFireExternalId } from '../../../lib/domain/canonical_entities'
import { useCharacter } from '../api/use_characters'
import { CharacterDetailView } from '../character-detail/CharacterDetailView'
import { characterDetailDesignFixture } from '../character-detail/character_detail.fixture'
import type { CharacterDetailViewModel } from '../character-detail/character-detail.types'

/**
 * La ficha se sirve a sangre, así que `AppLayout` no le pone caja. Los estados
 * transitorios sí la necesitan para no quedar pegados al canto de la ventana.
 */
function TransientState({ children }: { children: ReactNode }) {
  return <Container className="py-8 sm:py-12 lg:py-16">{children}</Container>
}

/* ------------------------------------------------------------------------
 * PUNTO DE CONEXIÓN — PENDIENTE
 * ------------------------------------------------------------------------
 * Aquí es donde entra la capa de datos. La firma ya es la definitiva:
 *
 *   toCharacterDetailViewModel(canonicalCharacter, characterMedia)
 *       → CharacterDetailViewModel
 *
 * `CanonicalCharacter` aporta identidad, casa, datos y relaciones;
 * `CharacterMedia` (vía `useCharacterMedia`) aporta `portraitUrl` y `altText`;
 * el futuro Spoiler Shield recorta `timeline`, `seasons` y `relationships`
 * ANTES de llegar hasta aquí.
 *
 * Mientras tanto esta rama es solo visual y devuelve el fixture de diseño, que
 * es spoiler-safe. Sustituir esta función es todo lo que hay que tocar en la
 * página: `CharacterDetailView` ya recibe el ViewModel completo por props.
 * ---------------------------------------------------------------------- */
function resolveCharacterDetailViewModel(): CharacterDetailViewModel {
  return characterDetailDesignFixture
}

export function PersonajeDetallePage() {
  const { id } = useParams()
  const sourceId = normalizeIceAndFireExternalId(id)
  const character = useCharacter(sourceId ?? undefined)

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

  return <CharacterDetailView character={resolveCharacterDetailViewModel()} />
}
