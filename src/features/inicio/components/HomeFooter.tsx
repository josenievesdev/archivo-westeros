import { Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FooterItem {
  external?: boolean
  label: string
  to?: string
}

const columns: Array<{ items: FooterItem[]; title: string }> = [
  {
    items: [
      { label: 'Personajes', to: '/personajes' },
      { label: 'Casas', to: '/casas' },
      { label: 'Linajes', to: '/linajes' },
      { label: 'Mapa de Westeros', to: '/mapa' },
    ],
    title: 'Explorar',
  },
  {
    items: [
      { label: 'Cronología', to: '/cronologia' },
      { label: 'Batallas' },
      { label: 'Títulos y cargos' },
      { label: 'Glosario' },
    ],
    title: 'Archivo',
  },
  {
    items: [
      { label: 'Sobre el archivo' },
      { external: true, label: 'Fuente de datos', to: 'https://anapioficeandfire.com/' },
      { label: 'Modo sin spoilers' },
      { label: 'Contacto' },
    ],
    title: 'El proyecto',
  },
]

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-content-width home-footer__main">
        <div className="home-footer__brand">
          <div>
            <Crown aria-hidden="true" className="size-[1.1875rem] text-gold" />
            <p>Archivo de Westeros</p>
          </div>
          <p>
            Proyecto de fans. Sin relación con HBO ni con George R. R. Martin. Hecho
            con respeto por el material original.
          </p>
        </div>

        {columns.map((column) => (
          <nav aria-label={column.title} className="home-footer__column" key={column.title}>
            <h2>{column.title}</h2>
            <ul>
              {column.items.map((item) => (
                <li key={item.label}>
                  {item.to && item.external ? (
                    <a href={item.to} rel="noreferrer" target="_blank">{item.label}</a>
                  ) : item.to ? (
                    <Link to={item.to}>{item.label}</Link>
                  ) : (
                    <span aria-disabled="true" title="Disponible en una fase posterior">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="home-content-width home-footer__legal">
        <p>Proyecto fan · Archivo de Westeros · 2026</p>
        <p>“Valar morghulis”</p>
      </div>
    </footer>
  )
}
