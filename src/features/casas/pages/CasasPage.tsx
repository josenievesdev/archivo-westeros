import { Shield, ShieldX, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, Skeleton } from '../../../components/ui/Feedback'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import { SectionTitle } from '../../../components/ui/SectionTitle'
import { getHouseThemeFromName } from '../../../components/ui/house-theme'
import { useHouses } from '../api/use_houses'

export function CasasPage() {
  const houses = useHouses({ page: 1, pageSize: 12 })

  return (
    <section aria-labelledby="houses-title" className="space-y-8 sm:space-y-10">
      <SectionTitle
        description="Primera lectura de casas, regiones, lemas y asientos mediante el modelo interno de la aplicación."
        eyebrow="Heráldica inicial"
        headingAs="h1"
        headingId="houses-title"
        size="page"
        title="Casas"
      />

      {houses.isPending && (
        <div aria-label="Cargando casas" role="status">
          <span className="sr-only">Cargando casas...</span>
          <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-40" />
              </li>
            ))}
          </ul>
        </div>
      )}
      {houses.isError && (
        <EmptyState
          description="La fuente externa no respondió. La navegación local permanece disponible."
          icon={<WifiOff aria-hidden="true" className="size-5" />}
          role="alert"
          title="No fue posible obtener las casas"
        />
      )}
      {houses.data?.length === 0 && (
        <EmptyState
          description="No se recibieron casas para esta primera página del archivo."
          icon={<ShieldX aria-hidden="true" className="size-5" />}
          title="No hay casas registradas"
        />
      )}
      {houses.data && houses.data.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {houses.data.map((house) => {
            const theme = getHouseThemeFromName(house.name)

            return (
              <li key={house.id}>
                <Link
                  className="group flex min-h-40 h-full items-start gap-4 rounded-etched border border-etch bg-slab p-5 transition-[border-color,background-color,transform] hover:border-[var(--house-accent)] hover:bg-relief lg:hover:-translate-y-0.5"
                  data-house={theme}
                  to={`/casas/${house.id}`}
                >
                  <span className="grid size-12 flex-none place-items-center rounded-full border border-etch bg-stone text-gold">
                    {theme ? (
                      <HouseSigil decorative house={theme} size={24} />
                    ) : (
                      <Shield aria-hidden="true" className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-semibold leading-6 text-bone">
                      {house.name}
                    </span>
                    <span className="mt-2 block font-sans text-xs uppercase tracking-[0.12em] text-parchment">
                      {house.region || 'Región no indicada'}
                    </span>
                    {house.words && (
                      <span className="mt-3 block font-serif text-base italic leading-6 text-parchment">
                        “{house.words}”
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
