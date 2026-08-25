import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getJiraTenant } from '@/lib/jira/access'
import { getIssue, isEstimableIssueType, JiraHttpError } from '@/lib/jira/client'
import { estimateUnestimatedIssue } from '@/lib/jira/estimate'
import { JiraLegacyEstimateError } from '@/lib/jira/legacy'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(
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
  if (!new RegExp(`^${tenant.projectKey}-\\d+$`, 'i').test(key)) {
    return NextResponse.json({ ok: false, error: 'Issue fora do projeto configurado.' }, { status: 400 })
  }

  try {
    const issue = await getIssue(tenant, key.toUpperCase())
    if (!isEstimableIssueType(issue.issueType, tenant.issueTypes)) {
      return NextResponse.json(
        { ok: false, error: `${issue.key} não é uma story (${issue.issueType}). Só estimamos histórias.` },
        { status: 400 }
      )
    }
    if (!issue.unestimated) {
      throw new JiraLegacyEstimateError(issue.key, issue.originalEstimate || 'já preenchido')
    }

    const suggestion = await estimateUnestimatedIssue({
      clientId: client.slug,
      tenant,
      issue,
      repos: client.delivery?.repos ?? [],
    })

    return NextResponse.json({ ok: true, issue, suggestion })
  } catch (error) {
    console.error('[client/jira/estimate]', error)
    if (error instanceof JiraLegacyEstimateError) {
      return NextResponse.json({ ok: false, error: error.message, code: 'legacy_estimate' }, { status: 409 })
    }
    const status = error instanceof JiraHttpError ? error.status : 500
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Falha ao estimar a issue.' },
      { status: status >= 400 && status < 600 ? status : 500 }
    )
  }
}
