import { LoaderCircle, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, type FormEvent, type InputHTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'
import { Button, IconButton } from './Button'

interface SearchFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onSubmit' | 'size' | 'type' | 'value'
  > {
  hint?: string
  label: string
  loading?: boolean
  onClear?: () => void
  onSubmit?: (value: string) => void
  onValueChange: (value: string) => void
  prominent?: boolean
  shortcut?: string
  submitLabel?: string
  value: string
}

export function SearchField({
  'aria-describedby': ariaDescribedBy,
  className,
  disabled = false,
  hint,
  id,
  label,
  loading = false,
  onClear,
  onSubmit,
  onValueChange,
  prominent = false,
  shortcut,
  submitLabel = 'Buscar',
  value,
  ...inputProps
}: SearchFieldProps) {
  const generatedId = useId()
  const inputId = id ?? `${generatedId}-search`
  const hintId = `${inputId}-hint`
  const inputRef = useRef<HTMLInputElement>(null)
  const describedBy = [ariaDescribedBy, hint ? hintId : undefined].filter(Boolean).join(' ')

  useEffect(() => {
    if (!shortcut) return

    function focusSearch(event: KeyboardEvent) {
      if (event.key.toLocaleLowerCase('en') === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [shortcut])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!disabled && !loading) {
      onSubmit?.(value.trim())
    }
  }

  function handleClear() {
    onValueChange('')
    onClear?.()
    inputRef.current?.focus()
  }

  return (
    <div className={cx('w-full', className)}>
      <form aria-busy={loading} role="search" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={inputId}>
          {label}
        </label>
        <div
          className={cx(
            'group relative flex min-h-16 items-center gap-2 rounded-etched border border-old-gold bg-[#0d0f13e6] p-2 pl-4 shadow-search transition-[border-color,box-shadow] focus-within:border-gold focus-within:shadow-[0_0_0_1px_#c9a44c40,0_24px_60px_-10px_#000000b3] sm:pl-6',
            prominent && 'min-h-[4.875rem]',
          )}
        >
          {prominent && (
            <>
              <span aria-hidden="true" className="absolute -top-1.5 -left-1.5 size-3 border-t border-l border-gold" />
              <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 size-3 border-t border-r border-gold" />
              <span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 size-3 border-b border-l border-gold" />
              <span aria-hidden="true" className="absolute -right-1.5 -bottom-1.5 size-3 border-r border-b border-gold" />
            </>
          )}
          <Search aria-hidden="true" className="size-5 flex-none text-gold" />
          <input
            aria-keyshortcuts={shortcut ? 'Meta+K Control+K' : undefined}
            aria-describedby={describedBy || undefined}
            className={cx(
              'min-h-12 min-w-0 flex-1 border-0 bg-transparent px-1 font-serif text-base text-bone outline-none placeholder:text-parchment disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg',
              prominent && 'sm:text-xl',
            )}
            disabled={disabled}
            id={inputId}
            onChange={(event) => onValueChange(event.target.value)}
            ref={inputRef}
            type="search"
            value={value}
            {...inputProps}
          />
          {loading && (
            <span aria-label="Buscando" role="status">
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-gold" />
            </span>
          )}
          {!loading && value && (
            <IconButton
              className="flex-none"
              disabled={disabled}
              label="Limpiar búsqueda"
              onClick={handleClear}
            >
              <X aria-hidden="true" className="size-4" />
            </IconButton>
          )}
          {shortcut && !value && (
            <kbd className="hidden flex-none rounded-etched border border-etch px-2 py-1 font-sans text-[0.6875rem] tracking-[0.08em] text-parchment lg:inline-flex">
              {shortcut}
            </kbd>
          )}
          {onSubmit && (
            <span className="hidden sm:contents">
              <Button
                className="flex-none"
                disabled={disabled}
                loading={loading}
                type="submit"
                variant="primary"
              >
                {submitLabel}
              </Button>
            </span>
          )}
        </div>
        {onSubmit && (
          <span className="mt-3 block sm:hidden">
            <Button
              className="w-full"
              disabled={disabled}
              loading={loading}
              type="submit"
              variant="primary"
            >
              {submitLabel}
            </Button>
          </span>
        )}
      </form>
      {hint && (
        <p className="mt-2 font-sans text-xs leading-5 text-parchment" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  )
}
