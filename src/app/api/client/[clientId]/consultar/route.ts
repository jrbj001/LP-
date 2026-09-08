import { NextResponse } from 'next/server'
import { runNaturalLanguageQuery } from '@/lib/cadence/nl-sql'
import { seedCadenceClient } from '@/lib/cadence/seed'
import { getClient } from '@/lib/client/registry'
import {
  DataSourceAdminConfigurationError,
  isDataSourceAdminRequest,
} from '@/lib/data-sources/auth'
import { runExternalNaturalLanguageQuery } from '@/lib/data-sources/nl-sql'
import { seedEnvDataSources } from '@/lib/data-sources/seed'

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
    try {
      if (!isDataSourceAdminRequest(req)) {
        return NextResponse.json(
          { ok: false, error: 'Credencial administrativa inválida.' },
          { status: 401 }
        )
      }
    } catch (error) {
      if (error instanceof DataSourceAdminConfigurationError) {
        return NextResponse.json(
          { ok: false, error: 'Autenticação de fontes externas não configurada.' },
          { status: 500 }
        )
      }
      throw error
    }
  }

  try {
    try {
      await seedEnvDataSources(client.slug)
    } catch (error) {
      console.error('[client/consultar] seed', error)
    }
    if (sourceId) {
      const result = await runExternalNaturalLanguageQuery({
        clientId: client.slug,
        sourceId,
        question,
      })
      return NextResponse.json({ ok: true, ...result })
    }
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
