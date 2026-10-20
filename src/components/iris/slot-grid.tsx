'use client'

import type { IrisCopy } from '@/lib/iris/data'
import type { IrisSlot } from '@/lib/iris/slots'

export function SlotGrid({
  slots,
  selected,
  loading,
  copy,
  onSelect,
}: {
  slots: IrisSlot[]
  selected: string | null
  loading: boolean
  copy: IrisCopy
  onSelect: (slot: IrisSlot) => void
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-busy="true" aria-label={copy.loadingSlots}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="h-11 animate-pulse rounded-xl bg-[var(--iris-line)]" />
        ))}
      </div>
    )
  }

  const visible = slots.filter(slot => slot.status !== 'past')
  const nextFree = visible.find(slot => slot.status === 'free')

  if (!nextFree) {
    return <p className="rounded-xl border border-dashed border-[var(--iris-line)] p-5 text-sm text-[var(--iris-muted)]">{copy.noSlots}</p>
  }

  return (
    <div role="radiogroup" aria-label={copy.stepTime} className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {visible.map(slot => {
        const isSelected = slot.start === selected
        const isNext = slot === nextFree
        const taken = slot.status === 'taken'
        return (
          <button
            key={slot.start}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={taken}
            onClick={() => onSelect(slot)}
            className={[
              'relative h-11 rounded-xl text-sm font-medium tabular-nums transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iris-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iris-card)]',
              isSelected
                ? 'bg-[var(--iris-accent)] text-white shadow-sm'
                : taken
                  ? 'cursor-not-allowed text-[var(--iris-muted)] line-through opacity-40'
                  : 'border border-[var(--iris-line)] bg-white hover:border-[var(--iris-accent)] hover:text-[var(--iris-accent)]',
            ].join(' ')}
          >
            {slot.time}
            {isNext && !isSelected && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--iris-wood)] px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-white">
                {copy.nextFree}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
