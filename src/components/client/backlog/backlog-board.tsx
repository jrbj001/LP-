'use client'

import type { BacklogCard, BacklogColumnId } from '@/lib/backlog/types'
import { BacklogCardPreview } from './backlog-card'

const LEVEL_BADGE: Record<string, string> = {
  raw: 'border-amber-200 bg-amber-50 text-amber-700',
  story: 'border-sky-200 bg-sky-50 text-sky-700',
  spec: 'border-teal-200 bg-teal-50 text-teal-700',
}

export function BacklogBoardView({
  columns,
  cards,
  accent,
  selectedId,
  onSelect,
  onMove,
}: {
  columns: { id: BacklogColumnId; label: string }[]
  cards: BacklogCard[]
  accent: string
  selectedId: string | null
  onSelect: (id: string) => void
  onMove: (id: string, column: BacklogColumnId) => void
}) {
  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex gap-3 min-w-[1100px]">
        {columns.map(column => {
          const colCards = cards.filter(c => c.column === column.id)
          return (
            <section
              key={column.id}
              className="flex-1 min-w-[210px] rounded-2xl border border-black/[0.06] bg-[#f5f5f3]/80"
            >
              <header className="px-3 py-3 border-b border-black/[0.05] flex items-center justify-between gap-2">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-500">
                  {column.label}
                </h3>
                <span className="text-[11px] tabular-nums text-neutral-400">{colCards.length}</span>
              </header>
              <div className="p-2 space-y-2 min-h-[320px]">
                {colCards.length === 0 && (
                  <p className="text-[11px] text-neutral-400 px-2 py-6 text-center">Vazio</p>
                )}
                {colCards.map(card => (
                  <BacklogCardPreview
                    key={card.id}
                    card={card}
                    accent={accent}
                    selected={card.id === selectedId}
                    levelClass={LEVEL_BADGE[card.level] ?? LEVEL_BADGE.raw}
                    onSelect={() => onSelect(card.id)}
                    onMove={next => onMove(card.id, next)}
                    columns={columns}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
