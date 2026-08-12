'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Check,
  FileCode2,
  Loader2,
  MessageSquarePlus,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react'
import {
  BACKLOG_BOARDS,
  type BacklogBoardId,
  type BacklogCard,
  type CopilotMessage,
  type CopilotThread,
  type CopilotThreadSummary,
} from '@/lib/backlog/types'
import { BacklogDiagramView } from './backlog-diagram'

const STARTERS = [
  'Como funciona hoje a promoção de inventário ao Banco de Ativos?',
  'Escreva a user story para o exibidor completar o cadastro pendente.',
  'Quais critérios de aceite garantem que o roteiro só publica com mídia válida?',
  'Desenhe o fluxo do agente que valida inventário antes da aprovação.',
]

export function CopilotChat({
  clientId,
  accent,
  detailBase,
  boardId,
  card,
  variant = 'page',
}: {
  clientId: string
  accent: string
  detailBase: string
  boardId: BacklogBoardId
  card?: Pick<BacklogCard, 'id' | 'title'> | null
  variant?: 'page' | 'modal'
}) {
  const base = `/api/client/${encodeURIComponent(clientId)}/backlog/copilot`

  const [threads, setThreads] = useState<CopilotThreadSummary[]>([])
  const [thread, setThread] = useState<CopilotThread | null>(null)
  const [activeBoardId, setActiveBoardId] = useState<BacklogBoardId>(boardId)
  const [draftMessage, setDraftMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [appliedCards, setAppliedCards] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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
    () => BACKLOG_BOARDS.find(b => b.id === activeBoardId)?.title ?? activeBoardId,
    [activeBoardId]
  )

  async function send(message: string) {
    const text = message.trim()
    if (!text || sending) return
    setSending(true)
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
      void loadThreads()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao falar com o copiloto.')
      setDraftMessage(text)
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
  }

  const messages = thread?.messages ?? []
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')

  return (
    <div
      className={`flex ${variant === 'modal' ? 'h-full' : 'h-[calc(100vh-13rem)] min-h-[32rem]'} overflow-hidden rounded-2xl border border-black/[0.07] bg-white`}
    >
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-black/[0.06] bg-[#fafaf8]">
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
                  {BACKLOG_BOARDS.find(b => b.id === item.boardId)?.productLabel ?? item.boardId} ·{' '}
                  {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </button>
            )
          })}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-black/[0.06] px-5 py-3.5 flex flex-wrap items-center gap-3 justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-neutral-400">
              Copiloto de user stories
            </p>
            <h2 className="text-[15px] font-semibold text-neutral-900 truncate">
              {thread?.title ?? boardLabel}
            </h2>
          </div>
          {card ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#fafaf8] px-3 py-1.5 text-[11px] text-neutral-600 max-w-xs truncate">
              <FileCode2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
              {card.title}
            </span>
          ) : (
            <select
              value={activeBoardId}
              disabled={Boolean(thread)}
              onChange={e => setActiveBoardId(e.target.value as BacklogBoardId)}
              className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] text-neutral-700 disabled:opacity-60"
            >
              {BACKLOG_BOARDS.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          )}
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {messages.length === 0 && !sending && (
            <div className="max-w-2xl mx-auto text-center py-8">
              <div
                className="w-11 h-11 rounded-2xl mx-auto flex items-center justify-center mb-4"
                style={{ backgroundColor: `${accent}14` }}
              >
                <Sparkles className="w-5 h-5" strokeWidth={1.8} style={{ color: accent }} />
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900">
                Construa a user story conversando
              </h3>
              <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
                O copiloto lê o código no GitHub, responde em linguagem natural, desenha o fluxo e
                propõe o rascunho. Você aplica ao board com um clique.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {STARTERS.map(starter => (
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

          {sending && (
            <div className="flex items-center gap-2 text-[12px] text-neutral-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Lendo o repositório e escrevendo a resposta…
            </div>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-[12px] text-rose-800">
            {error}
          </div>
        )}

        {lastAssistant?.followUps && lastAssistant.followUps.length > 0 && !sending && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
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

        <form
          className="border-t border-black/[0.06] px-5 py-4 flex items-end gap-3"
          onSubmit={e => {
            e.preventDefault()
            void send(draftMessage)
          }}
        >
          <textarea
            value={draftMessage}
            onChange={e => setDraftMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send(draftMessage)
              }
            }}
            rows={2}
            placeholder="Descreva a necessidade, peça um desenho ou pergunte sobre o código…"
            className="flex-1 resize-none rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-[13px] leading-relaxed outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            disabled={sending || !draftMessage.trim()}
            className="rounded-full text-white p-3 disabled:opacity-50"
            style={{ backgroundColor: accent }}
            aria-label="Enviar"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" strokeWidth={1.8} />
            )}
          </button>
        </form>
      </div>
    </div>
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
        <div className="max-w-2xl rounded-2xl rounded-br-md bg-neutral-900 text-white px-4 py-3">
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
        <div className="rounded-2xl rounded-tl-md border border-black/[0.06] bg-[#fafaf8] px-4 py-3">
          <MarkdownLite text={message.content} />
        </div>

        {message.diagram && <BacklogDiagramView diagram={message.diagram} compact />}

        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.sources.map((source, index) => {
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
                <li key={index} className="text-[13px] text-neutral-700 leading-relaxed pl-3.5 relative">
                  <span className="absolute left-0 top-[0.5em] w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  <Inline text={line.replace(/^([-*•]|\d+[.)])\s+/, '')} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={blockIndex} className="text-[13px] text-neutral-700 leading-relaxed">
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
