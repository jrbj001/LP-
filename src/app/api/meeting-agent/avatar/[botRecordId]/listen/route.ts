import { after, NextResponse, type NextRequest } from 'next/server'
import { avatarSecret, verifyAvatarToken } from '@/lib/meeting-agent/avatar-token'
import { handleLiveUtterance } from '@/lib/meeting-agent/inbound'
import { markLiveListening } from '@/lib/meeting-agent/store'
import { transcribeSpeech, voiceEnabled } from '@/lib/meeting-agent/voice'
import { detectWakeWord } from '@/lib/meeting-agent/wake-word'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_AUDIO_BYTES = 3 * 1024 * 1024
const NO_STORE = { 'Cache-Control': 'no-store' }

/**
 * Recebe cada fala da reunião capturada pela página do avatar, transcreve na hora
 * e, se chamaram o Cadence, responde em segundo plano.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ botRecordId: string }> }
) {
  const { botRecordId } = await params
  const token = request.nextUrl.searchParams.get('t')

  if (!UUID.test(botRecordId) || !verifyAvatarToken(botRecordId, token, avatarSecret())) {
    return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401, headers: NO_STORE })
  }
  if (!voiceEnabled()) {
    return NextResponse.json({ ok: false, error: 'Voz não configurada.' }, { status: 503, headers: NO_STORE })
  }

  const form = await request.formData().catch(() => null)
  const audio = form?.get('audio')
  if (!(audio instanceof Blob) || audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ ok: false, error: 'Áudio inválido.' }, { status: 400, headers: NO_STORE })
  }
  const previousRaw = form?.get('previous')
  const previous = typeof previousRaw === 'string' && previousRaw.trim() ? previousRaw.trim().slice(0, 500) : null

  await markLiveListening(botRecordId)

  let text: string
  try {
    text = await transcribeSpeech(audio)
  } catch (error) {
    console.error('[meeting-agent/listen]', error instanceof Error ? error.message : error)
    return NextResponse.json({ ok: false, error: 'Falha ao transcrever.' }, { status: 502, headers: NO_STORE })
  }

  if (text) {
    after(() =>
      handleLiveUtterance(botRecordId, text, previous).catch(error => {
        console.error('[meeting-agent/live-utterance]', error instanceof Error ? error.message : error)
      })
    )
  }
  return NextResponse.json(
    { ok: true, text, responding: Boolean(text) && detectWakeWord(text).kind !== 'none' },
    { headers: NO_STORE }
  )
}
