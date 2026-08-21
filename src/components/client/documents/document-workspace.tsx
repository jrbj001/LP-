'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import type { ClientDocumentRecord, DocumentBacklogDraft } from '@/lib/documents/types'
import { AgentProgress, type AgentStepId, type AgentStepState } from './agent-progress'
import { ArchitectureView, WorkPlanView } from './document-artifacts-view'

interface Board {
  id: string
  title: string
}

type Busy = 'upload' | 'register' | 'extract' | 'spec' | 'backlog' | 'apply' | 'delete' | null

const KIND_ICON = {
  spreadsheet: FileSpreadsheet,
  document: FileText,
  pdf: FileText,
  image: ImageIcon,
  text: FileText,
} as const

const KIND_LABEL = {
  spreadsheet: 'Planilha',
  document: 'Documento',
  pdf: 'PDF',
  image: 'Imagem',
  text: 'Texto',
} as const

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Agrupa milhares sem `toLocaleString`: Node e navegador usam separadores
 * diferentes para pt-BR e a divergência quebra a hidratação.
 */
function formatCount(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function errorMessage(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'Erro inesperado.'
}

async function readJson(response: Response, fallback: string) {
  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.ok) throw new Error(data?.error || fallback)
  return data
}

export function DocumentWorkspace({
  clientId,
  locale,
  accent,
  boards,
  storageReady,
  initialDocuments,
  maxBytes,
  extensions,
}: {
  clientId: string
  locale: string
  accent: string
  boards: Board[]
  storageReady: boolean
  initialDocuments: ClientDocumentRecord[]
  maxBytes: number
  extensions: string[]
}) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [selectedId, setSelectedId] = useState<string | null>(initialDocuments[0]?.id ?? null)
  const [busy, setBusy] = useState<Busy>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteTitle, setPasteTitle] = useState('')
  const [pasteUrl, setPasteUrl] = useState('')
  const [pasteContent, setPasteContent] = useState('')
  const [boardId, setBoardId] = useState(boards[0]?.id ?? '')
  const [drafts, setDrafts] = useState<DocumentBacklogDraft[]>([])
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set())
  const [applyResult, setApplyResult] = useState<{ created: number; skipped: number } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const base = `/api/client/${encodeURIComponent(clientId)}/documents`
  const selected = documents.find(document => document.id === selectedId) ?? null

  const replaceDocument = useCallback((record: ClientDocumentRecord) => {
    setDocuments(current => {
      const exists = current.some(document => document.id === record.id)
      return exists
        ? current.map(document => (document.id === record.id ? record : document))
        : [record, ...current]
    })
    setSelectedId(record.id)
  }, [])

  const accepted = useMemo(() => extensions.map(extension => `.${extension}`).join(','), [extensions])

  async function upload(file: File) {
    if (file.size > maxBytes) {
      setError(`"${file.name}" excede o limite de ${Math.round(maxBytes / 1024 / 1024)} MB.`)
      return
    }
    setBusy('upload')
    setError(null)
    setDrafts([])
    setApplyResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      if (boardId) form.append('boardId', boardId)
      const data = await readJson(
        await fetch(`${base}/upload`, { method: 'POST', body: form }),
        'Não foi possível enviar o arquivo.'
      )
      replaceDocument(data.document as ClientDocumentRecord)
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setBusy(null)
    }
  }

  async function register() {
    setBusy('register')
    setError(null)
    try {
      const data = await readJson(
        await fetch(`${base}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: pasteTitle,
            content: pasteContent,
            sourceUrl: pasteUrl || undefined,
            boardId: boardId || undefined,
          }),
        }),
        'Não foi possível registrar o conteúdo.'
      )
      replaceDocument(data.document as ClientDocumentRecord)
      setPasteOpen(false)
      setPasteTitle('')
      setPasteUrl('')
      setPasteContent('')
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setBusy(null)
    }
  }

  async function runStep(step: 'extract' | 'spec', documentId: string) {
    setBusy(step)
    setError(null)
    try {
      const data = await readJson(
        await fetch(`${base}/${encodeURIComponent(documentId)}/${step}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ boardId: boardId || undefined }),
        }),
        step === 'extract' ? 'Não foi possível ler o arquivo.' : 'Não foi possível gerar os artefatos.'
      )
      replaceDocument(data.document as ClientDocumentRecord)
      if (Array.isArray(data.failures) && data.failures.length > 0) {
        setError(`Parte da análise falhou — ${data.failures.join(' · ')}`)
      }
    } catch (caught) {
      setError(errorMessage(caught))
      // Recarrega para refletir o status 'failed' gravado pela rota.
      void refresh()
    } finally {
      setBusy(null)
    }
  }

  async function refresh() {
    try {
      const data = await readJson(await fetch(base, { cache: 'no-store' }), 'Falha ao recarregar.')
      setDocuments(data.documents as ClientDocumentRecord[])
    } catch {
      // Silencioso: o erro da ação principal já está visível.
    }
  }

  async function loadDrafts(documentId: string, regenerate: boolean) {
    setBusy('backlog')
    setError(null)
    setApplyResult(null)
    try {
      const data = await readJson(
        await fetch(`${base}/${encodeURIComponent(documentId)}/backlog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regenerate, boardId: boardId || undefined }),
        }),
        'Não foi possível gerar os itens de backlog.'
      )
      const next = data.drafts as DocumentBacklogDraft[]
      setDrafts(next)
      setSelectedDrafts(new Set(next.filter(draft => !draft.alreadyExported).map(draft => draft.id)))
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setBusy(null)
    }
  }

  async function applyDrafts(documentId: string) {
    const items = drafts
      .filter(draft => selectedDrafts.has(draft.id) && !draft.alreadyExported)
      .map(({ alreadyExported: _exported, ...draft }) => draft)
    if (items.length === 0) return

    setBusy('apply')
    setError(null)
    try {
      const data = await readJson(
        await fetch(`${base}/${encodeURIComponent(documentId)}/backlog/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        }),
        'Não foi possível enviar ao backlog.'
      )
      setApplyResult({
        created: Number(data.counts?.created ?? 0),
        skipped: Number(data.counts?.skipped ?? 0),
      })
      const sent = new Set(items.map(item => item.id))
      setDrafts(current =>
        current.map(draft => (sent.has(draft.id) ? { ...draft, alreadyExported: true } : draft))
      )
      setSelectedDrafts(new Set())
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setBusy(null)
    }
  }

  async function remove(documentId: string) {
    setBusy('delete')
    setError(null)
    try {
      await readJson(
        await fetch(`${base}/${encodeURIComponent(documentId)}`, { method: 'DELETE' }),
        'Não foi possível remover o documento.'
      )
      setDocuments(current => current.filter(document => document.id !== documentId))
      setSelectedId(current => (current === documentId ? null : current))
      setDrafts([])
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setBusy(null)
    }
  }

  function stepStates(document: ClientDocumentRecord | null): Record<AgentStepId, AgentStepState> {
    if (!document) {
      return {
        upload: busy === 'upload' || busy === 'register' ? 'running' : 'pending',
        extract: 'pending',
        analyze: 'pending',
        artifacts: 'pending',
      }
    }
    const failed = document.status === 'failed'
    const hasArtifacts = Boolean(
      document.artifacts?.workPlan || document.artifacts?.architecture || document.artifacts?.backlogDrafts
    )
    return {
      upload: 'done',
      extract: busy === 'extract' ? 'running' : document.extraction ? 'done' : failed ? 'failed' : 'pending',
      analyze:
        busy === 'spec' || busy === 'backlog'
          ? 'running'
          : hasArtifacts
            ? 'done'
            : failed && document.extraction
              ? 'failed'
              : 'pending',
      artifacts: hasArtifacts ? 'done' : 'pending',
    }
  }

  const selectedDraftCount = drafts.filter(
    draft => selectedDrafts.has(draft.id) && !draft.alreadyExported
  ).length

  if (!storageReady) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
        <h2 className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-900">
          <Upload className="h-4 w-4" strokeWidth={1.8} />
          Upload indisponível
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-amber-800">
          O armazenamento de arquivos não está configurado neste ambiente. Defina{' '}
          <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[11px]">BLOB_READ_WRITE_TOKEN</code>{' '}
          para habilitar o envio de planilhas, documentos, PDFs e imagens.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-neutral-900">
            <Sparkles className="h-4 w-4" style={{ color: accent }} strokeWidth={1.8} />
            Documentos com inteligência
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
            Envie planilhas, documentos, PDFs ou imagens. O agente lê o conteúdo, cruza com o código no
            GitHub e gera plano de trabalho, arquitetura, requisitos e user stories.
          </p>
        </div>
        {boards.length > 1 && (
          <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Board de destino
            <select
              value={boardId}
              onChange={event => setBoardId(event.target.value)}
              className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[12px] font-normal normal-case tracking-normal text-neutral-700 outline-none"
            >
              {boards.map(board => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div
        onDragOver={event => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={event => {
          event.preventDefault()
          setDragging(false)
          const file = event.dataTransfer.files?.[0]
          if (file) void upload(file)
        }}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging ? 'border-neutral-400 bg-neutral-50' : 'border-black/[0.09] bg-white'
        }`}
      >
        <input
          ref={fileInput}
          type="file"
          accept={accepted}
          className="hidden"
          onChange={event => {
            const file = event.target.files?.[0]
            if (file) void upload(file)
            event.target.value = ''
          }}
        />
        <Upload className="mx-auto h-5 w-5 text-neutral-400" strokeWidth={1.8} />
        <p className="mt-2 text-[13px] font-medium text-neutral-800">
          Arraste um arquivo ou escolha do computador
        </p>
        <p className="mt-1 text-[11px] text-neutral-400">
          {extensions.join(', ')} · até {Math.round(maxBytes / 1024 / 1024)} MB
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {busy === 'upload' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {busy === 'upload' ? 'Enviando…' : 'Selecionar arquivo'}
          </button>
          <button
            type="button"
            onClick={() => setPasteOpen(open => !open)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[11px] font-semibold text-neutral-600 disabled:opacity-50"
          >
            <Link2 className="h-3.5 w-3.5" />
            Colar texto ou link
          </button>
        </div>
      </div>

      {pasteOpen && (
        <div className="rounded-xl border border-black/[0.07] bg-white p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Título
              <input
                value={pasteTitle}
                onChange={event => setPasteTitle(event.target.value)}
                maxLength={180}
                placeholder="Ata de kickoff, escopo do Notion…"
                className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[12px] font-normal normal-case tracking-normal text-neutral-700 outline-none"
              />
            </label>
            <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Link de origem (opcional)
              <input
                value={pasteUrl}
                onChange={event => setPasteUrl(event.target.value)}
                placeholder="https://notion.so/…"
                className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[12px] font-normal normal-case tracking-normal text-neutral-700 outline-none"
              />
            </label>
          </div>
          <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Conteúdo
            <textarea
              value={pasteContent}
              onChange={event => setPasteContent(event.target.value)}
              rows={6}
              placeholder="Cole aqui o conteúdo que o agente deve analisar."
              className="resize-y rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-[12px] font-normal normal-case tracking-normal text-neutral-700 outline-none"
            />
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void register()}
              disabled={busy !== null || pasteTitle.trim().length < 3 || pasteContent.trim().length < 40}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-40"
            >
              {busy === 'register' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Registrar fonte
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] leading-relaxed text-rose-700">
          {error}
        </p>
      )}

      {documents.length > 0 && (
        <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.05] overflow-hidden">
          {documents.map(document => {
            const Icon = KIND_ICON[document.kind]
            const isSelected = document.id === selectedId
            return (
              <div
                key={document.id}
                className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${
                  isSelected ? 'bg-neutral-50/70' : 'hover:bg-black/[0.015]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(document.id)
                    setDrafts([])
                    setApplyResult(null)
                    setError(null)
                  }}
                  className="flex flex-1 items-center gap-3 text-left min-w-0"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${accent}12`, color: accent }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[13px] font-semibold text-neutral-900">
                        {document.title}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
                        {KIND_LABEL[document.kind]}
                      </span>
                      {document.status === 'failed' && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-rose-700">
                          Falhou
                        </span>
                      )}
                      {document.status === 'ready' && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-700">
                          Analisado
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-neutral-400">
                      {formatBytes(document.sizeBytes)}
                      {document.extraction
                        ? ` · ${formatCount(document.extraction.charCount)} caracteres lidos`
                        : ''}
                      {document.extraction?.truncated ? ' (truncado)' : ''}
                    </span>
                  </span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {!document.extraction && document.pathname && (
                    <button
                      type="button"
                      onClick={() => void runStep('extract', document.id)}
                      disabled={busy !== null}
                      className="rounded-full border border-black/[0.08] px-3 py-1.5 text-[11px] font-semibold text-neutral-600 disabled:opacity-40"
                    >
                      {busy === 'extract' && isSelected ? 'Lendo…' : 'Ler conteúdo'}
                    </button>
                  )}
                  {document.extraction && (
                    <button
                      type="button"
                      onClick={() => void runStep('spec', document.id)}
                      disabled={busy !== null}
                      className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-40"
                      style={{ backgroundColor: accent }}
                    >
                      {busy === 'spec' && isSelected
                        ? 'Analisando…'
                        : document.artifacts
                          ? 'Analisar novamente'
                          : 'Analisar'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void remove(document.id)}
                    disabled={busy !== null}
                    aria-label={`Remover ${document.title}`}
                    className="rounded-full border border-black/[0.08] p-1.5 text-neutral-400 hover:text-rose-600 disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <div className="space-y-4">
          <AgentProgress
            states={stepStates(selected)}
            accent={accent}
            error={
              selected.status === 'failed' && selected.error
                ? { step: selected.extraction ? 'analyze' : 'extract', message: selected.error }
                : null
            }
          />

          {selected.artifacts?.workPlan && (
            <WorkPlanView plan={selected.artifacts.workPlan} accent={accent} />
          )}
          {selected.artifacts?.architecture && (
            <ArchitectureView architecture={selected.artifacts.architecture} />
          )}

          {selected.extraction && (
            <section className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    <ClipboardList className="h-3.5 w-3.5" />
                    Requisitos e user stories
                  </h3>
                  <p className="mt-1 text-[12px] text-neutral-400">
                    Revise e ajuste antes de enviar ao backlog.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadDrafts(selected.id, drafts.length > 0)}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] px-3.5 py-2 text-[11px] font-semibold text-neutral-600 disabled:opacity-40"
                >
                  {busy === 'backlog' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {busy === 'backlog' ? 'Gerando…' : drafts.length > 0 ? 'Gerar novamente' : 'Gerar itens'}
                </button>
              </div>

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
                          checked={selectedDrafts.has(draft.id)}
                          onChange={() =>
                            setSelectedDrafts(current => {
                              const next = new Set(current)
                              if (next.has(draft.id)) next.delete(draft.id)
                              else next.add(draft.id)
                              return next
                            })
                          }
                          disabled={draft.alreadyExported}
                          aria-label={`Selecionar ${draft.title}`}
                          className="mt-1.5 h-4 w-4 rounded border-neutral-300"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
                              {draft.mode === 'story' ? 'User story' : 'Requisito'}
                            </span>
                            <h4 className="text-[13px] font-semibold text-neutral-900">{draft.title}</h4>
                          </div>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">
                            {draft.context}
                          </p>
                          {draft.mode === 'story' && (
                            <dl className="mt-2 grid gap-1 text-[11px] text-neutral-600">
                              <div className="flex gap-1.5">
                                <dt className="font-semibold text-neutral-400">Como</dt>
                                <dd>{draft.persona}</dd>
                              </div>
                              <div className="flex gap-1.5">
                                <dt className="font-semibold text-neutral-400">Quero</dt>
                                <dd>{draft.want}</dd>
                              </div>
                              <div className="flex gap-1.5">
                                <dt className="font-semibold text-neutral-400">Para que</dt>
                                <dd>{draft.soThat}</dd>
                              </div>
                            </dl>
                          )}
                          {draft.acceptance && draft.acceptance.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {draft.acceptance.map(item => (
                                <li key={item} className="flex gap-2 text-[11px] text-neutral-600">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
                          {draft.alreadyExported ? 'Já enviado' : draft.priority}
                        </span>
                      </div>
                    </article>
                  ))}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[11px] text-neutral-400">
                      {selectedDraftCount} item(ns) selecionado(s)
                    </p>
                    <button
                      type="button"
                      onClick={() => void applyDrafts(selected.id)}
                      disabled={busy !== null || selectedDraftCount === 0}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-40"
                    >
                      {busy === 'apply' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {busy === 'apply' ? 'Enviando…' : 'Enviar selecionados ao backlog'}
                    </button>
                  </div>
                </div>
              )}

              {applyResult && (
                <div className="mt-4 flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    {applyResult.created} criado(s)
                    {applyResult.skipped ? ` · ${applyResult.skipped} já existente(s)` : ''}.
                  </span>
                  <a
                    href={`/${locale}/client/${clientId}/backlog${boardId ? `?board=${encodeURIComponent(boardId)}` : ''}`}
                    className="inline-flex items-center gap-1 font-semibold hover:underline"
                  >
                    Abrir backlog <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </section>
  )
}
