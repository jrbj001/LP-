'use client'

import { useMemo, useState } from 'react'
import { Layers3, Search } from 'lucide-react'
import type { Template, TemplateFamily } from '@/lib/alquimia/types'
import { templateFamilies } from '@/lib/alquimia/templates'

const familyTone: Record<TemplateFamily, string> = {
  planning: 'bg-[#00435D]/8 text-[#00435D]',
  facilitation: 'bg-[#AEADCC]/35 text-[#2d3558]',
  analysis: 'bg-[#3A5976]/12 text-[#3A5976]',
  people: 'bg-[#E0CE7A]/40 text-[#675300]',
  fieldwork: 'bg-black/80 text-[#F7F5ED]',
}

export function TemplateLibrary({ templates }: { templates: Template[] }) {
  const [query, setQuery] = useState('')
  const [family, setFamily] = useState<'all' | TemplateFamily>('all')
  const [openId, setOpenId] = useState<string | null>(templates[0]?.id ?? null)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return templates.filter(item => {
      if (family !== 'all' && item.family !== family) return false
      if (!normalized) return true
      return `${item.title} ${item.summary} ${item.howTo} ${item.source}`
        .toLocaleLowerCase('pt-BR')
        .includes(normalized)
    })
  }, [family, query, templates])

  const selected = filtered.find(item => item.id === openId) ?? filtered[0]

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border border-black/[0.07] bg-white p-3 lg:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-2.5 rounded-xl bg-[#F7F5ED] px-3.5">
          <Search className="h-3.5 w-3.5 text-[#3A5976]" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar modelo, uso ou origem"
            className="min-w-0 flex-1 bg-transparent py-3 text-[11px] outline-none placeholder:text-black/25"
          />
        </label>
        <div className="flex flex-wrap gap-1 rounded-xl bg-[#F7F5ED] p-1">
          <FilterChip active={family === 'all'} onClick={() => setFamily('all')}>
            Todos
          </FilterChip>
          {templateFamilies.map(item => (
            <FilterChip key={item.id} active={family === item.id} onClick={() => setFamily(item.id)}>
              {item.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="mt-3 px-1 text-[9px] uppercase tracking-wider text-black/30">
        {filtered.length} modelos · origem atribuída · uso interno
      </p>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
          {filtered.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(item.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selected?.id === item.id
                  ? 'border-[#00435D]/35 bg-white shadow-[0_14px_35px_rgba(0,67,93,0.08)]'
                  : 'border-black/[0.07] bg-white hover:border-[#00435D]/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-[family-name:var(--font-alquimia-display)] text-[10px] text-[#3A5976]">
                  {String(item.number).padStart(2, '0')}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider ${familyTone[item.family]}`}>
                  {templateFamilies.find(entry => entry.id === item.family)?.name}
                </span>
              </div>
              <h3 className="mt-3 text-[14px] font-semibold leading-snug text-[#003b52]">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-black/40">{item.summary}</p>
            </button>
          ))}
        </div>

        {selected && <TemplateDetail template={selected} />}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
        active ? 'bg-[#00435D] text-white' : 'text-black/40 hover:text-black/70'
      }`}
    >
      {children}
    </button>
  )
}

function TemplateDetail({ template }: { template: Template }) {
  return (
    <article className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider ${familyTone[template.family]}`}>
          {templateFamilies.find(entry => entry.id === template.family)?.name}
        </span>
        <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-black/40">
          {template.status === 'ready' ? 'Pronto para uso' : 'Preliminar'}
        </span>
      </div>
      <div className="mt-5 flex items-start gap-3">
        <Layers3 className="mt-1 h-4 w-4 shrink-0 text-[#3A5976]" />
        <div>
          <h2 className="text-[22px] font-semibold leading-snug tracking-[-0.03em] text-[#003b52]">
            {template.title}
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-black/50">{template.summary}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-[#F7F5ED] p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#3A5976]">Como usar</p>
        <p className="mt-2 text-[12px] leading-relaxed text-[#003b52]/80">{template.howTo}</p>
      </div>

      {template.fields && template.fields.length > 0 && (
        <div className="mt-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/35">Campos</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {template.fields.map(field => (
              <span key={field} className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] text-[#003b52]">
                {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {template.sections?.map(section => (
        <section key={section.title} className="mt-6 border-t border-black/[0.06] pt-5">
          <h3 className="text-[13px] font-semibold text-[#003b52]">{section.title}</h3>
          {section.body && <p className="mt-2 text-[12px] leading-relaxed text-black/50">{section.body}</p>}
          {section.items && (
            <ul className="mt-3 space-y-2">
              {section.items.map(item => (
                <li key={item} className="flex gap-2 text-[12px] leading-relaxed text-black/55">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#E0CE7A]" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <p className="mt-7 border-t border-black/[0.06] pt-4 text-[10px] text-black/30">
        Fonte: {template.source}
      </p>
    </article>
  )
}
