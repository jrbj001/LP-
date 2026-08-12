'use client'

import type { BacklogCard, BacklogColumnId } from '@/lib/backlog/types'

export function BacklogCardPreview({
  card,
  accent,
  selected,
  levelClass,
  onSelect,
  onMove,
  columns,
}: {
  card: BacklogCard
  accent: string
  selected: boolean
  levelClass: string
  onSelect: () => void
  onMove: (column: BacklogColumnId) => void
  columns: { id: BacklogColumnId; label: string }[]
}) {
  return (
    <article
      className={`rounded-xl border bg-white p-3 shadow-sm transition-colors cursor-pointer ${
        selected ? 'border-neutral-900 ring-1 ring-neutral-900/10' : 'border-black/[0.06] hover:border-neutral-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${levelClass}`}>
          {card.level}
        </span>
        {card.priority && (
          <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">
            {card.priority}
          </span>
        )}
      </div>
      <h4 className="text-[12px] font-semibold text-neutral-900 leading-snug">{card.title}</h4>
      {card.persona && (
        <p className="text-[10px] text-neutral-400 mt-1.5 truncate">
          <span style={{ color: accent }}>●</span> {card.persona}
        </p>
      )}
      {card.acceptance && card.acceptance.length > 0 && (
        <p className="text-[10px] text-neutral-400 mt-1">
          {card.acceptance.length} critério{card.acceptance.length > 1 ? 's' : ''} de aceite
        </p>
      )}
      <div
        className="mt-2.5 pt-2 border-t border-black/[0.04]"
        onClick={e => e.stopPropagation()}
      >
        <label className="sr-only">Mover coluna</label>
        <select
          value={card.column}
          onChange={e => onMove(e.target.value as BacklogColumnId)}
          className="w-full rounded-md border border-black/[0.06] bg-[#fafaf8] px-2 py-1 text-[10px] text-neutral-600"
        >
          {columns.map(c => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </article>
  )
}
