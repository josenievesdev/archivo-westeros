import { CharacterSectionHeading } from './CharacterSectionHeading'
import type { CharacterSectionCopy, CharacterTimelineItem } from './character-detail.types'

interface CharacterTimelineProps {
  copy?: CharacterSectionCopy
  items?: CharacterTimelineItem[]
}

/**
 * Línea de vida.
 *
 * La vista no decide qué momentos son visibles ni los filtra por temporada:
 * pinta la lista que recibe. Cuando exista el Spoiler Shield, recortará
 * `timeline` antes de que llegue aquí. Sin eventos, la sección no se dibuja.
 */
export function CharacterTimeline({ copy, items }: CharacterTimelineProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="linea-de-vida" className="character-detail__timeline">
      <CharacterSectionHeading
        caption={copy?.caption}
        id="linea-de-vida"
        title={copy?.title ?? 'Línea de vida'}
      />

      <ol className="character-detail__events">
        {items.map((item) => (
          <li className="character-detail__event" key={item.id}>
            <p className="character-detail__event-year">{item.label}</p>
            <div className="character-detail__event-body" data-tone={item.tone ?? 'ice'}>
              <span aria-hidden="true" className="character-detail__event-dot" />
              <h3 className="character-detail__event-title">{item.title}</h3>
              {item.description && (
                <p className="character-detail__event-detail">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
