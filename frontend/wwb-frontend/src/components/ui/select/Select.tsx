import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import styles from './Select.module.scss'

export type SelectOption<T extends string = string> = {
  value: T
  label: string
}

type Props<T extends string> = {
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onValueChange: (value: T) => void
  ariaLabel?: string
  placeholder?: string
  startIcon?: ReactNode
  className?: string
  triggerClassName?: string
}

export function Select<T extends string>({
  value,
  options,
  onValueChange,
  ariaLabel = 'Select',
  placeholder,
  startIcon,
  className,
  triggerClassName,
}: Props<T>) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const selectedIndex = useMemo(() => {
    const idx = options.findIndex((o) => o.value === value)
    return idx >= 0 ? idx : 0
  }, [options, value])

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? placeholder ?? '',
    [options, value, placeholder],
  )

  const [open, setOpen] = useState(false)

  const [internalActiveIndex, setInternalActiveIndex] = useState(0)

  const activeIndex = open ? internalActiveIndex : selectedIndex

  const openMenu = () => {
    setInternalActiveIndex(selectedIndex)
    setOpen(true)
  }

  const closeMenu = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const move = (delta: number) => {
    const n = options.length
    if (n === 0) return
    setInternalActiveIndex((i) => (i + delta + n) % n)
  }

  const choose = (v: T) => {
    onValueChange(v)
    closeMenu()
  }

  useEffect(() => {
    if (!open) return
    const btn = itemRefs.current[activeIndex]
    btn?.focus()
  }, [open, activeIndex])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) setOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn(styles.root, open && styles.rootOpen, className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn(styles.trigger, open && styles.triggerOpen, triggerClassName)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!open) openMenu()
            else move(1)
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (!open) openMenu()
            else move(-1)
          }
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (open) closeMenu()
            else openMenu()
          }
        }}
      >
        {startIcon ? <span className={styles.startIcon}>{startIcon}</span> : null}
        <span className={styles.value}>{selectedLabel}</span>
        <ChevronDown
          className={cn(styles.chevron, open && styles.chevronOpen)}
          size={16}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className={styles.menu} role="listbox" id={listboxId} aria-label={ariaLabel}>
          {options.map((o, idx) => {
            const selected = o.value === value
            const active = idx === activeIndex

            return (
              <button
                key={o.value}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  styles.item,
                  active && styles.itemActive,
                  selected && styles.itemSelected,
                )}
                onMouseEnter={() => setInternalActiveIndex(idx)}
                onClick={() => choose(o.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    move(1)
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    move(-1)
                  }
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    choose(o.value)
                  }
                }}
              >
                <span>{o.label}</span>
                <span className={styles.checkWrap} aria-hidden="true">
                  <Check size={16} className={styles.check} />
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
