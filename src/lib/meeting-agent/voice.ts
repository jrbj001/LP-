import 'server-only'

import { avatarSecret } from './avatar-token'

const DEFAULT_MODEL = 'eleven_multilingual_v2'

/** Voz ligada quando há chave e voz do ElevenLabs e um segredo para assinar o link do avatar. */
export function voiceEnabled(): boolean {
  return Boolean(
    process.env.ELEVENLABS_API_KEY?.trim() && process.env.ELEVENLABS_VOICE_ID?.trim() && avatarSecret()
  )
}

/** Sintetiza a fala em MP3 com ElevenLabs. A chave nunca sai do servidor. */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim()
  if (!apiKey || !voiceId) throw new Error('ELEVENLABS_API_KEY ou ELEVENLABS_VOICE_ID não configurado.')

  const model = process.env.ELEVENLABS_MODEL_ID?.trim() || DEFAULT_MODEL
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
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
  return Buffer.from(await res.arrayBuffer())
}
