import { adfToPlainText } from './adf'
import { getJiraCredentials } from './access'
import { assertCanWriteOriginalEstimate, isUnestimated } from './legacy'
import type { JiraIssueView, JiraSearchPage, JiraTenantConfig } from './types'

export class JiraHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: string
  ) {
    super(message)
    this.name = 'JiraHttpError'
  }
}

interface JiraTimetracking {
  originalEstimate?: string
  originalEstimateSeconds?: number
  remainingEstimate?: string
  remainingEstimateSeconds?: number
  timeSpent?: string
  timeSpentSeconds?: number
}

interface JiraIssueRaw {
  id: string
  key: string
  fields?: {
    summary?: string
    description?: unknown
    issuetype?: { name?: string }
    status?: { name?: string; statusCategory?: { key?: string; name?: string } }
    labels?: string[]
    priority?: { name?: string } | null
    assignee?: { displayName?: string } | null
    updated?: string
    timetracking?: JiraTimetracking
  }
}

const ISSUE_FIELDS = [
  'summary',
  'description',
  'status',
  'issuetype',
  'labels',
  'timetracking',
  'assignee',
  'priority',
  'updated',
].join(',')

function authHeader(): string {
  const { email, token } = getJiraCredentials()
  return `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`
}

async function jiraFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { baseUrl } = getJiraCredentials()
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: authHeader(),
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
    signal: init?.signal ?? AbortSignal.timeout(25_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new JiraHttpError(describeJiraError(res.status, body), res.status, body.slice(0, 400))
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function describeJiraError(status: number, body: string): string {
  if (status === 401) return 'Jira recusou a autenticação (401). Confira JIRA_EMAIL e JIRA_API_TOKEN.'
  if (status === 403) return 'A conta do Jira não tem permissão nesta issue (403). Falta Browse/Edit/Schedule issues no projeto APP.'
  if (status === 404) return 'Issue ou recurso Jira não encontrado (404).'
  const snippet = body.replace(/\s+/g, ' ').slice(0, 180)
  return snippet ? `Jira ${status}: ${snippet}` : `Jira ${status}`
}

export function mapIssue(raw: JiraIssueRaw, tenant: JiraTenantConfig): JiraIssueView {
  const tracking = raw.fields?.timetracking ?? {}
  const originalEstimate = tracking.originalEstimate ?? null
  const originalEstimateSeconds = tracking.originalEstimateSeconds ?? null
  const site = tenant.site.replace(/\/$/, '')
  return {
    key: raw.key,
    id: raw.id,
    summary: raw.fields?.summary?.trim() || raw.key,
    description: adfToPlainText(raw.fields?.description),
    issueType: raw.fields?.issuetype?.name || 'Story',
    status: raw.fields?.status?.name || '',
    statusCategory: raw.fields?.status?.statusCategory?.key || '',
    labels: raw.fields?.labels ?? [],
    priority: raw.fields?.priority?.name ?? null,
    assignee: raw.fields?.assignee?.displayName ?? null,
    updatedAt: raw.fields?.updated ?? null,
    browseUrl: `${site}/browse/${raw.key}`,
    originalEstimate,
    originalEstimateSeconds,
    remainingEstimate: tracking.remainingEstimate ?? null,
    timeSpent: tracking.timeSpent ?? null,
    unestimated: isUnestimated({
      originalEstimate,
      originalEstimateSeconds,
      hoursPerDay: tenant.hoursPerDay,
    }),
  }
}

export function isEstimableIssueType(name: string, allowed: string[]): boolean {
  const normalized = name.trim().toLowerCase()
  if (allowed.some(type => type.toLowerCase() === normalized)) return true
  return /^(story|história|historia|user story)$/i.test(name.trim())
}

function backlogJql(tenant: JiraTenantConfig, withTypes: boolean): string {
  const base = `project = ${tenant.projectKey} AND statusCategory != Done AND issuetype != Epic`
  if (!withTypes || tenant.issueTypes.length === 0) {
    return `${base} ORDER BY Rank ASC`
  }
  const types = tenant.issueTypes.map(type => `"${type.replace(/"/g, '\\"')}"`).join(', ')
  return `${base} AND issuetype in (${types}) ORDER BY Rank ASC`
}

async function searchJql(tenant: JiraTenantConfig, jql: string, maxResults: number): Promise<JiraIssueView[]> {
  const issues: JiraIssueView[] = []
  let nextPageToken: string | undefined
  let useClassic = false

  for (let page = 0; page < 10; page++) {
    let data: {
      issues?: JiraIssueRaw[]
      nextPageToken?: string
      isLast?: boolean
      total?: number
    }

    if (!useClassic) {
      try {
        const payload: Record<string, unknown> = {
          jql,
          maxResults,
          fields: ISSUE_FIELDS.split(','),
        }
        if (nextPageToken) payload.nextPageToken = nextPageToken
        data = await jiraFetch('/rest/api/3/search/jql', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      } catch (error) {
        if (!(error instanceof JiraHttpError) || (error.status !== 404 && error.status !== 410)) {
          throw error
        }
        useClassic = true
      }
    }

    if (useClassic) {
      data = await jiraFetch(
        `/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=${ISSUE_FIELDS}&startAt=${issues.length}`
      )
    }

    const batch = (data!.issues ?? []).map(issue => mapIssue(issue, tenant))
    issues.push(...batch)
    if (batch.length === 0) break
    if (typeof data!.total === 'number' && issues.length >= data!.total) break
    nextPageToken = data!.nextPageToken
    if (nextPageToken) continue
    if (useClassic && typeof data!.total === 'number' && issues.length < data!.total) continue
    if (data!.isLast === false) continue
    break
  }

  return issues
}

export async function searchProjectIssues(
  tenant: JiraTenantConfig,
  options?: { maxResults?: number }
): Promise<JiraIssueView[]> {
  const maxResults = options?.maxResults ?? 100
  try {
    const typed = await searchJql(tenant, backlogJql(tenant, true), maxResults)
    if (typed.length > 0) return typed
  } catch (error) {
    if (!(error instanceof JiraHttpError) || error.status < 400) throw error
  }

  const broad = await searchJql(tenant, backlogJql(tenant, false), maxResults)
  return broad.filter(issue => isEstimableIssueType(issue.issueType, tenant.issueTypes))
}

export async function getIssue(tenant: JiraTenantConfig, key: string): Promise<JiraIssueView> {
  const raw = await jiraFetch<JiraIssueRaw>(
    `/rest/api/3/issue/${encodeURIComponent(key)}?fields=${ISSUE_FIELDS}`
  )
  return mapIssue(raw, tenant)
}

/**
 * Única escrita permitida: originalEstimate em issue ainda sem estimativa.
 * Relê o ticket na hora para não pisar em legado (3d, 2d, …).
 */
export async function writeOriginalEstimateIfEmpty(
  tenant: JiraTenantConfig,
  key: string,
  originalEstimate: string
): Promise<JiraIssueView> {
  const current = await getIssue(tenant, key)
  assertCanWriteOriginalEstimate(current)
  await jiraFetch(`/rest/api/3/issue/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify({
      fields: {
        timetracking: {
          originalEstimate,
        },
      },
    }),
  })
  return getIssue(tenant, key)
}

export type { JiraSearchPage }
