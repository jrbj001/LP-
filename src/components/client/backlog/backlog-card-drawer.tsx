'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { BacklogCard, BacklogColumnId, CardPatch } from '@/lib/backlog/types'
import { ArrowUpRight, Sparkles, X, Loader2 } from 'lucide-react'

export function BacklogCardDrawer({
  card,
  columns,
  accent,
  busy,
  detailHref,
  onClose,
  onPatch,
  onEnrich,
}: {
  card: BacklogCard
  columns: { id: BacklogColumnId; label: string }[]
  accent: string
  busy: boolean
  detailHref: string
  onClose: () => void
  onPatch: (patch: CardPatch) => Promise<BacklogCard | null>
  onEnrich: (mode: 'story' | 'spec') => Promise<BacklogCard | null>
}) {
  const [title, setTitle] = useState(card.title)
  const [persona, setPersona] = useState(card.persona ?? '')
  const [want, setWant] = useState(card.want ?? '')
  const [soThat, setSoThat] = useState(card.soThat ?? '')
  const [acceptanceText, setAcceptanceText] = useState((card.acceptance ?? []).join('\n'))
  const [context, setContext] = useState(card.context ?? '')
  const [impl, setImpl] = useState(card.implementationNotes ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(card.title)
    setPersona(card.persona ?? '')
    setWant(card.want ?? '')
    setSoThat(card.soThat ?? '')
    setAcceptanceText((card.acceptance ?? []).join('\n'))
    setContext(card.context ?? '')
    setImpl(card.implementationNotes ?? '')
  }, [card])

  async function save() {
    setSaving(true)
    await onPatch({
      title: title.trim() || card.title,
      persona: persona.trim() || undefined,
      want: want.trim() || undefined,
      soThat: soThat.trim() || undefined,
      acceptance: acceptanceText
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean),
      context: context.trim() || undefined,
      implementationNotes: impl.trim() || undefined,
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside className="relative w-full max-w-lg h-full bg-white shadow-2xl border-l border-black/[0.06] overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-black/[0.06] px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-neutral-400">
              {card.source.kind}
              {card.source.ref ? ` · ${card.source.ref}` : ''} · {card.level}
            </p>
            <h2 className="text-[16px] font-semibold text-neutral-900 mt-1 leading-snug">
              Detalhe do card
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-black/[0.04] hover:text-neutral-800"
          >
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </header>

        <div className="px-5 py-5 space-y-5">
          <Link
            href={detailHref}
            className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-[#fafaf8] px-4 py-3 text-[13px] font-medium text-neutral-800 hover:border-neutral-300"
          >
            Abrir visualização completa
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
          </Link>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || card.level === 'spec'}
              onClick={() => void onEnrich('story')}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-800 text-[12px] font-medium px-3.5 py-2 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Enriquecer → User Story
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void onEnrich('spec')}
              className="inline-flex items-center gap-1.5 rounded-full text-white text-[12px] font-medium px-3.5 py-2 disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Enriquecer → Spec (agent-ready)
            </button>
          </div>

          <Field label="Coluna">
            <select
              value={card.column}
              disabled={busy}
              onChange={e => void onPatch({ column: e.target.value as BacklogColumnId })}
              className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[13px]"
            >
              {columns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Título">
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[13px]"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3">
            <Field label="Persona">
              <input
                value={persona}
                onChange={e => setPersona(e.target.value)}
                className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[13px]"
              />
            </Field>
            <Field label="Quero">
              <textarea
                value={want}
                onChange={e => setWant(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[13px]"
              />
            </Field>
            <Field label="Para que">
              <textarea
                value={soThat}
                onChange={e => setSoThat(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[13px]"
              />
            </Field>
          </div>

          <Field label="Critérios de aceite (um por linha)">
            <textarea
              value={acceptanceText}
              onChange={e => setAcceptanceText(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[13px] font-mono"
            />
          </Field>

          <Field label="Contexto">
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[13px]"
            />
          </Field>

          <Field label="Notas de implementação (agent-ready)">
            <textarea
              value={impl}
              onChange={e => setImpl(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-[12px] font-mono"
            />
          </Field>

          {card.filesLikely && card.filesLikely.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400 mb-2">
                Arquivos prováveis
              </p>
              <ul className="space-y-1">
                {card.filesLikely.map(f => (
                  <li key={f} className="text-[11px] font-mono text-neutral-600 bg-[#fafaf8] rounded-md px-2 py-1">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {card.testPlan && card.testPlan.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400 mb-2">
                Plano de teste
              </p>
              <ul className="space-y-1.5">
                {card.testPlan.map(t => (
                  <li key={t} className="text-[12px] text-neutral-600 leading-relaxed pl-3 relative">
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-teal-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {card.risks && card.risks.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400 mb-2">
                Riscos
              </p>
              <ul className="space-y-1.5">
                {card.risks.map(r => (
                  <li key={r} className="text-[12px] text-amber-800/80 leading-relaxed">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {card.githubRefs && card.githubRefs.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400 mb-2">
                Refs GitHub
              </p>
              <ul className="space-y-1">
                {card.githubRefs.map((r, i) => (
                  <li key={`${r.repo}-${r.path}-${i}`} className="text-[11px] font-mono text-neutral-500">
                    {r.repo}
                    {r.path ? `:${r.path}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            disabled={saving || busy}
            onClick={() => void save()}
            className="w-full rounded-full bg-neutral-900 text-white text-[13px] font-medium py-2.5 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar edições do PM'}
          </button>
        </div>
      </aside>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400 mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  )
}
