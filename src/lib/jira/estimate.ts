import type { BacklogBoardId } from '@/lib/backlog/types'
import { gatherGithubContextForQuery, keywordsFromText } from '@/lib/backlog/github-context'
import { callOpenAiJson } from '@/lib/backlog/llm'
import { getDeliveryReport } from '@/lib/delivery/service'
import type { PrRow, RepoConfig } from '@/lib/delivery/types'
import { hoursToJiraEstimate } from './legacy'
import type { EstimateSuggestion, JiraIssueView, JiraTenantConfig, SimilarPr } from './types'

const MAX_HOURS = 80
const MIN_HOURS = 0.5

export function pickBoardsForIssue(text: string): BacklogBoardId[] {
  const t = text.toLowerCase()
  const boards: BacklogBoardId[] = []
  if (/landing|newsletter|sendgrid|cadastro|welcome/.test(t)) boards.push('likeme-landing')
  if (/api|backend|pagar\.?me|webhook|auth0|postgres|tabia|amity|social.?plus/.test(t)) {
    boards.push('likeme-backend')
  }
  if (/app|android|ios|google pay|apple pay|assinatura|frontend|tela|ui|ux/.test(t)) {
    boards.push('likeme-app')
  }
  if (boards.length === 0) return ['likeme-app', 'likeme-backend']
  return [...new Set(boards)]
}

export function scorePr(pr: PrRow, keywords: string[]): number {
  if (keywords.length === 0) return 0
  const hay = `${pr.title} ${pr.branch} ${pr.product}`.toLowerCase()
  return keywords.reduce((score, word) => (hay.includes(word) ? score + 1 : score), 0)
}

export function pickSimilarPrs(prs: PrRow[], keywords: string[], limit = 5): SimilarPr[] {
  return prs
    .map(pr => ({
      repo: pr.repo,
      number: pr.number,
      title: pr.title,
      hours: pr.estimatedHours,
      score: scorePr(pr, keywords),
    }))
    .filter(pr => pr.score > 0 && pr.hours > 0)
    .sort((a, b) => b.score - a.score || a.hours - b.hours)
    .slice(0, limit)
}

export function medianHours(values: number[], fallback: number): number {
  const sorted = values.filter(v => v > 0).sort((a, b) => a - b)
  if (sorted.length === 0) return fallback
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

export function clampEstimateHours(hours: number): number {
  if (!Number.isFinite(hours) || hours <= 0) return 4
  return Math.min(MAX_HOURS, Math.max(MIN_HOURS, Math.round(hours * 2) / 2))
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(item => String(item).trim()).filter(Boolean).slice(0, 6)
}

async function adjustWithLlm(input: {
  issue: JiraIssueView
  baselineHours: number
  similarPrs: SimilarPr[]
  githubContext: string
}): Promise<{ hours: number; rationale: string; risks: string[]; confidence: EstimateSuggestion['confidence'] } | null> {
  if (!process.env.OPENAI_API_KEY) return null
  try {
    const raw = await callOpenAiJson(
      `Você estima esforço de user stories Like:Me para original estimate no Jira.
Calendário: 8 horas = 1 dia. Seja conservador. Não invente código que não apareceu no contexto.
Responda JSON: {"hours": number, "confidence": "low"|"medium"|"high", "rationale": string, "risks": string[]}.
hours deve ficar entre ${MIN_HOURS} e ${MAX_HOURS}. Use a baseline como âncora (±50% no máximo, salvo risco claro).`,
      JSON.stringify({
        issue: {
          key: input.issue.key,
          summary: input.issue.summary,
          description: input.issue.description.slice(0, 4000),
          labels: input.issue.labels,
        },
        baselineHours: input.baselineHours,
        similarPrs: input.similarPrs,
        githubContext: input.githubContext.slice(0, 8000),
      }),
      { temperature: 0.15, maxTokens: 700 }
    )
    if (!raw || typeof raw !== 'object') return null
    const data = raw as Record<string, unknown>
    const hours = clampEstimateHours(Number(data.hours))
    const confidence =
      data.confidence === 'high' || data.confidence === 'medium' || data.confidence === 'low'
        ? data.confidence
        : 'medium'
    return {
      hours,
      rationale: String(data.rationale || '').trim() || 'Ajuste da IA sobre a mediana de PRs similares.',
      risks: asStringArray(data.risks),
      confidence,
    }
  } catch {
    return null
  }
}

export async function estimateUnestimatedIssue(input: {
  clientId: string
  tenant: JiraTenantConfig
  issue: JiraIssueView
  repos: RepoConfig[]
}): Promise<EstimateSuggestion> {
  const text = `${input.issue.summary}\n${input.issue.description}\n${input.issue.labels.join(' ')}`
  const keywords = keywordsFromText(text)
  const boards = pickBoardsForIssue(text)

  const [report, githubBundles] = await Promise.all([
    input.repos.length > 0
      ? getDeliveryReport(input.clientId, input.repos, 90, [], { forceRefresh: false }).catch(() => null)
      : Promise.resolve(null),
    Promise.all(
      boards.map(boardId =>
        gatherGithubContextForQuery(
          { clientId: input.clientId, boardId, query: keywords.join(' ') || input.issue.summary },
          input.repos
        )
      )
    ),
  ])

  const similarPrs = pickSimilarPrs(report?.prs ?? [], keywords)
  const avgPrHours = report?.kpis.avgHoursPerPr && report.kpis.avgHoursPerPr > 0 ? report.kpis.avgHoursPerPr : 8
  const baseline = clampEstimateHours(medianHours(similarPrs.map(pr => pr.hours), avgPrHours))

  const snippets = githubBundles.flatMap(bundle => bundle.snippets).slice(0, 8)
  const githubNotes = [...new Set(githubBundles.flatMap(bundle => bundle.notes))]
  const githubContext = [
    `Boards: ${boards.join(', ')}`,
    `Baseline (mediana PRs similares ou média do período): ${baseline}h`,
    ...githubNotes.map(note => `Nota: ${note}`),
    ...snippets.map(
      snippet => `Arquivo ${snippet.repo}:${snippet.path}\n${snippet.excerpt.slice(0, 1200)}`
    ),
  ].join('\n\n')

  const llm = await adjustWithLlm({
    issue: input.issue,
    baselineHours: baseline,
    similarPrs,
    githubContext,
  })

  const hours = llm?.hours ?? baseline
  const rationale =
    llm?.rationale ||
    (similarPrs.length > 0
      ? `Mediana de ${similarPrs.length} PRs similares no GitHub (${similarPrs.map(pr => `${pr.repo}#${pr.number}`).join(', ')}).`
      : `Sem PRs similares claras; usei a média histórica de ${avgPrHours.toFixed(1)}h por PR no período.`)

  return {
    issueKey: input.issue.key,
    hours,
    jiraEstimate: hoursToJiraEstimate(hours, input.tenant.hoursPerDay),
    hoursPerDay: input.tenant.hoursPerDay,
    confidence: llm?.confidence ?? (similarPrs.length >= 3 ? 'medium' : 'low'),
    rationale,
    risks: llm?.risks ?? [],
    boards,
    similarPrs,
    githubNotes,
    source: llm ? 'heuristic+llm' : 'heuristic',
  }
}
