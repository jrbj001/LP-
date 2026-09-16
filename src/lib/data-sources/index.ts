import 'server-only'

export {
  DataSourceEncryptionConfigurationError,
  decryptDataSourceConfig,
  encryptDataSourceConfig,
} from './crypto'
export {
  DataSourceConnectionError,
  discoverPostgresCatalog,
  testPostgresConnection,
} from './postgresql'
export { likemeSupabasePostgresConfigFromEnv, supabaseProjectRef } from './likeme-supabase'
export { seedEnvDataSources } from './seed'
export {
  createDataSource,
  deleteDataSource,
  ensureDataSourcesTable,
  getStoredDataSource,
  listDataSources,
  toDataSourceMetadata,
  updateDataSourceCatalog,
  upsertSeededDataSource,
} from './store'
export type {
  CreateDataSourceInput,
  DataSourceCatalog,
  DataSourceCatalogEntry,
  DataSourceKind,
  DataSourceMetadata,
  PostgresDataSourceConfig,
  PostgresSslMode,
  StoredDataSource,
} from './types'
