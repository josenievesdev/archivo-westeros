import { Clock3, Map, Network, Swords } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { moreNavigation } from '../navigation'

const icons: Record<(typeof moreNavigation)[number]['to'], LucideIcon> = {
  '/cronologia': Clock3,
  '/linajes': Network,
  '/mapa': Map,
  '/mesa-de-guerra': Swords,
}

export function MasPage() {
  return (
    <section className="space-y-8">
      <SectionTitle
        description="Accesos a las experiencias de contexto que crecerán sobre esta foundation."
        eyebrow="El archivo"
        headingAs="h1"
        size="page"
        title="Más secciones"
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {moreNavigation.map((item) => {
          const Icon = icons[item.to]

          return (
            <li key={item.to}>
              <Link
                className="group flex min-h-28 h-full items-start gap-4 rounded-etched border border-etch bg-slab p-5 transition-[border-color,background-color] hover:border-old-gold hover:bg-relief"
                to={item.to}
              >
                <span className="grid size-11 flex-none place-items-center rounded-full border border-etch text-gold">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-bone">
                    {item.label}
                  </span>
                  <span className="mt-1 block font-serif text-base leading-6 text-parchment">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
