'use client'

import { useMemo, useState } from 'react'
import type {
  DeliveryKpis,
  DeliveryReport,
  DeliveryType,
  ModuleGroup,
  PrRow,
  ProductBreakdown,
  RoadmapMilestone,
  WeeklyBucket,
} from '@/lib/delivery/types'

const TYPE_TAG: Record<DeliveryType | 'infra', { label: string; className: string }> = {
  feature: { label: 'feature', className: 'text-blue-800 bg-blue-50 border-blue-200' },
  fix: { label: 'fix', className: 'text-rose-800 bg-rose-50 border-rose-200' },
  improvement: { label: 'melhoria', className: 'text-sky-800 bg-sky-50 border-sky-200' },
  maintenance: { label: 'manutenção', className: 'text-neutral-600 bg-neutral-100 border-neutral-200' },
  infra: { label: 'infra', className: 'text-neutral-600 bg-neutral-100 border-neutral-200' },
}

function fmt(n: number): string {
  return n.toLocaleString('pt-BR')
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function fmtDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Summary strip ───────────────────────────────────────────────────────────

export function SummaryStrip({ report }: { report: DeliveryReport }) {
  const s = report.stats
  const cells = [
    { val: fmt(s.commits), lbl: 'Commits' },
    { val: fmt(s.pullRequests), lbl: 'Pull Requests' },
    { val: fmt(s.featureCommits), lbl: 'Features' },
    { val: fmt(s.fixCommits), lbl: 'Correções' },
    { val: fmt(s.filesChanged), lbl: 'Arquivos' },
    { val: `+${fmt(s.linesAdded)}`, lbl: 'Linhas' },
  ]
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-black/[0.08] border border-black/[0.08] rounded-lg overflow-hidden">
      {cells.map(c => (
        <div key={c.lbl} className="bg-white px-3 py-4 text-center">
          <span className="block text-[22px] font-bold text-neutral-900 leading-tight tabular-nums">{c.val}</span>
          <span className="block text-[10px] text-neutral-400 uppercase tracking-wider mt-1">{c.lbl}</span>
        </div>
      ))}
    </div>
  )
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export function KpiStrip({ kpis }: { kpis: DeliveryKpis }) {
  const cells = [
    { val: fmt(kpis.velocityPrPerWeek), lbl: 'PRs / semana', hint: 'Velocidade de entrega' },
    { val: `${kpis.featureRatioPct}%`, lbl: 'Foco em feat', hint: 'Share de features vs fixes' },
    {
      val: kpis.fixToFeatureRatio >= 9.9 ? '—' : kpis.fixToFeatureRatio.toLocaleString('pt-BR'),
      lbl: 'Fix / Feat',
      hint: 'Saúde: menor é melhor',
    },
    { val: `~${fmt(kpis.avgHoursPerPr)}h`, lbl: 'Horas / PR', hint: 'Tamanho médio da entrega' },
    { val: fmt(kpis.avgLinesPerPr), lbl: 'Linhas / PR', hint: 'Complexidade média' },
    {
      val: kpis.topProduct ? `${kpis.topProduct.pct}%` : '—',
      lbl: kpis.topProduct?.name.slice(0, 18) || 'Top produto',
      hint: 'Concentração de esforço',
    },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cells.map(c => (
        <div key={c.lbl} className="rounded-xl border border-black/[0.06] bg-white px-4 py-4">
          <p className="text-[22px] font-bold text-neutral-900 tabular-nums leading-none">{c.val}</p>
          <p className="text-[12px] font-medium text-neutral-700 mt-2 truncate">{c.lbl}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">{c.hint}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Charts ──────────────────────────────────────────────────────────────────

export function WeeklyChart({ weekly }: { weekly: WeeklyBucket[] }) {
  const max = Math.max(1, ...weekly.map(w => w.prs))
  if (weekly.length === 0) {
    return <p className="text-[13px] text-neutral-400 py-8 text-center">Sem dados semanais no período.</p>
  }
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-5">
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 mb-4">
        Entregas por semana
      </h3>
      <div className="flex items-end gap-2 h-40">
        {weekly.map(w => {
          const h = w.prs === 0 ? 0 : Math.max(8, (w.prs / max) * 100)
          return (
            <div key={w.weekStart} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
              <span className="text-[10px] text-neutral-500 tabular-nums">{w.prs || ''}</span>
              <div className="w-full flex flex-col justify-end h-28">
                <div
                  className={`w-full rounded-t-md transition-colors ${
                    w.prs ? 'bg-neutral-900/90 hover:bg-neutral-800' : 'bg-transparent'
                  }`}
                  style={{ height: `${h}%` }}
                  title={`${w.label}: ${w.prs} PRs · ${w.features} feat · ${w.fixes} fix · ~${w.hours}h`}
                />
              </div>
              <span className="text-[9px] text-neutral-400 truncate w-full text-center">{w.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MixChart({ report }: { report: DeliveryReport }) {
  const feat = report.estimate.featPct
  const fix = report.estimate.fixPct
  const other = Math.max(0, 100 - feat - fix)
  const r = 42
  const c = 2 * Math.PI * r
  const segments = [
    { pct: feat, color: '#171717', label: 'Features' },
    { pct: fix, color: '#a3a3a3', label: 'Correções' },
    { pct: other, color: '#e5e5e5', label: 'Outros' },
  ]
  let offset = 0

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-5 flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-32 h-32 shrink-0">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f5f5f5" strokeWidth="14" />
        {segments.map(seg => {
          if (seg.pct <= 0) return null
          const len = (seg.pct / 100) * c
          const el = (
            <circle
              key={seg.label}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
            />
          )
          offset += len
          return el
        })}
        <text x="60" y="58" textAnchor="middle" className="fill-neutral-900" style={{ fontSize: 18, fontWeight: 700 }}>
          {feat}%
        </text>
        <text x="60" y="74" textAnchor="middle" className="fill-neutral-400" style={{ fontSize: 9 }}>
          feat
        </text>
      </svg>
      <div className="flex-1 w-full space-y-2.5">
        <h3 className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
          Mix de trabalho
        </h3>
        {segments
          .filter(s => s.pct > 0)
          .map(s => (
            <div key={s.label} className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2 text-neutral-600">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="font-semibold tabular-nums text-neutral-900">{s.pct}%</span>
            </div>
          ))}
      </div>
    </div>
  )
}

export function ProductChart({ byProduct }: { byProduct: ProductBreakdown[] }) {
  const max = Math.max(1, ...byProduct.map(p => p.hours))
  if (byProduct.length === 0) return null
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-5">
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 mb-4">
        Esforço por produto
      </h3>
      <div className="space-y-3">
        {byProduct.map(p => (
          <div key={p.product}>
            <div className="flex justify-between text-[12px] mb-1.5">
              <span className="text-neutral-700 font-medium truncate pr-3">{p.product}</span>
              <span className="text-neutral-500 tabular-nums shrink-0">
                {p.prs} PR · ~{fmt(p.hours)}h
              </span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 rounded-full"
                style={{ width: `${(p.hours / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

export function RoadmapTimeline({ roadmap }: { roadmap: RoadmapMilestone[] }) {
  if (roadmap.length === 0) {
    return <p className="text-[13px] text-neutral-400 py-8 text-center">Sem marcos no período.</p>
  }
  return (
    <div className="relative pl-6">
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-neutral-200" />
      <div className="space-y-5">
        {roadmap.map(m => {
          const tag = TYPE_TAG[m.type]
          return (
            <div key={m.id} className="relative">
              <span className="absolute -left-6 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-neutral-900 bg-white" />
              <div className="rounded-xl border border-black/[0.06] bg-white px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                    {fmtDateLong(m.date)}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tag.className}`}>
                    {tag.label}
                  </span>
                  {m.product !== '—' && (
                    <span className="text-[11px] text-neutral-400">{m.product}</span>
                  )}
                </div>
                <p className="text-[14px] font-semibold text-neutral-900">{m.title}</p>
                <p className="text-[12px] text-neutral-500 mt-1 tabular-nums">
                  ~{fmt(m.hours)}h
                  {m.prNumbers.length > 0 && ` · PR ${m.prNumbers.map(n => `#${n}`).join(', ')}`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Effort section ──────────────────────────────────────────────────────────

export function EffortSection({ report }: { report: DeliveryReport }) {
  const e = report.estimate
  const manualRows = report.modules.filter(m => m.manualHours)

  const metricRows = [
    { key: 'Horas de produto (git)', val: `~${fmt(e.gitHours)} h` },
    ...manualRows.map(m => ({ key: m.name, val: `${fmt(m.manualHours!)} h` })),
  ]
  const rhythmRows = [
    { key: 'Duração', val: `${e.weeks} semana${e.weeks === 1 ? '' : 's'}` },
    { key: 'Ritmo médio', val: `~${fmt(e.hoursPerWeek)} h/sem` },
    { key: 'Pessoa-mês equivalente', val: `~${e.personMonths.toLocaleString('pt-BR')}` },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="rounded-lg bg-[#f7f7f5] px-6 py-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3.5">
          Métricas do período
        </h3>
        {metricRows.map(r => (
          <div key={r.key} className="flex justify-between items-center py-1.5 border-b border-black/[0.05] last:border-0">
            <span className="text-[13px] text-neutral-600">{r.key}</span>
            <span className="text-[13px] font-semibold text-neutral-900 tabular-nums">{r.val}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-2.5 mt-1.5 border-t border-neutral-300">
          <span className="text-[13px] font-semibold text-neutral-900">Total do período</span>
          <span className="text-[16px] font-bold text-neutral-900 tabular-nums">~{fmt(e.totalHours)} h</span>
        </div>
        {rhythmRows.map(r => (
          <div key={r.key} className="flex justify-between items-center py-1.5 border-b border-black/[0.05] last:border-0">
            <span className="text-[13px] text-neutral-600">{r.key}</span>
            <span className="text-[13px] font-semibold text-neutral-900 tabular-nums">{r.val}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-[#f7f7f5] px-6 py-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3.5">
          Distribuição de commits
        </h3>
        <div className="mb-3">
          <div className="flex justify-between text-[12px] text-neutral-500 mb-1.5">
            <span>feat (novas funcionalidades)</span>
            <span className="tabular-nums">{e.featPct}%</span>
          </div>
          <div className="h-1.5 bg-black/[0.07] rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${e.featPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[12px] text-neutral-500 mb-1.5">
            <span>fix (correções)</span>
            <span className="tabular-nums">{e.fixPct}%</span>
          </div>
          <div className="h-1.5 bg-black/[0.07] rounded-full overflow-hidden">
            <div className="h-full bg-neutral-400 rounded-full" style={{ width: `${e.fixPct}%` }} />
          </div>
        </div>
        <p className="mt-5 text-[11px] text-neutral-400 leading-relaxed">
          Estimativa baseada em {fmt(report.stats.linesAdded)} linhas inseridas, complexidade das
          funcionalidades e heurísticas de mercado (10–18 LOC/h TypeScript/React em produção).
          Variação ±20% (faixa {fmt(e.totalHoursMin)}–{fmt(e.totalHoursMax)} h).
        </p>
      </div>
    </div>
  )
}

// ─── Modules ─────────────────────────────────────────────────────────────────

function ModuleItem({ mod, index }: { mod: ModuleGroup; index: number }) {
  const [open, setOpen] = useState(false)
  const tag = TYPE_TAG[mod.type]
  return (
    <div className="border-b border-black/[0.06] last:border-0 py-4">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex justify-between items-start gap-4 mb-1.5">
          <span className="text-[15px] font-semibold text-neutral-900">
            {index + 1}. {mod.name}
          </span>
          <div className="flex gap-1.5 items-center shrink-0 flex-wrap justify-end">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${tag.className}`}>
              {tag.label}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded border text-neutral-500 bg-[#f5f5f3] border-neutral-200 tabular-nums">
              ~{fmt(mod.estimatedHours)}h
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded border text-green-800 bg-green-50 border-green-200">
              Entregue
            </span>
          </div>
        </div>
        {mod.product !== '—' && (
          <p className="text-[11px] text-neutral-400 mb-1">{mod.product}</p>
        )}
        <p className="text-[13px] text-neutral-600 leading-relaxed">{mod.description}</p>
        <p className="text-[11px] text-neutral-400 mt-1.5">{open ? 'Fechar detalhes' : 'Ver detalhes'}</p>
      </button>
      {open && (
        <div className="mt-3 rounded-lg bg-neutral-50 border border-black/[0.04] px-4 py-3 text-[12px] text-neutral-600 space-y-1">
          <p>
            Commits: <strong className="text-neutral-900">{mod.commitCount}</strong>
            {mod.prNumbers.length > 0 && (
              <> · PRs: {mod.prNumbers.map(n => `#${n}`).join(', ')}</>
            )}
          </p>
          {(mod.linesAdded > 0 || mod.linesDeleted > 0) && (
            <p className="tabular-nums">
              Código: +{fmt(mod.linesAdded)} / −{fmt(mod.linesDeleted)} linhas
            </p>
          )}
          {mod.firstMergedAt && (
            <p>
              Janela: {fmtDateLong(mod.firstMergedAt)}
              {mod.lastMergedAt && mod.lastMergedAt !== mod.firstMergedAt
                ? ` → ${fmtDateLong(mod.lastMergedAt)}`
                : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function ModulesSection({ modules }: { modules: ModuleGroup[] }) {
  return (
    <div>
      {modules.map((m, i) => (
        <ModuleItem key={m.key} mod={m} index={i} />
      ))}
      {modules.length === 0 && (
        <p className="py-8 text-center text-[13px] text-neutral-400">Nenhum módulo no período.</p>
      )}
    </div>
  )
}

// ─── PRs table ───────────────────────────────────────────────────────────────

function PrDetailRow({ pr }: { pr: PrRow }) {
  const [open, setOpen] = useState(false)
  const tag = TYPE_TAG[pr.type]
  return (
    <>
      <tr
        className="border-b border-black/[0.04] last:border-0 hover:bg-[#fafaf8] cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <td className="px-3 py-2 font-mono text-[12px] text-neutral-400">#{pr.number}</td>
        <td className="px-3 py-2">
          <p className="font-mono text-[12px] text-neutral-900">{pr.branch}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">{pr.title}</p>
        </td>
        <td className="px-3 py-2 text-right">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tag.className}`}>
            {tag.label}
          </span>
        </td>
        <td className="px-3 py-2 text-neutral-400 text-right tabular-nums text-[12px]">
          {fmtDate(pr.mergedAt)}
        </td>
      </tr>
      {open && (
        <tr className="bg-neutral-50/80">
          <td colSpan={4} className="px-4 py-3 text-[12px] text-neutral-600">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Produto</p>
                <p className="font-medium text-neutral-800">{pr.product}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Esforço</p>
                <p className="font-medium text-neutral-800 tabular-nums">~{fmt(pr.estimatedHours)}h</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Código</p>
                <p className="font-medium text-neutral-800 tabular-nums">
                  +{fmt(pr.additions)} / −{fmt(pr.deletions)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Arquivos · Commits</p>
                <p className="font-medium text-neutral-800 tabular-nums">
                  {pr.changedFiles} · {pr.commitCount}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function PrsTable({ report }: { report: DeliveryReport }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] min-w-[560px]">
        <thead>
          <tr className="border-b border-neutral-300 text-left">
            <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 w-16">PR</th>
            <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Entrega</th>
            <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 text-right w-24">Tipo</th>
            <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 text-right w-20">Data</th>
          </tr>
        </thead>
        <tbody>
          {report.prs.map(pr => (
            <PrDetailRow key={`${pr.repo}#${pr.number}`} pr={pr} />
          ))}
          {report.prs.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3 py-8 text-center text-neutral-400">
                Nenhuma PR mesclada no período.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── AI Analysis panel ───────────────────────────────────────────────────────

export function AiAnalysisPanel({
  clientId,
  periodDays,
  clientName,
}: {
  clientId: string
  periodDays: number
  clientName: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/client/${clientId}/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: periodDays }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao gerar análise')
      setAnalysis(data.analysis)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const paragraphs = useMemo(
    () => (analysis ? analysis.split(/\n\n+/).filter(Boolean) : []),
    [analysis]
  )

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
            Inteligência · PixelPulseLab
          </p>
          <h3 className="text-[16px] font-semibold text-neutral-900">
            Análise executiva com IA
          </h3>
          <p className="text-[13px] text-neutral-500 mt-1 max-w-lg">
            Leitura de negócio gerada a partir das entregas, KPIs e esforço do período — sem expor código.
          </p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="shrink-0 px-4 py-2 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? 'Analisando…' : analysis ? 'Gerar novamente' : 'Gerar análise'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-800 mb-3">
          {error}
        </div>
      )}

      {!analysis && !loading && !error && (
        <p className="text-[13px] text-neutral-400 leading-relaxed">
          Clique para gerar um briefing executivo sobre {clientName} neste período: ritmo, riscos,
          concentração de valor e recomendações.
        </p>
      )}

      {paragraphs.length > 0 && (
        <div className="space-y-3 mt-2">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Header meta ─────────────────────────────────────────────────────────────

export function ReportPeriod({ report }: { report: DeliveryReport }) {
  return (
    <p className="text-[13px] text-neutral-500 leading-relaxed text-right">
      <strong className="text-neutral-900 font-semibold">
        {fmtDateLong(report.periodStart)} → {fmtDateLong(report.periodEnd)}
      </strong>
      <br />
      Fonte: git log · {report.repos.map(r => r.repo.split('/')[1]).join(' · ')}
      <br />
      Gerado em {fmtDateLong(report.generatedAt)}
    </p>
  )
}
