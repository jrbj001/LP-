'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, Loader2, Shield } from 'lucide-react'
import type { EstimateSuggestion, JiraIssueView } from '@/lib/jira/types'

type FilterId = 'unestimated' | 'legacy' | 'all'

interface IssuesPayload {
  ok: boolean
  error?: string
  site?: string
  projectKey?: string
  hoursPerDay?: number
  issues?: JiraIssueView[]
  totals?: { all: number; unestimated: number; estimated: number }
}

export function JiraEstimateWorkspace({
  clientId,
  accent,
}: {
  clientId: string
  accent: string
}) {
  const [filter, setFilter] = useState<FilterId>('unestimated')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [issues, setIssues] = useState<JiraIssueView[]>([])
  const [totals, setTotals] = useState({ all: 0, unestimated: 0, estimated: 0 })
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Record<string, EstimateSuggestion>>({})
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [batch, setBatch] = useState<{ running: boolean; done: number; total: number; message: string } | null>(
    null
  )

  const selected = issues.find(issue => issue.key === selectedKey) ?? null
  const suggestion = selectedKey ? suggestions[selectedKey] : undefined

  const visible = useMemo(() => {
    if (filter === 'unestimated') return issues.filter(issue => issue.unestimated)
    if (filter === 'legacy') return issues.filter(issue => !issue.unestimated)
    return issues
  }, [filter, issues])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/client/${encodeURIComponent(clientId)}/jira/issues`, { cache: 'no-store' })
      const data = (await res.json()) as IssuesPayload
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao listar o backlog Jira.')
      setIssues(data.issues ?? [])
      setTotals(data.totals ?? { all: 0, unestimated: 0, estimated: 0 })
      setSelectedKey(current => {
        const next = data.issues ?? []
        if (current && next.some(issue => issue.key === current)) return current
        return next.find(issue => issue.unestimated)?.key ?? next[0]?.key ?? null
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao listar o backlog Jira.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [clientId])

  async function estimateOne(key: string) {
    setBusyKey(key)
    setError(null)
    try {
      const res = await fetch(
        `/api/client/${encodeURIComponent(clientId)}/jira/issues/${encodeURIComponent(key)}/estimate`,
        { method: 'POST' }
      )
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao estimar.')
      if (data.issue) {
        setIssues(prev => prev.map(issue => (issue.key === data.issue.key ? data.issue : issue)))
      }
      if (data.suggestion) {
        setSuggestions(prev => ({ ...prev, [key]: data.suggestion }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao estimar.')
    } finally {
      setBusyKey(null)
    }
  }

  async function commitOne(key: string) {
    const draft = suggestions[key]
    if (!draft) return
    setBusyKey(key)
    setError(null)
    try {
      const res = await fetch(
        `/api/client/${encodeURIComponent(clientId)}/jira/issues/${encodeURIComponent(key)}/estimate/commit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jiraEstimate: draft.jiraEstimate, hours: draft.hours }),
        }
      )
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao gravar no Jira.')
      setIssues(prev => prev.map(issue => (issue.key === data.issue.key ? data.issue : issue)))
      setSuggestions(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao gravar no Jira.')
    } finally {
      setBusyKey(null)
    }
  }

  async function estimateUnestimatedBatch() {
    const queue = issues.filter(issue => issue.unestimated).map(issue => issue.key)
    if (queue.length === 0) return
    setBatch({ running: true, done: 0, total: queue.length, message: 'Estimando só o que ainda está vazio…' })
    setError(null)
    for (let index = 0; index < queue.length; index++) {
      const key = queue[index]
      setBatch({
        running: true,
        done: index,
        total: queue.length,
        message: `Estimando ${key} (${index + 1}/${queue.length})`,
      })
      await estimateOne(key)
    }
    setBatch({ running: false, done: queue.length, total: queue.length, message: 'Fila sem estimativa concluída.' })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-5 py-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" strokeWidth={1.8} />
          <div>
            <p className="text-[13px] font-semibold text-amber-950">Legado permanece intacto</p>
            <p className="mt-1 text-[12px] leading-relaxed text-amber-900/80">
              Só estimamos stories <strong>sem</strong> original estimate (0m ou vazio). Tickets já
              preenchidos — como APP-382 em 3d — aparecem como legado e o servidor recusa qualquer
              sobrescrita.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-black/[0.08] bg-white p-0.5 text-[12px]">
          {(
            [
              ['unestimated', `Sem estimativa (${totals.unestimated})`],
              ['legacy', `Legado (${totals.estimated})`],
              ['all', `Todas (${totals.all})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-md px-3 py-1.5 font-medium ${
                filter === id ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Atualizar
          </button>
          <button
            type="button"
            disabled={batch?.running || totals.unestimated === 0}
            onClick={() => void estimateUnestimatedBatch()}
            className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
            style={{ backgroundColor: accent }}
          >
            Estimar as sem original estimate
          </button>
        </div>
      </div>

      {batch && (
        <p className="text-[12px] text-neutral-500">
          {batch.message}
          {batch.running ? ` · ${batch.done}/${batch.total}` : ''}
        </p>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-5 py-10 text-[13px] text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Lendo o backlog APP no Jira…
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
            {visible.length === 0 ? (
              <p className="px-5 py-10 text-center text-[13px] text-neutral-400">
                {filter === 'unestimated'
                  ? 'Nenhuma story sem original estimate neste recorte.'
                  : 'Nenhuma issue neste filtro.'}
              </p>
            ) : (
              <ul className="divide-y divide-black/[0.05]">
                {visible.map(issue => (
                  <li key={issue.key}>
                    <button
                      type="button"
                      onClick={() => setSelectedKey(issue.key)}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left ${
                        selectedKey === issue.key ? 'bg-neutral-50' : 'hover:bg-neutral-50/70'
                      }`}
                    >
                      <span className="mt-0.5 font-mono text-[11px] text-neutral-400">{issue.key}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-neutral-900">
                          {issue.summary}
                        </span>
                        <span className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-neutral-400">
                          <span>{issue.issueType}</span>
                          <span>· {issue.status}</span>
                        </span>
                      </span>
                      {issue.unestimated ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          {suggestions[issue.key]?.jiraEstimate ?? 'sem estimate'}
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                          {issue.originalEstimate} · legado
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <IssuePanel
            issue={selected}
            suggestion={suggestion}
            busy={busyKey === selected?.key}
            accent={accent}
            onEstimate={() => selected && void estimateOne(selected.key)}
            onCommit={() => selected && void commitOne(selected.key)}
          />
        </div>
      )}
    </div>
  )
}

function IssuePanel({
  issue,
  suggestion,
  busy,
  accent,
  onEstimate,
  onCommit,
}: {
  issue: JiraIssueView | null
  suggestion?: EstimateSuggestion
  busy: boolean
  accent: string
  onEstimate: () => void
  onCommit: () => void
}) {
  if (!issue) {
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white px-5 py-10 text-center text-[13px] text-neutral-400">
        Selecione uma story à esquerda.
      </div>
    )
  }

  return (
    <aside className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] text-neutral-400">{issue.key}</p>
          <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">{issue.summary}</h2>
        </div>
        <a
          href={issue.browseUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700"
        >
          Jira <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <p className="mt-3 line-clamp-6 text-[12px] leading-relaxed text-neutral-500">
        {issue.description || 'Sem descrição no Jira.'}
      </p>

      {!issue.unestimated ? (
        <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-neutral-800">
            <CheckCircle2 className="h-4 w-4 text-neutral-500" />
            Legado — original estimate {issue.originalEstimate}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
            Esta story já foi estimada. O portal não recalcula nem grava por cima.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {suggestion ? (
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3">
              <p className="flex items-center gap-2 text-[12px] font-semibold text-teal-950">
                <Clock className="h-4 w-4" />
                Sugestão {suggestion.jiraEstimate}
                <span className="font-normal text-teal-800/70">
                  ({suggestion.hours}h · 8h = 1d · {suggestion.confidence})
                </span>
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-teal-950/80">{suggestion.rationale}</p>
              {suggestion.similarPrs.length > 0 && (
                <p className="mt-2 text-[11px] text-teal-800/70">
                  PRs: {suggestion.similarPrs.map(pr => `${pr.repo}#${pr.number}`).join(', ')}
                </p>
              )}
              {suggestion.risks.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-[11px] text-teal-900/70">
                  {suggestion.risks.map(risk => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-[12px] text-neutral-500">
              Ainda sem sugestão. O cálculo olha PRs e código do GitHub e não grava nada até você confirmar.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onEstimate}
              className="rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-700 disabled:opacity-40"
            >
              {busy ? 'Estimando…' : suggestion ? 'Recalcular' : 'Estimar'}
            </button>
            <button
              type="button"
              disabled={busy || !suggestion}
              onClick={onCommit}
              className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: accent }}
            >
              Gravar no Jira
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
