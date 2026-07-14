'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { CLIENT, CLIENT_ID } from '@/components/adaptive/data'
import type { ProgressRow, ProgressStatus } from '@/lib/adaptive/types'

const OPS_SECRET_KEY = 'adaptive.ops.secret'

const STATUS_STYLE: Record<ProgressStatus, string> = {
  'Not started': 'bg-neutral-100 text-neutral-500',
  'Identified': 'bg-amber-100 text-amber-700',
  'Assessment done': 'bg-sky-100 text-sky-700',
  'Session booked': 'bg-emerald-100 text-emerald-700',
  'Done': 'bg-violet-100 text-violet-700',
}

function readSavedSecret() {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(OPS_SECRET_KEY)?.trim() || ''
}

export default function OnboardingDashboardPage() {
  const [rows, setRows] = useState<ProgressRow[]>([])
  const [counts, setCounts] = useState({ total: 0, identified: 0, assessmentDone: 0, sessionBooked: 0 })
  const [filter, setFilter] = useState<'all' | ProgressStatus>('all')
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [needsSecret, setNeedsSecret] = useState(false)

  const load = useCallback(async (overrideSecret?: string) => {
    const token = (overrideSecret ?? secret).trim()
    setLoading(true)
    setError('')
    setNeedsSecret(false)
    try {
      const qs = new URLSearchParams({ clientId: CLIENT_ID })
      const res = await fetch(`/api/adaptive/progress?${qs}`, {
        headers: token ? { 'x-adaptive-ops-secret': token } : undefined,
      })
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        throw new Error('Não foi possível carregar o progresso. Tente atualizar novamente.')
      }
      const data = await res.json()
      if (res.status === 401) {
        setNeedsSecret(true)
        setLoaded(false)
        setRows([])
        setCounts({ total: 0, identified: 0, assessmentDone: 0, sessionBooked: 0 })
        throw new Error(
          token
            ? 'Ops secret inválido. Confira o valor de ADAPTIVE_OPS_SECRET e tente de novo.'
            : 'Este painel é protegido. Cole o Ops secret e clique em Atualizar.'
        )
      }
      if (!res.ok) throw new Error(data.error || 'Falha ao carregar')
      setRows(data.rows || [])
      setCounts(data.counts)
      setLoaded(true)
      if (token) {
        sessionStorage.setItem(OPS_SECRET_KEY, token)
        setSecret(token)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [secret])

  useEffect(() => {
    const saved = readSavedSecret()
    if (saved) setSecret(saved)
    void load(saved)
    // bootstrap only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <div className={`rounded-xl border bg-white p-4 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center ${
          needsSecret ? 'border-amber-200' : 'border-black/[0.06]'
        }`}>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') void load()
            }}
            placeholder="Ops secret"
            autoComplete="off"
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

      {needsSecret && !loaded && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 leading-relaxed">
          Painel protegido pelo Ops secret (variável <code className="text-[12px]">ADAPTIVE_OPS_SECRET</code> no ambiente).
          Cole o secret, pressione Enter ou clique em Atualizar.
        </div>
      )}

      {error && !needsSecret && (
        <p className="text-[13px] text-rose-600 mb-6">{error}</p>
      )}
      {error && needsSecret && (
        <p className="text-[13px] text-amber-800 mb-6">{error}</p>
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
                {!loaded && !loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-neutral-400">
                      Informe o Ops secret para ver o acompanhamento.
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
