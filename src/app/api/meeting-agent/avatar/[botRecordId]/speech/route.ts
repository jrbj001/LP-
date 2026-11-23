import { NextResponse, type NextRequest } from 'next/server'
import { avatarSecret, verifyAvatarToken } from '@/lib/meeting-agent/avatar-token'
import { claimNextSpeech } from '@/lib/meeting-agent/store'
import { synthesizeSpeech, voiceEnabled } from '@/lib/meeting-agent/voice'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NO_STORE = { 'Cache-Control': 'no-store' }

/**
 * Chamado pela página do avatar dentro do bot. Entrega a próxima fala já sintetizada.
 * 204 quando não há nada para falar.
 */
export async function GET(
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

  const item = await claimNextSpeech(botRecordId)
  if (!item) return new NextResponse(null, { status: 204, headers: NO_STORE })

  try {
    const audio = await synthesizeSpeech(item.text)
    return NextResponse.json(
      { ok: true, text: item.text, audio: audio.toString('base64'), mime: 'audio/mpeg' },
      { headers: NO_STORE }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    console.error('[meeting-agent/speech]', message)
    return NextResponse.json({ ok: false, error: 'Falha ao sintetizar a fala.' }, { status: 502, headers: NO_STORE })
  }
}
