import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'
import { HouseSigil } from './HouseSigil'
import type { HouseTheme } from './house-theme'

type BadgeTone = 'neutral' | 'gold' | 'success' | 'danger' | 'ice'
export type StatusBadgeState = 'alive' | 'dead' | 'unknown' | 'protected'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

interface StatusBadgeProps extends Omit<BadgeProps, 'tone'> {
  label?: string
  state: StatusBadgeState
}

interface HouseBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  house: HouseTheme
  label: string
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-etch bg-white/[0.04] text-parchment',
  gold: 'border-old-gold bg-gold/[0.08] text-gold',
  success: 'border-alive/40 bg-alive/[0.06] text-alive',
  danger: 'border-fallen/40 bg-fallen/[0.06] text-fallen',
  ice: 'border-ice/40 bg-ice/[0.06] text-ice',
}

const statusDefaults: Record<StatusBadgeState, { label: string; tone: BadgeTone }> = {
  alive: { label: 'Vivo', tone: 'success' },
  dead: { label: 'Fallecido', tone: 'danger' },
  unknown: { label: 'Estado desconocido', tone: 'neutral' },
  protected: { label: 'Protegido', tone: 'gold' },
}

export function Badge({ children, className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex min-h-7 items-center gap-2 rounded-etched border px-2.5 py-1 font-sans text-[0.625rem] uppercase tracking-[0.14em]',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ label, state, ...props }: StatusBadgeProps) {
  const status = statusDefaults[state]

  return (
    <Badge tone={status.tone} {...props}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label ?? status.label}
    </Badge>
  )
}

export function HouseBadge({ className, house, label, ...props }: HouseBadgeProps) {
  return (
    <span
      className={cx(
        'house-badge inline-flex min-h-7 items-center gap-2 rounded-etched border px-2.5 py-1 font-sans text-[0.625rem] uppercase tracking-[0.14em]',
        className,
      )}
      data-house={house}
      {...props}
    >
      <HouseSigil decorative house={house} size={14} />
      {label}
    </span>
  )
}
