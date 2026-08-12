import {
  AS_IS,
  USER_STORIES,
  WORK_PLAN,
  type UserStory,
} from '@/components/client/documents/colmeia-agent-architecture-data'
import { getBacklogBoards } from './boards'
import { type BacklogBoardId, type BacklogCard } from './types'

function nowIso(): string {
  return new Date().toISOString()
}

function boardForStory(story: UserStory): BacklogBoardId {
  const hay = `${story.stageId} ${story.persona} ${story.want} ${story.soThat}`.toLowerCase()
  if (
    story.stageId === 'foundation' ||
    /exibidor|invent[aá]rio|media kit|ipv|ve[ií]culos|cadastro|admin/.test(hay)
  ) {
    if (/agente|briefing|copiloto|layer|orquestra/.test(hay) && story.stageId !== 'foundation') {
      return 'agentes'
    }
    if (story.stageId === 'foundation' || /exibidor|invent|media kit|ipv|ve[ií]culos|cadastro/.test(hay)) {
      return 'banco-ativos'
    }
  }
  if (
    story.stageId === 'layer' ||
    story.stageId === 'entrada' ||
    story.stageId === 'compra' ||
    story.stageId === 'validacao' ||
    story.stageId === 'pos-venda' ||
    /agente|copiloto|layer|briefing|pi\b|comprov/.test(hay)
  ) {
    return 'agentes'
  }
  return 'colmeia'
}

function boardForGap(gap: string): BacklogBoardId {
  const hay = gap.toLowerCase()
  if (/agente|copiloto|llm|layer|guardrail|contrato/.test(hay)) return 'agentes'
  if (/banco de ativos|invent[aá]rio|exibidor|media kit|cadastro|funil|ipv|doaç/.test(hay)) {
    return 'banco-ativos'
  }
  if (/visibil|image|brand/.test(hay)) return 'visibilidade'
  return 'colmeia'
}

function boardForMilestoneDeliverable(milestoneId: string, text: string): BacklogBoardId {
  const hay = text.toLowerCase()
  if (/agente|copiloto|rag|layer|orquestra|guardrail|avaliac/.test(hay)) return 'agentes'
  if (/invent[aá]rio|media kit|exibidor|cadastro|ipv|funil|banco de ativos/.test(hay)) {
    return 'banco-ativos'
  }
  if (milestoneId === 'm1' && /upload|admin|onboarding/.test(hay)) return 'banco-ativos'
  return 'colmeia'
}

function storyTitle(story: UserStory): string {
  return `Como ${story.persona}, quero ${story.want}`
}

/** Seed imutável derivado dos documentos — overrides ficam no store. */
export function buildSeedCards(clientId: string): BacklogCard[] {
  if (clientId !== 'be180-ooh') return []

  const ts = nowIso()
  const cards: BacklogCard[] = []

  for (const story of USER_STORIES) {
    cards.push({
      id: `seed-${story.id}`,
      boardId: boardForStory(story),
      column: 'story',
      title: storyTitle(story),
      level: 'story',
      persona: story.persona,
      want: story.want,
      soThat: story.soThat,
      acceptance: [...story.acceptance],
      phase: story.phase,
      priority: story.phase === 'M1' ? 'Alta' : story.phase === 'M2' ? 'Média' : 'Baixa',
      source: { kind: 'user-story', ref: story.id },
      createdAt: ts,
      updatedAt: ts,
    })
  }

  AS_IS.gaps.forEach((gap, index) => {
    cards.push({
      id: `seed-gap-${index + 1}`,
      boardId: boardForGap(gap),
      column: 'requirement',
      title: gap,
      level: 'raw',
      context: 'Gap identificado no as-is (Arquitetura de Agentes · sessão 04/08).',
      priority: /banco de ativos|invent|agente|infra/i.test(gap) ? 'Alta' : 'Média',
      source: { kind: 'gap', ref: `gap-${index + 1}` },
      createdAt: ts,
      updatedAt: ts,
    })
  })

  for (const milestone of WORK_PLAN) {
    milestone.deliverables.forEach((deliverable, index) => {
      cards.push({
        id: `seed-${milestone.id}-d${index + 1}`,
        boardId: boardForMilestoneDeliverable(milestone.id, deliverable),
        column: 'requirement',
        title: deliverable,
        level: 'raw',
        context: `${milestone.number} · ${milestone.title} — ${milestone.focus}`,
        acceptance: milestone.acceptance.slice(0, 2),
        phase: milestone.number,
        priority: milestone.id === 'm0' || milestone.id === 'm1' ? 'Alta' : 'Média',
        source: { kind: 'milestone', ref: `${milestone.id}:d${index + 1}` },
        createdAt: ts,
        updatedAt: ts,
      })
    })
  }

  // Seed mínimo do board de visibilidade (ainda sem stories formais nos docs).
  cards.push({
    id: 'seed-vis-1',
    boardId: 'visibilidade',
    column: 'requirement',
    title: 'Integrar teste de visibilidade ao fluxo operacional do Colmeia',
    level: 'raw',
    context:
      'Repos: jrbj001/image_brand_processing (backend) e Mavimarmara/digital-branding (frontend).',
    priority: 'Média',
    source: { kind: 'manual', ref: 'visibilidade-seed' },
    createdAt: ts,
    updatedAt: ts,
  })
  cards.push({
    id: 'seed-vis-2',
    boardId: 'visibilidade',
    column: 'requirement',
    title: 'Documentar contrato de API entre frontend e backend do teste de visibilidade',
    level: 'raw',
    priority: 'Média',
    source: { kind: 'manual', ref: 'visibilidade-api' },
    createdAt: ts,
    updatedAt: ts,
  })

  return cards
}

export function listBoards(clientId: string) {
  return getBacklogBoards(clientId)
}
