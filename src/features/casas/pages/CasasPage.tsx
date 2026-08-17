import { Link } from 'react-router-dom'
import { useHouses } from '../api/use_houses'

export function CasasPage() {
  const houses = useHouses({ page: 1, pageSize: 12 })

  return (
    <section className="space-y-8">
      <header className="max-w-2xl space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-200/70">
          Heráldica inicial
        </p>
        <h1 className="font-serif text-4xl text-stone-100 sm:text-5xl">Casas</h1>
        <p className="leading-7 text-stone-400">
          Primera lectura de casas, regiones, lemas y asientos mediante el modelo
          interno de la aplicación.
        </p>
      </header>

      {houses.isPending && <p className="text-stone-400">Cargando casas...</p>}
      {houses.isError && <p className="text-red-300">No fue posible obtener las casas.</p>}
      {houses.data && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {houses.data.map((house) => (
            <li key={house.id}>
              <Link
                className="block h-full rounded-lg border border-stone-800 bg-stone-900/50 p-5 transition-colors hover:border-stone-600"
                to={`/casas/${house.id}`}
              >
                <h2 className="font-serif text-xl text-stone-100">{house.name}</h2>
                <p className="mt-2 text-sm text-stone-500">
                  {house.region || 'Región no indicada'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
