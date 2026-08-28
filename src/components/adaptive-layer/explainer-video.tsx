'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { VIDEO } from './lp-data'

type Scene = (typeof VIDEO.scenes)[number]

const TOTAL_MS = VIDEO.scenes.reduce((sum, s) => sum + s.ms, 0)
const SPEAK_DELAY_MS = 480
const HOLD_AFTER_MS = 850
const SPEAK_RATE = 0.84

function pickPtVoice(voices: SpeechSynthesisVoice[]) {
  const ranked = voices
    .map(voice => {
      let score = 0
      const blob = `${voice.name} ${voice.lang}`
      if (/pt(-|_)BR/i.test(blob)) score += 6
      else if (/portugu/i.test(blob) || /^pt/i.test(voice.lang)) score += 3
      else return { voice, score: -1 }
      if (/google/i.test(voice.name)) score += 5
      if (/neural|premium|enhanced|online/i.test(voice.name)) score += 3
      if (/luciana|fernanda|maria|francisca|helena|joana/i.test(voice.name)) score += 4
      if (voice.localService) score += 1
      if (/compact|novelty|whisper|bad news|good news|bells|boing/i.test(voice.name)) score -= 12
      return { voice, score }
    })
    .filter(item => item.score >= 0)
    .sort((a, b) => b.score - a.score)
  return ranked[0]?.voice
}

export function ExplainerVideo() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const started = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const elapsedRef = useRef(0)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const scene = VIDEO.scenes[index]

  const offsetBefore = useMemo(
    () => VIDEO.scenes.slice(0, index).reduce((sum, s) => sum + s.ms, 0),
    [index],
  )
  const globalMs = offsetBefore + elapsed
  const progress = Math.min(globalMs / TOTAL_MS, 1)

  const stopVoice = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = useCallback((text: string, onEnd: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd()
      return
    }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'pt-BR'
    utter.rate = SPEAK_RATE
    utter.pitch = 0.98
    utter.volume = 1
    const picked = pickPtVoice(voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices())
    if (picked) utter.voice = picked
    utter.onend = onEnd
    utter.onerror = onEnd
    window.speechSynthesis.speak(utter)
  }, [])

  useEffect(() => {
    elapsedRef.current = elapsed
  }, [elapsed])

  useEffect(() => {
    if (!playing || !voiceOn) return
    const keepAlive = window.setInterval(() => {
      if (window.speechSynthesis.speaking) window.speechSynthesis.resume()
    }, 4000)
    return () => window.clearInterval(keepAlive)
  }, [playing, voiceOn])

  useEffect(() => {
    if (!playing) {
      stopVoice()
      return
    }

    let cancelled = false
    let advanced = false
    let speakTimer: number | undefined
    let holdTimer: number | undefined
    let safetyTimer: number | undefined

    const finishScene = () => {
      if (cancelled || advanced) return
      advanced = true
      if (index >= VIDEO.scenes.length - 1) {
        elapsedRef.current = scene.ms
        setElapsed(scene.ms)
        setPlaying(false)
        return
      }
      elapsedRef.current = 0
      setElapsed(0)
      setIndex(i => i + 1)
    }

    const origin = Date.now() - elapsedRef.current
    const tick = window.setInterval(() => {
      const next = Date.now() - origin
      if (!voiceOn && next >= scene.ms) {
        finishScene()
        return
      }
      elapsedRef.current = Math.min(next, scene.ms)
      setElapsed(elapsedRef.current)
    }, 80)

    if (voiceOn) {
      speakTimer = window.setTimeout(() => {
        if (cancelled) return
        speak(scene.voice, () => {
          holdTimer = window.setTimeout(finishScene, HOLD_AFTER_MS)
        })
      }, SPEAK_DELAY_MS)
      safetyTimer = window.setTimeout(finishScene, scene.ms + 5000)
    }

    return () => {
      cancelled = true
      window.clearInterval(tick)
      if (speakTimer) window.clearTimeout(speakTimer)
      if (holdTimer) window.clearTimeout(holdTimer)
      if (safetyTimer) window.clearTimeout(safetyTimer)
    }
  }, [playing, index, scene.ms, scene.voice, voiceOn, speak, stopVoice])

  useEffect(() => () => stopVoice(), [stopVoice])

  function togglePlay() {
    started.current = true
    if (playing) {
      setPlaying(false)
      return
    }
    if (index === VIDEO.scenes.length - 1 && elapsed >= scene.ms - 40) {
      setIndex(0)
      setElapsed(0)
    }
    setPlaying(true)
  }

  function goTo(i: number) {
    elapsedRef.current = 0
    setElapsed(0)
    setIndex(i)
  }

  function seek(ratio: number) {
    const target = Math.max(0, Math.min(1, ratio)) * TOTAL_MS
    let acc = 0
    for (let i = 0; i < VIDEO.scenes.length; i++) {
      const end = acc + VIDEO.scenes[i].ms
      if (target <= end) {
        elapsedRef.current = target - acc
        setIndex(i)
        setElapsed(target - acc)
        return
      }
      acc = end
    }
  }

  async function fullscreen() {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await el.requestFullscreen()
  }

  return (
    <div
      ref={stageRef}
      className="overflow-hidden rounded-3xl border border-black/[0.08] bg-neutral-950 text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)]"
    >
      <div className="relative aspect-[16/10] sm:aspect-video">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <SceneArt scene={scene} />
          </motion.div>
        </AnimatePresence>

        {!started.current && !playing && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950/20"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-neutral-950">
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
            </span>
            <span className="mt-4 text-[13px] text-white/70">Assistir · {VIDEO.durationLabel}</span>
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent px-5 pb-16 pt-20 sm:px-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">{scene.kicker}</p>
          <p className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[26px]">{scene.title}</p>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/55 sm:text-[14px]">{scene.caption}</p>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3 sm:px-5">
        <button
          type="button"
          aria-label="Progresso"
          className="group relative h-1.5 w-full rounded-full bg-white/10"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            seek((e.clientX - rect.left) / rect.width)
          }}
        >
          <span className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
        </button>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-950"
            aria-label={playing ? 'Pausar' : 'Reproduzir'}
          >
            {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 translate-x-px" fill="currentColor" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setVoiceOn(v => {
                if (v) stopVoice()
                return !v
              })
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            aria-label={voiceOn ? 'Desligar voz' : 'Ligar voz'}
          >
            {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <p className="ml-1 hidden text-[11px] text-white/40 sm:block">
            {formatMs(globalMs)} / {formatMs(TOTAL_MS)}
          </p>
          <div className="ml-auto flex gap-1 overflow-x-auto">
            {VIDEO.scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 w-4 rounded-full sm:w-5 ${i === index ? 'bg-white' : 'bg-white/20'}`}
                aria-label={`Cena ${s.kicker}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={fullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Tela cheia"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function SceneArt({ scene }: { scene: Scene }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.06),transparent_50%),#0a0a0a]">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6 pb-28 pt-10 sm:px-12">
        {scene.id === 'intro' && <IntroArt />}
        {scene.id === 'systems' && <SystemsArt />}
        {scene.id === 'event' && <EventArt />}
        {scene.id === 'listen' && <ListenArt />}
        {scene.id === 'identity' && <IdentityArt />}
        {scene.id === 'split' && <SplitArt />}
        {scene.id === 'vector' && <VectorArt />}
        {scene.id === 'ask' && <AskArt />}
        {scene.id === 'answer' && <AnswerArt />}
        {scene.id === 'outro' && <OutroArt />}
      </div>
    </div>
  )
}

function Chip({ children, ink }: { children: string; ink?: boolean }) {
  return (
    <span
      className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
        ink ? 'bg-white text-neutral-950' : 'border border-white/15 bg-white/5 text-white/80'
      }`}
    >
      {children}
    </span>
  )
}

function IntroArt() {
  return (
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11px] uppercase tracking-[0.2em] text-white/40"
      >
        Adaptive Layer™
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-3 max-w-lg text-[26px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]"
      >
        The data and context layer that makes the enterprise AI-ready.
      </motion.p>
    </div>
  )
}

function SystemsArt() {
  const items = ['ERP', 'WMS', 'CRM', 'Portal', 'PDF política']
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Chip>{item}</Chip>
        </motion.div>
      ))}
    </div>
  )
}

function EventArt() {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-2xl border border-white/15 bg-white/5 px-8 py-6 text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">Evento</p>
      <p className="mt-2 text-[28px] font-semibold tracking-tight">Pedido #4821</p>
      <p className="mt-2 text-[13px] text-white/50">40 caixas · cliente X · sexta</p>
    </motion.div>
  )
}

function ListenArt() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <div className="flex gap-2">
        <Chip>ERP</Chip>
        <Chip>PDF</Chip>
      </div>
      <motion.div
        className="h-10 w-px bg-white/25"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6 }}
      />
      <Chip ink>Adaptive Layer™</Chip>
    </div>
  )
}

function IdentityArt() {
  const bits = ['#4821', 'L-19', 'Cliente X']
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {bits.map((b, i) => (
          <motion.div key={b} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
            <Chip>{b}</Chip>
          </motion.div>
        ))}
      </div>
      <span className="text-white/25">↓</span>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Chip ink>1 registro canônico</Chip>
      </motion.div>
    </div>
  )
}

function SplitArt() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white bg-white px-4 py-5 text-neutral-950">
        <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">Fato</p>
        <p className="mt-2 text-[15px] font-semibold">40 caixas · sexta</p>
        <p className="mt-1 text-[12px] text-neutral-500">Fica registro</p>
      </div>
      <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Texto</p>
        <p className="mt-2 text-[15px] font-semibold">Política de SLA</p>
        <p className="mt-1 text-[12px] text-white/45">Ainda não é vetor</p>
      </div>
    </div>
  )
}

function VectorArt() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Chip>Política de SLA</Chip>
      <p className="text-[12px] text-white/40">chunk → embed → chave</p>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-white"
            initial={{ opacity: 0.2, scale: 0.6 }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1, 0.7] }}
            transition={{ duration: 1.4, delay: i * 0.12, repeat: Infinity }}
          />
        ))}
      </div>
      <Chip ink>amarrado ao cliente X</Chip>
    </div>
  )
}

function AskArt() {
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-md rounded-2xl border border-white/15 bg-white/5 px-6 py-5"
    >
      <p className="text-[11px] text-white/40">Agente · comercial</p>
      <p className="mt-2 text-[18px] font-medium leading-snug">“Por que o #4821 pode atrasar?”</p>
    </motion.div>
  )
}

function AnswerArt() {
  return (
    <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
      <div className="rounded-2xl bg-white px-4 py-4 text-neutral-950">
        <p className="text-[11px] text-neutral-400">Fato</p>
        <p className="mt-1 text-[14px] font-semibold">Entrega sexta</p>
      </div>
      <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
        <p className="text-[11px] text-white/40">Política</p>
        <p className="mt-1 text-[14px] font-semibold">Cláusula de SLA · cliente X</p>
      </div>
      <p className="text-center text-[11px] text-white/35 sm:col-span-2">Audit · quem viu</p>
    </div>
  )
}

function OutroArt() {
  return (
    <div className="text-center">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Adaptive Layer™</p>
      <p className="mt-3 text-[24px] font-semibold tracking-[-0.03em] sm:text-[30px]">Dados · contexto · ação</p>
      <p className="mt-2 text-[13px] text-white/45">Na nuvem da empresa.</p>
    </div>
  )
}
