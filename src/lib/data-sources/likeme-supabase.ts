export interface LikemeSupabasePostgresConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  sslMode: 'require'
}

export function supabaseProjectRef(projectUrl: string): string | null {
  const raw = projectUrl.trim()
  if (!raw) return null
  try {
    const host = new URL(raw.includes('://') ? raw : `https://${raw}`).hostname.toLowerCase()
    const match = host.match(/^([a-z0-9]+)\.supabase\.co$/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}

/** Conexão direta do Postgres Like:Me. Não reutiliza DATABASE_URL (Neon do Cadence). */
export function likemeSupabasePostgresConfigFromEnv(
  env: Record<string, string | undefined> = process.env
): LikemeSupabasePostgresConfig | null {
  const password = env.SUPABASE_DB_PASSWORD?.trim()
  const projectUrl = env.SUPABASE_PROJECT_URL?.trim()
  if (!password || !projectUrl) return null

  const ref = supabaseProjectRef(projectUrl)
  if (!ref) return null

  return {
    host: `db.${ref}.supabase.co`,
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password,
    sslMode: 'require',
  }
}
