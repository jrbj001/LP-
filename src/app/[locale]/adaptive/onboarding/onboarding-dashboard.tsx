'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { CLIENT, DISCOVERY_QUESTIONS } from '@/components/adaptive/data'
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

function formatCompletedAt(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function AssessmentAnswers({ answers }: { answers: Record<number, string> }) {
  return (
    <div className="space-y-4 pt-1 pb-2">
      {DISCOVERY_QUESTIONS.map(q => {
        const answer = answers[q.id]?.trim()
        return (
          <div key={q.id}>
            <p className="text-[12px] font-medium text-neutral-800">
              <span className="text-neutral-400 mr-1.5">Q{q.id}.</span>
              {q.question}
            </p>
            <p className="mt-1 text-[13px] text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {answer || '—'}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export function OnboardingDashboard({
  rows,
  assessments = [],
  counts,
  error,
}: {
  rows: ProgressRow[]
  assessments?: AssessmentRow[]
  counts: Counts
  error?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [filter, setFilter] = useState<'all' | ProgressStatus>('all')
  const [openId, setOpenId] = useState<string | null>(null)

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

      <Reveal>
        <div className="mt-12 mb-4">
          <h2 className="text-[18px] font-semibold text-neutral-900">Assessments enviados</h2>
          <p className="text-[13px] text-neutral-500 mt-1">
            Respostas Q1–Q11 de cada stakeholder. Clique para expandir.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden divide-y divide-black/[0.04]">
          {assessments.length === 0 && (
            <p className="px-5 py-10 text-center text-[13px] text-neutral-400">
              Nenhum assessment enviado ainda.
            </p>
          )}
          {assessments.map(a => {
            const open = openId === a.id
            const answered = Object.keys(a.answers).length
            return (
              <div key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : a.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-neutral-50/80 transition-colors"
                  aria-expanded={open}
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 truncate">{a.stakeholder}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {formatCompletedAt(a.completedAt)}
                      {a.whatsapp ? ` · ${a.whatsapp}` : ''}
                      {` · ${answered}/11 respostas`}
                    </p>
                  </div>
                  <span className="shrink-0 text-[12px] text-neutral-500 tabular-nums">
                    {open ? 'Fechar' : 'Ver respostas'}
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-5 border-t border-black/[0.04] bg-neutral-50/50">
                    <div className="pt-4">
                      <AssessmentAnswers answers={a.answers} />
                      {a.url && (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-[12px] text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
                        >
                          Abrir no Notion
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Reveal>
    </PageShell>
  )
}
