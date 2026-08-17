import { Building2, SearchX, UserRound, WifiOff } from 'lucide-react'
import { startTransition, useState } from 'react'
import { Link } from 'react-router-dom'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import { SearchField } from '../../../components/ui/SearchField'
import { getHouseThemeFromName } from '../../../components/ui/house-theme'
import {
  QUICK_SEARCHES,
  getFeaturedCharacterConfig,
} from '../config/home-content'
import { useDebouncedValue } from '../hooks/use-debounced-value'
import { useHomeSearch } from '../hooks/use-home-search'

export function HomeSearch() {
  const [value, setValue] = useState('')
  const [submittedValue, setSubmittedValue] = useState('')
  const trimmedValue = value.trim()
  const debouncedValue = useDebouncedValue(trimmedValue, 350)
  const effectiveValue = submittedValue || (trimmedValue.length >= 2 ? debouncedValue : '')
  const search = useHomeSearch(effectiveValue)
  const isWaitingForDebounce =
    trimmedValue.length >= 2 && !submittedValue && debouncedValue !== trimmedValue
  const showResults = search.enabled && !isWaitingForDebounce
  const hasResults = search.characters.length > 0 || search.houses.length > 0

  function updateValue(nextValue: string) {
    setValue(nextValue)
    setSubmittedValue('')
  }

  function submitValue(nextValue: string) {
    setValue(nextValue)
    setSubmittedValue(nextValue.trim())
  }

  function searchQuickTerm(term: string) {
    startTransition(() => submitValue(term))
  }

  return (
    <div className="home-search">
      <SearchField
        autoComplete="off"
        label="Buscar personajes y casas"
        loading={isWaitingForDebounce || search.isFetching}
        onClear={() => setSubmittedValue('')}
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
                onClick={() => searchQuickTerm(item.term)}
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
                    {search.characters.map((character) => {
                      const featured = getFeaturedCharacterConfig(character.id)
                      const name = character.name || character.aliases[0] || 'Sin nombre conocido'

                      return (
                        <li key={character.id}>
                          <Link className="home-search__result-link" to={`/personajes/${character.id}`}>
                            {featured ? (
                              <HouseSigil decorative house={featured.houseTheme} size={22} />
                            ) : (
                              <UserRound aria-hidden="true" className="size-[1.375rem] text-ice" />
                            )}
                            <span className="min-w-0">
                              <span className="block truncate font-display text-sm font-semibold text-bone">{name}</span>
                              <span className="mt-0.5 block truncate font-serif text-sm italic text-parchment">
                                {character.aliases[0] || character.culture || 'Personaje registrado'}
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
                          <Link className="home-search__result-link" data-house={theme} to={`/casas/${house.id}`}>
                            {theme ? (
                              <HouseSigil decorative house={theme} size={22} />
                            ) : (
                              <Building2 aria-hidden="true" className="size-[1.375rem] text-gold" />
                            )}
                            <span className="min-w-0">
                              <span className="block truncate font-display text-sm font-semibold text-bone">{house.name}</span>
                              <span className="mt-0.5 block truncate font-serif text-sm italic text-parchment">
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
