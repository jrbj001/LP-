import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getJiraTenant } from '@/lib/jira/access'
import { JiraHttpError, searchProjectIssues } from '@/lib/jira/client'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  const tenant = getJiraTenant(client.slug)
  if (!tenant) {
    return NextResponse.json({ ok: false, error: 'Jira não está habilitado para este cliente.' }, { status: 403 })
  }

  try {
    const issues = await searchProjectIssues(tenant)
    const unestimated = issues.filter(issue => issue.unestimated)
    return NextResponse.json(
      {
        ok: true,
        projectKey: tenant.projectKey,
        site: tenant.site,
        boardId: tenant.boardId,
        hoursPerDay: tenant.hoursPerDay,
        issues,
        totals: {
          all: issues.length,
          unestimated: unestimated.length,
          estimated: issues.length - unestimated.length,
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('[client/jira/issues]', error)
    const status = error instanceof JiraHttpError ? error.status : 500
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Falha ao listar o Jira.' },
      { status: status >= 400 && status < 600 ? status : 500 }
    )
  }
}
