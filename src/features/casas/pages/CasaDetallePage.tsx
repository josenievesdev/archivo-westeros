import { ArrowLeft, ShieldX } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import { SectionTitle } from '../../../components/ui/SectionTitle'
import { Surface } from '../../../components/ui/Surface'
import { getHouseThemeFromName } from '../../../components/ui/house-theme'
import { useHouse } from '../api/use_houses'

export function CasaDetallePage() {
  const { id } = useParams()
  const house = useHouse(id)

  if (!id) {
    return (
      <EmptyState
        description="La URL no contiene un identificador que podamos consultar."
        headingAs="h1"
        icon={<ShieldX aria-hidden="true" className="size-5" />}
        role="alert"
        title="El identificador de la casa no es válido"
      />
    )
  }

  if (house.isPending) {
    return (
      <div aria-label="Cargando casa" className="max-w-4xl space-y-6" role="status">
        <span className="sr-only">Cargando casa...</span>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-20 max-w-xl" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  if (house.isError) {
    return (
      <EmptyState
        description="La fuente externa no devolvió una ficha válida para esta ruta."
        headingAs="h1"
        icon={<ShieldX aria-hidden="true" className="size-5" />}
        role="alert"
        title="No fue posible obtener esta casa"
      />
    )
  }

  const theme = getHouseThemeFromName(house.data.name)

  return (
    <article className="max-w-4xl space-y-8 sm:space-y-10" data-house={theme}>
      <Link
        className="inline-flex min-h-11 items-center gap-2 font-sans text-sm text-parchment hover:text-bone"
        to="/casas"
      >
        <ArrowLeft aria-hidden="true" className="size-4 text-[var(--house-accent)]" />
        Volver a casas
      </Link>
      <header className="flex items-start gap-4 sm:gap-6">
        {theme && (
          <span className="mt-1 grid size-14 flex-none place-items-center rounded-full border border-etch bg-stone sm:size-20">
            <HouseSigil decorative house={theme} size={36} />
          </span>
        )}
        <SectionTitle
          description={house.data.region || 'Región no indicada'}
          eyebrow="Casa"
          headingAs="h1"
          size="page"
          title={house.data.name}
        />
      </header>
      <Surface className="p-5 sm:p-7">
        <dl className="grid gap-0 sm:grid-cols-2">
          {[
            ['Lema', house.data.words || 'No indicado'],
            ['Asientos', house.data.seats.join(', ') || 'No indicados'],
            ['Títulos', house.data.titles.join(', ') || 'No indicados'],
            [
              'Armas ancestrales',
              house.data.ancestralWeapons.join(', ') || 'No indicadas',
            ],
          ].map(([term, value]) => (
            <div className="border-b border-etch py-5 sm:px-5 sm:odd:pl-0 sm:even:pr-0" key={term}>
              <dt className="font-sans text-xs uppercase tracking-[0.12em] text-parchment">
                {term}
              </dt>
              <dd className="mt-2 font-serif text-lg leading-7 text-bone">{value}</dd>
            </div>
          ))}
        </dl>
      </Surface>
    </article>
  )
}
