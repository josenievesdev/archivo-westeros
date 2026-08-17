import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils/cx'
import { Surface } from './Surface'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cx('animate-pulse rounded-etched bg-relief', className)}
      {...props}
    />
  )
}

interface EmptyStateProps extends HTMLAttributes<HTMLElement> {
  action?: ReactNode
  description: string
  headingAs?: 'h1' | 'h2' | 'h3'
  icon?: ReactNode
  title: string
}

export function EmptyState({
  action,
  className,
  description,
  headingAs: Heading = 'h2',
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <Surface
      as="section"
      className={cx('px-5 py-10 text-center sm:px-8', className)}
      {...props}
    >
      {icon && (
        <span className="mx-auto mb-4 grid size-11 place-items-center rounded-full border border-etch text-gold">
          {icon}
        </span>
      )}
      <Heading className="font-display text-xl font-semibold text-bone">{title}</Heading>
      <p className="mx-auto mt-2 max-w-lg font-serif text-lg leading-7 text-parchment">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </Surface>
  )
}
