'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { CLIENT } from '@/components/adaptive/data'
import { DISCOVERY_QUESTIONS } from '@/lib/adaptive/progress'
import type { AssessmentRow, ProgressRow, ProgressStatus } from '@/lib/adaptive/types'

const STATUS_STYLE: Record<ProgressStatus, string> = {
  'Not started': 'bg-neutral-100 text-neutral-500',
  'Identified': 'bg-amber-100 text-amber-700',
  'Assessment done': 'bg-sky-100 text-sky-700',
  'Session booked': 'bg-emerald-100 text-emerald-700',
  'Done': 'bg-violet-100 text-violet-700',
}

type Counts = {
  total: number
  identified: number
  assessmentDone: number
  sessionBooked: number
}

export function OnboardingDashboard({
  rows,
  assessments,
  counts,
  error,
}: {
  rows: ProgressRow[]
  assessments: AssessmentRow[]
  counts: Counts
  error?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [filter, setFilter] = useState<'all' | ProgressStatus>('all')
  const [openAssessment, setOpenAssessment] = useState<string | null>(null)

  const filtered = useMemo(
    () => (filter === 'all' ? rows : rows.filter(r => r.status === filter)),
    [rows, filter]
  )

  const pct = counts.total ? Math.round((counts.sessionBooked / counts.total) * 100) : 0

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace · Ops"
        title="Acompanhamento"
        subtitle={`Ops: quem identificou, quem respondeu o assessment e quem agendou. Ligado aos projetos do Comitê. Facilitador: ${CLIENT.facilitator.name}. Host: ${CLIENT.meetingHost.name}.`}
      />

      <Reveal>
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => startTransition(() => router.refresh())}
            disabled={pending}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 disabled:opacity-50"
          >
            {pending ? 'Atualizando…' : 'Atualizar'}
          </button>
        </div>
      </Reveal>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800 leading-relaxed">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
        {[
          { label: 'Convidados', value: String(counts.total) },
          { label: 'Identificados', value: String(counts.identified) },
          { label: 'Assessment', value: String(counts.assessmentDone) },
          { label: 'Sessão agendada', value: String(counts.sessionBooked) },
          { label: 'Conclusão', value: `${pct}%` },
        ].map((m, i) => (
          <Reveal key={m.label} delay={i * 0.04}>
            <div className="rounded-xl border border-black/[0.06] bg-white p-5">
              <p className="text-[28px] font-semibold text-neutral-900 leading-none">{m.value}</p>
              <p className="text-[12px] text-neutral-500 mt-2">{m.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="flex flex-wrap gap-2 mb-5">
          {(['all', 'Not started', 'Identified', 'Assessment done', 'Session booked', 'Done'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                filter === s
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-black/[0.08] hover:border-neutral-300'
              }`}
            >
              {s === 'all' ? 'Todos' : s}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b border-black/[0.05] text-[11px] uppercase tracking-wider text-neutral-400">
                  <th className="px-5 py-3 font-medium">Stakeholder</th>
                  <th className="px-5 py-3 font-medium">Área</th>
                  <th className="px-5 py-3 font-medium">WhatsApp</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Slot</th>
                  <th className="px-5 py-3 font-medium">Host</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-black/[0.04] last:border-0">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-neutral-900">{r.stakeholder}</p>
                      <p className="text-[11px] text-neutral-400">{r.role}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-neutral-500">{r.areas || '—'}</td>
                    <td className="px-5 py-3.5 text-[12px] font-mono text-neutral-600">
                      {r.whatsapp || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-neutral-600">{r.slot || '—'}</td>
                    <td className="px-5 py-3.5 text-[12px] text-neutral-500">{r.meetingHost || CLIENT.meetingHost.name}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-neutral-400">
                      Nenhum stakeholder neste filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {assessments.length > 0 && (
        <Reveal>
          <div className="mt-12 mb-6">
            <h2 className="text-[18px] font-semibold text-neutral-900">Assessments enviados</h2>
            <p className="text-[13px] text-neutral-500 mt-1">
              Respostas Q1–Q11 sincronizadas do Notion. Clique para expandir.
            </p>
          </div>
          <div className="space-y-3">
            {assessments.map(a => {
              const open = openAssessment === a.id
              const filled = Object.keys(a.answers).length
              return (
                <div key={a.id} className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenAssessment(open ? null : a.id)}
                    className="w-full flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-black/[0.01] transition-colors"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">{a.stakeholder}</p>
                      <p className="text-[12px] text-neutral-500 mt-0.5">
                        {a.completedAt
                          ? new Date(a.completedAt).toLocaleString('pt-BR')
                          : '—'}
                        {' · '}
                        {filled}/11 respostas
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
                        {a.status || 'Submitted'}
                      </span>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-[12px] text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
                      >
                        Notion
                      </a>
                    </div>
                  </button>
                  {open && (
                    <div className="border-t border-black/[0.05] px-5 py-4 space-y-4 bg-[#fafaf8]">
                      {DISCOVERY_QUESTIONS.map(q => (
                        <div key={q.id}>
                          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                            Q{q.id}
                          </p>
                          <p className="text-[13px] font-medium text-neutral-800">{q.question}</p>
                          <p className="text-[13px] text-neutral-600 mt-1 leading-relaxed whitespace-pre-wrap">
                            {a.answers[q.id]?.trim() || '—'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>
      )}
    </PageShell>
  )
}
