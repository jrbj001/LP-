'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { encodeWav } from '@/lib/meeting-agent/wav'
import { parseAlignment } from '@/lib/meeting-agent/visemes'
import type { FaceSignal } from './cadence-face'

const IDLE_POLL_MS = 1000

/** Detecção de fala: nível acima do ruído de fundo, fim após silêncio curto. */
const MIN_THRESHOLD = 0.008
const NOISE_MULTIPLIER = 3
const END_SILENCE_MS = 700
const MIN_SPEECH_MS = 400
const MAX_UTTERANCE_MS = 15_000
const PREROLL_FRAMES = 3
/** Depois de falar, espera um pouco antes de voltar a ouvir para não captar o eco da própria voz. */
const SPEAKING_TAIL_MS = 600

interface SpeechPayload {
  ok: boolean
  text?: string
  audio?: string
  alignment?: unknown
}

const LISTENING_HOLD_MS = 1200
const THINKING_TIMEOUT_MS = 30_000

/**
 * Expressão do rosto fora da fala: ouvindo enquanto alguém fala, pensando depois que
 * chamaram o Cadence. Falar sempre tem prioridade e é controlado por `useCadenceSpeech`.
 */
export function useFaceMood(signalRef: RefObject<FaceSignal>) {
  const lastHeard = useRef(0)
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(thinkingTimer.current), [])

  return {
    hear(level: number) {
      const signal = signalRef.current
      if (signal.mode === 'speaking' || signal.mode === 'thinking') return
      const now = Date.now()
      if (level > 0) {
        lastHeard.current = now
        signal.hearing = level
        signal.mode = 'listening'
      } else if (now - lastHeard.current > LISTENING_HOLD_MS) {
        signal.hearing = 0
        signal.mode = 'idle'
      }
    },
    think() {
      const signal = signalRef.current
      if (signal.mode === 'speaking') return
      signal.mode = 'thinking'
      clearTimeout(thinkingTimer.current)
      thinkingTimer.current = setTimeout(() => {
        if (signalRef.current.mode === 'thinking') signalRef.current.mode = 'idle'
      }, THINKING_TIMEOUT_MS)
    },
  }
}

/**
 * Busca a próxima fala do Cadence, toca e entrega ao rosto o áudio e o alinhamento
 * para a boca acompanhar. Enquanto fala, `mutedUntilRef` impede de ouvir a própria voz.
 */
export function useCadenceSpeech(options: {
  speechUrl: string | null
  signalRef: RefObject<FaceSignal>
  mutedUntilRef: RefObject<number>
  onSpeak?: (text: string | null) => void
}) {
  const { speechUrl, signalRef, mutedUntilRef } = options
  const onSpeakRef = useRef(options.onSpeak)
  useEffect(() => {
    onSpeakRef.current = options.onSpeak
  })

  useEffect(() => {
    if (!speechUrl) return
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const audio = new Audio()
    audio.preload = 'auto'
    let context: AudioContext | null = null

    const connectAnalyser = () => {
      if (context) {
        void context.resume()
        return
      }
      try {
        context = new AudioContext()
        const source = context.createMediaElementSource(audio)
        const analyser = context.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)
        analyser.connect(context.destination)
        signalRef.current.analyser = analyser
      } catch {
        signalRef.current.analyser = null
      }
    }

    const playAudio = (base64: string) =>
      new Promise<void>((resolve) => {
        const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
        const url = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }))
        const finish = () => {
          URL.revokeObjectURL(url)
          resolve()
        }
        audio.onended = finish
        audio.onerror = finish
        audio.src = url
        connectAnalyser()
        audio.play().catch(finish)
      })

    const tick = async () => {
      if (stopped) return
      let nextIn = IDLE_POLL_MS
      try {
        const res = await fetch(speechUrl, { cache: 'no-store' })
        if (res.status === 200) {
          const data = (await res.json()) as SpeechPayload
          if (data.ok && data.audio) {
            const signal = signalRef.current
            signal.audio = audio
            signal.alignment = parseAlignment(data.alignment)
            signal.mode = 'speaking'
            onSpeakRef.current?.(data.text ?? '')
            mutedUntilRef.current = Number.POSITIVE_INFINITY
            await playAudio(data.audio)
            mutedUntilRef.current = Date.now() + SPEAKING_TAIL_MS
            signal.alignment = null
            signal.mode = 'idle'
            onSpeakRef.current?.(null)
            nextIn = 0
          }
        }
      } catch {
        nextIn = IDLE_POLL_MS * 2
      }
      if (!stopped) timer = setTimeout(tick, nextIn)
    }

    void tick()

    return () => {
      stopped = true
      clearTimeout(timer)
      audio.pause()
      signalRef.current.audio = null
      signalRef.current.analyser = null
      void context?.close()
    }
  }, [speechUrl, signalRef, mutedUntilRef])
}

/**
 * Ouve o microfone (ou o áudio da reunião, dentro do bot), recorta cada fala por nível de
 * energia e entrega como WAV. `onLevel` recebe o volume normalizado a cada bloco.
 */
export function useUtteranceCapture(options: {
  enabled: boolean
  mutedUntilRef: RefObject<number>
  /** Dentro do bot o áudio já vem da reunião; no navegador da pessoa, cancelar eco evita ouvir o Cadence. */
  echoCancellation: boolean
  onUtterance: (wav: Uint8Array<ArrayBuffer>) => void
  onLevel?: (level: number) => void
  onError?: (message: string) => void
}) {
  const { enabled, mutedUntilRef, echoCancellation } = options
  const handlers = useRef(options)
  useEffect(() => {
    handlers.current = options
  })

  useEffect(() => {
    if (!enabled) return
    let stopped = false
    let stream: MediaStream | null = null
    let context: AudioContext | null = null

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation, noiseSuppression: echoCancellation, autoGainControl: false },
        })
      } catch {
        handlers.current.onError?.('Sem acesso ao microfone.')
        return
      }
      if (stopped) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      context = new AudioContext()
      const source = context.createMediaStreamSource(stream)
      const processor = context.createScriptProcessor(4096, 1, 1)
      // Ganho zero: o processador precisa estar ligado à saída, mas ninguém pode ouvir o próprio áudio.
      const silence = context.createGain()
      silence.gain.value = 0
      source.connect(processor)
      processor.connect(silence)
      silence.connect(context.destination)

      const rate = context.sampleRate
      let noise = MIN_THRESHOLD
      let active = false
      let chunks: Float32Array[] = []
      let preroll: Float32Array[] = []
      let speechMs = 0
      let silentMs = 0

      const reset = () => {
        active = false
        chunks = []
        preroll = []
        speechMs = 0
        silentMs = 0
      }

      processor.onaudioprocess = (event) => {
        const input = new Float32Array(event.inputBuffer.getChannelData(0))
        const ms = (input.length / rate) * 1000
        let energy = 0
        for (let i = 0; i < input.length; i++) energy += input[i] * input[i]
        const rms = Math.sqrt(energy / input.length)
        const threshold = Math.max(MIN_THRESHOLD, noise * NOISE_MULTIPLIER)
        const loud = rms > threshold

        if (Date.now() < mutedUntilRef.current) {
          handlers.current.onLevel?.(0)
          reset()
          return
        }
        handlers.current.onLevel?.(loud ? Math.min(1, rms / (threshold * 4)) : 0)

        if (!active) {
          noise = noise * 0.95 + rms * 0.05
          preroll.push(input)
          if (preroll.length > PREROLL_FRAMES) preroll.shift()
          if (loud) {
            active = true
            chunks = [...preroll]
            speechMs = ms
            silentMs = 0
          }
          return
        }

        chunks.push(input)
        if (loud) {
          speechMs += ms
          silentMs = 0
        } else {
          silentMs += ms
        }
        const total = chunks.length * ms
        if (silentMs >= END_SILENCE_MS || total >= MAX_UTTERANCE_MS) {
          const clip = chunks
          const spoke = speechMs
          reset()
          if (spoke >= MIN_SPEECH_MS) handlers.current.onUtterance(encodeWav(clip, rate))
        }
      }
    }

    void start()

    return () => {
      stopped = true
      stream?.getTracks().forEach((track) => track.stop())
      void context?.close()
    }
  }, [enabled, mutedUntilRef, echoCancellation])
}
