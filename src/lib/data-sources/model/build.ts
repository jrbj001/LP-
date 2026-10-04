import 'server-only'

import { decryptDataSourceConfig } from '../crypto'
import type { SqlServerDataSourceConfig } from '../sqlserver'
import { getStoredDataSource } from '../store'
import type { PostgresDataSourceConfig, StoredDataSource } from '../types'
import { computeModelHealth } from './health'
import { introspectPostgresModel } from './introspect-postgres'
import { introspectSqlServerModel } from './introspect-sqlserver'
import { saveDataModelSnapshot } from './store'
import type { DataModelSnapshot, StoredDataModel } from './types'

export class DataModelNotFoundError extends Error {
  constructor() {
    super('Fonte de dados não encontrada.')
  }
}

async function introspect(source: StoredDataSource) {
  if (source.kind === 'sqlserver') {
    return introspectSqlServerModel(
      decryptDataSourceConfig<SqlServerDataSourceConfig>(source.encryptedConfig)
    )
  }
  return introspectPostgresModel(
    decryptDataSourceConfig<PostgresDataSourceConfig>(source.encryptedConfig)
  )
}

export async function buildDataModel(
  clientId: string,
  sourceId: string
): Promise<StoredDataModel> {
  const source = await getStoredDataSource(clientId, sourceId)
  if (!source) throw new DataModelNotFoundError()

  const { tables, relationships, truncated } = await introspect(source)
  const snapshot: DataModelSnapshot = {
    sourceId: source.id,
    sourceName: source.name,
    kind: source.kind,
    generatedAt: new Date().toISOString(),
    schemas: [...new Set(tables.map(table => table.schema))].sort(),
    tables,
    relationships,
    health: computeModelHealth(tables, relationships),
    truncated,
  }
  return saveDataModelSnapshot(clientId, sourceId, snapshot)
}
