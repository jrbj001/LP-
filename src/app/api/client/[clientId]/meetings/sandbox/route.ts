import { NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import { avatarSecret, signAvatarToken } from '@/lib/meeting-agent/avatar-token'
import { createSandboxRecord, meetingAgentErrorMessage, requireMeetingAgentDatabase } from '@/lib/meeting-agent/store'
import { voiceEnabled } from '@/lib/meeting-agent/voice'

export const dynamic = 'force-dynamic'

/** Abre uma reunião simulada. O token é o mesmo da página do avatar e libera a fila de fala. */
export async function POST(_req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const session = await requireClientSession(clientId)
  if (session instanceof NextResponse) return session
  const client = getClient(clientId)!

  try {
    requireMeetingAgentDatabase()
    const bot = await createSandboxRecord({ clientId: client.slug, createdBy: session.name })
    const secret = avatarSecret()
    return NextResponse.json({
      ok: true,
      bot,
      token: secret ? signAvatarToken(bot.id, secret) : null,
      voice: voiceEnabled(),
    })
  } catch (error) {
    return NextResponse.json({ ok: false, error: meetingAgentErrorMessage(error) }, { status: 503 })
  }
}
