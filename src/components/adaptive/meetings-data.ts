export interface MeetingTask {
  title: string
  owner?: string
  done?: boolean
}

export interface Meeting {
  id: string
  title: string
  /** ISO date or datetime */
  date: string
  duration?: string
  source: 'Read AI' | 'Manual' | 'Outro'
  reportUrl?: string
  attendees: string[]
  synopsis: string
  topics: string[]
  tasks: MeetingTask[]
  clientId: string
}

export const MEETINGS: Meeting[] = [
  {
    id: 'discovery-andre-2026-07-21',
    title: 'Discovery Interview — André Martins (TI)',
    date: '2026-07-21T10:59:00-03:00',
    duration: '~45 min',
    source: 'Read AI',
    reportUrl: 'https://app.notion.com/p/3a45615ab2748026aff1c6ff4e345a19',
    attendees: ['José Roberto', 'André Martins'],
    synopsis:
      'Entrevista de discovery conduzida por José Roberto com André, gestor de TI da Orfeu. Mapeamento de dores (equipe enxuta, dependência Protheus/TOTVS, sobrecarga de projetos, instabilidade de prioridades), projetos prioritários (faturamento B2B automático, camada de IA sobre Protheus, CRM) e alinhamento do modelo Pixel como parceiro embarcado. Findings alimentam o Executive Review e o comitê de priorização quinzenal.',
    topics: [
      'Contexto do assessment e comitê de priorização Orfeu',
      'Dores de TI: equipe enxuta, Alex afastado, SLAs TOTVS lentos',
      'Dependência Protheus — 400+ regras customizadas',
      'Sobrecarga e repriorização constante de projetos',
      'Faturamento B2B automático (prioridade #1)',
      'Camada de IA/NLP sobre Protheus para consultas em linguagem natural',
      'CRM, app de análise sensorial, WMS e conciliação PagBrasil',
      'Modelo Pixel: billing por entrega, portal do cliente, parceiro de longo prazo',
    ],
    tasks: [
      { title: 'Concluir entrevistas restantes com stakeholders Orfeu', owner: 'José Roberto' },
      { title: 'Adicionar André como observador/gestor no portal do cliente', owner: 'José Roberto' },
      {
        title: 'Preparar Executive Review (mapa de oportunidades, quick wins) e compartilhar com André antes da apresentação',
        owner: 'José Roberto',
      },
      { title: 'Selecionar 1–2 projetos piloto para iniciar o engajamento', owner: 'Pixel + André' },
      { title: 'Avaliar viabilidade da camada de IA sobre Protheus', owner: 'PixelPulseLab' },
    ],
    clientId: 'orfeu',
  },
  {
    id: 'kickoff-pixel-2026-07-14',
    title: 'Kickoff projetos Pixel',
    date: '2026-07-14T11:00:00-03:00',
    duration: '~60 min',
    source: 'Read AI',
    reportUrl: undefined,
    attendees: ['Diego', 'José Roberto', 'Equipe Orfeu'],
    synopsis:
      'Discussão sobre o cenário de automação e IA na Orfeu, com proposta de modelo de trabalho para organização de projetos e definição de prioridades. Foco inicial em um projeto de RH e nos problemas de comunicação operacional. Diego apresentou o rápido crescimento da área e a competência do time, apontando lacunas de processo que o Adaptive Assessment™ deve endereçar.',
    topics: [
      'Cenário de automação e IA na Orfeu',
      'Modelo de trabalho e priorização de projetos',
      'Projeto de RH como caso inicial',
      'Comunicação operacional',
      'Crescimento da área e gaps de processo',
    ],
    tasks: [
      { title: 'Disponibilizar workspace Adaptive para stakeholders', owner: 'Diego' },
      { title: 'Stakeholders completarem identificação + assessment', owner: 'Líderes de área' },
      { title: 'Agendar sessões presenciais de 30 min', owner: 'PixelPulseLab' },
      { title: 'Consolidar insights do kickoff no dashboard de acompanhamento', owner: 'PixelPulseLab' },
    ],
    clientId: 'orfeu',
  },
]

export function findMeeting(id: string): Meeting | undefined {
  return MEETINGS.find(m => m.id === id)
}

export function formatMeetingDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
