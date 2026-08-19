import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface CharacterPanelProps {
  children: ReactNode
  /** Cuerpo con menos aire: lo usa el panel de familia, cuyas filas ya separan. */
  dense?: boolean
  icon: LucideIcon
  id: string
  title: string
}

/** Chapa de piedra de la columna lateral: cabecera con sello y cuerpo. */
export function CharacterPanel({ children, dense, icon: Icon, id, title }: CharacterPanelProps) {
  return (
    <section aria-labelledby={id} className="character-detail__panel">
      <header className="character-detail__panel-head">
        <Icon aria-hidden="true" className="size-[0.875rem]" />
        <h2 className="character-detail__panel-title" id={id}>
          {title}
        </h2>
      </header>
      <div className="character-detail__panel-body" data-dense={dense ? 'true' : undefined}>
        {children}
      </div>
    </section>
  )
}
