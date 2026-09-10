import type { BacklogBoard } from './types'

const BE180_BOARDS: BacklogBoard[] = [
  {
    id: 'colmeia',
    title: 'Colmeia · Meus Roteiros',
    description: 'Planner, metodologia, resultados e jornada do roteiro OOH.',
    productLabel: 'Colmeia · Meus Roteiros',
    projectIds: ['colmeia-meus-roteiros', 'metodologia-cobertura-frequencia', 'tendencias-transporte-publico', 'ux-redesign-onboarding'],
    repository: 'jrbj001/colmeia---meusroteirosdefault',
  },
  {
    id: 'banco-ativos',
    title: 'Banco de Ativos',
    description: 'Inventário, exibidores, media kit, cadastros e funil de aprovação.',
    productLabel: 'Banco de Ativos',
    projectIds: ['banco-de-ativos'],
    repository: 'jrbj001/colmeia---meusroteirosdefault',
  },
  {
    id: 'agentes',
    title: 'Agentes / Adaptive Layer™',
    description: 'Copiloto, agentes da jornada e contratos da Adaptive Layer™.',
    productLabel: 'Agentes · Adaptive Layer™',
    projectIds: ['colmeia-ai-mvp', 'agentes'],
    repository: 'jrbj001/colmeia---meusroteirosdefault',
  },
  {
    id: 'visibilidade',
    title: 'Teste de Visibilidade',
    description: 'Frontend e backend do teste de visibilidade / image brand processing.',
    productLabel: 'Teste de Visibilidade',
    projectIds: ['image-brand-processing'],
    repository: 'jrbj001/image_brand_processing',
    repositories: ['Mavimarmara/digital-branding'],
  },
  {
    id: 'cadence',
    title: 'Cadence · WhatsApp',
    description: 'Canal WhatsApp Pixelpulselab.dev ligado a Colmeia, Banco de Ativos e Teste de Visibilidade.',
    productLabel: 'Cadence · WhatsApp',
    projectIds: ['colmeia-meus-roteiros', 'banco-de-ativos', 'image-brand-processing'],
    repository: 'jrbj001/colmeia---meusroteirosdefault',
    repositories: ['jrbj001/image_brand_processing', 'Mavimarmara/digital-branding'],
  },
]

export const BE180_WHATSAPP_BOARD_IDS: BacklogBoard['id'][] = ['colmeia', 'banco-ativos', 'visibilidade']

const LIKEME_BOARDS: BacklogBoard[] = [
  {
    id: 'likeme-landing',
    title: 'Landing',
    description: 'Landing pública, aquisição, cadastro e comunicação inicial.',
    productLabel: 'Landing · Like:Me',
    projectIds: ['likeme-landing', 'likeme-newsletter'],
    repository: 'jrbj001/LP-LikeMe',
  },
  {
    id: 'likeme-app',
    title: 'App Frontend',
    description: 'Experiência autenticada, marketplace, comunidade e jornadas de saúde.',
    productLabel: 'App Frontend · Like:Me',
    projectIds: ['likeme-front-end'],
    repository: 'PixelPulseLab/likeme-front-end',
  },
  {
    id: 'likeme-backend',
    title: 'Backend / API',
    description: 'Domínio, APIs, dados e integrações do produto Like:Me.',
    productLabel: 'Backend / API · Like:Me',
    projectIds: ['likeme-backend'],
    repository: 'PixelPulseLab/likeme-back-end',
  },
]

const CADENCE_BOARDS: BacklogBoard[] = [
  {
    id: 'cadence',
    title: 'Cadence',
    description: 'Canal WhatsApp e copiloto interno da PixelPulseLab.',
    productLabel: 'Cadence · PixelPulseLab',
    projectIds: ['cadence-platform'],
    repository: 'jrbj001/LP-',
  },
]

export function getBacklogBoards(clientId: string): BacklogBoard[] {
  if (clientId === 'be180-ooh') return BE180_BOARDS
  if (clientId === 'likeme') return LIKEME_BOARDS
  if (clientId === 'pixelpulselab') return CADENCE_BOARDS
  return []
}
