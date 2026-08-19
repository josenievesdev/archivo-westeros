import './character-detail.css'
import '../../inicio/styles/home.css'
import { HomeFooter } from '../../inicio/components/HomeFooter'
import { CharacterAmbientPanel } from './CharacterAmbientPanel'
import { CharacterFacts } from './CharacterFacts'
import { CharacterFamilyPanel } from './CharacterFamilyPanel'
import { CharacterHero } from './CharacterHero'
import { CharacterLoyaltiesPanel } from './CharacterLoyaltiesPanel'
import { CharacterRelations } from './CharacterRelations'
import { CharacterSeasonsPanel } from './CharacterSeasonsPanel'
import { CharacterTimeline } from './CharacterTimeline'
import type { CharacterDetailViewModel } from './character-detail.types'

interface CharacterDetailViewProps {
  character: CharacterDetailViewModel
}

/**
 * `02 · Ficha de personaje`, puramente presentacional.
 *
 * No consulta la API, no conoce ThronesAPI ni An API of Ice and Fire, no llama
 * a `useCharacterMedia`, no normaliza DTOs, no resuelve IDs canónicos y no
 * decide qué es spoiler. Recibe un `CharacterDetailViewModel` ya resuelto y lo
 * pinta.
 *
 * `data-house` propaga la atmósfera de la casa a todos los descendientes, de
 * modo que la misma estructura sirve a las siete casas —y al tema neutro—
 * cambiando solo el acento. No hay una página por personaje.
 */
export function CharacterDetailView({ character }: CharacterDetailViewProps) {
  const theme = character.house?.theme ?? 'neutral'

  return (
    <div className="character-detail" data-house={theme}>
      <CharacterHero character={character} theme={theme} />
      <CharacterFacts facts={character.facts} />

      <div className="character-detail-width character-detail__body">
        <div className="character-detail__main">
          <CharacterTimeline copy={character.timelineCopy} items={character.timeline} />
          <CharacterRelations
            copy={character.relationshipsCopy}
            relationships={character.relationships}
          />
        </div>

        <div className="character-detail__aside">
          <CharacterFamilyPanel family={character.family} />
          <CharacterLoyaltiesPanel loyalties={character.loyalties} />
          <CharacterSeasonsPanel note={character.seasonsNote} seasons={character.seasons} />
          <CharacterAmbientPanel ambient={character.ambient} />
        </div>
      </div>

      <HomeFooter />
    </div>
  )
}
