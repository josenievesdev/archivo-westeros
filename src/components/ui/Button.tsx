import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils/cx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  label: string
  variant?: Exclude<ButtonVariant, 'primary'>
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-gradient-to-b from-gold-light to-gold-shadow text-void shadow-[0_1px_0_#f6d98c_inset] hover:brightness-110',
  secondary:
    'border-etch bg-white/[0.04] text-bone hover:border-old-gold hover:bg-white/[0.07]',
  ghost: 'border-transparent bg-transparent text-parchment hover:bg-white/[0.05] hover:text-bone',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4 text-[0.6875rem]',
  md: 'min-h-12 px-6 text-xs',
}

export function Button({
  children,
  className,
  disabled,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-etched border font-sans font-semibold uppercase tracking-[0.16em] transition-[border-color,background-color,color,filter] disabled:cursor-not-allowed disabled:opacity-45',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
      <span>{children}</span>
    </button>
  )
}

export function IconButton({
  children,
  className,
  label,
  type = 'button',
  variant = 'ghost',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cx(
        'inline-flex size-11 items-center justify-center rounded-etched border transition-colors disabled:cursor-not-allowed disabled:opacity-45',
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
