import { ArrowLeft, UserRoundX } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { SectionTitle } from '../../../components/ui/SectionTitle'
import { Surface } from '../../../components/ui/Surface'
import { useCharacter } from '../api/use_characters'

export function PersonajeDetallePage() {
  const { id } = useParams()
  const character = useCharacter(id)

  if (!id) {
    return (
      <EmptyState
        description="La URL no contiene un identificador que podamos consultar."
        headingAs="h1"
        icon={<UserRoundX aria-hidden="true" className="size-5" />}
        role="alert"
        title="El identificador del personaje no es válido"
      />
    )
  }

  if (character.isPending) {
    return (
      <div aria-label="Cargando personaje" className="max-w-4xl space-y-6" role="status">
        <span className="sr-only">Cargando personaje...</span>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-20 max-w-xl" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  if (character.isError) {
    return (
      <EmptyState
        description="La fuente externa no devolvió una ficha válida para esta ruta."
        headingAs="h1"
        icon={<UserRoundX aria-hidden="true" className="size-5" />}
        role="alert"
        title="No fue posible obtener este personaje"
      />
    )
  }

  const displayName =
    character.data.name || character.data.aliases[0] || 'Sin nombre conocido'

  return (
    <article className="max-w-4xl space-y-8 sm:space-y-10">
      <Link
        className="inline-flex min-h-11 items-center gap-2 font-sans text-sm text-parchment hover:text-bone"
        to="/personajes"
      >
        <ArrowLeft aria-hidden="true" className="size-4 text-gold" />
        Volver a personajes
      </Link>
      <SectionTitle
        description={character.data.culture || 'Cultura no indicada'}
        eyebrow="Personaje"
        headingAs="h1"
        size="page"
        title={displayName}
      />
      <Surface className="p-5 sm:p-7">
        <dl className="grid gap-0 sm:grid-cols-2">
          {[
            ['Alias', character.data.aliases.join(', ') || 'No indicados'],
            ['Títulos', character.data.titles.join(', ') || 'No indicados'],
            ['Nacimiento', character.data.born || 'No indicado'],
            ['Interpretado por', character.data.playedBy.join(', ') || 'No indicado'],
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
