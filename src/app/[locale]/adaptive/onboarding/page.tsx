'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { CLIENT, CLIENT_ID } from '@/components/adaptive/data'
import type { ProgressRow, ProgressStatus } from '@/lib/adaptive/types'

const STATUS_STYLE: Record<ProgressStatus, string> = {
  'Not started': 'bg-neutral-100 text-neutral-500',
  'Identified': 'bg-amber-100 text-amber-700',
  'Assessment done': 'bg-sky-100 text-sky-700',
  'Session booked': 'bg-emerald-100 text-emerald-700',
  'Done': 'bg-violet-100 text-violet-700',
}

export default function OnboardingDashboardPage() {
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [counts, setCounts] = useState({ total: 0, identified: 0, assessmentDone: 0, sessionBooked: 0 })
  const [filter, setFilter] = useState<'all' | ProgressStatus>('all')
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('adaptive.ops.secret')
    if (saved) setSecret(saved)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const qs = new URLSearchParams({ clientId: CLIENT_ID })
      if (secret) qs.set('secret', secret)
      const res = await fetch(`/api/adaptive/progress?${qs}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao carregar')
      setRows(data.rows || [])
      setCounts(data.counts)
      setLoaded(true)
      if (secret) sessionStorage.setItem('adaptive.ops.secret', secret)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [secret])

  useEffect(() => {
    // Auto-try once (works if ADAPTIVE_OPS_SECRET unset in local)
    void load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(
    () => (filter === 'all' ? rows : rows.filter(r => r.status === filter)),
    [rows, filter]
  )

  const pct = counts.total ? Math.round((counts.sessionBooked / counts.total) * 100) : 0

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace · Ops"
        title="Onboarding & Assessment"
        subtitle={`Acompanhamento do processo Adaptive do ${CLIENT.name}. Facilitador do convite: ${CLIENT.facilitator.name}. Host das sessões: ${CLIENT.meetingHost.name}.`}
      />

      <Reveal>
        <div className="rounded-xl border border-black/[0.06] bg-white p-4 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Ops secret (se configurado)"
            className="flex-1 rounded-lg border border-black/[0.1] px-3 py-2 text-[13px] outline-none focus:border-neutral-900"
          />
          <button
            onClick={() => void load()}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? 'Atualizando…' : 'Atualizar'}
          </button>
        </div>
      </Reveal>

      {error && (
        <p className="text-[13px] text-rose-600 mb-6">{error}</p>
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
                {loaded && filtered.length === 0 && (
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
    </PageShell>
  )
}
