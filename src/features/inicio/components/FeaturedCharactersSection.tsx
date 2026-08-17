import {
  ArrowRight,
  ChevronDown,
  Clapperboard,
  Handshake,
  HeartPulse,
  Map,
  Shield,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { FEATURED_CHARACTERS } from '../config/home-content'
import { FeaturedCharacterCard } from './FeaturedCharacterCard'

const filters = [
  { icon: Shield, label: 'Casa' },
  { icon: HeartPulse, label: 'Estado' },
  { icon: Map, label: 'Región' },
  { icon: Clapperboard, label: 'Temporada' },
  { icon: Handshake, label: 'Lealtad' },
]

export function FeaturedCharactersSection() {
  return (
    <section aria-labelledby="featured-characters-title" className="featured-characters-section">
      <div className="home-content-width">
        <header className="featured-characters-header">
          <div>
            <p className="home-eyebrow">Archivo de almas</p>
            <h2 id="featured-characters-title">Personajes que mueven el tablero</h2>
          </div>
          <Link to="/personajes">
            Ver todas las fichas
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </header>

        <div aria-label="Filtros disponibles en la futura búsqueda completa" className="featured-filters">
          <span className="featured-filters__label">Filtrar</span>
          {filters.map((filter, index) => {
            const Icon = filter.icon
            return (
              <span className={index === 0 ? 'featured-filter featured-filter--active' : 'featured-filter'} key={filter.label}>
                <Icon aria-hidden="true" className="size-3.5" />
                {filter.label}
                <ChevronDown aria-hidden="true" className="size-3" />
              </span>
            )
          })}
        </div>

        <div className="featured-characters-track">
          {FEATURED_CHARACTERS.map((character) => (
            <FeaturedCharacterCard character={character} key={character.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
