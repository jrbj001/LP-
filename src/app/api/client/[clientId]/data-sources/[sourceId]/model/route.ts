import { NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import { DataSourceEncryptionConfigurationError } from '@/lib/data-sources/crypto'
import { buildDataModel, DataModelNotFoundError } from '@/lib/data-sources/model/build'
import { getDataModel } from '@/lib/data-sources/model/store'
import { DataSourceConnectionError } from '@/lib/data-sources/postgresql'
import { getStoredDataSource } from '@/lib/data-sources/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type RouteParams = Promise<{ clientId: string; sourceId: string }>

function validSourceId(sourceId: string): boolean {
  return sourceId.length > 0 && sourceId.length <= 128
}

async function authorize(params: RouteParams) {
  const { clientId, sourceId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado.' }, { status: 404 })
  }
  const session = await requireClientSession(client.slug)
  if (session instanceof NextResponse) return session
  if (!validSourceId(sourceId)) {
    return NextResponse.json(
      { ok: false, error: 'Identificador da fonte inválido.' },
      { status: 400 }
    )
  }
  return { clientSlug: client.slug, sourceId }
}

export async function GET(_request: Request, { params }: { params: RouteParams }) {
  const auth = await authorize(params)
  if (auth instanceof NextResponse) return auth

  try {
    const source = await getStoredDataSource(auth.clientSlug, auth.sourceId)
    if (!source) {
      return NextResponse.json({ ok: false, error: 'Fonte de dados não encontrada.' }, { status: 404 })
    }
    const model = await getDataModel(auth.clientSlug, auth.sourceId)
    return NextResponse.json({ ok: true, model, needsBuild: !model })
  } catch (error) {
    console.error('[client/data-sources/model] GET', error)
    return NextResponse.json(
      { ok: false, error: 'Não foi possível carregar a modelagem.' },
      { status: 500 }
    )
  }
}

export async function POST(_request: Request, { params }: { params: RouteParams }) {
  const auth = await authorize(params)
  if (auth instanceof NextResponse) return auth

  try {
    const model = await buildDataModel(auth.clientSlug, auth.sourceId)
    return NextResponse.json({ ok: true, model })
  } catch (error) {
    if (error instanceof DataModelNotFoundError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 404 })
    }
    if (error instanceof DataSourceConnectionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 422 })
    }
    if (error instanceof DataSourceEncryptionConfigurationError) {
      return NextResponse.json(
        { ok: false, error: 'Criptografia das fontes não configurada.' },
        { status: 500 }
      )
    }
    console.error('[client/data-sources/model] POST', error)
    return NextResponse.json(
      { ok: false, error: 'Não foi possível gerar a modelagem da fonte.' },
      { status: 500 }
    )
  }
}
