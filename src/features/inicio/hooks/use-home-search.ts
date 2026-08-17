import { useHouses } from '../../casas/api/use_houses'
import type { CanonicalCharacterId } from '../../../lib/domain/canonical_entities'
import { useCharacterSearch } from '../../personajes/api/use_characters'
import { resolveHouseSearchTerm } from '../config/home-content'

export function useHomeSearch(
  value: string,
  preferredCharacterId?: CanonicalCharacterId,
) {
  const term = value.trim()
  const enabled = term.length >= 2
  const characters = useCharacterSearch(term, { enabled, preferredCharacterId })
  const houses = useHouses(
    {
      name: resolveHouseSearchTerm(term),
      page: 1,
      pageSize: 8,
    },
    { enabled },
  )

  return {
    characters: characters.data ?? [],
    enabled,
    houses: houses.data ?? [],
    isError: characters.isError || houses.isError,
    isFetching: characters.isFetching || houses.isFetching,
  }
}
