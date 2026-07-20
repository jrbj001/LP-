import type { ClientWorkspace } from '@/lib/client/types'

export const be180Ooh: ClientWorkspace = {
  id: 'be180-ooh',
  slug: 'be180-ooh',
  name: 'Be180 OOH',
  sector: 'Mídia Out-of-Home · OOH',
  tagline:
    'Workspace do piloto — onboarding, documentação e acompanhamento do engajamento com a PixelPulseLab.',
  status: 'pilot',
  accent: '#0f766e',
  contacts: [
    { name: 'José Roberto', role: 'Principal Engineer · PixelPulseLab', email: 'hello@pixelpulselab.dev' },
    { name: 'Marco Lúcio', role: 'CEO · PixelPulseLab' },
  ],
  stats: [
    { label: 'Status', value: 'Piloto' },
    { label: 'Resposta', value: '< 4h' },
    { label: 'Canal', value: 'Direto' },
  ],
  onboarding: {
    eyebrow: 'Onboarding',
    title: 'Do kickoff ao',
    titleAccent: 'go-live em 5 etapas',
    steps: [
      {
        number: '01',
        title: 'Kickoff & Alinhamento',
        description:
          'Alinhamento de objetivos do piloto, stakeholders, escopo inicial e canal de comunicação dedicado.',
        tools: ['Kickoff', 'Slack', 'Briefing'],
      },
      {
        number: '02',
        title: 'Setup do Workspace',
        description:
          'Acesso à área do cliente, compartilhamento de materiais, ambiente e rituais de trabalho definidos.',
        tools: ['Portal', 'Docs', 'Agenda'],
      },
      {
        number: '03',
        title: 'Primeira Entrega',
        description:
          'Milestone inicial do piloto. Demo, walkthrough e validação com o time Be180 OOH.',
        tools: ['Demo', 'Feedback', 'Ajustes'],
      },
      {
        number: '04',
        title: 'Ciclo de Revisão',
        description:
          'Revisões periódicas, priorização contínua e refinamentos com base no uso real.',
        tools: ['Review', 'Priorização', 'Slack'],
      },
      {
        number: '05',
        title: 'Go-Live',
        description:
          'Entrada em produção do piloto, monitoramento, documentação e handoff operacional.',
        tools: ['Produção', 'Runbook', 'Handoff'],
      },
    ],
  },
  delivery: {
    repos: [
      {
        owner: 'jrbj001',
        repo: 'colmeia---meusroteirosdefault',
        label: 'Colmeia · Meus Roteiros',
        products: [{ label: 'Banco de Ativos', pattern: 'banco[\\s-]*(de[\\s-]*)?ativos?|\\bativos\\b' }],
      },
      {
        owner: 'jrbj001',
        repo: 'image_brand_processing',
        label: 'Image Brand Processing',
      },
    ],
  },
  docs: {
    eyebrow: 'Documentação',
    title: 'Tudo que você precisa',
    titleAccent: 'em um só lugar',
    supportEmail: 'hello@pixelpulselab.dev',
    categories: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Acesso ao workspace, primeiros passos e visão geral do piloto.',
        articles: ['Acesso ao portal', 'Quem participa', 'Rituais do piloto', 'Próximos passos'],
        badge: 'Essencial',
      },
      {
        id: 'projeto',
        title: 'Projeto',
        description: 'Escopo do piloto, entregáveis, timeline e critérios de sucesso.',
        articles: ['Escopo do piloto', 'Entregáveis', 'Timeline', 'Critérios de sucesso'],
        badge: 'Projeto',
      },
      {
        id: 'integracoes',
        title: 'Integrações',
        description: 'Sistemas e canais conectados ao fluxo de trabalho da Be180 OOH.',
        articles: ['Canais de comunicação', 'Fontes de dados', 'Ferramentas do time', 'Pendências'],
        badge: 'Guias',
      },
      {
        id: 'suporte',
        title: 'Suporte',
        description: 'Como pedir ajuda, SLAs de resposta e escalonamento com a PixelPulseLab.',
        articles: ['Abrir um pedido', 'SLAs de resposta', 'Escalonamento', 'Contato direto'],
        badge: 'Suporte',
      },
    ],
  },
}
