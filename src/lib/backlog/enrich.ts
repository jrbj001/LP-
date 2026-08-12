import type { RepoConfig } from '@/lib/delivery/types'
import { formatGithubContextForPrompt, gatherGithubContext } from './github-context'
import { asDiagram, asStringArray, callOpenAiJson, codingModel } from './llm'
import type { BacklogBoardId, BacklogCard, BacklogDiagram, GithubRef } from './types'
import { BACKLOG_BOARDS } from './types'

export type EnrichMode = 'story' | 'spec'

export interface StoryEnrichment {
  title: string
  persona: string
  want: string
  soThat: string
  acceptance: string[]
  priority?: 'Alta' | 'Média' | 'Baixa'
  diagram: BacklogDiagram
}

export interface SpecEnrichment {
  title: string
  persona?: string
  want?: string
  soThat?: string
  acceptance: string[]
  context: string
  implementationNotes: string
  filesLikely: string[]
  testPlan: string[]
  risks: string[]
  githubRefs: GithubRef[]
  diagram: BacklogDiagram
}

function boardLabel(boardId: BacklogBoardId): string {
  return BACKLOG_BOARDS.find(b => b.id === boardId)?.productLabel ?? boardId
}

function cardSummary(card: BacklogCard): string {
  return JSON.stringify(
    {
      id: card.id,
      board: boardLabel(card.boardId),
      title: card.title,
      level: card.level,
      column: card.column,
      persona: card.persona,
      want: card.want,
      soThat: card.soThat,
      acceptance: card.acceptance,
      context: card.context,
      phase: card.phase,
      priority: card.priority,
      source: card.source,
    },
    null,
    2
  )
}

function isStoryEnrichment(value: unknown): value is StoryEnrichment {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.title === 'string' &&
    typeof v.persona === 'string' &&
    typeof v.want === 'string' &&
    typeof v.soThat === 'string' &&
    Array.isArray(v.acceptance) &&
    v.acceptance.length > 0 &&
    Boolean(asDiagram(v.diagram))
  )
}

function isSpecEnrichment(value: unknown): value is SpecEnrichment {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.title === 'string' &&
    typeof v.context === 'string' &&
    typeof v.implementationNotes === 'string' &&
    Array.isArray(v.acceptance) &&
    v.acceptance.length > 0 &&
    Array.isArray(v.filesLikely) &&
    Array.isArray(v.testPlan) &&
    Boolean(asDiagram(v.diagram))
  )
}

export async function enrichCardToStory(
  card: BacklogCard,
  repos: RepoConfig[]
): Promise<StoryEnrichment> {
  const gh = await gatherGithubContext(card, repos)
  const system = `Você é um PM técnico sênior da PixelPulseLab, especialista em OOH e no produto Colmeia.
Transforme requisitos brutos em user stories claras em português do Brasil.
Responda APENAS JSON com: title, persona, want, soThat, acceptance (array 3-6 itens testáveis), priority (Alta|Média|Baixa) e diagram.
diagram deve ser um desenho simples da jornada com { title, nodes, edges }; nodes têm { id, label, detail, kind } e edges têm { from, to, label }. Use 3-6 nós e IDs curtos sem espaços.
Não invente integrações inexistentes. Use o contexto de código só como referência.`

  const user = `Card atual:
${cardSummary(card)}

Contexto GitHub:
${formatGithubContextForPrompt(gh)}

Gere a user story.`

  const parsed = await callOpenAiJson(system, user)
  if (!isStoryEnrichment(parsed)) {
    throw new Error('A IA retornou uma user story incompleta.')
  }
  return {
    ...parsed,
    acceptance: asStringArray(parsed.acceptance),
    diagram: asDiagram(parsed.diagram)!,
  }
}

export async function enrichCardToSpec(
  card: BacklogCard,
  repos: RepoConfig[]
): Promise<SpecEnrichment> {
  const gh = await gatherGithubContext(card, repos)
  const system = `Você é um tech lead / staff engineer preparando uma especificação agent-ready para um agente de desenvolvimento.
Produto: Colmeia / Banco de Ativos / Adaptive Layer (Be180 OOH).
Responda APENAS JSON com:
- title
- persona, want, soThat (opcionais se já existirem)
- acceptance: critérios de aceite testáveis (5-10)
- context: resumo do problema e domínio
- implementationNotes: passos concretos de implementação (markdown curto em string)
- filesLikely: paths/arquivos/módulos prováveis
- testPlan: checklist de validação
- risks: riscos técnicos/produto
- githubRefs: array de { repo, path? }
- diagram: desenho da solução com { title, nodes, edges }; nodes têm { id, label, detail, kind: actor|input|process|system|output } e edges têm { from, to, label }. Use 4-8 nós, IDs curtos sem espaços e mostre usuário, UI, API/processamento, dados e resultado.
Escreva em português do Brasil. Seja específico o suficiente para um agente de código executar sem ambiguidade.`

  const user = `Card atual:
${cardSummary(card)}

Contexto GitHub:
${formatGithubContextForPrompt(gh)}

Gere a especificação agent-ready.`

  const parsed = await callOpenAiJson(system, user)
  if (!isSpecEnrichment(parsed)) {
    throw new Error('A IA retornou uma especificação incompleta.')
  }

  const refs = Array.isArray(parsed.githubRefs)
    ? parsed.githubRefs
        .filter((r): r is GithubRef => Boolean(r && typeof r === 'object' && typeof (r as GithubRef).repo === 'string'))
        .map(r => ({
          repo: String(r.repo),
          path: r.path ? String(r.path) : undefined,
          pr: typeof r.pr === 'number' ? r.pr : undefined,
        }))
    : []

  // Completa refs com snippets usados, se a IA não citou.
  for (const s of gh.snippets) {
    if (!refs.some(r => r.repo === s.repo && r.path === s.path)) {
      refs.push({ repo: s.repo, path: s.path, pr: undefined })
    }
  }

  return {
    title: parsed.title,
    persona: parsed.persona,
    want: parsed.want,
    soThat: parsed.soThat,
    acceptance: asStringArray(parsed.acceptance),
    context: parsed.context,
    implementationNotes: parsed.implementationNotes,
    filesLikely: asStringArray(parsed.filesLikely),
    testPlan: asStringArray(parsed.testPlan),
    risks: asStringArray(parsed.risks),
    githubRefs: refs.slice(0, 12),
    diagram: asDiagram(parsed.diagram)!,
  }
}

export function applyStoryEnrichment(card: BacklogCard, enrich: StoryEnrichment): BacklogCard {
  return {
    ...card,
    title: enrich.title,
    persona: enrich.persona,
    want: enrich.want,
    soThat: enrich.soThat,
    acceptance: enrich.acceptance,
    priority: enrich.priority ?? card.priority,
    diagram: enrich.diagram,
    level: 'story',
    column: card.column === 'requirement' ? 'story' : card.column,
    updatedAt: new Date().toISOString(),
  }
}

export function applySpecEnrichment(card: BacklogCard, enrich: SpecEnrichment): BacklogCard {
  return {
    ...card,
    title: enrich.title || card.title,
    persona: enrich.persona ?? card.persona,
    want: enrich.want ?? card.want,
    soThat: enrich.soThat ?? card.soThat,
    acceptance: enrich.acceptance,
    context: enrich.context,
    implementationNotes: enrich.implementationNotes,
    filesLikely: enrich.filesLikely,
    testPlan: enrich.testPlan,
    risks: enrich.risks,
    githubRefs: enrich.githubRefs,
    diagram: enrich.diagram,
    level: 'spec',
    column: card.column === 'requirement' || card.column === 'story' ? 'ready' : card.column,
    updatedAt: new Date().toISOString(),
  }
}

export { codingModel }
