import type { HouseLeaderViewModel } from './house-detail.types'

interface HouseLeadershipProps {
  leadership: HouseLeaderViewModel[]
}

export function HouseLeadership({ leadership }: HouseLeadershipProps) {
  return (
    <section aria-labelledby="quien-tuvo-el-mando" className="house-detail__leadership">
      <header className="house-detail__section-head">
        <div>
          <h2 id="quien-tuvo-el-mando">Quién tuvo el mando</h2>
          <i aria-hidden="true" />
        </div>
        <p>Tres siglos de cabezas de casa, del primer dragón a la última.</p>
      </header>

      {leadership.length === 0 ? (
        <p className="house-detail__empty">
          No consta quién estuvo al mando de esta casa.
        </p>
      ) : (
        <ol className="house-detail__leaders">
          {leadership.map((leader) => (
            <li
              className="house-detail__leader"
              data-tone={leader.tone ?? 'gold'}
              key={leader.id}
            >
              <i aria-hidden="true" />
              <div className="house-detail__leader-text">
                <p className="house-detail__leader-name">
                  {leader.name}
                  {leader.epithet && <em>· {leader.epithet}</em>}
                </p>
                {leader.description && <p>{leader.description}</p>}
              </div>
              {leader.period && <time>{leader.period}</time>}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
