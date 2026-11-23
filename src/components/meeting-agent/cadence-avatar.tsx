'use client'

import { useEffect, useRef, useState } from 'react'

const IDLE_POLL_MS = 1500
const BARS = 9

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
 * Cartão do Cadence transmitido como câmera do bot. Busca as falas na fila do servidor,
 * toca o áudio e anima as barras com o nível real do áudio. Legenda o que está sendo dito.
 */
export function CadenceAvatar({ botRecordId, token }: Props) {
  const [caption, setCaption] = useState<string>('')
  const [speaking, setSpeaking] = useState(false)
  const barsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let frame = 0

    const audio = new Audio()
    audio.preload = 'auto'
    let context: AudioContext | null = null
    let analyser: AnalyserNode | null = null

    // A primeira reprodução cria o grafo de áudio; o analisador só lê o nível para animar as barras.
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
            await playAudio(data.audio)
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
