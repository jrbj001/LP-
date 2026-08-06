import type { ClientWorkspace } from '@/lib/client/types'

export const be180Ooh: ClientWorkspace = {
  id: 'be180-ooh',
  slug: 'be180-ooh',
  name: 'Be180 OOH',
  sector: 'Mídia Out-of-Home · OOH',
  tagline:
    'Workspace operacional — projetos, reuniões, documentos e entregas técnicas do engajamento com a PixelPulseLab.',
  status: 'active',
  accent: '#0f766e',
  contacts: [
    { name: 'José Roberto', role: 'Principal Engineer · PixelPulseLab', email: 'hello@pixelpulselab.dev' },
    { name: 'Marco Lúcio', role: 'CEO · PixelPulseLab' },
  ],
  stats: [
    { label: 'Roteiros', value: '3.541' },
    { label: 'Ativos 30d', value: '60' },
    { label: 'Projetos', value: '8' },
  ],
  projects: [
    {
      id: 'colmeia-meus-roteiros',
      name: 'Colmeia · Meus Roteiros',
      pillar: 'Colmeia',
      description:
        'Plataforma de planejamento, simulação e operação de campanhas OOH — produto principal em produção.',
      status: 'active',
      owner: 'PixelPulseLab + Be180',
      priority: 'Alta',
      updatedAt: '05/08/2026',
      tags: ['Produção', 'SaaS', 'Planejamento'],
      href: 'https://app.notion.com/p/37b5615ab27481d48154e1b27f250e01',
    },
    {
      id: 'banco-de-ativos',
      name: 'Banco de Ativos',
      pillar: 'Banco de Ativos',
      description:
        'Camada fundacional de inventário, cadastro e media kit. Prioridade estratégica — ainda incompleta e base para as demais frentes.',
      status: 'active',
      owner: 'PixelPulseLab + Be180',
      priority: 'Alta',
      updatedAt: '04/08/2026',
      tags: ['Fundacional', 'Exibidores', 'Inventário'],
    },
    {
      id: 'image-brand-processing',
      name: 'Image Brand Processing',
      pillar: 'Colmeia',
      description:
        'Pipeline de processamento de imagens e marca conectado ao ecossistema Colmeia.',
      status: 'active',
      owner: 'PixelPulseLab',
      priority: 'Média',
      updatedAt: '05/08/2026',
      tags: ['Repositório', 'Backend'],
    },
    {
      id: 'colmeia-ai-mvp',
      name: 'Colmeia AI · Agente RAG',
      pillar: 'Colmeia',
      description:
        'MVP do Adaptive Layer no vertical Colmeia: assistente contextual com respostas grounded e isolamento por tenant.',
      status: 'discovery',
      owner: 'João + Pedro · PixelPulseLab',
      priority: 'Alta',
      updatedAt: '15/07/2026',
      tags: ['IA', 'MVP', 'Adaptive Layer'],
      href: 'https://app.notion.com/p/39e5615ab27481709661c328ae6e9215',
    },
    {
      id: 'metodologia-cobertura-frequencia',
      name: 'Metodologia · Cobertura e Frequência',
      pillar: 'Colmeia',
      description:
        'Nova iniciativa: documentar e validar cobertura/frequência acumuladas, deflator, sazonalidade e métricas avançadas antes do desenvolvimento.',
      status: 'proposed',
      owner: 'Simone',
      priority: 'Alta',
      updatedAt: '04/08/2026',
      tags: ['Novo', 'Metodologia', 'Mídia'],
    },
    {
      id: 'tendencias-transporte-publico',
      name: 'Tendências · Transporte Público',
      pillar: 'Colmeia',
      description:
        'Nova iniciativa: planejamento de produto para tendências de transporte público na Via Pública.',
      status: 'proposed',
      owner: 'Camila',
      priority: 'Média',
      updatedAt: '04/08/2026',
      tags: ['Novo', 'Produto', 'Via Pública'],
    },
    {
      id: 'ux-redesign-onboarding',
      name: 'UX Redesign + Onboarding de Exibidores',
      pillar: 'Colmeia',
      description:
        'Nova iniciativa: redesign da experiência, personalização por perfil e onboarding hands-on com exibidores para acelerar uploads.',
      status: 'proposed',
      owner: 'Ana · Be180',
      priority: 'Média',
      updatedAt: '04/08/2026',
      tags: ['Novo', 'UX', 'Adoção'],
    },
    {
      id: 'agentes',
      name: 'Agentes',
      pillar: 'Agentes',
      description:
        'Pilar mapeado da plataforma, deliberadamente fora do escopo desta fase. Sem investimento até priorização futura.',
      status: 'deferred',
      owner: 'A definir',
      priority: 'Baixa',
      updatedAt: '04/08/2026',
      tags: ['Adiado', 'Arquitetura'],
    },
  ],
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
    manualEffort: [
      {
        label: 'Migração para Novo Backend',
        hours: 80,
        description:
          'Migração completa da camada de backend para a nova arquitetura. Trabalho de infraestrutura sem commits diretos visíveis no histórico de produto — refatoração interna, reestruturação de serviços e estabilização do ambiente.',
        from: '2026-06-07',
        to: '2026-07-07',
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
        description: 'Acesso ao workspace, rituais e visão geral do engajamento.',
        articles: ['Acesso ao portal', 'Quem participa', 'Rituais de trabalho', 'Próximos passos'],
        badge: 'Essencial',
      },
      {
        id: 'projeto',
        title: 'Projetos',
        description: 'Escopo, entregáveis, timeline e critérios das iniciativas ativas.',
        articles: ['Portfólio atual', 'Entregáveis', 'Timeline', 'Critérios de sucesso'],
        badge: 'Projetos',
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
  meetings: [
    {
      id: 'colmeia-roadmap-2026-08-04',
      title: 'Planejamento do Roadmap do Colmeia',
      date: '2026-08-04T16:31:00-03:00',
      status: 'completed',
      attendees: ['Time Be180', 'PixelPulseLab'],
      summary:
        'Sessão estratégica para mapear os três pilares da plataforma — Colmeia, Banco de Ativos e Agentes — além de pendências e responsáveis. Foram organizadas frentes de metodologia, UX, dados e infraestrutura, com Agentes fora do escopo desta primeira fase.',
      aiContext: `
Sessão estratégica de planejamento do roadmap do Colmeia realizada em 04/08/2026.
Objetivo: mapear pilares, pendências, responsáveis e dependências antes de priorizar soluções e montar o roadmap.

Três pilares da plataforma mapeados:
1. Colmeia — produto principal de planejamento OOH.
2. Banco de Ativos — alimenta os demais componentes e é fundacional.
3. Agentes — pilar reconhecido na arquitetura do produto, mas explicitamente fora do escopo desta primeira fase ("not to be touched in this first phase"). Não deve receber investimento agora; fica registrado para fases futuras.

Frentes do Colmeia nesta fase: Via Pública, Calculadora, Metodologia, UX, Dados e Infraestrutura. O planner é considerado o futuro da plataforma; é necessário evitar investimento excessivo em funcionalidades que serão substituídas.

Banco de Ativos: é fundacional e está incompleto. Há dados de inventário, mas faltam dados cadastrais, doações e PM. Exibidores são os usuários de maior frequência. Materiais e especificações ainda estão dispersos; foi proposta uma tela de upload de media kit. Também são necessários cadastro administrativo de agências, formatos e IPVs, além de melhorias no funil de inventário.

Metodologia: cobertura e frequência acumuladas são prioridade. Também foram discutidos deflator de inventário, cobertura por target, projeção de performance, sazonalidade, frequência por dia/hora, qualificação indoor e segmentação por bairro. Simone deve documentar e validar as metodologias com líderes de mídia antes do desenvolvimento.

UX e onboarding: a experiência atual precisa de redesign substancial e personalização por perfil. Foram propostos explicações contextuais, arquivo de planejamentos por usuário, pesquisa de usabilidade, certificação de onboarding e transparência da memória de cálculo. Ana está validando os manuais para integração à jornada.

Infraestrutura: incluir copiloto de perguntas e respostas com LLM, camada de segurança e logs por usuário, roadmap de APIs com exibidores, otimização dos cálculos e reset de senha de exibidores pelo admin.

Ações acordadas:
- Simone documentar as melhorias metodológicas pendentes.
- Organizar cerimônia com líderes de mídia para validar metodologias.
- Camila avançar o planejamento da funcionalidade de tendências de transporte público.
- Tchelo e José Roberto realizarem sessão focada na terça-feira para encerrar pendências antigas de Via Pública.
- Organizar atividades por responsável, dependências e prioridade para gerar o roadmap atualizado.
- Realizar reunião de continuidade sobre Banco de Ativos.
- Ana concluir a validação final dos manuais.
- Avaliar onboarding prático com exibidores para acelerar uploads de inventário.
- Marta e Mai Fernandes continuarem consolidando especificações de PM.
- Adicionar copiloto LLM, segurança e logs ao backlog de infraestrutura.
- Projetar reset de senha de exibidores pelo admin.
- Melhorar o dashboard administrativo para veículos em análise.
- Adicionar custo por inserção (CPE) à tela de resultados.
      `.trim(),
      href: 'https://app.notion.com/p/3b25615ab274805fbdd3ecec1c43e9d1',
    },
  ],
  documents: [
    {
      id: 'colmeia-usage-2026-08-05',
      title: 'Relatório de Uso do Produto',
      category: 'Produto · Dados de produção',
      description:
        'Adoção, usuários ativos, roteiros e inventário de exibidores — dados consolidados em 05/08/2026.',
      updatedAt: '05/08/2026',
      status: 'available',
      href: 'https://app.notion.com/p/3b35615ab27481159150e2ea3844ca21',
      external: true,
    },
    {
      id: 'colmeia-product-manual',
      title: 'Colmeia — Manual do Produto',
      category: 'Documentação · Produto',
      description:
        'Visão, glossário, personas, fluxos, módulos, Banco de Ativos, integrações e referência técnica.',
      updatedAt: '10/06/2026',
      status: 'available',
      href: 'https://app.notion.com/p/37b5615ab27481d48154e1b27f250e01',
      external: true,
    },
    {
      id: 'colmeia-development-report-2026',
      title: 'Relatório de Desenvolvimento — Jan a Mai 2026',
      category: 'Engenharia · Entregas',
      description:
        'Consolidado de engenharia com 11 épicos, 47 histórias e evolução das principais camadas do produto.',
      updatedAt: '06/05/2026',
      status: 'available',
      href: 'https://app.notion.com/p/3585615ab27481269268dc73ed460d17',
      external: true,
    },
    {
      id: 'colmeia-ai-mvp',
      title: 'MVP Colmeia AI — Agente RAG + Adaptive Layer',
      category: 'Roadmap · Inteligência Artificial',
      description:
        'Plano do primeiro vertical de IA do Colmeia: agente contextual, isolamento por tenant e respostas com fontes.',
      updatedAt: '15/07/2026',
      status: 'available',
      href: 'https://app.notion.com/p/39e5615ab27481709661c328ae6e9215',
      external: true,
    },
  ],
}
