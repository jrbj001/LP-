import 'server-only'

import { avatarSecret } from './avatar-token'
import { parseAlignment, type SpeechAlignment } from './visemes'

const DEFAULT_TTS_MODEL = 'eleven_turbo_v2_5'
const DEFAULT_STT_MODEL = 'scribe_v2'
const STT_KEYTERMS = ['Cadence', 'PixelPulseLab', 'PixelPulse', 'Colmeia', 'LikeMe', 'Adaptive Core']

/** Voz ligada quando há chave e voz do ElevenLabs e um segredo para assinar o link do avatar. */
export function voiceEnabled(): boolean {
  return Boolean(
    process.env.ELEVENLABS_API_KEY?.trim() && process.env.ELEVENLABS_VOICE_ID?.trim() && avatarSecret()
  )
}

function elevenLabsKey(): string {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY não configurado.')
  return apiKey
}

export interface SynthesizedSpeech {
  /** MP3 em base64. */
  audio: string
  /** Tempo de cada caractere falado; guia a boca do avatar. */
  alignment: SpeechAlignment | null
}

/** Sintetiza a fala em MP3 com ElevenLabs, com o tempo de cada caractere. A chave nunca sai do servidor. */
export async function synthesizeSpeech(text: string): Promise<SynthesizedSpeech> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim()
  if (!voiceId) throw new Error('ELEVENLABS_VOICE_ID não configurado.')

  const model = process.env.ELEVENLABS_MODEL_ID?.trim() || DEFAULT_TTS_MODEL
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsKey(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
      }),
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    throw new Error(`ElevenLabs respondeu ${res.status}`)
  }
  const data = (await res.json()) as { audio_base64?: string; alignment?: unknown; normalized_alignment?: unknown }
  if (!data.audio_base64) throw new Error('ElevenLabs não devolveu áudio.')
  return {
    audio: data.audio_base64,
    alignment: parseAlignment(data.alignment) ?? parseAlignment(data.normalized_alignment),
  }
}

/** Transcreve uma fala curta da reunião com o Speech to Text do ElevenLabs. */
export async function transcribeSpeech(audio: Blob): Promise<string> {
  const form = new FormData()
  form.append('file', audio, 'fala.wav')
  form.append('model_id', process.env.ELEVENLABS_STT_MODEL?.trim() || DEFAULT_STT_MODEL)
  form.append('language_code', 'por')
  form.append('tag_audio_events', 'false')
  for (const term of STT_KEYTERMS) form.append('keyterms', term)

  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': elevenLabsKey() },
    body: form,
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`ElevenLabs STT respondeu ${res.status}`)
  }
  const data = (await res.json()) as { text?: string }
  return (data.text ?? '').replace(/\s+/g, ' ').trim()
}
