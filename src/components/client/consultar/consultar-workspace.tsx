'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Database, Loader2, Search, Settings2 } from 'lucide-react'

const ConsultarChart = dynamic(
  () => import('./consultar-chart').then(mod => mod.ConsultarChart),
  { ssr: false }
)

interface QueryPayload {
  sql: string
  explanation: string
  suggestions: string[]
  sourceName?: string
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
}

const DEFAULT_EXAMPLES = [
  'Quantas PRs do app Like:Me nas últimas 6 semanas?',
  'Cards por coluna do backlog',
  'Quais reuniões aconteceram em agosto?',
]

const BE180_EXAMPLES = [
  'Quantos cards existem no Colmeia e no Banco de Ativos, separados por produto?',
  'Quais são os cards prontos para desenvolvimento no Banco de Ativos?',
  'Quais entregas recentes estão relacionadas ao Colmeia?',
]

type DataSourceSummary = {
  id: string
  name: string
  kind: 'postgresql' | 'sqlserver'
  tableCount: number
}

const ADMIN_KEY_STORAGE = 'cadence.data-source-admin-key'

function cellValue(value: unknown): string {
  if (value == null) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function ConsultarWorkspace({
  clientId,
  accent,
  sourcesHref,
}: {
  clientId: string
  accent: string
  sourcesHref: string
}) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<QueryPayload | null>(null)
  const [sourceId, setSourceId] = useState('')
  const [externalSources, setExternalSources] = useState<DataSourceSummary[]>([])
  const examples = clientId === 'be180-ooh' ? BE180_EXAMPLES : DEFAULT_EXAMPLES

  useEffect(() => {
    const adminKey = window.sessionStorage.getItem(ADMIN_KEY_STORAGE)
    if (!adminKey) return
    void fetch(`/api/client/${clientId}/data-sources`, {
      cache: 'no-store',
      headers: { 'x-data-source-admin-key': adminKey },
    })
      .then(async response => {
        const data = (await response.json()) as {
          ok?: boolean
          sources?: DataSourceSummary[]
        }
        if (response.ok && data.ok) setExternalSources(data.sources ?? [])
      })
      .catch(() => undefined)
  }, [clientId])

  async function run(nextQuestion: string) {
    const trimmed = nextQuestion.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    try {
      const adminKey = window.sessionStorage.getItem(ADMIN_KEY_STORAGE)
      const res = await fetch(`/api/client/${clientId}/consultar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sourceId && adminKey ? { 'x-data-source-admin-key': adminKey } : {}),
        },
        body: JSON.stringify({ question: trimmed, sourceId: sourceId || undefined }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string } & Partial<QueryPayload>
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Não foi possível consultar.')
      }
      setResult({
        sql: data.sql ?? '',
        explanation: data.explanation ?? '',
        suggestions: data.suggestions ?? [],
        sourceName: data.sourceName,
        columns: data.columns ?? [],
        rows: data.rows ?? [],
        chart: data.chart ?? null,
      })
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Erro ao consultar.')
    } finally {
      setLoading(false)
    }
  }

  const chartRows =
    result?.chart &&
    result.rows.map(row => ({
      ...row,
      [result.chart!.valueKey]: Number(row[result.chart!.valueKey]),
    }))

  return (
    <div className="space-y-6">
      <form
        onSubmit={event => {
          event.preventDefault()
          void run(question)
        }}
        className="rounded-2xl border border-black/[0.06] bg-[#fbfbfa] p-4 sm:p-5"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Pergunta
          </label>
          <Link
            href={sourcesHref}
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Gerenciar fontes
          </Link>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-neutral-400" />
          <select
            value={sourceId}
            onChange={event => {
              setSourceId(event.target.value)
              setResult(null)
            }}
            className="h-9 min-w-64 rounded-xl border border-black/[0.08] bg-white px-3 text-[11px] text-neutral-700 outline-none"
          >
            <option value="">Workspace Cadence</option>
            {externalSources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} · {source.tableCount} tabelas · {source.kind === 'sqlserver' ? 'SQL Server' : 'PostgreSQL'}
              </option>
            ))}
          </select>
          {externalSources.length === 0 && (
            <span className="text-[10px] text-neutral-400">
              Cadastre e desbloqueie uma fonte externa para selecioná-la.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={event => setQuestion(event.target.value)}
            placeholder="Ex.: quantas PRs do app nas últimas 6 semanas?"
            className="h-11 flex-1 rounded-xl border border-black/[0.08] bg-white px-3.5 text-[13px] text-neutral-800 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Consultar
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {examples.map(example => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuestion(example)
                void run(example)
              }}
              className="rounded-full border border-black/[0.07] bg-white px-3 py-1 text-[11px] text-neutral-500 hover:border-neutral-300"
            >
              {example}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-800">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">
              Explicação{result.sourceName ? ` · ${result.sourceName}` : ''}
            </p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-700">{result.explanation}</p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-950 px-3 py-2.5 text-[11px] leading-relaxed text-teal-100">
              {result.sql}
            </pre>
          </div>

          {result.suggestions.length > 0 && (
            <div className="rounded-2xl border border-black/[0.06] bg-[#fbfbfa] px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Próximas consultas sugeridas
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuestion(suggestion)
                      void run(suggestion)
                    }}
                    className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-left text-[11px] text-neutral-600 hover:border-neutral-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chartRows && result.chart && (
            <div className="rounded-2xl border border-black/[0.06] bg-[#fbfbfa] px-4 py-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Gráfico
              </p>
              <ConsultarChart
                rows={chartRows}
                labelKey={result.chart.labelKey}
                valueKey={result.chart.valueKey}
                accent={accent}
              />
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
            <div className="border-b border-black/[0.06] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              {result.rows.length} {result.rows.length === 1 ? 'linha' : 'linhas'}
            </div>
            {result.rows.length === 0 ? (
              <p className="px-4 py-8 text-center text-[13px] text-neutral-400">
                Nenhum resultado para esta pergunta.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[12px]">
                  <thead className="bg-[#fbfbfa] text-[10px] uppercase tracking-[0.08em] text-neutral-400">
                    <tr>
                      {result.columns.map(column => (
                        <th key={column} className="px-3 py-2.5 font-semibold">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, index) => (
                      <tr key={index} className="border-t border-black/[0.05]">
                        {result.columns.map(column => (
                          <td key={column} className="max-w-xs truncate px-3 py-2.5 text-neutral-700">
                            {cellValue(row[column])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
