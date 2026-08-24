import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import postgres from 'postgres'

const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connection) {
  console.error('DATABASE_URL ou POSTGRES_URL não configurado.')
  process.exit(1)
}

const migrationsDir = path.join(
  process.cwd(),
  'src/lib/alquimia/migrations'
)
const files = (await fs.readdir(migrationsDir))
  .filter(file => file.endsWith('.sql'))
  .sort()

const sql = postgres(connection, {
  max: 1,
  prepare: false,
  onnotice: () => {},
})

try {
  for (const file of files) {
    const migration = await fs.readFile(path.join(migrationsDir, file), 'utf8')
    await sql.begin(async transaction => {
      await transaction.unsafe(migration)
    })
    console.log(`aplicada: ${file}`)
  }
  console.log('Space Alquemia pronto.')
} finally {
  await sql.end()
}
