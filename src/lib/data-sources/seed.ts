import 'server-only'

import { encryptDataSourceConfig } from './crypto'
import { testPostgresConnection } from './postgresql'
import { testSqlServerConnection } from './sqlserver'
import { upsertSeededDataSource } from './store'

export async function seedEnvDataSources(clientId: string): Promise<void> {
  if (clientId !== 'be180-ooh') return

  const errors: string[] = []

  const host = process.env.BE180_ATIVOS_PG_HOST
  const database = process.env.BE180_ATIVOS_PG_DATABASE
  const username = process.env.BE180_ATIVOS_PG_USER
  const password = process.env.BE180_ATIVOS_PG_PASSWORD
  if (host && database && username && password) {
    try {
      const config = {
        host,
        port: Number(process.env.BE180_ATIVOS_PG_PORT || 5432),
        database,
        username,
        password,
        sslMode: 'require' as const,
      }
      const catalog = await testPostgresConnection(config)
      await upsertSeededDataSource({
        clientId,
        seedKey: 'be180-ativos-pg',
        name: 'Banco de Ativos · PostgreSQL',
        kind: 'postgresql',
        encryptedConfig: encryptDataSourceConfig(config),
        catalog,
      })
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Falha no Banco de Ativos')
    }
  }

  const sqlServer = process.env.BE180_COLMEIA_SQL_SERVER
  const sqlDatabase = process.env.BE180_COLMEIA_SQL_DATABASE
  const sqlUser = process.env.BE180_COLMEIA_SQL_USER
  const sqlPassword = process.env.BE180_COLMEIA_SQL_PASSWORD
  if (sqlServer && sqlDatabase && sqlUser && sqlPassword) {
    try {
      const config = {
        server: sqlServer,
        database: sqlDatabase,
        username: sqlUser,
        password: sqlPassword,
        encrypt: true,
      }
      const catalog = await testSqlServerConnection(config)
      await upsertSeededDataSource({
        clientId,
        seedKey: 'be180-colmeia-sql',
        name: 'Colmeia · SQL Server',
        kind: 'sqlserver',
        encryptedConfig: encryptDataSourceConfig(config),
        catalog,
      })
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Falha no Colmeia')
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' · '))
  }
}
