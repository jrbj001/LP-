import { NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import { answerKnowledgeQuestion } from '@/lib/knowledge/research'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  const session = await requireClientSession(client.slug)
  if (session instanceof NextResponse) return session

  let body: { question?: string; sourceId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const question = body.question?.trim()
  if (!question) {
    return NextResponse.json({ ok: false, error: 'Escreva uma pergunta.' }, { status: 400 })
  }

  const sourceId = body.sourceId?.trim()
  if (sourceId) {
    if (sourceId.length > 128) {
      return NextResponse.json({ ok: false, error: 'Fonte de dados inválida.' }, { status: 400 })
    }
  }

  try {
    const result = await answerKnowledgeQuestion({
      clientId: client.slug,
      question,
      sourceId,
    })
    const primary = result.databases[0]
    return NextResponse.json({
      ok: true,
      answer: result.answer,
      suggestions: result.suggestions,
      evidence: result.evidence,
      statuses: result.statuses,
      databases: result.databases,
      sourceName: primary?.sourceName,
      sql: primary?.sql ?? '',
      explanation: primary?.explanation ?? '',
      columns: primary?.columns ?? [],
      rows: primary?.rows ?? [],
      chart: primary?.chart ?? null,
    })
  } catch (error) {
    console.error('[client/consultar]', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Erro ao consultar.' },
      { status: 502 }
    )
  }
}
