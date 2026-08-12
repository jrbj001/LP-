'use client'

import { useState } from 'react'
import { CheckCircle2, ListChecks, Sparkles } from 'lucide-react'
import { MeetingBacklogExport } from './meeting-backlog-export'

interface MeetingBrief {
  summary: string
  actionPlan: string[]
  todos: {
    title: string
    owner: string
    priority: 'Alta' | 'Média' | 'Baixa'
  }[]
}

const PRIORITY_STYLE = {
  Alta: 'bg-rose-50 text-rose-700 border-rose-100',
  Média: 'bg-amber-50 text-amber-700 border-amber-100',
  Baixa: 'bg-neutral-50 text-neutral-500 border-neutral-100',
} as const

export function MeetingAiBrief({
  clientId,
  meetingId,
  locale,
  accent,
  backlogEnabled,
}: {
  clientId: string
  meetingId: string
  locale: string
  accent: string
  backlogEnabled: boolean
}) {
  const [brief, setBrief] = useState<MeetingBrief | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/client/${encodeURIComponent(clientId)}/meetings/${encodeURIComponent(meetingId)}/summary`,
        { method: 'POST' }
      )
      const data = await response.json()
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Não foi possível gerar o briefing.')
      }
      setBrief(data.brief)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-5 rounded-xl border border-black/[0.06] bg-neutral-50/70 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider" style={{ color: accent }}>
            <Sparkles className="w-3.5 h-3.5" />
            Inteligência da reunião
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">
            Gere um resumo, plano de ação e to-dos antes de abrir o registro completo.
          </p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-50"
        >
          {loading ? 'Analisando…' : brief ? 'Gerar novamente' : 'Resumir com IA'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
          {error}
        </p>
      )}

      {brief && (
        <div className="mt-5 space-y-5 border-t border-black/[0.06] pt-5">
          <section>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">Resumo executivo</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-700 whitespace-pre-line">{brief.summary}</p>
          </section>

          <section>
            <h3 className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
              <ListChecks className="w-3.5 h-3.5" />
              Plano de ação
            </h3>
            <ol className="mt-2 space-y-2">
              {brief.actionPlan.map((item, index) => (
                <li key={`${index}-${item}`} className="flex gap-2.5 text-[13px] leading-relaxed text-neutral-700">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3 className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              To-dos
            </h3>
            <div className="mt-2 divide-y divide-black/[0.05] rounded-lg border border-black/[0.06] bg-white">
              {brief.todos.map((todo, index) => (
                <div key={`${index}-${todo.title}`} className="flex flex-col sm:flex-row sm:items-center gap-2 px-3.5 py-3">
                  <p className="flex-1 text-[12px] font-medium text-neutral-700">{todo.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-400">{todo.owner}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${PRIORITY_STYLE[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {backlogEnabled && (
            <MeetingBacklogExport
              clientId={clientId}
              meetingId={meetingId}
              locale={locale}
              brief={brief}
              accent={accent}
            />
          )}
        </div>
      )}
    </div>
  )
}
