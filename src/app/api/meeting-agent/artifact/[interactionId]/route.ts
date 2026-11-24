import { NextResponse, type NextRequest } from 'next/server'
import { avatarSecret, verifyArtifactToken } from '@/lib/meeting-agent/avatar-token'
import { getInteraction } from '@/lib/meeting-agent/store'
import { rowsToCsv } from '@/lib/meeting-agent/table-artifact'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Planilha da resposta, aberta pelo link do chat. O token prende o acesso a esta interação. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ interactionId: string }> }
) {
  const { interactionId } = await params
  const token = request.nextUrl.searchParams.get('token')
  if (!UUID.test(interactionId) || !verifyArtifactToken(interactionId, token, avatarSecret())) {
    return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401 })
  }

  const interaction = await getInteraction(interactionId)
  const artifact = interaction?.artifact
  if (!artifact || artifact.kind !== 'csv' || !artifact.csv) {
    return NextResponse.json({ ok: false, error: 'Planilha não encontrada.' }, { status: 404 })
  }

  const csv = artifact.csv || rowsToCsv(artifact.columns, artifact.rows ?? [])
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cadence-${interactionId.slice(0, 8)}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
