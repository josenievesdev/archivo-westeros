import { Building2, SearchX, UserRound, WifiOff } from 'lucide-react'
import { startTransition, useState, type FocusEvent } from 'react'
import { Link } from 'react-router-dom'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import { SearchField } from '../../../components/ui/SearchField'
import { getHouseThemeFromName } from '../../../components/ui/house-theme'
import type { CanonicalCharacterId } from '../../../lib/domain/canonical_entities'
import { QUICK_SEARCHES } from '../config/home-content'
import { useDebouncedValue } from '../hooks/use-debounced-value'
import { useHomeSearch } from '../hooks/use-home-search'
import { useThronesCharactersList } from '../../../hooks/use-thrones-characters-list.ts'
import { getCharacterMediaFromList } from '../../../services/character_media_service'

export function HomeSearch() {
  const [value, setValue] = useState('')
  const [submittedValue, setSubmittedValue] = useState('')
  const [preferredCharacterId, setPreferredCharacterId] =
    useState<CanonicalCharacterId>()
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set())
  const trimmedValue = value.trim()
  const debouncedValue = useDebouncedValue(trimmedValue, 350)
  const effectiveValue = submittedValue || (trimmedValue.length >= 2 ? debouncedValue : '')
  const search = useHomeSearch(effectiveValue, preferredCharacterId)
  const { data: thronesCharacters } = useThronesCharactersList()
  const isWaitingForDebounce =
    trimmedValue.length >= 2 && !submittedValue && debouncedValue !== trimmedValue
  const showResults = search.enabled && !isWaitingForDebounce
  const hasResults = search.characters.length > 0 || search.houses.length > 0

  function updateValue(nextValue: string) {
    setValue(nextValue)
    setSubmittedValue('')
    setPreferredCharacterId(undefined)
  }

  function submitValue(
    nextValue: string,
    nextPreferredCharacterId?: CanonicalCharacterId,
  ) {
    setValue(nextValue)
    setSubmittedValue(nextValue.trim())
    setPreferredCharacterId(nextPreferredCharacterId)
  }

  function searchQuickTerm(term: string, characterId: CanonicalCharacterId) {
    startTransition(() => submitValue(term, characterId))
  }

  function revealQuickTerm(event: FocusEvent<HTMLButtonElement>) {
    event.currentTarget.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }

function handleImageError(characterId: string) {
     // Marcar esta imagen como fallida para mostrar el fallback
     setFailedImageIds((prev) => {
       const newSet = new Set(prev)
       newSet.add(characterId)
       return newSet
     })
   }

  return (
    <div className="home-search">
      <SearchField
        autoComplete="off"
        label="Buscar personajes y casas"
        loading={isWaitingForDebounce || search.isFetching}
        onClear={() => {
          setSubmittedValue('')
          setPreferredCharacterId(undefined)
          setFailedImageIds(new Set()) // Limpiar errores al limpiar la búsqueda
        }}
        onSubmit={submitValue}
        onValueChange={updateValue}
        placeholder="Busca un personaje, una casa, un título o un alias…"
        prominent
        shortcut="⌘K"
        value={value}
      />

      {!showResults && (
        <div aria-label="Búsquedas frecuentes" className="home-search__quick">
          <span className="home-search__quick-label">Más buscados</span>
          <div className="home-search__quick-list">
            {QUICK_SEARCHES.map((item) => (
              <button
                className="home-search__quick-button"
                data-house={item.theme}
                key={item.term}
                onClick={() => searchQuickTerm(item.term, item.characterId)}
                onFocus={revealQuickTerm}
                type="button"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--house-accent)]" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showResults && (
        <section
          aria-label={`Resultados para ${effectiveValue}`}
          aria-live="polite"
          className="home-search__results"
        >
          {search.isError ? (
            <div className="home-search__message" role="alert">
              <WifiOff aria-hidden="true" className="size-5 text-fallen" />
              <div>
                <p className="font-display text-sm font-semibold text-bone">El archivo no responde</p>
                <p className="mt-1 font-serif text-base text-parchment">Prueba de nuevo en unos instantes.</p>
              </div>
            </div>
          ) : !search.isFetching && !hasResults ? (
            <div className="home-search__message">
              <SearchX aria-hidden="true" className="size-5 text-gold" />
              <div>
                <p className="font-display text-sm font-semibold text-bone">Sin resultados</p>
                <p className="mt-1 font-serif text-base text-parchment">Escribe el nombre completo o prueba una búsqueda frecuente.</p>
              </div>
            </div>
          ) : (
            <div className="home-search__result-columns">
              {search.characters.length > 0 && (
                <div>
                  <p className="home-search__result-heading">Personajes</p>
                  <ul className="mt-2 space-y-1">
                    {search.characters.map((hit) => {
                      const { character, view } = hit
                      const summary = hit.disambiguation || view.summary

                      // Obtener la media del personaje desde la lista cacheada
                      const media = thronesCharacters
                        ? getCharacterMediaFromList(thronesCharacters, character)
                        : undefined

                      // Determinar si mostrar la miniatura o el fallback
                      const showThumbnail =
                        media !== undefined && !failedImageIds.has(character.id)

                      return (
                        <li key={character.id}>
                          <Link className="home-search__result-link" to={`/personajes/${character.source.externalId}`}>
                            {showThumbnail ? (
                              <img
                                src={media.portraitUrl}
                                alt="" // Decorativo, el nombre ya está presente
                                className="home-search__character-thumbnail"
                                onError={() => handleImageError(character.id)}
                              />
                            ) : (
                              view.houseTheme ? (
                                <HouseSigil decorative house={view.houseTheme} size={22} />
                              ) : (
                                <UserRound aria-hidden="true" className="size-[1.375rem] text-ice" />
                              )
                            )}
                            <span className="min-w-0">
                              <span className="block truncate font-display text-sm font-semibold text-bone">{view.name}</span>
                              <span className="mt-0.5 block truncate font-serif text-sm italic text-parchment}">
                                {summary}
                              </span>
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {search.houses.length > 0 && (
                <div>
                  <p className="home-search__result-heading">Casas</p>
                  <ul className="mt-2 space-y-1">
                    {search.houses.map((house) => {
                      const theme = getHouseThemeFromName(house.name)

                      return (
                        <li key={house.id}>
                          <Link className="home-search__result-link" data-house={theme} to={`/casas/${house.source.externalId}`}>
                            {theme ? (
                              <HouseSigil decorative house={theme} size={22} />
                            ) : (
                              <Building2 aria-hidden="true" className="size-[1.375rem] text-gold" />
                            )}
                            <span className="min-w-0">
                              <span className="block truncate font-display text-sm font-semibold text-bone">{house.name}</span>
                              <span className="mt-0.5 block truncate font-serif text-sm italic text-parchment}">
                                {house.region || house.words || 'Casa registrada'}
                              </span>
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}