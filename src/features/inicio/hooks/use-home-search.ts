import { useHouses } from '../../casas/api/use_houses'
import { useCharacters } from '../../personajes/api/use_characters'
import {
  resolveCharacterSearchTerm,
  resolveHouseSearchTerm,
} from '../config/home-content'

export function useHomeSearch(value: string) {
  const term = value.trim()
  const enabled = term.length >= 2
  const characters = useCharacters(
    {
      name: resolveCharacterSearchTerm(term),
      page: 1,
      pageSize: 8,
    },
    { enabled },
  )
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
