'use client'

import { useState } from 'react'
import type { DeliveryItem, DeliveryType, DeliveryWeek } from '@/lib/delivery/types'

const TYPE_META: Record<DeliveryType, { label: string; className: string }> = {
  feature: { label: 'Funcionalidade', className: 'bg-emerald-100 text-emerald-700' },
  fix: { label: 'Correção', className: 'bg-rose-100 text-rose-700' },
  improvement: { label: 'Melhoria', className: 'bg-sky-100 text-sky-700' },
  maintenance: { label: 'Manutenção', className: 'bg-neutral-100 text-neutral-500' },
}

function formatHours(h: number): string {
  return `${h.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h`
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatWeek(weekStart: string): string {
  const start = new Date(`${weekStart}T00:00:00Z`)
  return `Semana de ${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', timeZone: 'UTC' })}`
}

function EffortDetail({ item }: { item: DeliveryItem }) {
  const e = item.effort
  const rows = [
    { label: 'Sessões de trabalho', value: `${e.commitCount} commits → ${formatHours(e.sessionHours)}` },
    {
      label: 'Complexidade',
      value: `base ${formatHours(e.baseHours)} × tamanho ${e.sizeFactor.toLocaleString('pt-BR')} + ${e.reviewRounds} review${e.reviewRounds === 1 ? '' : 's'} → ${formatHours(e.complexityHours)}`,
    },
    { label: 'Alterações', value: `${item.filesChanged} arquivos · +${item.additions} −${item.deletions} linhas` },
  ]
  return (
    <div className="mt-3 rounded-lg border border-black/[0.05] bg-neutral-50/80 px-4 py-3 space-y-1.5">
      {rows.map(r => (
        <div key={r.label} className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 sm:w-44 shrink-0">
            {r.label}
          </span>
          <span className="text-[12px] text-neutral-600">{r.value}</span>
        </div>
      ))}
      <p className="pt-1 text-[11px] text-neutral-400">
        Horas faturáveis = 60% sessões + 40% complexidade, arredondado a 0,5h.
      </p>
    </div>
  )
}

function DeliveryRow({ item }: { item: DeliveryItem }) {
  const [open, setOpen] = useState(false)
  const meta = TYPE_META[item.type]

  return (
    <div className="px-5 py-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.className}`}>
                {meta.label}
              </span>
              <span className="text-[11px] text-neutral-400">{item.product}</span>
              {item.reviewApproved && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  Review aprovado
                </span>
              )}
              {item.deployedToProduction && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                  Em produção
                </span>
              )}
            </div>
            <p className="text-[14px] font-medium text-neutral-900 leading-snug">{item.title}</p>
            <p className="mt-1 text-[11px] text-neutral-400">
              {formatDay(item.mergedAt)} · por {item.authorInitials}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[17px] font-semibold text-neutral-900 tabular-nums">
              {formatHours(item.effort.billableHours)}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{open ? 'fechar' : 'como calculamos'}</p>
          </div>
        </div>
      </button>
      {open && <EffortDetail item={item} />}
    </div>
  )
}

export function DeliveryTimeline({ weeks }: { weeks: DeliveryWeek[] }) {
  if (weeks.length === 0) {
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-12 text-center text-[13px] text-neutral-400">
        Nenhuma entrega no período selecionado.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {weeks.map(week => {
        const weekHours = week.items.reduce((acc, i) => acc + i.effort.billableHours, 0)
        return (
          <div key={week.weekStart}>
            <div className="flex items-baseline justify-between mb-3 px-1">
              <h3 className="text-[13px] font-semibold text-neutral-800">{formatWeek(week.weekStart)}</h3>
              <span className="text-[12px] text-neutral-400 tabular-nums">
                {week.items.length} entrega{week.items.length === 1 ? '' : 's'} · {formatHours(weekHours)}
              </span>
            </div>
            <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.04]">
              {week.items.map(item => (
                <DeliveryRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
