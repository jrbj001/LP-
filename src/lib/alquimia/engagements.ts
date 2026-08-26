export type SpaceEngagementStatus = 'active' | 'attention' | 'paused' | 'complete'

export interface SpaceEngagement {
  id: string
  name: string
  shortName: string
  sector: string
  challenge: string
  stage: string
  status: SpaceEngagementStatus
  progress: number
  health: string
  lead: string
  next: string
  initiatives: number
}

export const spaceEngagements: SpaceEngagement[] = [
  {
    id: 'orfeu',
    name: 'Café Orfeu',
    shortName: 'Orfeu',
    sector: 'Café especial',
    challenge: 'Construir sistema comercial, expansão EUA, flagship e a camada de IA com a PixelPulseLab.',
    stage: 'Execução',
    status: 'active',
    progress: 58,
    health: 'No ritmo',
    lead: 'Felipe · Alquemia',
    next: 'Arquivo de conteúdos finais · ago 2026',
    initiatives: 10,
  },
]

export const KNOWN_ENGAGEMENT_IDS = new Set(spaceEngagements.map(item => item.id))
export const PARTNER_SPACE_SEGMENTS = new Set([
  'login',
  'metodologia',
  'praticas',
  'templates',
  'agenda',
  'documentos',
])

export function getSpaceEngagement(id: string): SpaceEngagement | undefined {
  return spaceEngagements.find(item => item.id === id)
}

export function engagementHasArchive(id: string): boolean {
  return id === 'orfeu'
}

export function engagementEyebrow(clientId: string, section: string): string {
  return `${getSpaceEngagement(clientId)?.name ?? 'Café Orfeu'} · ${section}`
}
