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
      <form
        aria-busy={loading}
        className={prominent ? 'search-field--prominent' : undefined}
        role="search"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor={inputId}>
          {label}
        </label>
        <div
          className={cx(
            'group relative flex items-center rounded-etched border border-old-gold bg-[#0d0f13e6] shadow-search transition-[border-color,box-shadow] focus-within:border-gold focus-within:shadow-[0_0_0_1px_#c9a44c40,0_24px_60px_-10px_#000000b3]',
            prominent
              ? 'h-[4.875rem] gap-4 py-0 pr-[0.625rem] pl-[1.625rem]'
              : 'min-h-16 gap-2 p-2 pl-4 sm:pl-6',
          )}
        >
          {prominent && (
            <>
              <span
                aria-hidden="true"
                className="absolute -top-[0.3125rem] -left-[0.3125rem] size-2.5 border-t border-l border-gold"
              />
              <span
                aria-hidden="true"
                className="absolute -top-[0.3125rem] -right-[0.3125rem] size-2.5 border-t border-r border-gold"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-[0.3125rem] -left-[0.3125rem] size-2.5 border-b border-l border-gold"
              />
              <span
                aria-hidden="true"
                className="absolute -right-[0.3125rem] -bottom-[0.3125rem] size-2.5 border-r border-b border-gold"
              />
            </>
          )}
          <Search
            aria-hidden="true"
            className={prominent
              ? 'size-[1.3125rem] flex-none text-gold'
              : 'size-5 flex-none text-gold'}
          />
          <input
            aria-keyshortcuts={shortcut ? 'Meta+K Control+K' : undefined}
            aria-describedby={describedBy || undefined}
            className={cx(
              'min-h-12 min-w-0 flex-1 border-0 bg-transparent px-1 font-serif text-base text-bone outline-none placeholder:text-parchment disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg',
              prominent && 'px-0 sm:text-xl',
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
            <kbd className="hidden h-6 flex-none items-center rounded-etched border border-etch px-[0.5625rem] font-sans text-[0.6875rem] leading-[0.875rem] tracking-[0.0375rem] text-ash lg:inline-flex">
              {shortcut}
            </kbd>
          )}
          {prominent && onSubmit && (
            <span
              aria-hidden="true"
              className="hidden h-[2.125rem] w-px flex-none bg-etch sm:block"
            />
          )}
          {onSubmit && (
            <span className="hidden sm:contents">
              <Button
                className={prominent
                  ? 'h-12 min-h-12 flex-none px-[1.875rem] text-[0.71875rem] tracking-[0.15rem]'
                  : 'flex-none'}
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
