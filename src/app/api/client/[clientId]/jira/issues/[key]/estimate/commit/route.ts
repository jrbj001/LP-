import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getJiraTenant } from '@/lib/jira/access'
import { isEstimableIssueType, JiraHttpError, getIssue, writeOriginalEstimateIfEmpty } from '@/lib/jira/client'
import { hoursToJiraEstimate, JiraLegacyEstimateError, parseJiraDurationToHours } from '@/lib/jira/legacy'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
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
  if (!new RegExp(`^${tenant.projectKey}-\\d+$`, 'i').test(key)) {
    return NextResponse.json({ ok: false, error: 'Issue fora do projeto configurado.' }, { status: 400 })
  }

  const body = (await req.json().catch(() => ({}))) as { jiraEstimate?: string; hours?: number }
  const jiraEstimate =
    typeof body.jiraEstimate === 'string' && body.jiraEstimate.trim()
      ? body.jiraEstimate.trim()
      : typeof body.hours === 'number'
        ? hoursToJiraEstimate(body.hours, tenant.hoursPerDay)
        : ''

  if (!jiraEstimate || parseJiraDurationToHours(jiraEstimate, tenant.hoursPerDay) <= 0) {
    return NextResponse.json({ ok: false, error: 'Informe um original estimate válido (ex.: 1d 4h).' }, { status: 400 })
  }

  try {
    const current = await getIssue(tenant, key.toUpperCase())
    if (!isEstimableIssueType(current.issueType, tenant.issueTypes)) {
      return NextResponse.json(
        { ok: false, error: `${current.key} não é uma story (${current.issueType}). Só gravamos original estimate em histórias.` },
        { status: 400 }
      )
    }
    const issue = await writeOriginalEstimateIfEmpty(tenant, key.toUpperCase(), jiraEstimate)
    return NextResponse.json({ ok: true, issue })
  } catch (error) {
    console.error('[client/jira/estimate/commit]', error)
    if (error instanceof JiraLegacyEstimateError) {
      return NextResponse.json({ ok: false, error: error.message, code: 'legacy_estimate' }, { status: 409 })
    }
    const status = error instanceof JiraHttpError ? error.status : 500
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Falha ao gravar o original estimate.' },
      { status: status >= 400 && status < 600 ? status : 500 }
    )
  }
}
