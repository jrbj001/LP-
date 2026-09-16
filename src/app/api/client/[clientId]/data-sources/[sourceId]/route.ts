import { NextResponse } from 'next/server'
import { requireClientSession } from '@/lib/client/auth'
import { getClient } from '@/lib/client/registry'
import {
  DataSourceEncryptionConfigurationError,
  decryptDataSourceConfig,
} from '@/lib/data-sources/crypto'
import {
  DataSourceConnectionError,
  testPostgresConnection,
} from '@/lib/data-sources/postgresql'
import { isDataSourceRemovable } from '@/lib/data-sources/lifecycle'
import { testSqlServerConnection, type SqlServerDataSourceConfig } from '@/lib/data-sources/sqlserver'
import type { PostgresDataSourceConfig } from '@/lib/data-sources/types'
import {
  deleteDataSource,
  getStoredDataSource,
  updateDataSourceCatalog,
  updateDataSourceEnabled,
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

function validSourceId(sourceId: string): boolean {
  return sourceId.length > 0 && sourceId.length <= 128
}

export async function DELETE(
  _request: Request,
  { params }: { params: RouteParams }
) {
  const { clientId, sourceId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Cliente não encontrado.' },
      { status: 404 }
    )
  }
  const session = await requireClientSession(client.slug)
  if (session instanceof NextResponse) return session
  if (!validSourceId(sourceId)) {
    return NextResponse.json(
      { ok: false, error: 'Identificador da fonte inválido.' },
      { status: 400 }
    )
  }

  try {
    const source = await getStoredDataSource(client.slug, sourceId)
    if (source && !isDataSourceRemovable(source)) {
      return NextResponse.json(
        { ok: false, error: 'Fontes automáticas podem ser desativadas, mas não removidas.' },
        { status: 409 }
      )
    }
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

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  const { clientId, sourceId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Cliente não encontrado.' },
      { status: 404 }
    )
  }
  const session = await requireClientSession(client.slug)
  if (session instanceof NextResponse) return session
  if (!validSourceId(sourceId)) {
    return NextResponse.json(
      { ok: false, error: 'Identificador da fonte inválido.' },
      { status: 400 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 })
  }
  if (
    typeof body !== 'object' ||
    body === null ||
    !('enabled' in body) ||
    typeof body.enabled !== 'boolean'
  ) {
    return NextResponse.json(
      { ok: false, error: 'O campo enabled deve ser booleano.' },
      { status: 400 }
    )
  }

  try {
    const source = await updateDataSourceEnabled(client.slug, sourceId, body.enabled)
    if (!source) {
      return NextResponse.json(
        { ok: false, error: 'Fonte de dados não encontrada.' },
        { status: 404 }
      )
    }
    return NextResponse.json({ ok: true, source: sourceView(source) })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Não foi possível atualizar a fonte de dados.' },
      { status: 500 }
    )
  }
}

export async function POST(
  _request: Request,
  { params }: { params: RouteParams }
) {
  const { clientId, sourceId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Cliente não encontrado.' },
      { status: 404 }
    )
  }
  const session = await requireClientSession(client.slug)
  if (session instanceof NextResponse) return session
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
