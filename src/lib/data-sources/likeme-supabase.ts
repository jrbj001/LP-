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

/**
 * Host do Supavisor (pooler). Aceita a connection string completa do painel do
 * Supabase ou apenas `host:porta`.
 */
export function supabasePoolerTarget(
  value?: string
): { host: string; port: number } | null {
  const raw = value?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw.includes('://') ? raw : `postgresql://${raw}`)
    const host = url.hostname.toLowerCase()
    if (!host.endsWith('.pooler.supabase.com')) return null
    return { host, port: Number(url.port) || 5432 }
  } catch {
    return null
  }
}

/** Conexão do Postgres Like:Me. Não reutiliza DATABASE_URL (Neon do Cadence). */
export function likemeSupabasePostgresConfigFromEnv(
  env: Record<string, string | undefined> = process.env
): LikemeSupabasePostgresConfig | null {
  const password = env.SUPABASE_DB_PASSWORD?.trim()
  const projectUrl = env.SUPABASE_PROJECT_URL?.trim()
  if (!password || !projectUrl) return null

  const ref = supabaseProjectRef(projectUrl)
  if (!ref) return null

  // `db.<ref>.supabase.co` só resolve em IPv6 e é inalcançável nas funções da
  // Vercel; com o pooler configurado a conexão sai por IPv4.
  const pooler = supabasePoolerTarget(env.SUPABASE_POOLER_URL)
  if (pooler) {
    return {
      host: pooler.host,
      port: pooler.port,
      database: 'postgres',
      username: `postgres.${ref}`,
      password,
      sslMode: 'require',
    }
  }

  return {
    host: `db.${ref}.supabase.co`,
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password,
    sslMode: 'require',
  }
}
