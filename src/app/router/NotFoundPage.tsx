import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="space-y-4">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Error 404</p>
      <h1 className="font-serif text-4xl text-stone-100">Ruta no encontrada</h1>
      <p className="max-w-xl text-stone-400">
        Esta sección no existe o todavía no ha sido habilitada.
      </p>
      <Link className="inline-block text-amber-200 hover:text-amber-100" to="/">
        Volver al inicio
      </Link>
    </section>
  )
}
