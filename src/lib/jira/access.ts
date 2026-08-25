import { getClient } from '@/lib/client/registry'
import type { JiraTenantConfig } from './types'

const DEFAULT_ISSUE_TYPES = ['Story', 'História', 'User Story']

export function isJiraEnabled(clientId: string): boolean {
  const client = getClient(clientId)
  return Boolean(client?.jira)
}

export function getJiraTenant(clientId: string): JiraTenantConfig | null {
  const client = getClient(clientId)
  if (!client?.jira) return null
  return {
    ...client.jira,
    site: (process.env.JIRA_BASE_URL || client.jira.site).replace(/\/$/, ''),
    projectKey: process.env.JIRA_PROJECT_KEY || client.jira.projectKey,
    issueTypes: client.jira.issueTypes.length > 0 ? client.jira.issueTypes : DEFAULT_ISSUE_TYPES,
  }
}

export function getJiraCredentials(): { baseUrl: string; email: string; token: string } {
  const baseUrl = (process.env.JIRA_BASE_URL || '').replace(/\/$/, '')
  const email = process.env.JIRA_EMAIL || ''
  const token = process.env.JIRA_API_TOKEN || ''
  if (!baseUrl || !email || !token) {
    throw new Error('Jira não configurado. Defina JIRA_BASE_URL, JIRA_EMAIL e JIRA_API_TOKEN.')
  }
  return { baseUrl, email, token }
}
