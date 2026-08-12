import type { BacklogBoard } from './types'

const BE180_BOARDS: BacklogBoard[] = [
  {
    id: 'colmeia',
    title: 'Colmeia · Meus Roteiros',
    description: 'Planner, metodologia, resultados e jornada do roteiro OOH.',
    productLabel: 'Colmeia · Meus Roteiros',
  },
  {
    id: 'banco-ativos',
    title: 'Banco de Ativos',
    description: 'Inventário, exibidores, media kit, cadastros e funil de aprovação.',
    productLabel: 'Banco de Ativos',
  },
  {
    id: 'agentes',
    title: 'Agentes / Adaptive Layer™',
    description: 'Copiloto, agentes da jornada e contratos da Adaptive Layer™.',
    productLabel: 'Agentes · Adaptive Layer™',
  },
  {
    id: 'visibilidade',
    title: 'Teste de Visibilidade',
    description: 'Frontend e backend do teste de visibilidade / image brand processing.',
    productLabel: 'Teste de Visibilidade',
  },
]

const LIKEME_BOARDS: BacklogBoard[] = [
  {
    id: 'likeme-landing',
    title: 'Landing',
    description: 'Landing pública, aquisição, cadastro e comunicação inicial.',
    productLabel: 'Landing · Like:Me',
  },
  {
    id: 'likeme-app',
    title: 'App Frontend',
    description: 'Experiência autenticada, marketplace, comunidade e jornadas de saúde.',
    productLabel: 'App Frontend · Like:Me',
  },
  {
    id: 'likeme-backend',
    title: 'Backend / API',
    description: 'Domínio, APIs, dados e integrações do produto Like:Me.',
    productLabel: 'Backend / API · Like:Me',
  },
]

export function getBacklogBoards(clientId: string): BacklogBoard[] {
  if (clientId === 'be180-ooh') return BE180_BOARDS
  if (clientId === 'likeme') return LIKEME_BOARDS
  return []
}
