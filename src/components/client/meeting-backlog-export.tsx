'use client'

import { useState } from 'react'
import { ArrowRight, Check, ClipboardList, Loader2 } from 'lucide-react'

type Mode = 'requirement' | 'story'
type Priority = 'Alta' | 'Média' | 'Baixa'

interface Board {
  id: string
  title: string
}

interface Draft {
  id: string
  mode: Mode
  boardId: string
  title: string
  priority: Priority
  context: string
  persona?: string
  want?: string
  soThat?: string
  acceptance?: string[]
  alreadyExported: boolean
}

export function MeetingBacklogExport({
  clientId,
  meetingId,
  locale,
  brief,
  accent,
}: {
  clientId: string
  meetingId: string
  locale: string
  brief: unknown
  accent: string
}) {
  const [mode, setMode] = useState<Mode>('requirement')
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [boards, setBoards] = useState<Board[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ created: number; skipped: number; boardId?: string } | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch(
        `/api/client/${encodeURIComponent(clientId)}/meetings/${encodeURIComponent(meetingId)}/backlog`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, brief: JSON.stringify(brief) }),
        }
      )
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Não foi possível gerar os itens.')
      const nextDrafts = data.drafts as Draft[]
      setDrafts(nextDrafts)
      setBoards(data.boards)
      setSelected(new Set(nextDrafts.filter(item => !item.alreadyExported).map(item => item.id)))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts(items => items.map(item => (item.id === id ? { ...item, ...patch } : item)))
  }

  function toggle(id: string) {
    setSelected(current => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function apply() {
    const items = drafts
      .filter(item => selected.has(item.id) && !item.alreadyExported)
      .map(({ alreadyExported: _alreadyExported, context: _context, ...item }) => item)
    if (items.length === 0) return
    setApplying(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/client/${encodeURIComponent(clientId)}/meetings/${encodeURIComponent(meetingId)}/backlog/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, items }),
        }
      )
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Não foi possível enviar ao backlog.')
      const created = Number(data.counts?.created ?? 0)
      const skipped = Number(data.counts?.skipped ?? 0)
      setResult({ created, skipped, boardId: data.created?.[0]?.boardId })
      const processed = new Set(items.map(item => item.id))
      setDrafts(current =>
        current.map(item => (processed.has(item.id) ? { ...item, alreadyExported: true } : item))
      )
      setSelected(new Set())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setApplying(false)
    }
  }

  const selectedCount = drafts.filter(item => selected.has(item.id) && !item.alreadyExported).length
  const backlogHref = `/${locale}/client/${clientId}/backlog${result?.boardId ? `?board=${encodeURIComponent(result.boardId)}` : ''}`

  return (
    <section className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
            <ClipboardList className="h-3.5 w-3.5" />
            Gerar para o backlog
          </h3>
          <p className="mt-1 text-[12px] text-neutral-400">Revise os itens antes de enviá-los.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-black/[0.08] bg-neutral-50 p-0.5">
            {([
              ['requirement', 'Requisitos'],
              ['story', 'User stories'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value)
                  setDrafts([])
                  setSelected(new Set())
                  setResult(null)
                }}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium ${
                  mode === value ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={loading || applying}
            className="rounded-full px-3.5 py-2 text-[11px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {loading ? 'Gerando…' : drafts.length ? 'Gerar novamente' : 'Gerar'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
          {error}
        </p>
      )}

      {drafts.length > 0 && (
        <div className="mt-4 space-y-3">
          {drafts.map(draft => (
            <article
              key={draft.id}
              className={`rounded-xl border p-3.5 ${
                draft.alreadyExported ? 'border-emerald-100 bg-emerald-50/40' : 'border-black/[0.07]'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(draft.id)}
                  onChange={() => toggle(draft.id)}
                  disabled={draft.alreadyExported}
                  aria-label={`Selecionar ${draft.title}`}
                  className="mt-2 h-4 w-4 rounded border-neutral-300"
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="grid gap-2 sm:grid-cols-[1fr_190px]">
                    <input
                      value={draft.title}
                      onChange={event => updateDraft(draft.id, { title: event.target.value })}
                      disabled={draft.alreadyExported}
                      maxLength={180}
                      className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[12px] font-medium text-neutral-800 outline-none focus:border-neutral-300 disabled:bg-transparent"
                    />
                    <select
                      value={draft.boardId}
                      onChange={event => updateDraft(draft.id, { boardId: event.target.value })}
                      disabled={draft.alreadyExported}
                      className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[11px] text-neutral-600 outline-none disabled:bg-transparent"
                    >
                      {boards.map(board => (
                        <option key={board.id} value={board.id}>
                          {board.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] leading-relaxed text-neutral-500">{draft.context}</p>

                  {draft.mode === 'story' && (
                    <div className="grid gap-2">
                      {([
                        ['persona', 'Como / persona'],
                        ['want', 'Quero'],
                        ['soThat', 'Para que'],
                      ] as const).map(([field, label]) => (
                        <label key={field} className="grid gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                          {label}
                          <input
                            value={draft[field] ?? ''}
                            onChange={event => updateDraft(draft.id, { [field]: event.target.value })}
                            disabled={draft.alreadyExported}
                            maxLength={field === 'persona' ? 120 : 300}
                            className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[12px] font-normal normal-case tracking-normal text-neutral-700 outline-none disabled:bg-transparent"
                          />
                        </label>
                      ))}
                      <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Critérios de aceite (um por linha)
                        <textarea
                          value={(draft.acceptance ?? []).join('\n')}
                          onChange={event =>
                            updateDraft(draft.id, {
                              acceptance: event.target.value.split('\n').slice(0, 8),
                            })
                          }
                          disabled={draft.alreadyExported}
                          rows={Math.max(2, draft.acceptance?.length ?? 2)}
                          className="resize-y rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[12px] font-normal normal-case tracking-normal text-neutral-700 outline-none disabled:bg-transparent"
                        />
                      </label>
                    </div>
                  )}
                </div>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
                  {draft.alreadyExported ? 'Já enviado' : draft.priority}
                </span>
              </div>
            </article>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-neutral-400">{selectedCount} item(ns) selecionado(s)</p>
            <button
              type="button"
              onClick={apply}
              disabled={applying || selectedCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-40"
            >
              {applying && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {applying ? 'Enviando…' : 'Enviar selecionados ao backlog'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" />
            {result.created} criado(s){result.skipped ? ` · ${result.skipped} já existente(s)` : ''}.
          </span>
          <a href={backlogHref} className="inline-flex items-center gap-1 font-semibold hover:underline">
            Abrir backlog <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </section>
  )
}
