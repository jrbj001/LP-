'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Search, SlidersHorizontal } from 'lucide-react'
import type { Pillar, Practice } from '@/lib/alquimia/types'

export function PracticeLibrary({
  practices,
  pillars,
  compact = false,
}: {
  practices: Practice[]
  pillars: Pillar[]
  compact?: boolean
}) {
  const [query, setQuery] = useState('')
  const [system, setSystem] = useState<'all' | 'danaher' | 'abi'>('all')
  const [pillar, setPillar] = useState('all')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return practices.filter(practice => {
      if (system !== 'all' && practice.system !== system) return false
      if (pillar !== 'all' && !practice.pillarIds.includes(pillar as never)) return false
      if (!normalized) return true
      return `${practice.title} ${practice.summary} ${practice.area}`
        .toLocaleLowerCase('pt-BR')
        .includes(normalized)
    })
  }, [pillar, practices, query, system])

  const visible = compact ? filtered.slice(0, 12) : filtered

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border border-black/[0.07] bg-white p-3 md:grid-cols-[1fr_auto_auto]">
        <label className="flex items-center gap-2.5 rounded-xl bg-[#F7F5ED] px-3.5">
          <Search className="h-3.5 w-3.5 text-[#3A5976]" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar prática, área ou conceito"
            className="min-w-0 flex-1 bg-transparent py-3 text-[11px] outline-none placeholder:text-black/25"
          />
        </label>
        <div className="flex rounded-xl bg-[#F7F5ED] p-1">
          {(
            [
              ['all', 'Todos'],
              ['danaher', 'Danaher'],
              ['abi', 'AB InBev'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSystem(value)}
              className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                system === value ? 'bg-[#00435D] text-white' : 'text-black/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-xl bg-[#F7F5ED] px-3">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#3A5976]" />
          <select
            value={pillar}
            onChange={event => setPillar(event.target.value)}
            className="bg-transparent py-3 text-[9px] font-medium text-[#00435D] outline-none"
          >
            <option value="all">Todos os pilares</option>
            {pillars.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between px-1 text-[9px] uppercase tracking-wider text-black/30">
        <span>{filtered.length} práticas encontradas</span>
        <span>Fontes atribuídas</span>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visible.map(practice => (
          <article
            key={practice.id}
            className="group flex min-h-56 flex-col rounded-2xl border border-black/[0.07] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#00435D]/25 hover:shadow-[0_14px_35px_rgba(0,67,93,0.07)]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-[family-name:var(--font-alquimia-display)] text-[10px] text-[#3A5976]">
                {String(practice.number).padStart(2, '0')}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider ${
                  practice.system === 'danaher'
                    ? 'bg-[#00435D]/7 text-[#00435D]'
                    : 'bg-[#E0CE7A]/30 text-[#675300]'
                }`}
              >
                {practice.system === 'danaher' ? 'Danaher DBS' : 'AB InBev'}
              </span>
            </div>
            <BookOpen className="mt-6 h-4 w-4 text-[#3A5976]" />
            <h3 className="mt-3 text-[14px] font-semibold leading-snug text-[#003b52]">
              {practice.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-[10px] leading-relaxed text-black/40">
              {practice.summary}
            </p>
            <div className="mt-auto border-t border-black/[0.06] pt-4">
              <p className="text-[8px] font-medium uppercase tracking-wider text-black/25">
                {practice.area}
              </p>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-3 rounded-2xl border border-dashed border-black/15 py-12 text-center text-[11px] text-black/35">
          Nenhuma prática combina com estes filtros.
        </div>
      )}
    </div>
  )
}
