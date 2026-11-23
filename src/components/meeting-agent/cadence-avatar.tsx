'use client'

import { useEffect, useRef, useState } from 'react'
import { encodeWav } from '@/lib/meeting-agent/wav'

const IDLE_POLL_MS = 1000
const BARS = 9

/** Detecção de fala: nível acima do ruído de fundo, fim após silêncio curto. */
const MIN_THRESHOLD = 0.008
const NOISE_MULTIPLIER = 3
const END_SILENCE_MS = 700
const MIN_SPEECH_MS = 400
const MAX_UTTERANCE_MS = 15_000
const PREROLL_FRAMES = 3
/** Depois de falar, espera um pouco antes de voltar a ouvir para não captar o eco da própria voz. */
const SPEAKING_TAIL_MS = 600
const PREVIOUS_TTL_MS = 60_000

interface Props {
  botRecordId: string
  token: string
}

interface SpeechPayload {
  ok: boolean
  text?: string
  audio?: string
}

/**
 * Cartão do Cadence transmitido como câmera do bot. Ouve a reunião ao vivo, envia cada
 * fala para transcrição, toca as respostas da fila e anima as barras com o nível do áudio.
 */
export function CadenceAvatar({ botRecordId, token }: Props) {
  const [caption, setCaption] = useState<string>('')
  const [speaking, setSpeaking] = useState(false)
  const barsRef = useRef<(HTMLSpanElement | null)[]>([])
  const mutedUntilRef = useRef(0)

  useEffect(() => {
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let frame = 0

    const audio = new Audio()
    audio.preload = 'auto'
    let context: AudioContext | null = null
    let analyser: AnalyserNode | null = null

    const connectAnalyser = () => {
      if (context) {
        void context.resume()
        return
      }
      try {
        context = new AudioContext()
        const source = context.createMediaElementSource(audio)
        analyser = context.createAnalyser()
        analyser.fftSize = 64
        source.connect(analyser)
        analyser.connect(context.destination)
      } catch {
        analyser = null
      }
    }

    const animate = () => {
      const data = new Uint8Array(analyser?.frequencyBinCount ?? 0)
      if (analyser) analyser.getByteFrequencyData(data)
      barsRef.current.forEach((bar, index) => {
        if (!bar) return
        const level = analyser ? data[index + 2] / 255 : 0
        bar.style.height = `${Math.max(0.08, level) * 100}%`
      })
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)

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
        const res = await fetch(
          `/api/meeting-agent/avatar/${botRecordId}/speech?t=${encodeURIComponent(token)}`,
          { cache: 'no-store' }
        )
        if (res.status === 200) {
          const data = (await res.json()) as SpeechPayload
          if (data.ok && data.audio) {
            setCaption(data.text ?? '')
            setSpeaking(true)
            mutedUntilRef.current = Number.POSITIVE_INFINITY
            await playAudio(data.audio)
            mutedUntilRef.current = Date.now() + SPEAKING_TAIL_MS
            setSpeaking(false)
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
      cancelAnimationFrame(frame)
      audio.pause()
      void context?.close()
    }
  }, [botRecordId, token])

  useEffect(() => {
    let stopped = false
    let stream: MediaStream | null = null
    let context: AudioContext | null = null
    let previous: { text: string; at: number } | null = null
    let sending = Promise.resolve()

    const send = (wav: Uint8Array<ArrayBuffer>) => {
      sending = sending.then(async () => {
        if (stopped) return
        const form = new FormData()
        form.append('audio', new Blob([wav], { type: 'audio/wav' }), 'fala.wav')
        if (previous && Date.now() - previous.at < PREVIOUS_TTL_MS) form.append('previous', previous.text)
        try {
          const res = await fetch(
            `/api/meeting-agent/avatar/${botRecordId}/listen?t=${encodeURIComponent(token)}`,
            { method: 'POST', body: form }
          )
          if (!res.ok) return
          const data = (await res.json()) as { text?: string }
          if (data.text) previous = { text: data.text, at: Date.now() }
        } catch {
          /* rede instável: a próxima fala tenta de novo */
        }
      })
    }

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        })
      } catch {
        return
      }
      if (stopped) return

      context = new AudioContext()
      const source = context.createMediaStreamSource(stream)
      const processor = context.createScriptProcessor(4096, 1, 1)
      // Ganho zero: o processador precisa estar ligado à saída, mas a reunião não pode ouvir o próprio áudio.
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
        if (Date.now() < mutedUntilRef.current) {
          reset()
          return
        }
        const ms = (input.length / rate) * 1000
        let energy = 0
        for (let i = 0; i < input.length; i++) energy += input[i] * input[i]
        const rms = Math.sqrt(energy / input.length)
        const threshold = Math.max(MIN_THRESHOLD, noise * NOISE_MULTIPLIER)
        const loud = rms > threshold

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
          if (spoke >= MIN_SPEECH_MS) send(encodeWav(clip, rate))
        }
      }
    }

    void start()

    return () => {
      stopped = true
      stream?.getTracks().forEach((track) => track.stop())
      void context?.close()
    }
  }, [botRecordId, token])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0b0b10]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cadence-avatar.jpg" alt="Cadence" className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute bottom-[14%] left-1/2 flex h-10 -translate-x-1/2 items-end gap-2">
        {Array.from({ length: BARS }).map((_, index) => (
          <span
            key={index}
            ref={(element) => {
              barsRef.current[index] = element
            }}
            className="w-2 rounded-full bg-[#a78bfa] transition-[height] duration-75"
            style={{ height: '8%', opacity: speaking ? 1 : 0.5 }}
          />
        ))}
      </div>

      {caption ? (
        <div className="absolute bottom-[4%] left-1/2 w-[86%] -translate-x-1/2 rounded-lg bg-black/70 px-5 py-3 text-center text-[22px] leading-snug text-white">
          {caption}
        </div>
      ) : null}
    </main>
  )
}
