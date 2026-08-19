import { ChevronRight, GitFork, Shield, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import type { HouseTheme } from '../../../components/ui/house-theme'
import { CharacterPortrait } from './CharacterPortrait'
import type {
  CharacterAction,
  CharacterActionIcon,
  CharacterDetailViewModel,
} from './character-detail.types'

const actionIcons: Record<CharacterActionIcon, LucideIcon> = {
  compare: Users,
  house: Shield,
  lineage: GitFork,
}

/**
 * Las acciones son presentacionales: enlazan o avisan, nada más.
 *
 * Con `to` es un enlace interno, con `href` un enlace externo y sin ninguno de
 * los dos un botón que solo hace lo que le pasen por `onClick`. La vista no
 * decide adónde llevan.
 */
function HeroAction({ action }: { action: CharacterAction }) {
  const Icon = action.icon ? actionIcons[action.icon] : undefined
  const className =
    action.tone === 'primary'
      ? 'character-detail__action character-detail__action--primary'
      : 'character-detail__action'

  const content = (
    <>
      {Icon && <Icon aria-hidden="true" className="size-[0.9375rem]" />}
      {action.label}
    </>
  )

  if (action.to) {
    return (
      <Link className={className} onClick={action.onClick} to={action.to}>
        {content}
      </Link>
    )
  }

  if (action.href) {
    return (
      <a className={className} href={action.href} onClick={action.onClick}>
        {content}
      </a>
    )
  }

  return (
    <button className={className} onClick={action.onClick} type="button">
      {content}
    </button>
  )
}

interface CharacterHeroProps {
  character: CharacterDetailViewModel
  theme: HouseTheme
}

export function CharacterHero({ character, theme }: CharacterHeroProps) {
  const { actions, badges, description, house } = character

  return (
    <section className="character-detail__hero">
      <div aria-hidden="true" className="character-detail__atmosphere">
        <div className="character-detail__cold" />
      </div>

      <div className="character-detail-width character-detail__hero-inner">
        <div className="character-detail__identity">
          <nav aria-label="Ruta de navegación">
            <ol className="character-detail__breadcrumb">
              <li>
                <Link to="/">Archivo</Link>
                <ChevronRight aria-hidden="true" className="size-[0.6875rem]" />
              </li>
              <li>
                <Link to="/personajes">Personajes</Link>
                <ChevronRight aria-hidden="true" className="size-[0.6875rem]" />
              </li>
              <li aria-current="page">{character.displayName}</li>
            </ol>
          </nav>

          {(house || character.origin) && (
            <p className="character-detail__origin">
              {house && (
                <>
                  <HouseSigil decorative house={house.theme ?? theme} size={18} />
                  {house.to ? (
                    <Link className="character-detail__house-link" to={house.to}>
                      {house.label}
                    </Link>
                  ) : (
                    <span className="character-detail__house-link">{house.label}</span>
                  )}
                </>
              )}
              {house && character.origin && (
                <span aria-hidden="true" className="character-detail__origin-dot" />
              )}
              {character.origin && <em>{character.origin}</em>}
            </p>
          )}

          <h1 className="character-detail__name">{character.displayName}</h1>

          {character.secondaryName && (
            <p className="character-detail__alias">{character.secondaryName}</p>
          )}

          {badges && badges.length > 0 && (
            <ul className="character-detail__badges">
              {badges.map((badge) => (
                <li
                  className="character-detail__badge"
                  data-tone={badge.tone ?? 'default'}
                  key={badge.id}
                >
                  {badge.tone === 'alive' && <i aria-hidden="true" />}
                  {badge.label}
                </li>
              ))}
            </ul>
          )}

          {description && <p className="character-detail__summary">{description}</p>}

          {actions && actions.length > 0 && (
            <div className="character-detail__actions">
              {actions.map((action) => (
                <HeroAction action={action} key={action.id} />
              ))}
            </div>
          )}
        </div>

        <CharacterPortrait media={character.media} theme={theme} />
      </div>
    </section>
  )
}
