import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getJiraTenant } from '@/lib/jira/access'
import { getIssue, JiraHttpError } from '@/lib/jira/client'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clientId: string; key: string }> }
) {
  const { clientId, key } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  const tenant = getJiraTenant(client.slug)
  if (!tenant) {
    return NextResponse.json({ ok: false, error: 'Jira não está habilitado para este cliente.' }, { status: 403 })
  }
  if (!belongsToProject(key, tenant.projectKey)) {
    return NextResponse.json({ ok: false, error: 'Issue fora do projeto APP.' }, { status: 400 })
  }

  try {
    const issue = await getIssue(tenant, key.toUpperCase())
    return NextResponse.json({ ok: true, issue }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[client/jira/issue]', error)
    const status = error instanceof JiraHttpError ? error.status : 500
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Falha ao ler a issue.' },
      { status: status >= 400 && status < 600 ? status : 500 }
    )
  }
}

function belongsToProject(key: string, projectKey: string): boolean {
  return new RegExp(`^${projectKey}-\\d+$`, 'i').test(key)
}
