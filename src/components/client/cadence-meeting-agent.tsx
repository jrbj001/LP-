'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ExternalLink, FlaskConical, LogOut, MessageSquare, RefreshCw, Radio } from 'lucide-react'
import type {
  AgentInteraction,
  MeetingBotRecord,
  MeetingBotStatus,
  TranscriptSegment,
} from '@/lib/meeting-agent/types'

const POLL_MS = 4000
const RECALL_SYNC_EVERY = 5

const STATUS_LABEL: Record<MeetingBotStatus, string> = {
  created: 'Criado',
  joining: 'Entrando',
  in_call: 'Na chamada',
  recording: 'Ouvindo',
  ended: 'Encerrando',
  done: 'Encerrada',
  failed: 'Falhou',
}

const LIVE = new Set<MeetingBotStatus>(['created', 'joining', 'in_call', 'recording', 'ended'])

const PRIORITY_STYLE = {
  Alta: 'bg-rose-50 text-rose-700 border-rose-100',
  Média: 'bg-amber-50 text-amber-700 border-amber-100',
  Baixa: 'bg-neutral-50 text-neutral-500 border-neutral-100',
} as const

function formatTime(value: string): string {
  return new Date(value).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CadenceMeetingAgent({
  clientId,
  accent,
  sandboxHref,
}: {
  clientId: string
  accent: string
  sandboxHref: string
}) {
  const base = `/api/client/${encodeURIComponent(clientId)}/meetings/bot`
  const [bots, setBots] = useState<MeetingBotRecord[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [meetingUrl, setMeetingUrl] = useState('')
  const [title, setTitle] = useState('')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadBots = useCallback(async () => {
    try {
      const response = await fetch(base, { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Não foi possível listar as reuniões do Cadence.')
      setBots(data.bots)
      setSelectedId(current => current ?? data.bots[0]?.id ?? null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    }
  }, [base])

  useEffect(() => {
    void loadBots()
  }, [loadBots])

  async function invite(event: React.FormEvent) {
    event.preventDefault()
    setInviting(true)
    setError(null)
    try {
      const response = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingUrl, title }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Não foi possível convidar o Cadence.')
      setBots(current => [data.bot, ...current])
      setSelectedId(data.bot.id)
      setMeetingUrl('')
      setTitle('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setInviting(false)
    }
  }

  const onBotChange = useCallback((bot: MeetingBotRecord) => {
    setBots(current => current.map(item => (item.id === bot.id ? bot : item)))
  }, [])

  return (
    <section className="mb-8 rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <img
          src="/cadence-avatar.jpg"
          alt="Cadence, pixelpulselab"
          className="h-12 w-20 rounded-lg border border-black/[0.06] object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-semibold text-neutral-900">Cadence na reunião</h2>
          <p className="mt-1 text-[12px] text-neutral-500 leading-relaxed">
            Convide o Cadence para uma chamada do Meet, Zoom ou Teams. Ele transcreve em português, responde quando
            alguém diz &ldquo;Cadence,&rdquo; seguido da pergunta (ou escreve @Cadence no chat) usando GitHub, Notion e a
            base do Cadence, e gera o relatório ao final. A fala demora alguns minutos para aparecer; a pergunta no chat
            chega na hora.
          </p>
        </div>
      </div>

      <form onSubmit={invite} className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          required
          value={meetingUrl}
          onChange={event => setMeetingUrl(event.target.value)}
          placeholder="https://meet.google.com/abc-defg-hij"
          className="flex-1 rounded-full border border-black/[0.08] px-4 py-2 text-[13px] outline-none focus:border-neutral-400"
        />
        <input
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Título (opcional)"
          maxLength={140}
          className="sm:w-56 rounded-full border border-black/[0.08] px-4 py-2 text-[13px] outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          disabled={inviting}
          className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-50"
        >
          {inviting ? 'Convidando…' : 'Convidar Cadence'}
        </button>
        <Link
          href={sandboxHref}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-black/[0.08] px-4 py-2 text-[12px] font-semibold text-neutral-700 hover:border-neutral-400"
        >
          <FlaskConical className="w-3.5 h-3.5" /> Testar no sandbox
        </Link>
      </form>
      {error && <p className="mt-3 text-[12px] text-rose-600">{error}</p>}

      {bots.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {bots.map(bot => (
            <button
              key={bot.id}
              type="button"
              onClick={() => setSelectedId(bot.id)}
              className={`rounded-full border px-3 py-1 text-[11px] ${
                bot.id === selectedId
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-black/[0.08] text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {bot.title || bot.report?.title || formatTime(bot.createdAt)} · {STATUS_LABEL[bot.status]}
            </button>
          ))}
        </div>
      )}

      {selectedId && (
        <BotPanel key={selectedId} base={base} botId={selectedId} accent={accent} onBotChange={onBotChange} />
      )}
    </section>
  )
}

function BotPanel({
  base,
  botId,
  accent,
  onBotChange,
}: {
  base: string
  botId: string
  accent: string
  onBotChange: (bot: MeetingBotRecord) => void
}) {
  const [bot, setBot] = useState<MeetingBotRecord | null>(null)
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [interactions, setInteractions] = useState<AgentInteraction[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastId = useRef(0)
  const tick = useRef(0)
  const transcriptEnd = useRef<HTMLDivElement | null>(null)

  const poll = useCallback(async () => {
    tick.current += 1
    const sync = tick.current % RECALL_SYNC_EVERY === 1 ? '&sync=1' : ''
    const response = await fetch(`${base}/${botId}?after=${lastId.current}${sync}`, { cache: 'no-store' })
    const data = await response.json()
    if (!response.ok || !data.ok) throw new Error(data.error || 'Falha ao atualizar.')
    const fresh = data.segments as TranscriptSegment[]
    if (fresh.length > 0) {
      lastId.current = fresh[fresh.length - 1].id
      setSegments(current => [...current, ...fresh])
    }
    setInteractions(data.interactions)
    setBot(data.bot)
    onBotChange(data.bot)
    return data.bot as MeetingBotRecord
  }, [base, botId, onBotChange])

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const run = async () => {
      try {
        const current = await poll()
        if (cancelled) return
        const keepPolling = LIVE.has(current.status) || current.reportStatus === 'running' ||
          (current.status === 'done' && current.reportStatus === 'none')
        if (keepPolling) timer = setTimeout(run, POLL_MS)
      } catch (caught) {
        if (cancelled) return
        setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
        timer = setTimeout(run, POLL_MS * 2)
      }
    }
    void run()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [poll])

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [segments.length])

  async function action(name: 'leave' | 'report') {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch(`${base}/${botId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: name }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Ação não concluída.')
      await poll()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setBusy(false)
    }
  }

  if (!bot) return <p className="mt-5 text-[12px] text-neutral-400">Carregando…</p>

  const live = LIVE.has(bot.status)
  const report = bot.report

  return (
    <div className="mt-5 rounded-xl border border-black/[0.06] bg-neutral-50/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] text-neutral-600">
          {live && <Radio className="w-3.5 h-3.5 animate-pulse" style={{ color: accent }} />}
          <span className="font-semibold">{STATUS_LABEL[bot.status]}</span>
          <a
            href={bot.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-700"
          >
            link da chamada <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex gap-2">
          {live && bot.status !== 'ended' && (
            <button
              type="button"
              onClick={() => action('leave')}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-700 hover:border-neutral-400 disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" /> Remover da chamada
            </button>
          )}
          {(bot.status === 'done' || bot.status === 'ended') && bot.reportStatus !== 'running' && (
            <button
              type="button"
              onClick={() => action('report')}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-700 hover:border-neutral-400 disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {report ? 'Gerar relatório de novo' : 'Gerar relatório'}
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-[12px] text-rose-600">{error}</p>}
      {bot.status === 'failed' && bot.reportError && (
        <p className="mt-2 text-[12px] text-rose-600">{bot.reportError}</p>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Transcrição</p>
          <div className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-black/[0.06] bg-white p-3 text-[12px] leading-relaxed">
            {segments.length === 0 ? (
              <p className="text-neutral-400">
                {live ? 'Aguardando as primeiras falas…' : 'Sem transcrição registrada.'}
              </p>
            ) : (
              segments.map(segment => (
                <p key={segment.id} className="mb-1.5">
                  <span className="font-semibold text-neutral-800">
                    {segment.source === 'chat' ? '[chat] ' : ''}
                    {segment.speaker || 'Participante'}:
                  </span>{' '}
                  <span className="text-neutral-600">{segment.text}</span>
                </p>
              ))
            )}
            <div ref={transcriptEnd} />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Perguntas ao Cadence</p>
          <div className="mt-2 max-h-80 overflow-y-auto flex flex-col gap-2">
            {interactions.length === 0 ? (
              <p className="rounded-lg border border-black/[0.06] bg-white p-3 text-[12px] text-neutral-400">
                Ninguém chamou o Cadence ainda.
              </p>
            ) : (
              interactions.map(item => (
                <div key={item.id} className="rounded-lg border border-black/[0.06] bg-white p-3 text-[12px]">
                  <p className="inline-flex items-center gap-1.5 font-semibold text-neutral-800">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {item.speaker || 'Participante'}: {item.question}
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-neutral-600">
                    {item.answer ?? `Sem resposta (${item.error ?? 'erro'})`}
                  </p>
                  {item.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.sources.map(source =>
                        source.url ? (
                          <a
                            key={`${source.kind}:${source.url}`}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-black/[0.06] px-2 py-0.5 text-[10px] text-neutral-500 hover:text-neutral-800"
                          >
                            {source.label}
                          </a>
                        ) : (
                          <span
                            key={`${source.kind}:${source.label}`}
                            className="rounded-full border border-black/[0.06] px-2 py-0.5 text-[10px] text-neutral-500"
                          >
                            {source.label}
                          </span>
                        )
                      )}
                    </div>
                  )}
                  {item.latencyMs != null && (
                    <p className="mt-1 text-[10px] text-neutral-400">
                      {(item.latencyMs / 1000).toFixed(1)} s{item.tools.length ? ` · ${item.tools.join(', ')}` : ''}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {bot.reportStatus === 'running' && (
        <p className="mt-4 text-[12px] text-neutral-500">Gerando o relatório da reunião…</p>
      )}
      {bot.reportStatus === 'failed' && bot.reportError && bot.status !== 'failed' && (
        <p className="mt-4 text-[12px] text-rose-600">Relatório não gerado: {bot.reportError}</p>
      )}

      {report && (
        <div className="mt-5 border-t border-black/[0.06] pt-4 text-[13px]">
          <p className="text-[11px] font-mono uppercase tracking-wider" style={{ color: accent }}>
            Relatório · {report.title}
          </p>
          <p className="mt-2 text-neutral-700 leading-relaxed">{report.summary}</p>

          {report.decisions.length > 0 && (
            <ReportList title="Decisões" items={report.decisions} />
          )}
          {report.risks.length > 0 && <ReportList title="Riscos e dúvidas" items={report.risks} />}

          {report.actionItems.length > 0 && (
            <div className="mt-4">
              <p className="text-[12px] font-semibold text-neutral-800">Itens de ação</p>
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {report.actionItems.map(item => (
                  <li key={item.title} className="flex flex-wrap items-center gap-2 text-[12px] text-neutral-600">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${PRIORITY_STYLE[item.priority]}`}>
                      {item.priority}
                    </span>
                    {item.title}
                    <span className="text-neutral-400">· {item.owner}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.stories.length > 0 && (
            <div className="mt-4">
              <p className="text-[12px] font-semibold text-neutral-800">User stories sugeridas</p>
              <ul className="mt-1.5 flex flex-col gap-2">
                {report.stories.map(story => (
                  <li key={story.title} className="rounded-lg border border-black/[0.06] bg-white p-3 text-[12px] text-neutral-600">
                    <p className="font-semibold text-neutral-800">{story.title}</p>
                    <p className="mt-1">
                      Como {story.persona}, quero {story.want}, para {story.soThat}.
                    </p>
                    <ul className="mt-1.5 list-disc pl-4">
                      {story.acceptance.map(criterion => (
                        <li key={criterion}>{criterion}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-neutral-400">
                Para levar ao backlog, use &ldquo;Resumir com IA&rdquo; na reunião listada abaixo e revise os itens
                antes de aplicar.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-[12px] font-semibold text-neutral-800">{title}</p>
      <ul className="mt-1.5 list-disc pl-4 text-[12px] text-neutral-600">
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
