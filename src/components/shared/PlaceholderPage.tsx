interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="max-w-3xl space-y-7">
      <SectionTitle
        description={description}
        eyebrow={eyebrow}
        headingAs="h1"
        size="page"
        title={title}
      />
      <Surface className="border-l-2 border-l-old-gold p-5 font-serif text-lg text-parchment">
        Ruta preparada. La funcionalidad se abordará en una fase posterior.
      </Surface>
    </section>
  )
}
import { SectionTitle } from '../ui/SectionTitle'
import { Surface } from '../ui/Surface'
