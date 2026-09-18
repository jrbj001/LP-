'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ExternalLink, Loader2, Search, Settings2 } from 'lucide-react'

const ConsultarChart = dynamic(
  () => import('./consultar-chart').then(mod => mod.ConsultarChart),
  { ssr: false }
)

interface QueryPayload {
  sql: string
  explanation: string
  answer: string
  suggestions: string[]
  sourceName?: string
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
  evidence: {
    id: string
    kind: 'github' | 'database' | 'meeting' | 'document'
    source: string
    title: string
    excerpt: string
    href?: string
  }[]
  statuses: {
    id: string
    label: string
    state: 'used' | 'empty' | 'unavailable' | 'error'
    detail?: string
  }[]
}

const DEFAULT_EXAMPLES = [
  'Quantas PRs do app Like:Me nas últimas 6 semanas?',
  'Cards por coluna do backlog',
  'Quais reuniões aconteceram em agosto?',
]

const LIKEME_EXAMPLES = [
  'Quantos usuários existem hoje no produto?',
  'Quais são as tabelas principais do Supabase Like:Me?',
  'Quantos registros recentes aparecem no marketplace ou na comunidade?',
]

const BE180_EXAMPLES = [
  'Quantos pontos ativos existem hoje no Banco de Ativos?',
  'Qual o exibidor com o maior número de pontos ativos?',
  'Quais roteiros mais recentes aparecem no Colmeia?',
]

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
  const examples =
    clientId === 'be180-ooh' ? BE180_EXAMPLES : clientId === 'likeme' ? LIKEME_EXAMPLES : DEFAULT_EXAMPLES

  async function run(nextQuestion: string) {
    const trimmed = nextQuestion.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/client/${clientId}/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string } & Partial<QueryPayload>
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Não foi possível consultar.')
      }
      setResult({
        sql: data.sql ?? '',
        explanation: data.explanation ?? '',
        answer: data.answer ?? data.explanation ?? '',
        suggestions: data.suggestions ?? [],
        sourceName: data.sourceName,
        columns: data.columns ?? [],
        rows: data.rows ?? [],
        chart: data.chart ?? null,
        evidence: data.evidence ?? [],
        statuses: data.statuses ?? [],
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
        <p className="mb-3 text-[11px] text-neutral-500">
          O agente escolhe e cruza automaticamente GitHub, bancos, reuniões e documentos.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={event => setQuestion(event.target.value)}
            placeholder="Ex.: qual o exibidor com mais pontos ativos?"
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
              Resposta{result.sourceName ? ` · ${result.sourceName}` : ''}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-800">
              {result.answer || result.explanation}
            </p>
            {result.statuses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {result.statuses.map(status => (
                  <span
                    key={status.id}
                    title={status.detail}
                    className={`rounded-full border px-2.5 py-1 text-[10px] ${
                      status.state === 'used'
                        ? 'border-teal-200 bg-teal-50 text-teal-800'
                        : status.state === 'error' || status.state === 'unavailable'
                          ? 'border-amber-200 bg-amber-50 text-amber-800'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-500'
                    }`}
                  >
                    {status.label} · {status.state === 'used' ? 'consultado' : status.state === 'error' ? 'erro' : status.state === 'unavailable' ? 'indisponível' : 'sem resultado'}
                  </span>
                ))}
              </div>
            )}
          </div>

          {result.evidence.length > 0 && (
            <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Referências
              </p>
              <div className="mt-3 divide-y divide-black/[0.06]">
                {result.evidence.map((item, index) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[12px] font-medium text-neutral-800">
                        [{index + 1}] {item.title}
                      </p>
                      <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                        {item.kind}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-neutral-400">{item.source}</p>
                    <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-neutral-600">
                      {item.excerpt}
                    </p>
                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-teal-700 hover:underline"
                      >
                        Abrir fonte <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.sql && (
            <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Como consultamos
            </p>
            {result.explanation && result.explanation !== result.answer && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600">{result.explanation}</p>
            )}
            <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-950 px-3 py-2.5 text-[11px] leading-relaxed text-teal-100">
              {result.sql}
            </pre>
            </div>
          )}

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

          {result.sql && (
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
          )}
        </div>
      )}
    </div>
  )
}
