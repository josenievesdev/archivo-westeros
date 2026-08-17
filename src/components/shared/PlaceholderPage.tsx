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
    <section className="max-w-2xl space-y-4">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-200/70">
        {eyebrow}
      </p>
      <h1 className="font-serif text-4xl text-stone-100 sm:text-5xl">{title}</h1>
      <p className="text-lg leading-8 text-stone-400">{description}</p>
      <p className="border-l-2 border-stone-700 pl-4 text-sm text-stone-500">
        Ruta preparada. La funcionalidad se abordará en una fase posterior.
      </p>
    </section>
  )
}
