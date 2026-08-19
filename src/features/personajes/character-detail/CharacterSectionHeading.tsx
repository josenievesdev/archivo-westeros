interface CharacterSectionHeadingProps {
  caption?: string
  id: string
  title: string
}

/**
 * Título de sección con filete, tal y como lo repiten «Línea de vida» y
 * «Vínculos». El filete lo dibuja el `::after` del título, no un elemento
 * suelto: así no aparece en el árbol de accesibilidad.
 */
export function CharacterSectionHeading({ caption, id, title }: CharacterSectionHeadingProps) {
  return (
    <header className="character-detail__section-head">
      <h2 className="character-detail__section-title" id={id}>
        <span>{title}</span>
      </h2>
      {caption && <p className="character-detail__section-caption">{caption}</p>}
    </header>
  )
}
