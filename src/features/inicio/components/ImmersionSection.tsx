import { Flame, Snowflake, Volume2 } from 'lucide-react'

const features = [
  {
    description: 'Crepitar de antorchas, viento en The Wall y ecos de piedra. Siempre bajo control del usuario.',
    icon: Volume2,
    number: 'I',
    title: 'Sonido de sala',
    tone: 'ice',
  },
  {
    description: 'Nieve en el Norte y ceniza donde hubo fuego, como capas ambientales opcionales.',
    icon: Snowflake,
    number: 'II',
    title: 'Ceniza y nieve',
    tone: 'ice',
  },
  {
    description: 'Una futura respuesta visual para las casas de fuego. Breve, explícita y nunca automática.',
    icon: Flame,
    number: 'III',
    title: 'Dracarys',
    tone: 'ember',
  },
] as const

export function ImmersionSection() {
  return (
    <section aria-labelledby="immersion-title" className="immersion-section">
      <div className="home-content-width">
        <header className="immersion-header">
          <p className="home-eyebrow home-eyebrow--ember">Atmósfera</p>
          <h2 id="immersion-title">No se consulta. Se habita.</h2>
          <p>
            El archivo cambia con el contexto: el Norte respira frío y Dragonstone
            conserva la brasa. Todo podrá silenciarse en un gesto.
          </p>
        </header>

        <div className="immersion-features">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article className="immersion-feature" data-tone={feature.tone} key={feature.number}>
                <div className="immersion-feature__marker">
                  <span>{feature.number}</span>
                  <Icon aria-hidden="true" className="size-[1.0625rem]" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
