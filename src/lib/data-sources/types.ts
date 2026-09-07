import 'server-only'

export const POSTGRES_SSL_MODES = ['require', 'prefer', 'disable'] as const

export type PostgresSslMode = (typeof POSTGRES_SSL_MODES)[number]

export interface PostgresDataSourceConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  sslMode: PostgresSslMode
  schemas?: string[]
}

export type DataSourceKind = 'postgresql' | 'sqlserver'

export interface DataSourceCatalogEntry {
  schema: string
  table: string
  type: 'table' | 'view' | 'materialized_view' | 'foreign_table'
}

export interface DataSourceCatalog {
  entries: DataSourceCatalogEntry[]
  count: number
  discoveredAt: string
}

export interface DataSourceColumn {
  schema: string
  table: string
  column: string
  dataType: string
  nullable: boolean
}

export interface DataSourceMetadata {
  id: string
  clientId: string
  name: string
  kind: DataSourceKind
  enabled: boolean
  catalog: DataSourceCatalog
  lastTestedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface StoredDataSource extends DataSourceMetadata {
  encryptedConfig: string
}

export interface CreateDataSourceInput {
  name: string
  config: PostgresDataSourceConfig
  enabled?: boolean
}
