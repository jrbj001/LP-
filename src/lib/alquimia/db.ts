import 'server-only'

import postgres from 'postgres'

let client: ReturnType<typeof postgres> | null = null

export function hasAlquimiaDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL)
}

export function alquimiaDb(): ReturnType<typeof postgres> {
  const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!connection) throw new Error('DATABASE_URL não configurado')
  if (!client) {
    client = postgres(connection, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    })
  }
  return client
}
