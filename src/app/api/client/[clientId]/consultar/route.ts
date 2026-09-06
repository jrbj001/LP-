import { NextResponse } from 'next/server'
import { runNaturalLanguageQuery } from '@/lib/cadence/nl-sql'
import { seedCadenceClient } from '@/lib/cadence/seed'
import { getClient } from '@/lib/client/registry'

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

  let body: { question?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const question = body.question?.trim()
  if (!question) {
    return NextResponse.json({ ok: false, error: 'Escreva uma pergunta.' }, { status: 400 })
  }

  try {
    await seedCadenceClient(client.slug)
    const result = await runNaturalLanguageQuery(client.slug, question)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error('[client/consultar]', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Erro ao consultar.' },
      { status: 502 }
    )
  }
}
