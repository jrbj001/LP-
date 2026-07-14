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
