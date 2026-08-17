import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionTitle } from '../../components/ui/SectionTitle'

export function NotFoundPage() {
  return (
    <section className="max-w-2xl space-y-7">
      <SectionTitle
        description="Esta sección no existe o todavía no ha sido habilitada."
        eyebrow="Error 404"
        headingAs="h1"
        size="page"
        title="Ruta no encontrada"
      />
      <Link
        className="inline-flex min-h-11 items-center gap-2 font-sans text-sm text-gold hover:text-gold-light"
        to="/"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver al inicio
      </Link>
    </section>
  )
}
