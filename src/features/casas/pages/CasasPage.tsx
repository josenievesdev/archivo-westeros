import {
  Building2,
  ChevronLeft,
  ChevronRight,
  SearchX,
  ShieldX,
  WifiOff,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import { SearchField } from '../../../components/ui/SearchField'
import { SectionTitle } from '../../../components/ui/SectionTitle'
import { Surface } from '../../../components/ui/Surface'
import { MAJOR_HOUSE_METADATA } from '../../../content/house_editorial_metadata'
import type { CanonicalHouse } from '../../../lib/domain/canonical_entities'
import type {
  HouseArchiveEntry,
  MajorHouseMetadata,
} from '../../../lib/domain/house_types'
import {
  buildHouseArchiveEntries,
  filterHouseArchiveEntriesByRegion,
  getHouseArchiveRegions,
  searchHouseArchiveEntries,
} from '../../../services/house_archive'
import {
  HOUSE_ARCHIVE_PAGE_SIZE,
  useHouseArchivePage,
  useMajorHouses,
} from '../api/use_houses'

interface MajorHouseCardProps {
  house: CanonicalHouse
  metadata: MajorHouseMetadata
}

function MajorHouseCard({ house, metadata }: MajorHouseCardProps) {
  return (
    <li className="min-w-0">
      <Link
        aria-label={`Ver casa ${metadata.shortName}: ${house.name}`}
        className="group block h-full rounded-etched focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        data-house={metadata.themeKey}
        to={`/casas/${house.source.externalId}`}
      >
        <Surface
          as="article"
          className="flex h-full min-h-64 flex-col p-5 transition-[border-color,background-color,transform] group-hover:-translate-y-0.5 group-hover:border-[var(--house-accent)] group-hover:bg-relief sm:p-6"
          variant="raised"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-gold">
                Gran casa
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-bone">
                {metadata.shortName}
              </h3>
            </div>
            <span className="grid size-14 flex-none place-items-center rounded-full border border-[var(--house-accent)]/50 bg-stone text-[var(--house-accent)]">
              <HouseSigil decorative house={metadata.themeKey} size={30} />
            </span>
          </div>

          <p className="mt-4 break-words font-serif text-sm leading-6 text-parchment">
            {house.name}
          </p>

          <dl className="mt-5 grid gap-3 border-t border-etch pt-4 font-sans text-xs">
            {house.region && (
              <div>
                <dt className="uppercase tracking-[0.12em] text-ash">Región</dt>
                <dd className="mt-1 break-words text-bone">{house.region}</dd>
              </div>
            )}
            {house.seats[0] && (
              <div>
                <dt className="uppercase tracking-[0.12em] text-ash">Asiento</dt>
                <dd className="mt-1 break-words text-bone">{house.seats[0]}</dd>
              </div>
            )}
          </dl>

          {house.words && (
            <p className="mt-auto pt-5 font-serif text-base italic leading-6 text-bone">
              “{house.words}”
            </p>
          )}
        </Surface>
      </Link>
    </li>
  )
}

function ArchiveHouseCard({ entry }: { entry: HouseArchiveEntry }) {
  return (
    <li className="min-w-0">
      <Link
        aria-label={`Ver ${entry.displayName}`}
        className="group block h-full rounded-etched focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        to={`/casas/${entry.sourceId}`}
      >
        <Surface
          as="article"
          className="flex h-full min-h-44 items-start gap-4 p-5 transition-[border-color,background-color,transform] group-hover:-translate-y-0.5 group-hover:border-old-gold group-hover:bg-relief"
        >
          <span className="grid size-12 flex-none place-items-center rounded-full border border-etch bg-stone text-gold">
            <Building2 aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="break-words font-display text-lg font-semibold leading-6 text-bone">
              {entry.displayName}
            </h3>
            <p className="mt-2 break-words font-sans text-xs uppercase tracking-[0.12em] text-parchment">
              {entry.region || 'Región no indicada'}
            </p>
            {entry.seats[0] && (
              <p className="mt-2 break-words font-serif text-sm leading-5 text-ash">
                {entry.seats[0]}
              </p>
            )}
            {entry.words && (
              <p className="mt-3 break-words font-serif text-base italic leading-6 text-parchment">
                “{entry.words}”
              </p>
            )}
          </div>
        </Surface>
      </Link>
    </li>
  )
}

function ArchiveSkeletons() {
  return (
    <div aria-label="Cargando archivo de casas" role="status">
      <span className="sr-only">Cargando archivo de casas...</span>
      <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: HOUSE_ARCHIVE_PAGE_SIZE }, (_, index) => (
          <li key={index}>
            <Skeleton className="h-44" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CasasPage() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const majorHouses = useMajorHouses()
  const archive = useHouseArchivePage({
    page,
    pageSize: HOUSE_ARCHIVE_PAGE_SIZE,
  })
  const majorHouseById = new Map(
    majorHouses.data?.houses.map((house) => [house.id, house]) ?? [],
  )
  const orderedMajorHouses = MAJOR_HOUSE_METADATA.flatMap((metadata) => {
    const house = majorHouseById.get(metadata.canonicalId)
    return house ? [{ house, metadata }] : []
  })
  const archiveEntries = archive.data
    ? buildHouseArchiveEntries(archive.data.items)
    : []
  const regions = getHouseArchiveRegions(archiveEntries)
  const selectedRegion = regions.includes(region) ? region : ''
  const searchResults = searchHouseArchiveEntries(archiveEntries, query)
  const visibleEntries = filterHouseArchiveEntriesByRegion(
    searchResults,
    selectedRegion,
  )
  const partialMajorFailureCount = majorHouses.data?.failures.length ?? 0
  const loadedArchivePage = archive.data?.page ?? page

  return (
    <div className="space-y-14 sm:space-y-16">
      <SectionTitle
        description="Consulta primero los linajes principales y recorre después el archivo paginado de casas de la fuente."
        eyebrow="Archivo heráldico"
        headingAs="h1"
        headingId="houses-title"
        size="page"
        title="Casas de Westeros"
      />

      <section aria-labelledby="major-houses-title" className="space-y-6">
        <header className="max-w-3xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Siete linajes prioritarios
          </p>
          <h2
            className="mt-2 font-display text-2xl font-semibold text-bone sm:text-3xl"
            id="major-houses-title"
          >
            Las grandes casas
          </h2>
          <p className="mt-3 font-serif text-lg leading-7 text-parchment">
            Entidades reales de la fuente, ordenadas por la metadata editorial del
            archivo.
          </p>
        </header>

        {majorHouses.isPending && (
          <div aria-label="Cargando las grandes casas" role="status">
            <span className="sr-only">Cargando las grandes casas...</span>
            <ul
              aria-hidden="true"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {MAJOR_HOUSE_METADATA.map((metadata) => (
                <li key={metadata.canonicalId}>
                  <Skeleton className="h-64" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {majorHouses.isError && (
          <EmptyState
            action={
              <Button onClick={() => void majorHouses.refetch()} variant="secondary">
                Reintentar
              </Button>
            }
            description="La colección prioritaria no pudo resolverse. El archivo paginado permanece disponible."
            icon={<WifiOff aria-hidden="true" className="size-5" />}
            role="alert"
            title="No fue posible cargar las grandes casas"
          />
        )}

        {majorHouses.data &&
          partialMajorFailureCount > 0 &&
          orderedMajorHouses.length > 0 && (
          <Surface
            aria-live="polite"
            className="flex flex-col items-start justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center"
            role="status"
            variant="inset"
          >
            <p className="font-serif text-base leading-6 text-parchment">
              {partialMajorFailureCount === 1
                ? 'Una gran casa no pudo cargarse; se muestran las seis disponibles.'
                : `${partialMajorFailureCount} grandes casas no pudieron cargarse; se muestran las disponibles.`}
            </p>
            <Button
              loading={majorHouses.isFetching}
              onClick={() => void majorHouses.refetch()}
              size="sm"
              variant="secondary"
            >
              Reintentar
            </Button>
          </Surface>
        )}

        {majorHouses.data && orderedMajorHouses.length === 0 && (
          <EmptyState
            action={
              <Button onClick={() => void majorHouses.refetch()} variant="secondary">
                Reintentar
              </Button>
            }
            description="Ninguna de las siete entidades prioritarias respondió. Esto no afecta al archivo paginado."
            icon={<ShieldX aria-hidden="true" className="size-5" />}
            title="Las grandes casas no están disponibles"
          />
        )}

        {orderedMajorHouses.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orderedMajorHouses.map(({ house, metadata }) => (
              <MajorHouseCard
                house={house}
                key={metadata.canonicalId}
                metadata={metadata}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="house-archive-title" className="space-y-6">
        <header className="max-w-3xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Registro paginado
          </p>
          <h2
            className="mt-2 font-display text-2xl font-semibold text-bone sm:text-3xl"
            id="house-archive-title"
          >
            Archivo de casas
          </h2>
          <p className="mt-3 font-serif text-lg leading-7 text-parchment">
            Las casas menores se conservan como parte del registro y usan una
            identidad visual genérica.
          </p>
        </header>

        {archive.isPending && <ArchiveSkeletons />}

        {archive.isError && (
          <EmptyState
            action={
              <Button onClick={() => void archive.refetch()} variant="secondary">
                Reintentar
              </Button>
            }
            description="La fuente externa no respondió. Las grandes casas y la navegación local permanecen disponibles."
            icon={<WifiOff aria-hidden="true" className="size-5" />}
            role="alert"
            title="No fue posible obtener el archivo"
          />
        )}

        {archive.data && archive.data.items.length === 0 && (
          <EmptyState
            description={`No se recibieron casas para la página ${archive.data.page} del archivo.`}
            icon={<ShieldX aria-hidden="true" className="size-5" />}
            title="No hay casas en esta página"
          />
        )}

        {archive.data && archive.data.items.length > 0 && (
          <>
            <Surface className="space-y-5 p-4 sm:p-5" variant="inset">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.35fr)] lg:items-end">
                <SearchField
                  hint={`Busca únicamente en las ${archive.data.items.length} casas cargadas de la página ${loadedArchivePage}; no en todo el archivo remoto.`}
                  label="Buscar en la página cargada del archivo de casas"
                  onValueChange={setQuery}
                  placeholder="Nombre, región, lema o asiento"
                  value={query}
                />

                <div>
                  <label
                    className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.12em] text-parchment"
                    htmlFor="house-region-filter"
                  >
                    Región en esta página
                  </label>
                  <select
                    className="min-h-12 w-full rounded-etched border border-etch bg-stone px-4 font-serif text-base text-bone outline-none transition-colors focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40"
                    id="house-region-filter"
                    onChange={(event) => setRegion(event.target.value)}
                    value={selectedRegion}
                  >
                    <option value="">Todas</option>
                    {regions.map((regionName) => (
                      <option key={regionName} value={regionName}>
                        {regionName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p aria-live="polite" className="font-sans text-xs text-ash">
                {visibleEntries.length === 1
                  ? '1 casa coincide en la página cargada.'
                  : `${visibleEntries.length} casas coinciden en la página cargada.`}
              </p>
            </Surface>

            {archive.isFetching && archive.isPlaceholderData && (
              <p aria-live="polite" className="font-sans text-sm text-parchment" role="status">
                Cargando la siguiente página del archivo...
              </p>
            )}

            {visibleEntries.length === 0 ? (
              <EmptyState
                description="Prueba otra búsqueda o región. El resultado solo cubre la página cargada."
                icon={<SearchX aria-hidden="true" className="size-5" />}
                title="Sin resultados en esta página"
              />
            ) : (
              <ul
                aria-busy={archive.isFetching && archive.isPlaceholderData}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleEntries.map((entry) => (
                  <ArchiveHouseCard entry={entry} key={entry.canonicalId} />
                ))}
              </ul>
            )}

            <nav
              aria-label="Paginación del archivo de casas"
              className="flex flex-col items-center justify-between gap-4 border-t border-etch pt-6 sm:flex-row"
            >
              <Button
                disabled={
                  archive.data.pagination.previousPage === null || archive.isFetching
                }
                onClick={() => {
                  const previousPage = archive.data?.pagination.previousPage
                  if (previousPage !== null && previousPage !== undefined) {
                    setRegion('')
                    setPage(previousPage)
                  }
                }}
                size="sm"
                variant="secondary"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
                Anterior
              </Button>

              <p aria-live="polite" className="font-sans text-xs text-parchment">
                Página {loadedArchivePage}
                {archive.data.pagination.lastPage
                  ? ` de ${archive.data.pagination.lastPage}`
                  : ''}
              </p>

              <Button
                disabled={archive.data.pagination.nextPage === null || archive.isFetching}
                onClick={() => {
                  const nextPage = archive.data?.pagination.nextPage
                  if (nextPage !== null && nextPage !== undefined) {
                    setRegion('')
                    setPage(nextPage)
                  }
                }}
                size="sm"
                variant="secondary"
              >
                Siguiente
                <ChevronRight aria-hidden="true" className="size-4" />
              </Button>
            </nav>
          </>
        )}
      </section>
    </div>
  )
}
