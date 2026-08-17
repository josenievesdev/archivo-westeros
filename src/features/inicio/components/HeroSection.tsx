import { HomeSearch } from './HomeSearch'

const stats = [
  { label: 'personajes destacados', value: '5' },
  { label: 'grandes casas', value: '7' },
  { label: 'temporadas', value: '8' },
  { label: 'tipos de búsqueda', value: '2' },
]

const embers = [
  '880-300',
  '960-420',
  '1040-250',
  '1120-500',
  '820-560',
  '1200-360',
  '760-420',
  '1010-600',
  '1160-220',
  '900-660',
]

export function HeroSection() {
  return (
    <section aria-labelledby="home-title" className="home-hero">
      <div aria-hidden="true" className="home-hero__atmosphere">
        <span className="home-hero__ice-light" />
        <span className="home-hero__beam home-hero__beam--300" />
        <span className="home-hero__beam home-hero__beam--520" />
        <span className="home-hero__beam home-hero__beam--700" />
        <span className="home-hero__beam home-hero__beam--930" />
        <span className="home-hero__ember-light" />
        <span className="home-hero__ember-left" />
        <span className="home-hero__vignette home-hero__vignette--left" />
        <span className="home-hero__vignette home-hero__vignette--right" />
        {embers.map((ember) => (
          <i className="home-hero__ember" data-ember={ember} key={ember} />
        ))}
      </div>
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
