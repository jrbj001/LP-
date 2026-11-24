'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Mic,
  MicOff,
  PhoneOff,
  RotateCcw,
  Send,
  Video,
  VideoOff,
} from 'lucide-react'
import type { AgentInteraction, MeetingBotRecord, TranscriptSegment } from '@/lib/meeting-agent/types'
import { CadenceFace, createFaceSignal, type FaceMode, type FaceSignal } from './cadence-face'
import { useCadenceSpeech, useFaceMood, useUtteranceCapture } from './use-cadence-audio'

const POLL_MS = 1500
const CAPTION_HOLD_MS = 2500

const MODE_LABEL: Record<FaceMode, string> = {
  idle: 'Na escuta',
  listening: 'Ouvindo',
  thinking: 'Pensando…',
  speaking: 'Falando',
}

interface Session {
  bot: MeetingBotRecord
  token: string | null
  voice: boolean
}

type FeedItem =
  | { kind: 'chat'; id: string; at: string; speaker: string; text: string }
  | { kind: 'answer'; id: string; at: string; item: AgentInteraction }

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function CadenceSandbox({ clientId, backHref }: { clientId: string; backHref: string }) {
  const [name, setName] = useState('Você')
  const [session, setSession] = useState<Session | null>(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function start() {
    setStarting(true)
    setError(null)
    try {
      const res = await fetch(`/api/client/${encodeURIComponent(clientId)}/meetings/sandbox`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Não foi possível abrir o sandbox.')
      setSession({ bot: data.bot, token: data.token, voice: Boolean(data.voice && data.token) })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setStarting(false)
    }
  }

  if (session) {
    return (
      <SandboxRoom
        key={session.bot.id}
        clientId={clientId}
        session={session}
        speaker={name.trim() || 'Você'}
        onRestart={() => setSession(null)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[12px] text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Reuniões
      </Link>
      <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
        <div className="relative aspect-video bg-[#0c0b12]">
          <LobbyFace />
        </div>
        <div className="p-5 sm:p-6">
          <h1 className="text-[18px] font-semibold text-neutral-900">Sandbox do Cadence</h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">
            Uma reunião simulada só com você e o Cadence, sem Meet, Zoom ou Teams. Fale pelo microfone ou escreva no
            chat: o pedido passa pelo mesmo caminho da reunião real (chamado pelo nome, agente com GitHub, Notion e base
            do Cadence, voz do ElevenLabs) e, ao encerrar, gera o relatório.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              placeholder="Seu nome na reunião"
              className="flex-1 rounded-full border border-black/[0.08] px-4 py-2 text-[13px] outline-none focus:border-neutral-400"
            />
            <button
              type="button"
              onClick={start}
              disabled={starting}
              className="shrink-0 rounded-full bg-neutral-900 px-5 py-2 text-[12px] font-semibold text-white hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-50"
            >
              {starting ? 'Entrando…' : 'Entrar na reunião simulada'}
            </button>
          </div>
          {error && <p className="mt-3 text-[12px] text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}

function LobbyFace() {
  const signal = useRef<FaceSignal>(createFaceSignal())
  return <CadenceFace signal={signal} className="absolute inset-0 h-full w-full" />
}

function SandboxRoom({
  clientId,
  session,
  speaker,
  onRestart,
}: {
  clientId: string
  session: Session
  speaker: string
  onRestart: () => void
}) {
  const botId = session.bot.id
  const sandboxUrl = `/api/client/${encodeURIComponent(clientId)}/meetings/sandbox/${botId}`
  const pollUrl = `/api/client/${encodeURIComponent(clientId)}/meetings/bot/${botId}`

  const [bot, setBot] = useState<MeetingBotRecord>(session.bot)
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [interactions, setInteractions] = useState<AgentInteraction[]>([])
  const [requireWake, setRequireWake] = useState(true)
  const [micOn, setMicOn] = useState(session.voice)
  const [camOn, setCamOn] = useState(false)
  const [tab, setTab] = useState<'chat' | 'transcript'>('chat')
  const [draft, setDraft] = useState('')
  const [caption, setCaption] = useState<string | null>(null)
  const [mode, setMode] = useState<FaceMode>('idle')
  const [micLevel, setMicLevel] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const signal = useRef<FaceSignal>(createFaceSignal())
  const mutedUntil = useRef(0)
  const lastSegmentId = useRef(0)
  const captionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const videoRef = useRef<HTMLVideoElement>(null)
  const feedEnd = useRef<HTMLDivElement>(null)
  const mood = useFaceMood(signal)

  const live = bot.status === 'recording'

  const poll = useCallback(async () => {
    const res = await fetch(`${pollUrl}?after=${lastSegmentId.current}`, { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok || !data.ok) throw new Error(data.error || 'Falha ao atualizar.')
    const fresh = data.segments as TranscriptSegment[]
    if (fresh.length > 0) {
      lastSegmentId.current = fresh[fresh.length - 1].id
      setSegments((current) => [...current, ...fresh])
    }
    setInteractions((current) => {
      const next = data.interactions as AgentInteraction[]
      if (next.length > current.length && signal.current.mode === 'thinking' && !session.voice) {
        signal.current.mode = 'idle'
      }
      return next
    })
    setBot(data.bot)
    return data.bot as MeetingBotRecord
  }, [pollUrl, session.voice])

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const run = async () => {
      try {
        const current = await poll()
        if (cancelled) return
        const waitingReport =
          current.status === 'done' && (current.reportStatus === 'none' || current.reportStatus === 'running')
        if (current.status === 'recording' || waitingReport) timer = setTimeout(run, POLL_MS)
      } catch (caught) {
        if (cancelled) return
        setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
        timer = setTimeout(run, POLL_MS * 3)
      }
    }
    void run()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [poll])

  useEffect(() => {
    if (!live) return
    const started = Date.now()
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000))
      setMode(signal.current.mode)
    }, 250)
    return () => clearInterval(timer)
  }, [live])

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [segments.length, interactions.length, tab])

  useEffect(() => () => clearTimeout(captionTimer.current), [])

  useEffect(() => {
    if (!camOn || !live) return
    let stream: MediaStream | null = null
    let stopped = false
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((media) => {
        if (stopped) {
          media.getTracks().forEach((track) => track.stop())
          return
        }
        stream = media
        if (videoRef.current) videoRef.current.srcObject = media
      })
      .catch(() => {
        setError('Sem acesso à câmera.')
        setCamOn(false)
      })
    return () => {
      stopped = true
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [camOn, live])

  useCadenceSpeech({
    speechUrl: live && session.voice && session.token
      ? `/api/meeting-agent/avatar/${botId}/speech?t=${encodeURIComponent(session.token)}`
      : null,
    signalRef: signal,
    mutedUntilRef: mutedUntil,
    onSpeak: (text) => {
      clearTimeout(captionTimer.current)
      if (text) setCaption(text)
      else captionTimer.current = setTimeout(() => setCaption(null), CAPTION_HOLD_MS)
    },
  })

  useUtteranceCapture({
    enabled: live && micOn && session.voice,
    mutedUntilRef: mutedUntil,
    echoCancellation: true,
    onLevel: (level) => {
      mood.hear(level)
      setMicLevel((current) => (Math.abs(current - level) > 0.05 ? level : current))
    },
    onError: (message) => {
      setError(message)
      setMicOn(false)
    },
    onUtterance: (wav) => {
      const form = new FormData()
      form.append('audio', new Blob([wav], { type: 'audio/wav' }), 'fala.wav')
      form.append('speaker', speaker)
      form.append('requireWake', String(requireWake))
      void fetch(sandboxUrl, { method: 'POST', body: form })
        .then((res) => res.json())
        .then((data: { ok?: boolean; responding?: boolean; error?: string }) => {
          if (data.ok && data.responding) mood.think()
          if (!data.ok && data.error) setError(data.error)
        })
        .catch(() => {})
    },
  })

  async function sendChat(event: React.FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setDraft('')
    try {
      const res = await fetch(sandboxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', text, speaker, requireWake }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Mensagem não enviada.')
      if (data.responding) mood.think()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    }
  }

  async function end() {
    setMicOn(false)
    setCamOn(false)
    try {
      const res = await fetch(sandboxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end' }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Não foi possível encerrar.')
      await poll()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    }
  }

  const feed = useMemo<FeedItem[]>(() => {
    const chats: FeedItem[] = segments
      .filter((segment) => segment.source === 'chat')
      .map((segment) => ({
        kind: 'chat',
        id: `s${segment.id}`,
        at: segment.createdAt,
        speaker: segment.speaker || speaker,
        text: segment.text,
      }))
    const answers: FeedItem[] = interactions.map((item) => ({ kind: 'answer', id: item.id, at: item.createdAt, item }))
    return [...chats, ...answers].sort((a, b) => a.at.localeCompare(b.at))
  }, [segments, interactions, speaker])

  const speakingRing = mode === 'speaking' ? 'ring-4 ring-[#a78bfa]' : 'ring-1 ring-white/10'
  const userRing = micLevel > 0 ? 'ring-4 ring-emerald-400/80' : 'ring-1 ring-white/10'
  const report = bot.report

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#111018] text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3 text-[13px]">
          <span className={`h-2 w-2 rounded-full ${live ? 'animate-pulse bg-rose-500' : 'bg-neutral-500'}`} />
          <span className="font-semibold">Reunião simulada</span>
          <span className="font-mono text-white/50">{clock(elapsed)}</span>
          <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[11px] text-white/70">
            Cadence: {live ? MODE_LABEL[mode] : 'Fora da reunião'}
          </span>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[12px] text-white/70">
          <input
            type="checkbox"
            checked={requireWake}
            onChange={(event) => setRequireWake(event.target.checked)}
            className="accent-[#a78bfa]"
          />
          Exigir &ldquo;Cadence,&rdquo; no começo da fala
        </label>
      </div>

      {!session.voice && (
        <p className="border-b border-white/[0.06] bg-amber-500/10 px-5 py-2 text-[12px] text-amber-200">
          Voz desligada: configure ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID e MEETING_AVATAR_SECRET para falar com o
          Cadence. O chat funciona normalmente.
        </p>
      )}
      {error && (
        <p className="border-b border-white/[0.06] bg-rose-500/10 px-5 py-2 text-[12px] text-rose-200">
          {error}{' '}
          <button type="button" onClick={() => setError(null)} className="underline">
            fechar
          </button>
        </p>
      )}

      <div className="grid lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`relative aspect-video overflow-hidden rounded-xl bg-[#0c0b12] transition ${speakingRing}`}>
              <CadenceFace signal={signal} className="absolute inset-0 h-full w-full" />
              <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px]">Cadence</span>
              {caption && (
                <p className="absolute inset-x-2 bottom-2 line-clamp-2 rounded-md bg-black/70 px-2.5 py-1.5 text-center text-[11px] leading-snug">
                  {caption}
                </p>
              )}
            </div>
            <div className={`relative aspect-video overflow-hidden rounded-xl bg-[#1b1a24] transition ${userRing}`}>
              {camOn ? (
                <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#a78bfa]/20 text-[26px] font-semibold text-[#c4b5fd]">
                    {initials(speaker)}
                  </span>
                </div>
              )}
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[11px]">
                {micOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3 text-rose-300" />} {speaker}
              </span>
            </div>
          </div>

          {live ? (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMicOn((on) => !on)}
                disabled={!session.voice}
                title={session.voice ? 'Microfone' : 'Voz não configurada'}
                className={`flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-40 ${
                  micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => setCamOn((on) => !on)}
                title="Câmera"
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  camOn ? 'bg-white/10 hover:bg-white/20' : 'bg-white/[0.06] hover:bg-white/15'
                }`}
              >
                {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={end}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-rose-600 px-5 text-[13px] font-semibold hover:bg-rose-500"
              >
                <PhoneOff className="h-4 w-4" /> Encerrar
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-[13px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">Reunião encerrada</p>
                <button
                  type="button"
                  onClick={onRestart}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] hover:bg-white/20"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Nova sessão
                </button>
              </div>
              {bot.reportStatus === 'failed' ? (
                <p className="mt-2 text-rose-300">Relatório não gerado: {bot.reportError}</p>
              ) : !report ? (
                <p className="mt-2 text-white/60">Gerando o relatório da reunião…</p>
              ) : (
                <div className="mt-3 space-y-3 text-white/80">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#c4b5fd]">{report.title}</p>
                  <p className="leading-relaxed">{report.summary}</p>
                  {report.decisions.length > 0 && <ReportList title="Decisões" items={report.decisions} />}
                  {report.actionItems.length > 0 && (
                    <ReportList
                      title="Itens de ação"
                      items={report.actionItems.map((item) => `${item.title} · ${item.owner} (${item.priority})`)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="flex min-h-[420px] flex-col border-t border-white/[0.06] lg:border-l lg:border-t-0">
          <div className="flex border-b border-white/[0.06] text-[12px]">
            {(['chat', 'transcript'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`flex-1 px-4 py-2.5 ${tab === value ? 'border-b-2 border-[#a78bfa] text-white' : 'text-white/50'}`}
              >
                {value === 'chat' ? 'Chat' : 'Transcrição'}
              </button>
            ))}
          </div>

          <div className="max-h-[520px] flex-1 overflow-y-auto p-4 text-[12px] leading-relaxed">
            {tab === 'chat' ? (
              feed.length === 0 ? (
                <p className="text-white/40">
                  {requireWake
                    ? 'Diga "Cadence, ..." no microfone ou escreva @Cadence no chat.'
                    : 'Pergunte qualquer coisa: o Cadence responde a toda fala e mensagem.'}
                </p>
              ) : (
                feed.map((entry) =>
                  entry.kind === 'chat' ? (
                    <div key={entry.id} className="mb-3">
                      <p className="font-semibold text-white/80">{entry.speaker}</p>
                      <p className="whitespace-pre-line text-white/70">{entry.text}</p>
                    </div>
                  ) : (
                    <AnswerBubble key={entry.id} item={entry.item} />
                  )
                )
              )
            ) : segments.length === 0 ? (
              <p className="text-white/40">Nada transcrito ainda.</p>
            ) : (
              segments.map((segment) => (
                <p key={segment.id} className="mb-1.5">
                  <span className="font-semibold text-white/80">
                    {segment.source === 'chat' ? '[chat] ' : ''}
                    {segment.speaker || 'Participante'}:
                  </span>{' '}
                  <span className="text-white/60">{segment.text}</span>
                </p>
              ))
            )}
            <div ref={feedEnd} />
          </div>

          {live && (
            <form onSubmit={sendChat} className="flex gap-2 border-t border-white/[0.06] p-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={requireWake ? '@Cadence, qual o status do backlog?' : 'Mensagem para o Cadence'}
                className="flex-1 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] outline-none placeholder:text-white/30 focus:bg-white/10"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c6cf0] hover:bg-[#8f80f5]"
                title="Enviar"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  )
}

function AnswerBubble({ item }: { item: AgentInteraction }) {
  return (
    <div className="mb-3 rounded-lg bg-[#7c6cf0]/15 p-3">
      <p className="font-semibold text-[#c4b5fd]">Cadence</p>
      <p className="mt-0.5 text-[11px] text-white/40">Pergunta: {item.question}</p>
      <p className="mt-1.5 whitespace-pre-line text-white/80">{item.answer ?? `Sem resposta (${item.error ?? 'erro'})`}</p>
      {item.sources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.sources.map((source) =>
            source.url ? (
              <a
                key={`${source.kind}:${source.url}`}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/60 hover:text-white"
              >
                {source.label}
              </a>
            ) : (
              <span key={`${source.kind}:${source.label}`} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/60">
                {source.label}
              </span>
            )
          )}
        </div>
      )}
      {item.latencyMs != null && (
        <p className="mt-1.5 text-[10px] text-white/40">
          {(item.latencyMs / 1000).toFixed(1)} s{item.tools.length ? ` · ${item.tools.join(', ')}` : ''}
        </p>
      )}
    </div>
  )
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-white">{title}</p>
      <ul className="mt-1 list-disc pl-4 text-[12px]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
