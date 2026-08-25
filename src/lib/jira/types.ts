import type { BacklogBoardId } from '@/lib/backlog/types'

export interface JiraTenantConfig {
  site: string
  projectKey: string
  boardId: number
  hoursPerDay: number
  issueTypes: string[]
}

export interface JiraIssueView {
  key: string
  id: string
  summary: string
  description: string
  issueType: string
  status: string
  statusCategory: string
  labels: string[]
  priority: string | null
  assignee: string | null
  updatedAt: string | null
  browseUrl: string
  originalEstimate: string | null
  originalEstimateSeconds: number | null
  remainingEstimate: string | null
  timeSpent: string | null
  /** true = pode entrar na fila de estimativa. */
  unestimated: boolean
}

export interface SimilarPr {
  repo: string
  number: number
  title: string
  hours: number
  score: number
}

export interface EstimateSuggestion {
  issueKey: string
  hours: number
  jiraEstimate: string
  hoursPerDay: number
  confidence: 'low' | 'medium' | 'high'
  rationale: string
  risks: string[]
  boards: BacklogBoardId[]
  similarPrs: SimilarPr[]
  githubNotes: string[]
  source: 'heuristic' | 'heuristic+llm'
}

export interface JiraSearchPage {
  issues: JiraIssueView[]
  isLast: boolean
}
