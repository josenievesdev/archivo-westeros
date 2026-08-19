import { CharacterCard } from '../../../components/ui/CharacterCard'
import { Skeleton } from '../../../components/ui/Feedback'
import {
  createCharacterViewModel,
  localizeCharacterTitle,
} from '../../../content/character_localization'
import { useCharacter } from '../../personajes/api/use_characters'
import { useThronesCharactersList } from '../../../hooks/use-thrones-characters-list'
import { getCharacterMediaFromList } from '../../../services/character_media_service'
import type { FeaturedCharacterConfig } from '../config/home-content'

interface FeaturedCharacterCardProps {
  character: FeaturedCharacterConfig
}

export function FeaturedCharacterCard({ character }: FeaturedCharacterCardProps) {
  const query = useCharacter(character.source.externalId)
  const thronesCharacters = useThronesCharactersList()

  if (query.isPending) {
    return (
      <div aria-label={`Cargando ${character.preferredName}`} className="featured-character-skeleton" role="status">
        <Skeleton className="h-full" />
      </div>
    )
  }

  const view = query.data ? createCharacterViewModel(query.data) : null
  const name = view?.name || character.preferredName
  const title =
    view?.featuredTitle?.value || localizeCharacterTitle(character.featured.title).value

  // Get media from ThronesAPI list if available
  const media = thronesCharacters.data && query.data
    ? getCharacterMediaFromList(thronesCharacters.data, query.data)
    : undefined

  const image = media
    ? {
        src: media.portraitUrl,
        alt: view?.name || character.preferredName,
      }
    : undefined

  return (
    <CharacterCard
      alias={title}
      house={character.featured.houseLabel}
      houseTheme={character.featured.houseTheme}
      name={name}
      image={image}
      status={{ label: 'Archivo', state: 'unknown' }}
      to={`/personajes/${character.source.externalId}`}
      variant="featured"
    />
  )
}
