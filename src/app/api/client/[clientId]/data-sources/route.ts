import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import {
  DataSourceAdminConfigurationError,
  isDataSourceAdminRequest,
} from '@/lib/data-sources/auth'
import {
  DataSourceEncryptionConfigurationError,
  encryptDataSourceConfig,
} from '@/lib/data-sources/crypto'
import {
  DataSourceConnectionError,
  testPostgresConnection,
} from '@/lib/data-sources/postgresql'
import { seedEnvDataSources } from '@/lib/data-sources/seed'
import { createDataSource, listDataSources } from '@/lib/data-sources/store'
import type { DataSourceMetadata } from '@/lib/data-sources/types'
import { validateCreateDataSourceInput } from '@/lib/data-sources/validation'

export const dynamic = 'force-dynamic'

function sourceView(source: DataSourceMetadata) {
  return {
    ...source,
    tableCount: source.catalog.count,
    schemas: [...new Set(source.catalog.entries.map(entry => entry.schema))],
  }
}

function authorize(request: Request): NextResponse | null {
  try {
    if (isDataSourceAdminRequest(request)) return null
    return NextResponse.json(
      { ok: false, error: 'Credencial administrativa inválida.' },
      { status: 401 }
    )
  } catch (error) {
    if (error instanceof DataSourceAdminConfigurationError) {
      return NextResponse.json(
        { ok: false, error: 'Autenticação administrativa não configurada.' },
        { status: 500 }
      )
    }
    throw error
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const unauthorized = authorize(request)
  if (unauthorized) return unauthorized

  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Cliente não encontrado.' },
      { status: 404 }
    )
  }

  try {
    try {
      await seedEnvDataSources(client.slug)
    } catch (error) {
      console.error('[client/data-sources] seed', error)
    }
    const dataSources = await listDataSources(client.slug)
    return NextResponse.json({ ok: true, sources: dataSources.map(sourceView) })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Não foi possível listar as fontes de dados.' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const unauthorized = authorize(request)
  if (unauthorized) return unauthorized

  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Cliente não encontrado.' },
      { status: 404 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'JSON inválido.' },
      { status: 400 }
    )
  }

  const validation = validateCreateDataSourceInput(body)
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error },
      { status: 400 }
    )
  }

  try {
    const catalog = await testPostgresConnection(validation.value.config)
    const encryptedConfig = encryptDataSourceConfig(validation.value.config)
    const dataSource = await createDataSource({
      clientId: client.slug,
      name: validation.value.name,
      encryptedConfig,
      enabled: validation.value.enabled ?? true,
      catalog,
    })

    return NextResponse.json({ ok: true, source: sourceView(dataSource) }, { status: 201 })
  } catch (error) {
    if (error instanceof DataSourceConnectionError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 422 }
      )
    }
    if (error instanceof DataSourceEncryptionConfigurationError) {
      return NextResponse.json(
        { ok: false, error: 'Criptografia das fontes não configurada.' },
        { status: 500 }
      )
    }
    console.error('[client/data-sources]', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Não foi possível cadastrar a fonte de dados.',
      },
      { status: 500 }
    )
  }
}
