import { LockKeyhole } from 'lucide-react'
import { useId, type HTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'
import { StatusBadge } from './Badge'
import { Button } from './Button'
import { Surface } from './Surface'

interface SpoilerLockProps extends HTMLAttributes<HTMLElement> {
  description?: string
  onReveal?: () => void
  revealLabel?: string
  title?: string
}

export function SpoilerLock({
  className,
  description = 'Este dato ocurre después de tu progreso actual.',
  onReveal,
  revealLabel = 'Revelar de todos modos',
  title = 'Información protegida',
  ...props
}: SpoilerLockProps) {
  const titleId = useId()

  return (
    <Surface
      aria-labelledby={titleId}
      as="aside"
      className={cx('border-etched-gold p-5 sm:p-6', className)}
      {...props}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 flex-none place-items-center rounded-full border border-old-gold bg-gold/[0.06] text-gold">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <StatusBadge state="protected" />
          <h2 className="mt-3 font-display text-lg font-semibold text-bone" id={titleId}>
            {title}
          </h2>
          <p className="mt-2 font-serif text-lg leading-7 text-parchment">{description}</p>
          {onReveal && (
            <Button className="mt-5" onClick={onReveal} size="sm" variant="secondary">
              {revealLabel}
            </Button>
          )}
        </div>
      </div>
    </Surface>
  )
}
