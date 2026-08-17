import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LineageNodeProps {
  initials: string
  name: string
  tone?: 'gold' | 'ice'
}

function LineageNode({ initials, name, tone = 'ice' }: LineageNodeProps) {
  return (
    <div className="lineage-node" data-tone={tone}>
      <span>{initials}</span>
      <p>{name}</p>
    </div>
  )
}

export function BloodlineTeaser() {
  return (
    <section aria-labelledby="bloodline-title" className="bloodline-section">
      <div className="home-content-width bloodline-layout">
        <div className="bloodline-copy">
          <p className="home-eyebrow home-eyebrow--ice">Linajes y lealtades</p>
          <h2 id="bloodline-title">La sangre explica casi todo</h2>
          <p className="bloodline-copy__description">
            Un mapa de linajes que se lee como un archivo, no como una tabla. Sigue una
            familia, reconoce una alianza y entiende por qué una casa protege su nombre.
          </p>
          <ul className="bloodline-legend">
            <li><span className="bg-ice" />Línea familiar</li>
            <li><span className="bg-gold" />Alianza</li>
            <li><span className="bg-ember" />Dato protegido</li>
          </ul>
          <Link className="home-outline-link" to="/linajes">
            Explorar los linajes
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        <div aria-label="Ejemplo simplificado de un linaje de la casa Stark" className="bloodline-diagram">
          <div className="bloodline-diagram__root">
            <LineageNode initials="HS" name="House Stark" />
          </div>
          <div className="bloodline-diagram__couple">
            <LineageNode initials="NS" name="Ned Stark" />
            <span aria-hidden="true" className="bloodline-diagram__alliance" />
            <LineageNode initials="CT" name="Catelyn Tully" tone="gold" />
          </div>
          <div className="bloodline-diagram__children">
            <LineageNode initials="SS" name="Sansa Stark" />
            <LineageNode initials="AS" name="Arya Stark" />
            <LineageNode initials="BS" name="Bran Stark" />
          </div>
          <span aria-hidden="true" className="bloodline-diagram__fade" />
        </div>
      </div>
    </section>
  )
}
