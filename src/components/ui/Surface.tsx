import type { ElementType, HTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'

type SurfaceVariant = 'slab' | 'raised' | 'inset'
type SurfaceElement = 'article' | 'aside' | 'div' | 'section'

interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: SurfaceElement
  variant?: SurfaceVariant
}

const variants: Record<SurfaceVariant, string> = {
  slab: 'border border-etch bg-slab',
  raised: 'border border-etch bg-relief shadow-raised',
  inset: 'border border-etch bg-stone',
}

export function Surface({
  as = 'div',
  className,
  variant = 'slab',
  ...props
}: SurfaceProps) {
  const Component: ElementType = as

  return (
    <Component
      className={cx('rounded-etched', variants[variant], className)}
      {...props}
    />
  )
}
