interface WarRoomHeaderProps {
  description: string
  eyebrow: string
  title: string
}

/** `Encabezado` del frame: antetítulo, título y bajada centrados sobre el degradado. */
export function WarRoomHeader({ description, eyebrow, title }: WarRoomHeaderProps) {
  return (
    <header className="war-room__header">
      <p className="war-room__eyebrow">{eyebrow}</p>
      <h1 className="war-room__title" id="war-room-title">
        {title}
      </h1>
      <p className="war-room__description">{description}</p>
    </header>
  )
}
