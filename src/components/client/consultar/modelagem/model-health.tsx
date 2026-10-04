'use client'

import { useState } from 'react'
import { AlertOctagon, AlertTriangle, CheckCircle2, ChevronDown, Info } from 'lucide-react'
import { healthScoreLabel } from '@/lib/data-sources/model/health'
import type { DataModelHealth, HealthCheck, HealthSeverity } from '@/lib/data-sources/model/types'
import { formatDateTime } from './format'

const SEVERITY_ORDER: Record<HealthSeverity, number> = { high: 0, medium: 1, low: 2, info: 3, ok: 4 }

const SEVERITY_LABEL: Record<HealthSeverity, string> = {
  high: 'Alto',
  medium: 'Médio',
  low: 'Baixo',
  info: 'Informativo',
  ok: 'OK',
}

const SEVERITY_CLASS: Record<HealthSeverity, string> = {
  high: 'border-rose-200 bg-rose-50 text-rose-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-900',
  low: 'border-sky-200 bg-sky-50 text-sky-900',
  info: 'border-black/[0.06] bg-[#fbfbfa] text-neutral-700',
  ok: 'border-teal-200 bg-teal-50 text-teal-800',
}

function scoreColor(score: number): string {
  if (score >= 85) return 'bg-teal-500'
  if (score >= 65) return 'bg-amber-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-rose-500'
}

export function HealthScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={`inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-lg px-2 text-[12px] font-semibold text-white ${scoreColor(score)}`}
    >
      {score}
    </span>
  )
}

function SeverityIcon({ severity }: { severity: HealthSeverity }) {
  if (severity === 'ok') return <CheckCircle2 className="h-4 w-4 text-teal-600" />
  if (severity === 'high') return <AlertOctagon className="h-4 w-4 text-rose-600" />
  if (severity === 'medium' || severity === 'low') return <AlertTriangle className="h-4 w-4 text-amber-600" />
  return <Info className="h-4 w-4 text-neutral-400" />
}

export function ModelHealth({
  health,
  onOpenTable,
}: {
  health: DataModelHealth
  onOpenTable: (key: string) => void
}) {
  const checks = [...health.checks].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.ratio - a.ratio
  )
  const issues = checks.filter(check => check.severity !== 'ok').length

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-[24px] font-semibold text-white ${scoreColor(health.score)}`}
          >
            {health.score}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Health check</p>
            <p className="mt-0.5 text-[16px] font-semibold text-neutral-900">{healthScoreLabel(health.score)}</p>
            <p className="text-[11px] text-neutral-500">
              {issues === 0 ? 'Nenhum alerta' : `${issues} ${issues === 1 ? 'alerta' : 'alertas'}`} · calculado em{' '}
              {formatDateTime(health.computedAt)}
            </p>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-neutral-500 sm:ml-auto sm:max-w-sm">
          Avaliação baseada em metadados do próprio banco (chaves, relacionamentos, descrições, estatísticas e
          contagens estimadas). Não lê o conteúdo das linhas.
        </p>
      </div>

      <ul className="space-y-3">
        {checks.map(check => (
          <CheckItem key={check.id} check={check} onOpenTable={onOpenTable} />
        ))}
      </ul>
    </div>
  )
}

function CheckItem({ check, onOpenTable }: { check: HealthCheck; onOpenTable: (key: string) => void }) {
  const [open, setOpen] = useState(check.severity === 'high')
  const hasAffected = check.affected.length > 0
  return (
    <li className={`rounded-2xl border px-4 py-3.5 ${SEVERITY_CLASS[check.severity]}`}>
      <button
        type="button"
        onClick={() => hasAffected && setOpen(current => !current)}
        className="flex w-full items-start gap-3 text-left"
        aria-expanded={open}
      >
        <span className="mt-0.5 shrink-0">
          <SeverityIcon severity={check.severity} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold">{check.label}</span>
            <span className="rounded-full border border-current/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider opacity-80">
              {SEVERITY_LABEL[check.severity]}
            </span>
            {check.ratio > 0 && (
              <span className="text-[10px] opacity-70">{Math.round(check.ratio * 100)}%</span>
            )}
          </span>
          <span className="mt-1 block text-[12px] leading-relaxed opacity-90">{check.summary}</span>
        </span>
        {hasAffected && (
          <ChevronDown className={`mt-1 h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>
      {open && hasAffected && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-current/10 pt-3">
          {check.affected.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => onOpenTable(key)}
              className="rounded-full border border-current/20 bg-white/60 px-2.5 py-1 font-mono text-[10px] hover:bg-white"
            >
              {key}
            </button>
          ))}
          {check.affectedCount > check.affected.length && (
            <span className="px-2 py-1 text-[10px] opacity-70">
              +{check.affectedCount - check.affected.length} outras
            </span>
          )}
        </div>
      )}
    </li>
  )
}
