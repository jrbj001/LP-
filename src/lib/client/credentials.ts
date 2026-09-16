import { getClient } from './registry'
import type { ClientSession } from './session'

const DEV_PASSWORDS: Record<string, string> = {
  likeme: 'likeme2026',
  'be180-ooh': 'be180ooh2026',
  cadence: 'cadence2026',
  pixelpulselab: 'pixel2026',
  'adaptive-layer': 'adaptive2026',
  orfeu: 'orfeu2026',
}

type Credential = { slug: string; password: string }

function parseConfiguredPasswords(raw: string): Credential[] {
  try {
    const parsed = JSON.parse(raw) as Array<{ slug?: string; password?: string }>
    return parsed
      .filter(
        (item): item is Credential =>
          typeof item.slug === 'string' && typeof item.password === 'string'
      )
      .map(item => ({ slug: item.slug.trim(), password: item.password }))
  } catch {
    throw new Error('CLIENT_ACCESS deve ser um JSON válido')
  }
}

function developmentPasswords(): Credential[] {
  return Object.entries(DEV_PASSWORDS).map(([slug, password]) => ({ slug, password }))
}

function configuredPasswords(): Credential[] {
  const raw = process.env.CLIENT_ACCESS
  const fromEnv = raw ? parseConfiguredPasswords(raw) : []
  if (process.env.NODE_ENV === 'production') return fromEnv
  const envSlugs = new Set(fromEnv.map(item => getClient(item.slug)?.slug ?? item.slug))
  return [...fromEnv, ...developmentPasswords().filter(item => !envSlugs.has(item.slug))]
}

export function authenticateClient(slug: string, password: string): Omit<ClientSession, 'exp'> | null {
  const client = getClient(slug)
  if (!client || !password) return null
  const credentials = configuredPasswords()
  const expected =
    credentials.find(item => item.slug === slug) ??
    credentials.find(item => getClient(item.slug)?.slug === client.slug)
  if (!expected || expected.password !== password) return null
  return { slug: client.slug, name: client.name }
}
