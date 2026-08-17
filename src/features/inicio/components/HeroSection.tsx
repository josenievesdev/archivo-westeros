import { HomeSearch } from './HomeSearch'

const stats = [
  { label: 'personajes destacados', value: '5' },
  { label: 'grandes casas', value: '7' },
  { label: 'temporadas', value: '8' },
  { label: 'tipos de búsqueda', value: '2' },
]

export function HeroSection() {
  return (
    <section aria-labelledby="home-title" className="home-hero">
      <div aria-hidden="true" className="home-hero__ice-light" />
      <div aria-hidden="true" className="home-hero__ember-light" />
      <div className="home-hero__content">
        <p className="home-eyebrow">Archivo abierto · Temporadas I–VIII</p>
        <span aria-hidden="true" className="home-ornament">
          <span />
          <i />
          <span />
        </span>
        <h1 className="home-hero__title" id="home-title">
          Nadie recuerda todos los nombres
        </h1>
        <p className="home-hero__accent">nosotros sí</p>
        <p className="home-hero__description">
          Consulta al instante quién es cada personaje, a qué casa pertenece y qué
          títulos o alias posee, sin abandonar el episodio.
        </p>
        <div className="home-hero__search">
          <HomeSearch />
        </div>
        <dl className="home-stats">
          {stats.map((stat) => (
            <div className="home-stat" key={stat.label}>
              <dd>{stat.value}</dd>
              <dt>{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
