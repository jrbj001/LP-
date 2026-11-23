import { after, NextResponse } from 'next/server'
import { hasCadenceDatabase } from '@/lib/cadence/db'
import { handleRecallEvent } from '@/lib/meeting-agent/inbound'
import { recallSignatureHeaders, verifyRecallSignature } from '@/lib/recall/verify'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const seen = new Set<string>()
const SEEN_LIMIT = 2000

function alreadySeen(id: string | null): boolean {
  if (!id) return false
  if (seen.has(id)) return true
  seen.add(id)
  if (seen.size > SEEN_LIMIT) seen.delete(seen.values().next().value as string)
  return false
}

export async function POST(request: Request): Promise<Response> {
  const raw = await request.text()
  const headers = recallSignatureHeaders(request.headers)
  const secret = process.env.RECALL_WEBHOOK_SECRET?.trim()

  if (secret) {
    if (!verifyRecallSignature({ secret, headers, payload: raw })) {
      return NextResponse.json({ ok: false, error: 'Assinatura inválida.' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'RECALL_WEBHOOK_SECRET não configurado.' }, { status: 503 })
  } else {
    console.warn('[webhooks/recall] RECALL_WEBHOOK_SECRET ausente — aceitando sem verificar (apenas dev).')
  }

  if (!hasCadenceDatabase()) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL não configurado.' }, { status: 503 })
  }

  let envelope: unknown
  try {
    envelope = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }

  if (!alreadySeen(headers.id)) {
    after(() =>
      handleRecallEvent(envelope as Parameters<typeof handleRecallEvent>[0]).catch(error => {
        console.error('[webhooks/recall]', error)
      })
    )
  }
  return NextResponse.json({ ok: true })
}
