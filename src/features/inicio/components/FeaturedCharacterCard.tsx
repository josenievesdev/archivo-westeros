import { CharacterCard } from '../../../components/ui/CharacterCard'
import { Skeleton } from '../../../components/ui/Feedback'
import { useCharacter } from '../../personajes/api/use_characters'
import type { FeaturedCharacterConfig } from '../config/home-content'

interface FeaturedCharacterCardProps {
  character: FeaturedCharacterConfig
}

export function FeaturedCharacterCard({ character }: FeaturedCharacterCardProps) {
  const query = useCharacter(character.id)

  if (query.isPending) {
    return (
      <div aria-label={`Cargando ${character.fallbackName}`} className="featured-character-skeleton" role="status">
        <Skeleton className="h-full" />
      </div>
    )
  }

  const data = query.data
  const name = data?.name || character.fallbackName
  const labels = data ? [...data.titles, ...data.aliases] : []
  const verifiedLabel = labels.find(
    (label) => label.toLocaleLowerCase('en') === character.fallbackTitle.toLocaleLowerCase('en'),
  )
  const title = verifiedLabel || character.fallbackTitle

  return (
    <CharacterCard
      alias={title}
      house={character.houseLabel}
      houseTheme={character.houseTheme}
      name={name}
      status={{ label: 'En archivo', state: 'unknown' }}
      to={`/personajes/${character.id}`}
      variant="featured"
    />
  )
}
