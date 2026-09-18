'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  collectSpeechTranscript,
  getSpeechRecognitionCtor,
  isSpeechDictationSupported,
  mergeSpeechDraft,
  speechDictationErrorMessage,
  type SpeechRecognitionInstance,
} from '@/lib/backlog/speech-dictation'

export function useSpeechDictation({
  lang = 'pt-BR',
  enabled = true,
  onDraft,
  onError,
}: {
  lang?: string
  enabled?: boolean
  onDraft: (next: string) => void
  onError: (message: string) => void
}) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const listeningRef = useRef(false)
  const baseDraftRef = useRef('')
  const finalsRef = useRef('')
  const onDraftRef = useRef(onDraft)
  const onErrorRef = useRef(onError)

  onDraftRef.current = onDraft
  onErrorRef.current = onError

  useEffect(() => {
    setSupported(isSpeechDictationSupported())
  }, [])

  const stop = useCallback(() => {
    listeningRef.current = false
    setListening(false)
    const recognition = recognitionRef.current
    recognitionRef.current = null
    try {
      recognition?.stop()
    } catch {
      /* já encerrado */
    }
  }, [])

  const start = useCallback(
    (currentDraft: string) => {
      const Ctor = getSpeechRecognitionCtor()
      if (!Ctor || !enabled) {
        onErrorRef.current('Este navegador não transcreve voz. Use Chrome ou Edge, ou escreva a pergunta.')
        return
      }

      stop()
      baseDraftRef.current = currentDraft.trim()
      finalsRef.current = ''
      const recognition = new Ctor()
      recognition.lang = lang
      recognition.continuous = true
      recognition.interimResults = true
      recognition.onresult = event => {
        const { finals, interim } = collectSpeechTranscript(event)
        if (finals) finalsRef.current = finals
        onDraftRef.current(mergeSpeechDraft(baseDraftRef.current, `${finalsRef.current} ${interim}`))
      }
      recognition.onerror = event => {
        const message = speechDictationErrorMessage(event.error)
        if (message) onErrorRef.current(message)
        if (event.error !== 'no-speech') stop()
      }
      recognition.onend = () => {
        if (!listeningRef.current) return
        try {
          recognition.start()
        } catch {
          stop()
        }
      }

      recognitionRef.current = recognition
      listeningRef.current = true
      setListening(true)
      try {
        recognition.start()
      } catch {
        stop()
        onErrorRef.current('Não consegui ligar o microfone. Tente de novo.')
      }
    },
    [enabled, lang, stop]
  )

  const toggle = useCallback(
    (currentDraft: string) => {
      if (listeningRef.current) stop()
      else start(currentDraft)
    },
    [start, stop]
  )

  useEffect(() => () => stop(), [stop])

  return { supported, listening, start, stop, toggle }
}
