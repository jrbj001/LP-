import { NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import { describeModelWithAi } from '@/lib/data-sources/model/ai'
import { getDataModel, saveDataModelAi } from '@/lib/data-sources/model/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

type RouteParams = Promise<{ clientId: string; sourceId: string }>

export async function POST(_request: Request, { params }: { params: RouteParams }) {
  const { clientId, sourceId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado.' }, { status: 404 })
  }
  const session = await requireClientSession(client.slug)
  if (session instanceof NextResponse) return session
  if (!sourceId || sourceId.length > 128) {
    return NextResponse.json(
      { ok: false, error: 'Identificador da fonte inválido.' },
      { status: 400 }
    )
  }

  try {
    const stored = await getDataModel(client.slug, sourceId)
    if (!stored) {
      return NextResponse.json(
        { ok: false, error: 'Gere a modelagem da fonte antes de pedir a visão de IA.' },
        { status: 409 }
      )
    }
    const ai = await describeModelWithAi(stored.snapshot)
    const model = await saveDataModelAi(client.slug, sourceId, ai)
    if (!model) {
      return NextResponse.json({ ok: false, error: 'Modelagem não encontrada.' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, model })
  } catch (error) {
    console.error('[client/data-sources/model/ai] POST', error)
    const message =
      error instanceof Error && /OPENAI|OpenAI/.test(error.message)
        ? error.message
        : 'Não foi possível gerar a visão de IA da modelagem.'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
