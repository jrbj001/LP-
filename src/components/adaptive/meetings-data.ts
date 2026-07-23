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
    id: 'discovery-ricardo-2026-07-22',
    title: 'Discovery Interview — Ricardo Madureira (CEO)',
    date: '2026-07-22T11:30:00-03:00',
    duration: '~45 min',
    source: 'Read AI',
    reportUrl: 'https://app.notion.com/p/3a55615ab27480ab9450dd1cd527dbb6',
    attendees: ['José Roberto', 'Ricardo Madureira'],
    synopsis:
      'Sessão de discovery com Ricardo Madureira, CEO e sponsor executivo da Orfeu. Visão estratégica de escalar nacionalmente mantendo posicionamento premium, dores comerciais (jornada B2B HORECA, ausência de CRM, automações de vendas que falharam), preocupação com segurança da informação e alinhamento com o modelo Pixel de entregas transparentes. Findings alimentam o plano consolidado e o Executive Review agendado para 31/07.',
    topics: [
      'Visão CEO: escalar produção e vendas no Brasil mantendo propósito e qualidade premium',
      'Lacunas comercial/logística: jornada B2B HORECA e varejo com etapas quebradas',
      'Ausência de CRM unificado e falhas em duas tentativas de automação mobile de pedidos',
      'Stakeholders faltantes: Augusto Kraft (Comercial) e Priscila (Supermercados)',
      'Demo do portal Pixel: transparência de entregas, KPIs e análise por IA',
      'Quick wins: portal B2B, integrações Protheus e conciliação PagBrasil',
      'Segurança da informação como pilar dedicado — vulnerabilidade reconhecida pelo CEO',
      'CRM e ERP tradicionais vs. abordagem AI-native; visão de construir digital do zero',
      'Plano consolidado e proposta comercial até fim da semana seguinte',
      'Review agendado para sexta 31/07 às 14h',
    ],
    tasks: [
      { title: 'Concluir assessments restantes com Cris, Lucas e Rafaela', owner: 'José Roberto' },
      { title: 'Incluir Augusto Kraft (Diretor Comercial) e Priscila (Supermercados) no assessment', owner: 'Diego' },
      { title: 'Entregar preview faseado e quick wins a partir da semana seguinte', owner: 'PixelPulseLab' },
      {
        title: 'Preparar plano completo com esforço, horas e proposta comercial até fim da semana',
        owner: 'José Roberto',
      },
      { title: 'Bloquear agenda para review do plano em 31/07 às 14h', owner: 'José Roberto + Ricardo' },
      { title: 'Incluir segurança da informação como pilar em todas as camadas de implementação', owner: 'PixelPulseLab' },
    ],
    clientId: 'orfeu',
  },
  {
    id: 'discovery-gustavo-2026-07-22',
    title: 'Discovery Interview — Gustavo (Indústria/SOP)',
    date: '2026-07-22T08:00:00-03:00',
    duration: '~45 min',
    source: 'Read AI',
    reportUrl: 'https://app.notion.com/p/3a55615ab27481968cfef7105e507769',
    attendees: ['José Roberto', 'Gustavo'],
    synopsis:
      'Entrevista de discovery com Gustavo, Diretor de Operações da Orfeu (~1,5 ano), responsável por beneficiamento, produção, qualidade, manutenção, PCP e logística. Mapeamento de sistemas descentralizados (TOTVS, Traction, MES, WMS), transição desigual para Indústria 4.0, escassez de recursos de TI e frustração com velocidade de execução. Alinhamento com abordagem Pixel de camada de infraestrutura e assessment gratuito.',
    topics: [
      'Papel de Gustavo: cadeia completa de operações (beneficiamento → logística)',
      'Stack atual: TOTVS (ERP), Traction (sensores), MES, WMS recente — sistemas não integrados',
      'Indústria 4.0 desigual: fábrica/refino avançados, beneficiamento em transição 1.0→2.0',
      'BIs descentralizados por área sem integração — visibilidade fragmentada',
      'Recursos de TI escassos e execução lenta apesar de bons planos e roadmaps',
      'Visão: referência em Indústria 4.0 com camada tecnológica robusta',
      'Interesse em agente de IA conectado ao ERP para consultas operacionais em tempo real',
      'Abordagem Pixel: camada de infraestrutura de dados antes de projetos isolados',
      'Assessment gratuito: quick wins, oportunidades de IA, recomendações executivas, Adaptive Index',
      'Modelo de entrega: só conta como entregue quando está em produção e em uso',
    ],
    tasks: [
      { title: 'Conduzir assessment gratuito e entregar resultados a Gustavo e demais gestores', owner: 'PixelPulseLab' },
      { title: 'Gustavo apoiar e facilitar o processo de assessment', owner: 'Gustavo' },
      { title: 'Visitar fazendas Orfeu se o engajamento avançar', owner: 'José Roberto' },
    ],
    clientId: 'orfeu',
  },
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
