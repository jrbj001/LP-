import {
  POSTGRES_SSL_MODES,
  type CreateDataSourceInput,
  type PostgresDataSourceConfig,
} from './types'

type ValidationResult =
  | { ok: true; value: CreateDataSourceInput }
  | { ok: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(
  value: unknown,
  field: string,
  maxLength: number
): { value?: string; error?: string } {
  if (typeof value !== 'string' || !value.trim()) {
    return { error: `O campo ${field} é obrigatório.` }
  }
  const normalized = value.trim()
  if (normalized.length > maxLength) {
    return { error: `O campo ${field} excede o tamanho permitido.` }
  }
  return { value: normalized }
}

export function parsePostgresConnectionUrl(raw: string): Partial<PostgresDataSourceConfig> | null {
  const trimmed = raw.trim()
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) return null
  try {
    const url = new URL(trimmed)
    const database = decodeURIComponent(url.pathname.replace(/^\//, '')).split('/')[0]
    const sslModeRaw = url.searchParams.get('sslmode')
    const sslMode =
      sslModeRaw === 'disable' || sslModeRaw === 'prefer' || sslModeRaw === 'require'
        ? sslModeRaw
        : undefined
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      database,
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      ...(sslMode ? { sslMode } : {}),
    }
  } catch {
    return null
  }
}

export function validateCreateDataSourceInput(body: unknown): ValidationResult {
  if (!isRecord(body)) return { ok: false, error: 'JSON inválido.' }

  const name = requiredString(body.name, 'name', 120)
  if (name.error) return { ok: false, error: name.error }
  if (!isRecord(body.config)) {
    return { ok: false, error: 'O campo config é obrigatório.' }
  }

  const fromUrl =
    parsePostgresConnectionUrl(
      typeof body.config.url === 'string'
        ? body.config.url
        : typeof body.config.host === 'string'
          ? body.config.host
          : ''
    ) ?? null
  const hostLooksLikeUrl =
    typeof body.config.host === 'string' && /^postgres(ql)?:\/\//i.test(body.config.host)
  const config = {
    ...fromUrl,
    ...body.config,
    host: hostLooksLikeUrl
      ? fromUrl?.host
      : typeof body.config.host === 'string' && body.config.host.trim()
        ? body.config.host
        : fromUrl?.host,
    port: body.config.port ?? fromUrl?.port,
    database:
      typeof body.config.database === 'string' && body.config.database.trim()
        ? body.config.database
        : fromUrl?.database,
    username:
      typeof body.config.username === 'string' && body.config.username.trim()
        ? body.config.username
        : fromUrl?.username,
    password:
      typeof body.config.password === 'string' && body.config.password
        ? body.config.password
        : fromUrl?.password,
    sslMode: body.config.sslMode ?? fromUrl?.sslMode ?? 'prefer',
  }

  const host = requiredString(config.host, 'config.host', 255)
  const database = requiredString(config.database, 'config.database', 128)
  const username = requiredString(config.username, 'config.username', 128)
  if (host.error) return { ok: false, error: host.error }
  if (database.error) return { ok: false, error: database.error }
  if (username.error) return { ok: false, error: username.error }
  if (typeof config.password !== 'string' || config.password.length > 4096) {
    return { ok: false, error: 'O campo config.password é inválido.' }
  }
  const port = typeof config.port === 'string' ? Number(config.port) : config.port
  if (typeof port !== 'number' || !Number.isInteger(port) || port < 1 || port > 65535) {
    return { ok: false, error: 'O campo config.port deve estar entre 1 e 65535.' }
  }
  if (
    typeof config.sslMode !== 'string' ||
    !POSTGRES_SSL_MODES.includes(
      config.sslMode as (typeof POSTGRES_SSL_MODES)[number]
    )
  ) {
    return {
      ok: false,
      error: 'config.sslMode deve ser require, prefer ou disable.',
    }
  }

  let schemas: string[] | undefined
  if (config.schemas !== undefined) {
    if (
      !Array.isArray(config.schemas) ||
      config.schemas.length > 100 ||
      config.schemas.some(
        schema =>
          typeof schema !== 'string' ||
          !schema.trim() ||
          schema.trim().length > 128
      )
    ) {
      return { ok: false, error: 'O campo config.schemas é inválido.' }
    }
    schemas = [...new Set(config.schemas.map(schema => schema.trim()))]
  }

  if (body.enabled !== undefined && typeof body.enabled !== 'boolean') {
    return { ok: false, error: 'O campo enabled deve ser booleano.' }
  }

  const normalizedConfig: PostgresDataSourceConfig = {
    host: host.value!.replace(/^https?:\/\//, ''),
    port,
    database: database.value!,
    username: username.value!,
    password: config.password,
    sslMode: config.sslMode as PostgresDataSourceConfig['sslMode'],
    ...(schemas ? { schemas } : {}),
  }

  return {
    ok: true,
    value: {
      name: name.value!,
      config: normalizedConfig,
      enabled: body.enabled as boolean | undefined,
    },
  }
}
