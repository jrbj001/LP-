'use client'

import Link from 'next/link'
import { AlertTriangle, Loader2, MessageSquareText, Sparkles } from 'lucide-react'
import type { DataModelAi, DataModelSnapshot } from '@/lib/data-sources/model/types'
import { formatDateTime } from './format'

export function ModelAi({
  snapshot,
  ai,
  generating,
  accent,
  consultarHref,
  onGenerate,
  onOpenTable,
}: {
  snapshot: DataModelSnapshot
  ai: DataModelAi | null
  generating: boolean
  accent: string
  consultarHref: string
  onGenerate: () => void
  onOpenTable: (key: string) => void
}) {
  if (!ai) {
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
          <Sparkles className="h-5 w-5" strokeWidth={1.6} />
        </div>
        <h2 className="mt-4 text-[15px] font-semibold text-neutral-800">Visão de IA ainda não gerada</h2>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-neutral-400">
          A IA lê o schema de {snapshot.tables.length} tabelas e escreve uma descrição de cada uma, agrupa por domínios
          de negócio, aponta riscos e sugere perguntas para o Consultar.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: accent }}
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Gerar visão de IA
        </button>
      </div>
    )
  }

  const described = Object.keys(ai.tables).length

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700">Visão geral</p>
          <span className="text-[10px] text-neutral-400">
            {described}/{snapshot.tables.length} tabelas descritas · {formatDateTime(ai.generatedAt)}
          </span>
        </div>
        <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-neutral-800">
          {ai.overview || 'A IA não retornou um resumo geral.'}
        </p>
      </section>

      {ai.domains.length > 0 && (
        <section>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Domínios de negócio
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ai.domains.map(domain => (
              <article key={domain.name} className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5">
                <h3 className="text-[13px] font-semibold text-neutral-900">{domain.name}</h3>
                {domain.description && (
                  <p className="mt-1 text-[12px] leading-relaxed text-neutral-600">{domain.description}</p>
                )}
                {domain.tables.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {domain.tables.map(key => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onOpenTable(key)}
                        className="rounded-full border border-black/[0.07] bg-[#fbfbfa] px-2 py-0.5 font-mono text-[10px] text-neutral-600 hover:border-neutral-300"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Riscos e lacunas
          </p>
          {ai.risks.length === 0 ? (
            <p className="mt-3 text-[12px] text-neutral-400">Nenhum risco apontado.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {ai.risks.map((risk, index) => (
                <li key={index} className="flex gap-2 text-[12px] leading-relaxed text-neutral-700">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {risk}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-black/[0.06] bg-[#fbfbfa] px-5 py-4">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            <MessageSquareText className="h-3.5 w-3.5" /> Perguntas sugeridas para o Consultar
          </p>
          {ai.suggestedQuestions.length === 0 ? (
            <p className="mt-3 text-[12px] text-neutral-400">Nenhuma sugestão.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {ai.suggestedQuestions.map(question => (
                <Link
                  key={question}
                  href={`${consultarHref}?q=${encodeURIComponent(question)}`}
                  className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] text-neutral-700 hover:border-neutral-300"
                >
                  {question}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="flex items-center justify-between gap-3 text-[11px] text-neutral-400">
        <span>Gerado com base no schema, estatísticas e health check. Revise antes de usar como documentação oficial.</span>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-black/[0.07] bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-600 hover:border-neutral-300 disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Regenerar
        </button>
      </div>
    </div>
  )
}
