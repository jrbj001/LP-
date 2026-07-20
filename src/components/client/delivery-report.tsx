import type { DeliveryReport, DeliveryType, ModuleGroup } from '@/lib/delivery/types'

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
  const tag = TYPE_TAG[mod.type]
  return (
    <div className="py-4.5 border-b border-black/[0.06] last:border-0 py-4">
      <div className="flex justify-between items-start gap-4 mb-1.5">
        <span className="text-[15px] font-semibold text-neutral-900">
          {index + 1}. {mod.name}
        </span>
        <div className="flex gap-1.5 items-center shrink-0 flex-wrap justify-end">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${tag.className}`}>
            {tag.label}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded border text-neutral-500 bg-[#f5f5f3] border-neutral-200 tabular-nums">
            {mod.manualHours ? `${mod.manualHours} h` : `${mod.commitCount} commits`}
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

export function PrsTable({ report }: { report: DeliveryReport }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] min-w-[480px]">
        <thead>
          <tr className="border-b border-neutral-300 text-left">
            <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 w-16">PR</th>
            <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Branch</th>
            <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 text-right w-20">Data</th>
          </tr>
        </thead>
        <tbody>
          {report.prs.map(pr => (
            <tr key={`${pr.repo}#${pr.number}`} className="border-b border-black/[0.04] last:border-0 hover:bg-[#fafaf8]">
              <td className="px-3 py-2 font-mono text-[12px] text-neutral-400">#{pr.number}</td>
              <td className="px-3 py-2 font-mono text-[12px] text-neutral-900">{pr.branch}</td>
              <td className="px-3 py-2 text-neutral-400 text-right tabular-nums">{fmtDate(pr.mergedAt)}</td>
            </tr>
          ))}
          {report.prs.length === 0 && (
            <tr>
              <td colSpan={3} className="px-3 py-8 text-center text-neutral-400">
                Nenhuma PR mesclada no período.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
