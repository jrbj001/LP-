'use client'

import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Loader2, Search } from 'lucide-react'

interface QueryPayload {
  sql: string
  explanation: string
  columns: string[]
  rows: Record<string, unknown>[]
  chart: { labelKey: string; valueKey: string } | null
}

const EXAMPLES = [
  'Quantas PRs do app Like:Me nas últimas 6 semanas?',
  'Cards por coluna do backlog',
  'Quais reuniões aconteceram em agosto?',
]

function cellValue(value: unknown): string {
  if (value == null) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function ConsultarWorkspace({
  clientId,
  accent,
}: {
  clientId: string
  accent: string
}) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<QueryPayload | null>(null)

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
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Pergunta
        </label>
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
          {EXAMPLES.map(example => (
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
              Explicação
            </p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-700">{result.explanation}</p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-950 px-3 py-2.5 text-[11px] leading-relaxed text-teal-100">
              {result.sql}
            </pre>
          </div>

          {chartRows && result.chart && (
            <div className="rounded-2xl border border-black/[0.06] bg-[#fbfbfa] px-4 py-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Gráfico
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey={result.chart.labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey={result.chart.valueKey} fill={accent} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
