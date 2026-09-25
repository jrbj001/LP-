import type { ClientWorkspace } from '@/lib/client/types'

export const adaptiveLayer: ClientWorkspace = {
  id: 'adaptive-layer',
  slug: 'adaptive-layer',
  name: 'Adaptive Layer™',
  sector: 'AI Operating System',
  tagline:
    'Sistema operacional de IA da empresa — agentes, governança, assessment e rollout nos clientes.',
  status: 'active',
  accent: '#4338ca',
  contacts: [{ name: 'José Roberto', role: 'Principal Engineer', email: 'hello@pixelpulselab.dev' }],
  stats: [
    { label: 'Categoria', value: 'AI OS' },
    { label: 'Assessments', value: 'Ativos' },
  ],
  projects: [
    {
      id: 'adaptive-layer-os',
      name: 'Adaptive Layer™ OS',
      pillar: 'Plataforma',
      description:
        'Camada de agentes, GraphRAG e governança sobre os sistemas que a empresa já usa.',
      status: 'active',
      owner: 'PixelPulseLab',
      priority: 'Alta',
      updatedAt: '15/09/2026',
      tags: ['OS', 'Agentes', 'Governança'],
      boardIds: ['adaptive-layer'],
    },
    {
      id: 'adaptive-layer-devs',
      name: 'Devs · SDK / API / MCP',
      pillar: 'Plataforma',
      description: 'Superfície para desenvolvedores integrar a Adaptive Layer™ ao stack do cliente.',
      status: 'active',
      owner: 'PixelPulseLab',
      priority: 'Alta',
      updatedAt: '15/09/2026',
      tags: ['SDK', 'MCP', 'API'],
      boardIds: ['adaptive-layer'],
    },
    {
      id: 'adaptive-enterprise-assessment',
      name: 'Adaptive Enterprise™',
      pillar: 'Assessment',
      description: 'Metodologia de assessment e executive review — Orfeu, Banana Brasil e próximos.',
      status: 'active',
      owner: 'PixelPulseLab',
      priority: 'Alta',
      updatedAt: '15/09/2026',
      tags: ['Assessment', 'Orfeu', 'Banana Brasil'],
      boardIds: ['adaptive-layer'],
    },
  ],
  documents: [
    {
      id: 'pixel-missions-architecture-roadmap',
      title: 'Pixel — Missions Architecture & Execution Roadmap',
      category: 'Product · Engineering · Roadmap',
      description:
        'Plano de execução do Mission Runtime com arquitetura, lifecycle, contratos e as 26 tasks de Marga, João e Pedro.',
      updatedAt: '25/09/2026',
      status: 'available',
      href: '/missions-architecture-roadmap',
      external: false,
    },
  ],
  docs: {
    eyebrow: 'Adaptive Layer™',
    title: 'Adaptive Layer™',
    titleAccent: 'produto',
    categories: [
      {
        id: 'product-engineering-roadmap',
        title: 'Product & Engineering Roadmap',
        description:
          'Arquitetura e plano de execução compartilhado para Missions, Runtime, Context Engine, Agents e Cadence.',
        articles: [
          'Mission Runtime — Phase 1',
          'First End-to-End Mission',
          'MARGA-01…07',
          'JOAO-01…09',
          'PEDRO-01…10',
        ],
        badge: '26 tasks',
      },
    ],
    supportEmail: 'hello@pixelpulselab.dev',
  },
  delivery: {
    repos: [
      {
        owner: 'jrbj001',
        repo: 'LP-',
        label: 'Adaptive Layer™',
        products: [{ label: 'Adaptive Layer™', pattern: 'adaptive.?layer|assessment' }],
      },
    ],
  },
}
