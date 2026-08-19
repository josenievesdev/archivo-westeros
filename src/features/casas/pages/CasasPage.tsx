import {
  Building2,
  ChevronLeft,
  ChevronRight,
  SearchX,
  ShieldX,
  WifiOff,
} from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/houses-archive.css'
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

/* Ficha heráldica: cinta de casa, medallón con sigilo y lema anclado al pie.
   Más presencia que el registro, menos que la pieza de la Home. */
function MajorHouseCard({ house, metadata }: MajorHouseCardProps) {
  return (
    <li className="min-w-0">
      <Link
        aria-label={`Ver casa ${metadata.shortName}: ${house.name}`}
        className="major-house-card"
        data-house={metadata.themeKey}
        to={`/casas/${house.source.externalId}`}
      >
        <article className="major-house-card__frame">
          <div className="major-house-card__head">
            <div className="min-w-0">
              <p className="major-house-card__eyebrow">Gran casa</p>
              <h3 className="major-house-card__name">{metadata.shortName}</h3>
            </div>
            <span className="major-house-card__crest">
              <HouseSigil decorative house={metadata.themeKey} size={30} />
            </span>
          </div>

          <p className="major-house-card__full">{house.name}</p>

          {(house.region || house.seats[0]) && (
            <dl className="major-house-card__facts">
              {house.region && (
                <div>
                  <dt>Región</dt>
                  <dd>{house.region}</dd>
                </div>
              )}
              {house.seats[0] && (
                <div>
                  <dt>Asiento</dt>
                  <dd>{house.seats[0]}</dd>
                </div>
              )}
            </dl>
          )}

          {house.words && (
            <p className="major-house-card__words major-house-card__words--pinned">
              <i aria-hidden="true" />
              <q>{house.words}</q>
            </p>
          )}
        </article>
      </Link>
    </li>
  )
}

/* Registro sobrio: marca cuadrada genérica, sin tema de casa. */
function ArchiveHouseCard({ entry }: { entry: HouseArchiveEntry }) {
  return (
    <li className="min-w-0">
      <Link
        aria-label={`Ver ${entry.displayName}`}
        className="archive-house-card"
        to={`/casas/${entry.sourceId}`}
      >
        <article className="archive-house-card__frame">
          <div className="archive-house-card__head">
            <span className="archive-house-card__mark">
              <Building2 aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="archive-house-card__name">{entry.displayName}</h3>
              <p className="archive-house-card__region">
                {entry.region || 'Región no indicada'}
              </p>
            </div>
          </div>

          {entry.seats[0] && (
            <div className="archive-house-card__meta">
              <p className="archive-house-card__seat">{entry.seats[0]}</p>
            </div>
          )}

          {entry.words && (
            <p className="archive-house-card__words archive-house-card__words--pinned">
              “{entry.words}”
            </p>
          )}
        </article>
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
            <Skeleton className="h-40" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CasasPage() {
  const searchHintId = `${useId()}-archive-hint`
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
                  <Skeleton className="h-[19rem]" />
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
          <ul className="grid-even-rows grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <Surface className="space-y-4 p-4 sm:p-5" variant="inset">
              <div className="houses-toolbar">
                <div>
                  {/* Rótulo puramente visual: el campo ya expone su etiqueta
                      completa a lectores de pantalla. */}
                  <span aria-hidden="true" className="houses-toolbar__label">
                    Buscar en esta página
                  </span>
                  <SearchField
                    aria-describedby={searchHintId}
                    className="houses-toolbar__search"
                    label="Buscar en la página cargada del archivo de casas"
                    onValueChange={setQuery}
                    placeholder="Nombre, región, lema o asiento"
                    value={query}
                  />
                </div>

                <div>
                  <label
                    className="houses-toolbar__label"
                    htmlFor="house-region-filter"
                  >
                    Región en esta página
                  </label>
                  <select
                    className="houses-toolbar__select"
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

              <p className="houses-toolbar__caption">
                <span id={searchHintId}>
                  {`Busca únicamente en las ${archive.data.items.length} casas cargadas de la página ${loadedArchivePage}; no en todo el archivo remoto.`}
                </span>
                <span aria-live="polite">
                  {visibleEntries.length === 1
                    ? '1 casa coincide en la página cargada.'
                    : `${visibleEntries.length} casas coinciden en la página cargada.`}
                </span>
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
                className="grid-even-rows grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleEntries.map((entry) => (
                  <ArchiveHouseCard entry={entry} key={entry.canonicalId} />
                ))}
              </ul>
            )}

            <nav
              aria-label="Paginación del archivo de casas"
              className="houses-pagination"
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
