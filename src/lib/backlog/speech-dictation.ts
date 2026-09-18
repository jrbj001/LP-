export type SpeechRecognitionErrorCode =
  | 'not-allowed'
  | 'service-not-allowed'
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'bad-grammar'
  | 'language-not-supported'
  | string

type SpeechRecognitionResultLike = {
  isFinal: boolean
  0?: { transcript?: string }
}

export type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

export type SpeechRecognitionInstance = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: SpeechRecognitionErrorCode }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

export function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
}

export function isSpeechDictationSupported(): boolean {
  return Boolean(getSpeechRecognitionCtor())
}

export function mergeSpeechDraft(base: string, spoken: string): string {
  const prefix = base.trim()
  const transcript = spoken.replace(/\s+/g, ' ').trim()
  if (!transcript) return prefix
  if (!prefix) return transcript
  return `${prefix} ${transcript}`
}

export function collectSpeechTranscript(
  event: SpeechRecognitionEventLike,
  fromIndex = 0
): { finals: string; interim: string } {
  const finals: string[] = []
  const interims: string[] = []
  for (let index = fromIndex; index < event.results.length; index += 1) {
    const result = event.results[index]
    const piece = result?.[0]?.transcript?.trim()
    if (!piece) continue
    if (result.isFinal) finals.push(piece)
    else interims.push(piece)
  }
  return {
    finals: finals.join(' '),
    interim: interims.join(' '),
  }
}

export function speechDictationErrorMessage(code: SpeechRecognitionErrorCode): string | null {
  if (code === 'aborted' || code === 'no-speech') return null
  if (code === 'not-allowed' || code === 'service-not-allowed') {
    return 'O navegador bloqueou o microfone. Permita o acesso para perguntar por voz.'
  }
  if (code === 'audio-capture') {
    return 'Não encontrei um microfone neste aparelho.'
  }
  if (code === 'network') {
    return 'A transcrição de voz precisa de conexão. Tente de novo em instantes.'
  }
  return 'Não consegui ouvir agora. Tente de novo ou escreva a pergunta.'
}
