import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import {
  DataSourceAdminConfigurationError,
  isDataSourceAdminRequest,
} from '@/lib/data-sources/auth'
import {
  DataSourceEncryptionConfigurationError,
  decryptDataSourceConfig,
} from '@/lib/data-sources/crypto'
import {
  DataSourceConnectionError,
  testPostgresConnection,
} from '@/lib/data-sources/postgresql'
import { testSqlServerConnection, type SqlServerDataSourceConfig } from '@/lib/data-sources/sqlserver'
import type { PostgresDataSourceConfig } from '@/lib/data-sources/types'
import {
  deleteDataSource,
  getStoredDataSource,
  updateDataSourceCatalog,
} from '@/lib/data-sources/store'
import type { DataSourceMetadata } from '@/lib/data-sources/types'

export const dynamic = 'force-dynamic'

type RouteParams = Promise<{ clientId: string; sourceId: string }>

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

function validSourceId(sourceId: string): boolean {
  return sourceId.length > 0 && sourceId.length <= 128
}

export async function DELETE(
  request: Request,
  { params }: { params: RouteParams }
) {
  const unauthorized = authorize(request)
  if (unauthorized) return unauthorized

  const { clientId, sourceId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Cliente não encontrado.' },
      { status: 404 }
    )
  }
  if (!validSourceId(sourceId)) {
    return NextResponse.json(
      { ok: false, error: 'Identificador da fonte inválido.' },
      { status: 400 }
    )
  }

  try {
    const deleted = await deleteDataSource(client.slug, sourceId)
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: 'Fonte de dados não encontrada.' },
        { status: 404 }
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Não foi possível remover a fonte de dados.' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: RouteParams }
) {
  const unauthorized = authorize(request)
  if (unauthorized) return unauthorized

  const { clientId, sourceId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Cliente não encontrado.' },
      { status: 404 }
    )
  }
  if (!validSourceId(sourceId)) {
    return NextResponse.json(
      { ok: false, error: 'Identificador da fonte inválido.' },
      { status: 400 }
    )
  }

  try {
    const stored = await getStoredDataSource(client.slug, sourceId)
    if (!stored) {
      return NextResponse.json(
        { ok: false, error: 'Fonte de dados não encontrada.' },
        { status: 404 }
      )
    }

    const catalog =
      stored.kind === 'sqlserver'
        ? await testSqlServerConnection(
            decryptDataSourceConfig<SqlServerDataSourceConfig>(stored.encryptedConfig)
          )
        : await testPostgresConnection(
            decryptDataSourceConfig<PostgresDataSourceConfig>(stored.encryptedConfig)
          )
    const dataSource = await updateDataSourceCatalog(
      client.slug,
      sourceId,
      catalog
    )
    if (!dataSource) {
      return NextResponse.json(
        { ok: false, error: 'Fonte de dados não encontrada.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, source: sourceView(dataSource) })
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
    return NextResponse.json(
      { ok: false, error: 'Não foi possível retestar a fonte de dados.' },
      { status: 500 }
    )
  }
}
