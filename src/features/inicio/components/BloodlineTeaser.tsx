import { GitFork } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LineageNodeProps {
  className: string
  initials: string
  name: string
  status: string
  tone?: 'ember' | 'ice' | 'tully'
}

function LineageNode({
  className,
  initials,
  name,
  status,
  tone = 'ice',
}: LineageNodeProps) {
  return (
    <div className={`lineage-node ${className}`} data-tone={tone}>
      <span className="lineage-node__disc">{initials}</span>
      <p className="lineage-node__name">{name}</p>
      <span className="lineage-node__status">{status}</span>
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
            Un mapa de linajes que se lee como un pergamino, no como un diagrama. Sigue
            una línea de sangre, descubre un matrimonio político o el secreto que cambió
            el trono.
          </p>
          <ul className="bloodline-legend">
            <li>
              <span className="bg-ice" />
              <strong>Línea de sangre</strong>
              <em>· padres, hijos, hermanos</em>
            </li>
            <li>
              <span className="bg-gold" />
              <strong>Matrimonio</strong>
              <em>· alianzas y pactos</em>
            </li>
            <li>
              <span className="bg-ember" />
              <strong>Secreto revelado</strong>
              <em>· lo que nadie debía saber</em>
            </li>
          </ul>
          <Link className="home-outline-link" to="/linajes">
            Explorar los linajes
            <GitFork aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        <div
          aria-label="Linaje simplificado de una casa: una rama principal, una alianza y cuatro descendientes; un vínculo adicional permanece protegido."
          className="bloodline-diagram"
          role="img"
        >
          <svg
            aria-hidden="true"
            className="bloodline-diagram__connections"
            preserveAspectRatio="none"
            viewBox="0 0 760 470"
          >
            <path
              className="bloodline-diagram__blood"
              d="M300 102v44M250 146h221M250 146v44M470 146v44M180 248v48M60 296h331M60 296v44M170 296v44M280 296v44M390 296v44"
            />
            <path className="bloodline-diagram__marriage" d="M139 220h82" />
            <path className="bloodline-diagram__secret" d="M470 248v62h90v30" />
            <rect
              className="bloodline-diagram__knot"
              height="13"
              transform="rotate(45 180.5 219.5)"
              width="13"
              x="174"
              y="213"
            />
          </svg>
          <LineageNode
            className="lineage-node--rickard"
            initials="HS"
            name="House Stark"
            status="Archivo"
          />
          <LineageNode
            className="lineage-node--catelyn"
            initials="AT"
            name="Alianza Tully"
            status="Archivo"
            tone="tully"
          />
          <LineageNode
            className="lineage-node--ned"
            initials="RP"
            name="Rama principal"
            status="Archivo"
          />
          <LineageNode
            className="lineage-node--lyanna"
            initials="RL"
            name="Rama lateral"
            status="Archivo"
          />
          <LineageNode
            className="lineage-node--robb"
            initials="I"
            name="Descendiente I"
            status="Protegido"
          />
          <LineageNode
            className="lineage-node--sansa"
            initials="II"
            name="Descendiente II"
            status="Protegido"
          />
          <LineageNode
            className="lineage-node--arya"
            initials="III"
            name="Descendiente III"
            status="Protegido"
          />
          <LineageNode
            className="lineage-node--bran"
            initials="IV"
            name="Descendiente IV"
            status="Protegido"
          />
          <LineageNode
            className="lineage-node--jon"
            initials="?"
            name="Dato protegido"
            status="Bloqueado"
            tone="ember"
          />
          <span className="bloodline-diagram__secret-label">Vínculo protegido</span>
          <span aria-hidden="true" className="bloodline-diagram__fade" />
        </div>
      </div>
    </section>
  )
}
