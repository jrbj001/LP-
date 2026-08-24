import type { ClientWorkspace } from '@/lib/client/types'
import { LIKEME_MEETINGS } from '@/components/client/tenants/likeme-meetings'

/**
 * Workspace Like:Me — replica da área do cliente Be180,
 * conectada aos repositórios de landing, app frontend e backend.
 *
 * Repos:
 * - https://github.com/jrbj001/LP-LikeMe
 * - https://github.com/PixelPulseLab/likeme-front-end
 * - https://github.com/PixelPulseLab/likeme-back-end
 */
export const likeMe: ClientWorkspace = {
  id: 'likeme',
  slug: 'likeme',
  name: 'Like:Me',
  sector: 'Saúde · Marketplace · Comunidade',
  tagline:
    'Workspace operacional — app, landing, backend, reuniões e documentos do engajamento Like:Me com a PixelPulseLab.',
  status: 'pilot',
  accent: '#be123c',
  contacts: [
    { name: 'José Roberto', role: 'Principal Engineer · PixelPulseLab', email: 'hello@pixelpulselab.dev' },
    { name: 'Marco Lúcio', role: 'CEO · PixelPulseLab' },
    {
      name: 'Fabrício Guimarães',
      role: 'Like:Me',
      email: 'fabricio.guimaraes@likeme.global',
    },
  ],
  stats: [
    { label: 'Repos', value: '3' },
    { label: 'Reuniões', value: String(LIKEME_MEETINGS.length) },
    { label: 'Documentos', value: '9' },
  ],
  projects: [
    {
      id: 'likeme-landing',
      name: 'Landing Page · Like:Me',
      pillar: 'Frontend',
      description:
        'Landing pública (Vite + Vercel) com cadastro/newsletter via SendGrid Dynamic Template e assets de marca.',
      status: 'active',
      owner: 'PixelPulseLab + Like:Me',
      priority: 'Alta',
      updatedAt: '12/08/2026',
      tags: ['Landing', 'Vite', 'SendGrid', 'Vercel'],
      boardIds: ['likeme-landing'],
      href: 'https://github.com/jrbj001/LP-LikeMe',
    },
    {
      id: 'likeme-front-end',
      name: 'App Frontend · Like:Me',
      pillar: 'Frontend',
      description:
        'Aplicação frontend do produto Like:Me — experiência autenticada e fluxos principais do marketplace/comunidade.',
      status: 'active',
      owner: 'PixelPulseLab + Like:Me',
      priority: 'Alta',
      updatedAt: '12/08/2026',
      tags: ['App', 'Frontend', 'Produto'],
      boardIds: ['likeme-app'],
      href: 'https://github.com/PixelPulseLab/likeme-front-end',
    },
    {
      id: 'likeme-backend',
      name: 'Backend · Like:Me API',
      pillar: 'Backend',
      description:
        'API e serviços de backend do produto Like:Me — autenticação, domínio de negócio e integrações.',
      status: 'active',
      owner: 'PixelPulseLab + Like:Me',
      priority: 'Alta',
      updatedAt: '12/08/2026',
      tags: ['API', 'Backend', 'Produto'],
      boardIds: ['likeme-backend'],
      href: 'https://github.com/PixelPulseLab/likeme-back-end',
    },
    {
      id: 'likeme-newsletter',
      name: 'Newsletter & Onboarding por e-mail',
      pillar: 'Growth',
      description:
        'Fluxo de cadastro na landing com template SendGrid de boas-vindas e lista de marketing contacts.',
      status: 'active',
      owner: 'PixelPulseLab',
      priority: 'Média',
      updatedAt: '12/08/2026',
      tags: ['SendGrid', 'Growth', 'Onboarding'],
      boardIds: ['likeme-landing'],
    },
  ],
  delivery: {
    repos: [
      {
        owner: 'jrbj001',
        repo: 'LP-LikeMe',
        label: 'Landing Page · Like:Me',
        products: [
          {
            label: 'Newsletter / SendGrid',
            pattern: 'newsletter|sendgrid|cadastro|welcome|template',
          },
        ],
      },
      {
        owner: 'PixelPulseLab',
        repo: 'likeme-front-end',
        label: 'App Frontend · Like:Me',
      },
      {
        owner: 'PixelPulseLab',
        repo: 'likeme-back-end',
        label: 'Backend · Like:Me API',
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
        description: 'Acesso ao workspace, rituais e visão geral do engajamento Like:Me.',
        articles: ['Acesso ao portal', 'Quem participa', 'Rituais de trabalho', 'Próximos passos'],
        badge: 'Essencial',
      },
      {
        id: 'projeto',
        title: 'Projetos',
        description: 'Escopo, entregáveis e critérios das frentes Landing, App e Backend.',
        articles: [
          'Portfólio atual',
          'Piloto Tabia Health',
          'Migração Social Plus',
          'App Frontend',
          'Backend API',
          'Critérios de sucesso',
        ],
        badge: 'Projetos',
      },
      {
        id: 'integracoes',
        title: 'Integrações',
        description: 'Sistemas e canais conectados ao fluxo Like:Me.',
        articles: ['Tabia Health', 'Pagar.me', 'Social Plus / Amity', 'SendGrid', 'Auth0', 'GitHub'],
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
  meetings: LIKEME_MEETINGS,
  documents: [
    {
      id: 'likeme-arquitetura-adaptive-layer',
      title: 'Arquitetura do Produto — Adaptive Layer™ & Agentes',
      category: 'Arquitetura · IA · Plataforma',
      description:
        'Estudo técnico-executivo do estado atual e da arquitetura-alvo: Adaptive Layer, squad de agentes, guardrails e roadmap de adoção.',
      updatedAt: '21/08/2026',
      status: 'available',
      href: '/arquitetura-de-agentes',
      external: false,
    },
    {
      id: 'likeme-tabia-piloto',
      title: 'Piloto — Integração Tabia Health no Backend',
      category: 'Arquitetura · Integrações · Saúde',
      description:
        'Plano do piloto de 8 semanas: Like:Me mantém app, auth, pagamento e comunidade; Tabia orquestra care pathways pós-assinatura ACTIVE.',
      updatedAt: '30/07/2026',
      status: 'available',
      href: 'https://app.notion.com/p/3ad5615ab274815096edf0c29e9d1dfe',
      external: true,
    },
    {
      id: 'likeme-social-plus-migration',
      title: 'Migração Social Plus In-House — Arquitetura',
      category: 'Arquitetura · Backend · Comunidade',
      description:
        'Plano faseado para eliminar Amity/Social Plus mantendo os mesmos paths HTTP no front, com persistência própria em PostgreSQL.',
      updatedAt: '17/06/2026',
      status: 'available',
      href: 'https://app.notion.com/p/3825615ab27481458d1ee99d746a646e',
      external: true,
    },
    {
      id: 'likeme-backlog-estimate-2026-04',
      title: 'Estimativa de Backlog — LikeMe App (Abr 2026)',
      category: 'Produto · Planejamento · Frontend',
      description:
        'Estimativas de tickets (pagamento recorrente, afiliados, vouchers, perfil, force update) — 38–55 dias com 1 senior ou 24–34 com 2.',
      updatedAt: '27/04/2026',
      status: 'available',
      href: 'https://app.notion.com/p/34f5615ab274817ba217d9e03b81b28a',
      external: true,
    },
    {
      id: 'likeme-features',
      title: 'LikeMe — Features & Visões de Produto',
      category: 'Produto · Roadmap',
      description:
        'Hub de features/valores, visões (usuário, negócio, técnica) e marcos MLP / Launch 1 / Launch 2.',
      updatedAt: '06/10/2025',
      status: 'available',
      href: 'https://app.notion.com/p/2725615ab27480b48c49ff3eecaa4043',
      external: true,
    },
    {
      id: 'likeme-landing-repo',
      title: 'Repositório · Landing Page',
      category: 'Engenharia · Frontend',
      description:
        'Código-fonte da landing Like:Me (Vite, Vercel, newsletter SendGrid). Fonte das entregas de landing.',
      updatedAt: '12/08/2026',
      status: 'available',
      href: 'https://github.com/jrbj001/LP-LikeMe',
      external: true,
    },
    {
      id: 'likeme-front-end-repo',
      title: 'Repositório · App Frontend',
      category: 'Engenharia · Frontend',
      description:
        'Código-fonte do app frontend Like:Me. Fonte das entregas da experiência autenticada.',
      updatedAt: '12/08/2026',
      status: 'available',
      href: 'https://github.com/PixelPulseLab/likeme-front-end',
      external: true,
    },
    {
      id: 'likeme-backend-repo',
      title: 'Repositório · Backend API',
      category: 'Engenharia · Backend',
      description:
        'Código-fonte do backend Like:Me. Fonte das entregas de API e serviços.',
      updatedAt: '12/08/2026',
      status: 'available',
      href: 'https://github.com/PixelPulseLab/likeme-back-end',
      external: true,
    },
    {
      id: 'likeme-site',
      title: 'Site em produção',
      category: 'Produto · Landing',
      description: 'Landing pública Like:Me — referência do que está no ar.',
      updatedAt: '12/08/2026',
      status: 'available',
      href: 'https://www.likeme.global',
      external: true,
    },
  ],
}
