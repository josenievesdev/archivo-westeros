import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CharacterSectionHeading } from './CharacterSectionHeading'
import type { CharacterRelation, CharacterSectionCopy } from './character-detail.types'

/** Iniciales de reserva cuando el ViewModel no las trae resueltas. */
function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase('es') ?? '')
    .join('')
}

interface CharacterRelationsProps {
  copy?: CharacterSectionCopy
  relationships?: CharacterRelation[]
}

/**
 * Vínculos.
 *
 * Rejilla de tres tarjetas por fila, como en el frame. La tarjeta enlaza solo
 * si el ViewModel trae `to`; nunca se inventa una ruta.
 */
export function CharacterRelations({ copy, relationships }: CharacterRelationsProps) {
  if (!relationships || relationships.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="vinculos" className="character-detail__relations">
      <CharacterSectionHeading
        caption={copy?.caption}
        id="vinculos"
        title={copy?.title ?? 'Vínculos'}
      />

      <ul className="character-detail__relations-grid">
        {relationships.map((relation) => {
          const body: ReactNode = (
            <>
              <span
                aria-hidden="true"
                className="character-detail__relation-disc"
                data-tone={relation.tone ?? 'ice'}
              >
                {relation.initials ?? initialsFrom(relation.name)}
              </span>
              <span className="character-detail__relation-text">
                <span className="character-detail__relation-name">
                  {relation.name}
                  {relation.signal && (
                    <i
                      aria-hidden="true"
                      className="character-detail__relation-signal"
                      data-signal={relation.signal}
                    />
                  )}
                </span>
                {relation.kind && (
                  <em className="character-detail__relation-kind">{relation.kind}</em>
                )}
              </span>
            </>
          )

          return (
            <li key={relation.id}>
              {relation.to ? (
                <Link className="character-detail__relation" to={relation.to}>
                  {body}
                </Link>
              ) : (
                <div className="character-detail__relation">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
