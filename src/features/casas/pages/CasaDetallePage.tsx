import { ShieldX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../../../components/ui/Container'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { IceAndFireApiError } from '../../../lib/api/ice-and-fire'
import { normalizeIceAndFireExternalId } from '../../../lib/domain/canonical_entities'
import { useHouseDataBundle } from '../api/use_houses'
import { HouseDetailView } from '../house-detail/HouseDetailView'
import { toHouseDetailViewModel } from '../house-detail/house-detail.connection'

/**
 * La ficha se sirve a sangre, así que `AppLayout` no le pone caja. Los estados
 * transitorios sí la necesitan para no quedar pegados al canto de la ventana.
 */
function TransientState({ children }: { children: ReactNode }) {
  return (
    <Container className="py-8 sm:py-12 lg:py-16">{children}</Container>
  )
}

export function CasaDetallePage() {
  const { id } = useParams()
  const sourceId = normalizeIceAndFireExternalId(id)
  const houseBundle = useHouseDataBundle(sourceId ?? undefined)

  if (!sourceId) {
    return (
      <TransientState>
        <EmptyState
          description="La URL no contiene un identificador que podamos consultar."
          headingAs="h1"
          icon={<ShieldX aria-hidden="true" className="size-5" />}
          role="alert"
          title="El identificador de la casa no es válido"
        />
      </TransientState>
    )
  }

  if (houseBundle.isPending) {
    return (
      <TransientState>
        <div aria-label="Cargando casa" className="max-w-4xl space-y-6" role="status">
          <span className="sr-only">Cargando casa...</span>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-20 max-w-xl" />
          <Skeleton className="h-72" />
        </div>
      </TransientState>
    )
  }

  if (houseBundle.isError) {
    const isNotFound =
      houseBundle.error instanceof IceAndFireApiError &&
      houseBundle.error.status === 404

    return (
      <TransientState>
        <EmptyState
          description={
            isNotFound
              ? 'No existe una casa de la fuente asociada a este identificador.'
              : 'La fuente externa no devolvió una ficha válida para esta ruta.'
          }
          headingAs="h1"
          icon={<ShieldX aria-hidden="true" className="size-5" />}
          role="alert"
          title={isNotFound ? 'Casa no encontrada' : 'No fue posible obtener esta casa'}
        />
      </TransientState>
    )
  }

  return <HouseDetailView house={toHouseDetailViewModel(houseBundle.data)} />
}
