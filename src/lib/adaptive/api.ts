import { NextResponse } from 'next/server'
import { isNotionConfigured } from './notion'

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function requireNotion() {
  if (!isNotionConfigured()) {
    return jsonError(
      'Notion não configurado. Defina NOTION_TOKEN e os DB IDs no .env (veja .env.example).',
      503
    )
  }
  return null
}

export function assertOpsSecret(req: Request): NextResponse | null {
  const secret = process.env.ADAPTIVE_OPS_SECRET?.trim()
  if (!secret) return null // open if not set (local dev)
  const header = req.headers.get('x-adaptive-ops-secret')?.trim()
  const url = new URL(req.url)
  const query = url.searchParams.get('secret')?.trim()
  if (header === secret || query === secret) return null
  return jsonError('Unauthorized', 401)
}
