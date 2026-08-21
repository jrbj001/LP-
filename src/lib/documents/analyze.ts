import { createHash } from 'crypto'
import type { ClientWorkspace } from '@/lib/client/types'
import { getBacklogBoards } from '@/lib/backlog/boards'
import {
  formatGithubContextForPrompt,
  gatherGithubContextForQuery,
  keywordsFromText,
  type GithubContextBundle,
} from '@/lib/backlog/github-context'
import { asDiagram, asStringArray, callOpenAiJson } from '@/lib/backlog/llm'
import type { BacklogBoardId } from '@/lib/backlog/types'
import {
  normalizeDraftTitle,
  type ArchitectureArtifact,
  type ArchitectureComponent,
  type ClientDocumentRecord,
  type DocumentArtifacts,
  type DocumentBacklogDraft,
  type DocumentDraftMode,
  type WorkPlanArtifact,
  type WorkPlanMilestone,
} from './types'

const PRIORITIES = new Set(['Alta', 'Média', 'Baixa'])

/** Trecho do documento levado a cada prompt — o texto completo estoura o contexto. */
const PROMPT_EXCERPT_CHARS = 24_000

function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : ''
}

function documentExcerpt(document: ClientDocumentRecord): string {
  const text = document.extraction?.text ?? ''
  if (!text) throw new Error('Este documento ainda não foi extraído.')
  if (text.length <= PROMPT_EXCERPT_CHARS) return text
  // Início e fim costumam concentrar objetivo e conclusões.
  const head = text.slice(0, Math.floor(PROMPT_EXCERPT_CHARS * 0.7))
  const tail = text.slice(-Math.floor(PROMPT_EXCERPT_CHARS * 0.3))
  return `${head}\n\n[...trecho intermediário omitido...]\n\n${tail}`
}

function sourceHeader(client: ClientWorkspace, document: ClientDocumentRecord): string {
  return [
    `Cliente: ${client.name} (${client.sector})`,
    `Documento: ${document.title}`,
    `Arquivo: ${document.fileName} · formato ${document.kind}`,
    document.extraction?.sheets?.length ? `Abas: ${document.extraction.sheets.join(', ')}` : '',
    document.extraction?.pages ? `Páginas: ${document.extraction.pages}` : '',
    document.extraction?.truncated ? 'Atenção: o conteúdo foi truncado por tamanho.' : '',
    document.sourceUrl ? `Origem: ${document.sourceUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

const GROUNDING_RULE = `Use somente fatos presentes no documento e nos trechos de código fornecidos.
Não invente escopo, integrações, prazos, responsáveis ou métricas. Quando algo não estiver no material, omita em vez de supor.
Responda em português do Brasil.`

export async function gatherDocumentGithubContext(
  client: ClientWorkspace,
  document: ClientDocumentRecord,
  boardId: BacklogBoardId
): Promise<GithubContextBundle> {
  const repos = client.delivery?.repos ?? []
  if (repos.length === 0) {
    return { repos: [], snippets: [], notes: ['Cliente sem repositórios configurados.'] }
  }
  const query = [document.title, ...keywordsFromText(document.extraction?.text ?? '')].join(' ')
  return gatherGithubContextForQuery({ clientId: client.slug, boardId, query }, repos)
}

// ─── Plano de trabalho ────────────────────────────────────────────────────────

export function parseWorkPlan(value: unknown): WorkPlanArtifact {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou um plano inválido.')
  const raw = value as Record<string, unknown>
  const title = cleanString(raw.title, 160)
  const summary = cleanString(raw.summary, 900)
  if (!title || !summary) throw new Error('O plano veio sem título ou resumo.')

  const rawMilestones = Array.isArray(raw.milestones) ? raw.milestones : []
  const milestones: WorkPlanMilestone[] = rawMilestones
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item, index) => ({
      id: `m${index}`,
      title: cleanString(item.title, 160),
      objective: cleanString(item.objective, 600),
      window: cleanString(item.window, 60) || undefined,
      deliverables: asStringArray(item.deliverables).map(v => cleanString(v, 300)).filter(Boolean).slice(0, 8),
      acceptanceCriteria: asStringArray(item.acceptanceCriteria)
        .map(v => cleanString(v, 300))
        .filter(Boolean)
        .slice(0, 8),
    }))
    .filter(m => m.title && m.objective && m.deliverables.length > 0)
    .slice(0, 8)

  if (milestones.length === 0) throw new Error('O plano veio sem milestones utilizáveis.')

  return {
    title,
    summary,
    milestones,
    risks: asStringArray(raw.risks).map(v => cleanString(v, 300)).filter(Boolean).slice(0, 6),
    generatedAt: new Date().toISOString(),
  }
}

export async function generateWorkPlan(
  client: ClientWorkspace,
  document: ClientDocumentRecord,
  github: GithubContextBundle
): Promise<WorkPlanArtifact> {
  const parsed = await callOpenAiJson(
    `Você é um tech lead que transforma documentos de clientes em planos de trabalho executáveis.
${GROUNDING_RULE}
Retorne apenas JSON: {"title":"...","summary":"...","milestones":[{"title":"...","objective":"...","window":"opcional","deliverables":["..."],"acceptanceCriteria":["critério observável"]}],"risks":["..."]}
Use de 3 a 6 milestones em sequência lógica, cada um com entregáveis concretos e critérios de aceite verificáveis.`,
    `${sourceHeader(client, document)}

Contexto do repositório (use para ancorar entregáveis em código real):
${formatGithubContextForPrompt(github)}

Conteúdo do documento:
${documentExcerpt(document)}`,
    { temperature: 0.15, maxTokens: 2600 }
  )
  return parseWorkPlan(parsed)
}

// ─── Documento de arquitetura ─────────────────────────────────────────────────

export function parseArchitecture(value: unknown): ArchitectureArtifact {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou uma arquitetura inválida.')
  const raw = value as Record<string, unknown>
  const title = cleanString(raw.title, 160)
  const overview = cleanString(raw.overview, 1200)
  if (!title || !overview) throw new Error('A arquitetura veio sem título ou visão geral.')

  const rawComponents = Array.isArray(raw.components) ? raw.components : []
  const components: ArchitectureComponent[] = rawComponents
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map(item => ({
      name: cleanString(item.name, 120),
      responsibility: cleanString(item.responsibility, 500),
      touchpoints: asStringArray(item.touchpoints).map(v => cleanString(v, 200)).filter(Boolean).slice(0, 6),
    }))
    .filter(component => component.name && component.responsibility)
    .slice(0, 10)

  if (components.length === 0) throw new Error('A arquitetura veio sem componentes.')

  return {
    title,
    overview,
    components,
    integrations: asStringArray(raw.integrations).map(v => cleanString(v, 240)).filter(Boolean).slice(0, 8),
    decisions: asStringArray(raw.decisions).map(v => cleanString(v, 300)).filter(Boolean).slice(0, 8),
    risks: asStringArray(raw.risks).map(v => cleanString(v, 300)).filter(Boolean).slice(0, 6),
    diagram: asDiagram(raw.diagram) ?? undefined,
    generatedAt: new Date().toISOString(),
  }
}

export async function generateArchitecture(
  client: ClientWorkspace,
  document: ClientDocumentRecord,
  github: GithubContextBundle
): Promise<ArchitectureArtifact> {
  const parsed = await callOpenAiJson(
    `Você é um arquiteto de software documentando a solução descrita por um documento do cliente.
${GROUNDING_RULE}
Cite arquivos e repositórios reais em "touchpoints" quando os trechos de código permitirem.
Retorne apenas JSON: {"title":"...","overview":"...","components":[{"name":"...","responsibility":"...","touchpoints":["owner/repo:caminho"]}],"integrations":["..."],"decisions":["decisão e o porquê"],"risks":["..."],"diagram":{"title":"...","nodes":[{"id":"n1","label":"...","detail":"opcional","kind":"actor|input|process|system|output"}],"edges":[{"from":"n1","to":"n2","label":"opcional"}]}}
O diagrama deve ter de 3 a 8 nós representando o fluxo principal.`,
    `${sourceHeader(client, document)}

Contexto do repositório:
${formatGithubContextForPrompt(github)}

Conteúdo do documento:
${documentExcerpt(document)}`,
    { temperature: 0.15, maxTokens: 2800 }
  )
  return parseArchitecture(parsed)
}

// ─── Requisitos e user stories ────────────────────────────────────────────────

export function documentDraftId(documentId: string, title: string): string {
  return `document-draft-${createHash('sha256')
    .update(`${documentId}:${normalizeDraftTitle(title)}`)
    .digest('hex')
    .slice(0, 16)}`
}

export function parseDrafts(
  value: unknown,
  clientId: string,
  documentId: string
): Omit<DocumentBacklogDraft, 'alreadyExported'>[] {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou um formato inválido.')
  const rawDrafts = (value as { drafts?: unknown }).drafts
  if (!Array.isArray(rawDrafts) || rawDrafts.length < 1) {
    throw new Error('A IA não retornou itens de backlog.')
  }

  const boardIds = new Set(getBacklogBoards(clientId).map(board => board.id))
  const seen = new Set<string>()
  const drafts: Omit<DocumentBacklogDraft, 'alreadyExported'>[] = []

  for (const item of rawDrafts.slice(0, 12)) {
    if (!item || typeof item !== 'object') continue
    const raw = item as Record<string, unknown>
    const title = cleanString(raw.title, 180)
    const context = cleanString(raw.context, 500)
    const boardId = cleanString(raw.boardId, 80) as BacklogBoardId
    const priority = cleanString(raw.priority, 10)
    const mode: DocumentDraftMode = raw.mode === 'story' ? 'story' : 'requirement'
    const normalized = normalizeDraftTitle(title)

    if (title.length < 4 || !normalized || seen.has(normalized)) continue
    if (!boardIds.has(boardId) || !PRIORITIES.has(priority) || context.length < 4) continue

    const base = {
      id: documentDraftId(documentId, title),
      mode,
      boardId,
      title,
      priority: priority as DocumentBacklogDraft['priority'],
      context,
    }

    if (mode === 'requirement') {
      seen.add(normalized)
      drafts.push(base)
      continue
    }

    const persona = cleanString(raw.persona, 120)
    const want = cleanString(raw.want, 300)
    const soThat = cleanString(raw.soThat, 300)
    const acceptance = asStringArray(raw.acceptance).map(v => cleanString(v, 300)).filter(Boolean).slice(0, 8)
    // Story incompleta rebaixa para requisito em vez de descartar o item.
    if (!persona || !want || !soThat || acceptance.length === 0) {
      seen.add(normalized)
      drafts.push({ ...base, mode: 'requirement' })
      continue
    }

    seen.add(normalized)
    drafts.push({ ...base, persona, want, soThat, acceptance })
  }

  if (drafts.length === 0) throw new Error('Nenhum item de backlog válido foi produzido.')
  return drafts
}

export async function generateDocumentBacklogDrafts(
  client: ClientWorkspace,
  document: ClientDocumentRecord,
  github: GithubContextBundle
): Promise<Omit<DocumentBacklogDraft, 'alreadyExported'>[]> {
  const boards = getBacklogBoards(client.slug)
  const boardList = boards
    .map(board => `- ${board.id}: ${board.title} — ${board.description}`)
    .join('\n')

  const parsed = await callOpenAiJson(
    `Você é um product manager sênior que converte documentos em itens de backlog revisáveis.
${GROUNDING_RULE}
Retorne apenas JSON: {"drafts":[{"mode":"requirement|story","boardId":"ID válido","title":"...","priority":"Alta|Média|Baixa","context":"origem rastreável no documento","persona":"só para story","want":"só para story","soThat":"só para story","acceptance":["critério testável, só para story"]}]}
Produza de 4 a 10 itens sem duplicatas. Use "story" quando o documento deixar claro persona, objetivo e critérios; caso contrário use "requirement".`,
    `${sourceHeader(client, document)}

Boards válidos (use somente estes IDs):
${boardList}

Contexto do repositório:
${formatGithubContextForPrompt(github)}

Conteúdo do documento:
${documentExcerpt(document)}`,
    { temperature: 0.1, maxTokens: 3000 }
  )

  return parseDrafts(parsed, client.slug, document.id)
}

// ─── Orquestração ─────────────────────────────────────────────────────────────

export interface AnalyzeResult {
  artifacts: DocumentArtifacts
  /** Etapas que falharam sem interromper as demais. */
  failures: string[]
  githubRepos: string[]
}

/**
 * Roda as três gerações de forma independente: uma falha de LLM em qualquer
 * artefato não deve descartar os que funcionaram.
 */
export async function analyzeDocument(
  client: ClientWorkspace,
  document: ClientDocumentRecord,
  boardId: BacklogBoardId
): Promise<AnalyzeResult> {
  const github = await gatherDocumentGithubContext(client, document, boardId)

  const [workPlan, architecture, drafts] = await Promise.allSettled([
    generateWorkPlan(client, document, github),
    generateArchitecture(client, document, github),
    generateDocumentBacklogDrafts(client, document, github),
  ])

  const failures: string[] = []
  if (workPlan.status === 'rejected') failures.push(`Plano de trabalho: ${reasonOf(workPlan.reason)}`)
  if (architecture.status === 'rejected') failures.push(`Arquitetura: ${reasonOf(architecture.reason)}`)
  if (drafts.status === 'rejected') failures.push(`Backlog: ${reasonOf(drafts.reason)}`)

  if (failures.length === 3) throw new Error(failures.join(' · '))

  return {
    artifacts: {
      workPlan: workPlan.status === 'fulfilled' ? workPlan.value : undefined,
      architecture: architecture.status === 'fulfilled' ? architecture.value : undefined,
      backlogDrafts: drafts.status === 'fulfilled' ? drafts.value : undefined,
      generatedAt: new Date().toISOString(),
    },
    failures,
    githubRepos: github.repos,
  }
}

function reasonOf(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'erro desconhecido'
}
