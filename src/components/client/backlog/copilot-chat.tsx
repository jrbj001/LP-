'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Check,
  FileCode2,
  Loader2,
  MessageSquarePlus,
  PanelLeft,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react'
import {
  type BacklogBoard,
  type BacklogBoardId,
  type BacklogCard,
  type CopilotMessage,
  type CopilotThread,
  type CopilotThreadSummary,
} from '@/lib/backlog/types'
import { BacklogDiagramView } from './backlog-diagram'

const GENERATE_STORY_PROMPT =
  'Com o fluxo da empresa que já aprendemos nesta conversa, escreva agora o rascunho completo da user story (persona, quero, para que e critérios de aceite testáveis) para eu aplicar no board.'

const BE180_STARTERS = [
  'Como a operação promove inventário do Colmeia para o Banco de Ativos?',
  'Como o Colmeia monta um roteiro?',
  'O que o portal já documenta sobre o funil comercial da face?',
  'Quando o fluxo estiver claro, escreva a user story do roteiro só publicar com mídia válida.',
]

const LIKEME_STARTERS = [
  'Desenhe a jornada de saúde entre descoberta e acompanhamento.',
  'Como a empresa trata uma interação na comunidade hoje?',
  'O que o backlog do app já descreve sobre compra no marketplace?',
  'Quando o fluxo estiver claro, escreva a user story de compra no marketplace.',
]

export function CopilotChat({
  clientId,
  boards,
  accent,
  detailBase,
  boardId,
  card,
  variant = 'page',
}: {
  clientId: string
  boards: BacklogBoard[]
  accent: string
  detailBase: string
  boardId: BacklogBoardId
  card?: Pick<BacklogCard, 'id' | 'title'> | null
  variant?: 'page' | 'modal'
}) {
  const base = `/api/client/${encodeURIComponent(clientId)}/backlog/copilot`
  const starters = clientId === 'likeme' ? LIKEME_STARTERS : BE180_STARTERS

  const [threads, setThreads] = useState<CopilotThreadSummary[]>([])
  const [thread, setThread] = useState<CopilotThread | null>(null)
  const [activeBoardId, setActiveBoardId] = useState<BacklogBoardId>(boardId)
  const [draftMessage, setDraftMessage] = useState('')
  const [pendingUser, setPendingUser] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [appliedCards, setAppliedCards] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // O histórico só abre sozinho quando sobra largura depois da navegação do workspace.
  useEffect(() => {
    setHistoryOpen(window.matchMedia('(min-width: 1280px)').matches)
  }, [])

  useEffect(() => {
    const field = inputRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${Math.min(field.scrollHeight, 200)}px`
  }, [draftMessage])

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch(base, { cache: 'no-store' })
      const data = await res.json()
      if (res.ok && data.ok) setThreads(data.threads as CopilotThreadSummary[])
    } catch {
      /* lista de conversas é secundária; silencioso */
    }
  }, [base])

  useEffect(() => {
    void loadThreads()
  }, [loadThreads])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [thread?.messages.length, sending])

  const boardLabel = useMemo(
    () => boards.find(b => b.id === activeBoardId)?.title ?? activeBoardId,
    [activeBoardId, boards]
  )

  async function send(message: string) {
    const text = message.trim()
    if (!text || sending) return
    setSending(true)
    setPendingUser(text)
    setError(null)
    setDraftMessage('')
    try {
      const res = thread
        ? await fetch(`${base}/${encodeURIComponent(thread.id)}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
          })
        : await fetch(base, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ boardId: activeBoardId, cardId: card?.id, message: text }),
          })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        if (data?.thread) setThread(data.thread as CopilotThread)
        throw new Error(data?.error || 'Falha ao falar com o copiloto.')
      }
      setThread(data.thread as CopilotThread)
      setPendingUser(null)
      void loadThreads()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao falar com o copiloto.')
      setDraftMessage(text)
      setPendingUser(null)
    } finally {
      setSending(false)
    }
  }

  async function openThread(threadId: string) {
    setError(null)
    try {
      const res = await fetch(`${base}/${encodeURIComponent(threadId)}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || 'Conversa não encontrada.')
      const loaded = data.thread as CopilotThread
      setThread(loaded)
      setActiveBoardId(loaded.boardId)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao abrir conversa.')
    }
  }

  async function applyDraft(messageId: string) {
    if (!thread) return
    setApplyingId(messageId)
    setError(null)
    try {
      const res = await fetch(`${base}/${encodeURIComponent(thread.id)}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || 'Falha ao aplicar rascunho.')
      if (data.thread) setThread(data.thread as CopilotThread)
      setAppliedCards(prev => ({ ...prev, [messageId]: (data.card as BacklogCard).id }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao aplicar rascunho.')
    } finally {
      setApplyingId(null)
    }
  }

  function newThread() {
    setThread(null)
    setError(null)
    setDraftMessage('')
    setPendingUser(null)
  }

  const messages = thread?.messages ?? []
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')

  return (
    <div
      className={`flex h-full overflow-hidden bg-white ${
        variant === 'modal' ? 'rounded-2xl border border-black/[0.07]' : ''
      }`}
    >
      <aside
        className={`${historyOpen ? 'flex w-64' : 'hidden'} shrink-0 flex-col border-r border-black/[0.06] bg-[#fafaf8]`}
      >
        <div className="p-4 border-b border-black/[0.06]">
          <button
            type="button"
            onClick={newThread}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 text-white text-[12px] font-medium py-2"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" strokeWidth={1.8} />
            Nova conversa
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {threads.length === 0 && (
            <p className="text-[11px] text-neutral-400 px-2 py-3 leading-relaxed">
              Nenhuma conversa ainda. Pergunte algo para começar.
            </p>
          )}
          {threads.map(item => {
            const active = item.id === thread?.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => void openThread(item.id)}
                className={`w-full text-left rounded-lg px-2.5 py-2 transition-colors ${
                  active ? 'bg-white border border-black/[0.08]' : 'hover:bg-white/70'
                }`}
              >
                <p className="text-[12px] font-medium text-neutral-800 leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  {boards.find(b => b.id === item.boardId)?.productLabel ?? item.boardId} ·{' '}
                  {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </button>
            )
          })}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-2.5">
          <button
            type="button"
            onClick={() => setHistoryOpen(open => !open)}
            aria-label={historyOpen ? 'Ocultar conversas' : 'Mostrar conversas'}
            className="rounded-lg p-2 text-neutral-400 hover:bg-black/[0.04] hover:text-neutral-800"
          >
            <PanelLeft className="h-4 w-4" strokeWidth={1.8} />
          </button>
          {!historyOpen && (
            <button
              type="button"
              onClick={newThread}
              aria-label="Nova conversa"
              className="rounded-lg p-2 text-neutral-400 hover:bg-black/[0.04] hover:text-neutral-800"
            >
              <MessageSquarePlus className="h-4 w-4" strokeWidth={1.8} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[14px] font-semibold text-neutral-900">
              {thread?.title ?? boardLabel}
            </h2>
          </div>
          {card ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#fafaf8] px-3 py-1.5 text-[11px] text-neutral-600 max-w-xs truncate">
              <FileCode2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
              {card.title}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#fafaf8] px-3 py-1.5 text-[11px] text-neutral-600">
              <FileCode2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              Todos os repositórios
            </span>
          )}
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div
            className={`mx-auto w-full max-w-3xl px-4 sm:px-6 ${
              messages.length === 0 && !sending && !pendingUser
                ? 'flex h-full flex-col justify-center'
                : 'space-y-7 py-8'
            }`}
          >
          {messages.length === 0 && !sending && (
            <div className="mx-auto max-w-2xl text-center">
              <div
                className="w-11 h-11 rounded-2xl mx-auto flex items-center justify-center mb-4"
                style={{ backgroundColor: `${accent}14` }}
              >
                <Sparkles className="w-5 h-5" strokeWidth={1.8} style={{ color: accent }} />
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900">
                Pergunte sobre o fluxo
              </h3>
              <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
                O agente pesquisa todos os repositórios, reuniões, documentos, backlog e bancos
                relevantes antes de responder.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {starters.map(starter => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => void send(starter)}
                    className="rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-3 text-[12px] text-neutral-600 leading-relaxed hover:border-neutral-300 transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              accent={accent}
              detailBase={detailBase}
              appliedCardId={message.appliedCardId ?? appliedCards[message.id]}
              applying={applyingId === message.id}
              onApply={() => void applyDraft(message.id)}
            />
          ))}

          {pendingUser && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl bg-neutral-900 px-4 py-3 text-white">
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{pendingUser}</p>
              </div>
            </div>
          )}

          {sending && (
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${accent}14` }}
              >
                <Sparkles className="w-4 h-4" strokeWidth={1.8} style={{ color: accent }} />
              </div>
              <div className="rounded-2xl rounded-tl-md border border-black/[0.06] bg-[#fafaf8] px-4 py-3.5">
                <ThinkingDots accent={accent} />
              </div>
            </div>
          )}
          </div>
        </div>

        {error && (
          <div className="mx-auto mb-3 w-full max-w-3xl px-4 sm:px-6">
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-[12px] text-rose-800">
              {error}
            </p>
          </div>
        )}

        {lastAssistant && !sending && (
          <div className="mx-auto w-full max-w-3xl space-y-2 px-4 pb-3 sm:px-6">
            <StoryTurnCta
              lastAssistant={lastAssistant}
              appliedCardId={lastAssistant.appliedCardId ?? appliedCards[lastAssistant.id]}
              applying={applyingId === lastAssistant.id}
              onApply={() => void applyDraft(lastAssistant.id)}
              onGenerate={() => void send(GENERATE_STORY_PROMPT)}
              detailBase={detailBase}
            />
            {lastAssistant.followUps && lastAssistant.followUps.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {lastAssistant.followUps.map(followUp => (
                  <button
                    key={followUp}
                    type="button"
                    onClick={() => void send(followUp)}
                    className="rounded-full border border-black/[0.08] bg-[#fafaf8] px-3 py-1.5 text-[11px] text-neutral-600 hover:border-neutral-300"
                  >
                    {followUp}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="px-4 pb-5 pt-1 sm:px-6">
          <form
            className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-3xl border border-black/[0.1] bg-white px-3 py-2 shadow-sm focus-within:border-neutral-400"
            onSubmit={e => {
              e.preventDefault()
              void send(draftMessage)
            }}
          >
            <textarea
              ref={inputRef}
              value={draftMessage}
              onChange={e => setDraftMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send(draftMessage)
                }
              }}
              rows={1}
              placeholder="Pergunte sobre o fluxo, o código, um documento ou o que precisa virar story…"
              className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[14px] leading-relaxed outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              disabled={sending || !draftMessage.trim()}
              className="mb-0.5 rounded-full p-2.5 text-white disabled:opacity-40"
              style={{ backgroundColor: accent }}
              aria-label="Enviar"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" strokeWidth={1.8} />
              )}
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-neutral-400">
            O agente cruza código, bancos, reuniões e documentos. Enter envia, Shift+Enter quebra linha.
          </p>
        </div>
      </div>
    </div>
  )
}

function ThinkingDots({ accent }: { accent: string }) {
  return (
    <div className="flex items-center gap-1.5 h-4" aria-live="polite" aria-label="Pensando">
      {[0, 1, 2].map(index => (
        <span
          key={index}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{
            backgroundColor: accent,
            animationDelay: `${index * 160}ms`,
            animationDuration: '900ms',
          }}
        />
      ))}
    </div>
  )
}

function StoryTurnCta({
  lastAssistant,
  appliedCardId,
  applying,
  onApply,
  onGenerate,
  detailBase,
}: {
  lastAssistant: CopilotMessage
  appliedCardId?: string
  applying: boolean
  onApply: () => void
  onGenerate: () => void
  detailBase: string
}) {
  if (appliedCardId) {
    return (
      <Link
        href={`${detailBase}/${encodeURIComponent(appliedCardId)}`}
        className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2.5 text-[12px] font-medium text-teal-800"
      >
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" strokeWidth={2} />
          User story aplicada no board
        </span>
        <span className="inline-flex items-center gap-1 text-[11px]">
          Abrir card
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
        </span>
      </Link>
    )
  }

  if (lastAssistant.storyDraft) {
    return (
      <button
        type="button"
        onClick={onApply}
        disabled={applying}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 text-white text-[13px] font-medium px-4 py-2.5 disabled:opacity-50"
      >
        {applying ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserRound className="w-4 h-4" strokeWidth={1.8} />
        )}
        Aplicar user story no board
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onGenerate}
      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 text-[13px] font-medium px-4 py-2.5"
    >
      <Sparkles className="w-4 h-4" strokeWidth={1.8} />
      Gerar user story com o fluxo aprendido
    </button>
  )
}

function MessageBubble({
  message,
  accent,
  detailBase,
  appliedCardId,
  applying,
  onApply,
}: {
  message: CopilotMessage
  accent: string
  detailBase: string
  appliedCardId?: string
  applying: boolean
  onApply: () => void
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-3xl bg-neutral-900 px-4 py-3 text-white">
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
        style={{ backgroundColor: `${accent}14` }}
      >
        <Sparkles className="w-4 h-4" strokeWidth={1.8} style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1 space-y-4">
        <div className="pt-1">
          <MarkdownLite text={message.content} />
        </div>

        {message.diagram && <BacklogDiagramView diagram={message.diagram} compact />}

        {message.flowNotes && message.flowNotes.length > 0 && (
          <div className="rounded-xl border border-black/[0.06] bg-white px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400 mb-2">
              Fluxo da empresa · o que já sabemos
            </p>
            <ul className="space-y-1.5">
              {message.flowNotes.map((note, index) => (
                <li key={`${note}-${index}`} className="flex items-start gap-2">
                  <span className="mt-[0.45em] w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <span className="text-[12px] text-neutral-600 leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.sources.map((source, index) => {
              if (source.kind === 'sql') {
                return (
                  <span
                    key={`${source.repo}-${source.path}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10px] font-mono text-teal-800"
                  >
                    Banco · {source.repo}
                  </span>
                )
              }
              if (source.kind === 'workspace') {
                return (
                  <span
                    key={`${source.repo}-${source.path}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-mono text-sky-800"
                  >
                    Workspace · {source.path ?? source.repo}
                  </span>
                )
              }
              const href = source.path
                ? `https://github.com/${source.repo}/blob/HEAD/${source.path}`
                : `https://github.com/${source.repo}`
              return (
                <a
                  key={`${source.repo}-${source.path}-${index}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white px-2.5 py-1 text-[10px] font-mono text-neutral-500 hover:border-neutral-300"
                >
                  <FileCode2 className="w-3 h-3" strokeWidth={1.8} />
                  {source.path ?? source.repo}
                </a>
              )
            })}
          </div>
        )}

        {message.storyDraft && (
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/40 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                  Rascunho de user story
                </p>
                <h4 className="text-[14px] font-semibold text-neutral-900 mt-1 leading-snug">
                  {message.storyDraft.title}
                </h4>
              </div>
              {message.storyDraft.priority && (
                <span className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-[10px] text-neutral-500 shrink-0">
                  {message.storyDraft.priority}
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <DraftRow label="Como" value={message.storyDraft.persona} />
              <DraftRow label="Quero" value={message.storyDraft.want} />
              <DraftRow label="Para que" value={message.storyDraft.soThat} />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400 mb-2">
              Critérios de aceite
            </p>
            <ul className="space-y-1.5 mb-4">
              {message.storyDraft.acceptance.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-[12px] text-neutral-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {appliedCardId ? (
              <Link
                href={`${detailBase}/${encodeURIComponent(appliedCardId)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-300 bg-teal-50 px-3.5 py-2 text-[12px] font-medium text-teal-800"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                Aplicado — abrir card
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onApply}
                disabled={applying}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white text-[12px] font-medium px-4 py-2 disabled:opacity-50"
              >
                {applying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UserRound className="w-3.5 h-3.5" strokeWidth={1.8} />
                )}
                Aplicar no board
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function DraftRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[62px_1fr] gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400 pt-0.5">
        {label}
      </span>
      <p className="text-[12px] text-neutral-700 leading-relaxed">
        {value || <span className="text-neutral-300">—</span>}
      </p>
    </div>
  )
}

/** Renderiza o subset de markdown que o copiloto usa: bullets, numeração e **negrito**. */
function MarkdownLite({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter(block => block.trim())

  return (
    <div className="space-y-2.5">
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n').map(line => line.trim()).filter(Boolean)
        const isList = lines.every(line => /^([-*•]|\d+[.)])\s+/.test(line))
        if (isList) {
          return (
            <ul key={blockIndex} className="space-y-1.5">
              {lines.map((line, index) => (
                <li key={index} className="text-[14px] text-neutral-700 leading-relaxed pl-3.5 relative">
                  <span className="absolute left-0 top-[0.5em] w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  <Inline text={line.replace(/^([-*•]|\d+[.)])\s+/, '')} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={blockIndex} className="text-[14px] text-neutral-700 leading-relaxed">
            <Inline text={block.replace(/^#{1,6}\s+/gm, '')} />
          </p>
        )
      })}
    </div>
  )
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-neutral-900">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="font-mono text-[11px] bg-white border border-black/[0.07] rounded px-1 py-0.5"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}
