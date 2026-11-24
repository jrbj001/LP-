'use client'

import { useRef, useState } from 'react'
import { CadenceFace, createFaceSignal, type FaceSignal } from './cadence-face'
import { useCadenceSpeech, useFaceMood, useUtteranceCapture } from './use-cadence-audio'

const PREVIOUS_TTL_MS = 60_000

interface Props {
  botRecordId: string
  token: string
}

/**
 * Cadence transmitido como câmera do bot. Ouve a reunião ao vivo, envia cada fala para
 * transcrição e toca as respostas da fila com o rosto animado acompanhando a voz.
 */
export function CadenceAvatar({ botRecordId, token }: Props) {
  const [caption, setCaption] = useState<string | null>(null)
  const signal = useRef<FaceSignal>(createFaceSignal())
  const mutedUntil = useRef(0)
  const previous = useRef<{ text: string; at: number } | null>(null)
  const sending = useRef(Promise.resolve())
  const mood = useFaceMood(signal)
  const query = `t=${encodeURIComponent(token)}`

  useCadenceSpeech({
    speechUrl: `/api/meeting-agent/avatar/${botRecordId}/speech?${query}`,
    signalRef: signal,
    mutedUntilRef: mutedUntil,
    onSpeak: (text) => {
      if (text) setCaption(text)
    },
  })

  useUtteranceCapture({
    enabled: true,
    mutedUntilRef: mutedUntil,
    echoCancellation: false,
    onLevel: mood.hear,
    onUtterance: (wav) => {
      sending.current = sending.current.then(async () => {
        const form = new FormData()
        form.append('audio', new Blob([wav], { type: 'audio/wav' }), 'fala.wav')
        const last = previous.current
        if (last && Date.now() - last.at < PREVIOUS_TTL_MS) form.append('previous', last.text)
        try {
          const res = await fetch(`/api/meeting-agent/avatar/${botRecordId}/listen?${query}`, {
            method: 'POST',
            body: form,
          })
          if (!res.ok) return
          const data = (await res.json()) as { text?: string; responding?: boolean }
          if (data.text) previous.current = { text: data.text, at: Date.now() }
          if (data.responding) mood.think()
        } catch {
          /* rede instável: a próxima fala tenta de novo */
        }
      })
    },
  })

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0c0b12]">
      <CadenceFace signal={signal} className="absolute inset-0 h-full w-full" />

      <div className="absolute left-[3%] top-[5%] rounded-full bg-black/50 px-4 py-1.5 text-[18px] font-medium text-white/90">
        Cadence · PixelPulseLab
      </div>

      {caption ? (
        <div className="absolute bottom-[4%] left-1/2 w-[86%] -translate-x-1/2 rounded-lg bg-black/70 px-5 py-3 text-center text-[22px] leading-snug text-white">
          {caption}
        </div>
      ) : null}
    </main>
  )
}
