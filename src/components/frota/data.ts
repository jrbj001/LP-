import {
  Home, Layers, User, FolderKanban, LayoutDashboard,
  FileBarChart, FileText, type LucideIcon,
  Database, Brain, Globe, Smartphone, Zap,
} from 'lucide-react'

// ─── Sidebar navigation ──────────────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  section: 'main' | 'workspace'
  locked?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home',            href: '',          icon: Home,            section: 'main' },
  { label: 'Arquitetura',     href: '/arch',     icon: Layers,          section: 'main' },
  { label: 'Minha Área',      href: '/my-area',  icon: User,            section: 'workspace' },
  { label: 'Módulos',         href: '/projects', icon: FolderKanban,    section: 'workspace' },
  { label: 'Dashboard',       href: '/dashboard',icon: LayoutDashboard, section: 'workspace' },
  { label: 'Executive Review',href: '/review',   icon: FileBarChart,    section: 'workspace', locked: true },
  { label: 'Documentos',      href: '/docs',     icon: FileText,        section: 'workspace' },
]

// ─── Build timeline ───────────────────────────────────────────────────────────
export interface TimelineStep {
  id: string
  title: string
  description: string
  status: 'done' | 'active' | 'upcoming'
}

export const TIMELINE: TimelineStep[] = [
  { id: 'kickoff',   title: 'Kickoff',                  description: 'Alinhamento de escopo, arquitetura, stack e contrato.',             status: 'active' },
  { id: 'fase1',     title: 'Build — Fase 1',            description: 'Enriquecimento, banco de dados, IA de busca e plataforma web.',     status: 'upcoming' },
  { id: 'validacao', title: 'Entrega & Validação',       description: 'Deploy em produção, teste com a base real e ajustes finos.',        status: 'upcoming' },
  { id: 'fase2',     title: 'Build — Fase 2',            description: 'App mobile iOS + Android.',                                         status: 'upcoming' },
  { id: 'handover',  title: 'Handover',                  description: 'Documentação, treinamento e entrega do código-fonte.',              status: 'upcoming' },
]

// ─── Client ───────────────────────────────────────────────────────────────────
export const CLIENT = {
  name: 'Projeto Frota',
  product: 'SF Network Intelligence',
  sector: 'Inteligência de Rede · Finanças & Investimentos',
  facilitator: { name: 'José Roberto', role: 'Tech Lead · PixelPulseLab', initials: 'JR' },
  sponsor: { name: 'SF', role: 'Sponsor · Cliente' },
  partners: 'José Roberto (Zé) & Marco Lúcio — PixelPulseLab',
}

// ─── Layers / Areas ───────────────────────────────────────────────────────────
export type Priority = 'high' | 'medium' | 'low'
export type ProjectStatus = 'review' | 'in-progress' | 'planned' | 'at-risk' | 'done'

export interface Project {
  name: string
  area: string
  owner: string
  priority: Priority
  status: ProjectStatus
}

export const PROJECTS: Project[] = [
  // Camada 1 — Coleta & Enriquecimento
  { name: 'Integração HubSpot — importação dos 2.410 contatos',   area: 'Coleta & Enriquecimento', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'Scraper LinkedIn (cargo, bio, experiência, posts)',     area: 'Coleta & Enriquecimento', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'Scraper Instagram (bio, seguidores, engajamento)',      area: 'Coleta & Enriquecimento', owner: 'Zé',    priority: 'medium', status: 'planned' },
  { name: 'Scraper Site da empresa (setor, serviços, equipe)',     area: 'Coleta & Enriquecimento', owner: 'Zé',    priority: 'medium', status: 'planned' },
  { name: 'Scraper Notícias (menções, entrevistas, prêmios)',      area: 'Coleta & Enriquecimento', owner: 'Zé',    priority: 'low',    status: 'planned' },
  { name: 'n8n — orquestração de lotes e automação',              area: 'Coleta & Enriquecimento', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'OpenAI — extração de tópicos + geração de embeddings', area: 'Coleta & Enriquecimento', owner: 'Zé',    priority: 'high',   status: 'planned' },

  // Camada 2 — Banco de Dados
  { name: 'Schema relacional de contatos (Supabase / Postgres)',  area: 'Banco de Dados', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'pgvector — índice vetorial para busca semântica',      area: 'Banco de Dados', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'Sistema de tiers (Inner Circle > A > B > C)',          area: 'Banco de Dados', owner: 'Marco', priority: 'high',   status: 'planned' },
  { name: 'Busca textual por nome / empresa',                     area: 'Banco de Dados', owner: 'Marco', priority: 'medium', status: 'planned' },
  { name: 'Redis — cache para respostas instantâneas',            area: 'Banco de Dados', owner: 'Marco', priority: 'low',    status: 'planned' },

  // Camada 3 — IA de Busca
  { name: 'Busca semântica + híbrida (vetorial + textual)',       area: 'IA de Busca', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'Chat em linguagem natural (query → contatos certos)',  area: 'IA de Busca', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'Ranking por força da relação (tier-weighted)',         area: 'IA de Busca', owner: 'Zé',    priority: 'high',   status: 'planned' },
  { name: 'Filtros: cidade, país, tier, setor',                   area: 'IA de Busca', owner: 'Marco', priority: 'medium', status: 'planned' },

  // Camada 4 — Plataforma Web
  { name: 'Chat de busca (interface linguagem natural)',          area: 'Plataforma Web', owner: 'Marco', priority: 'high',   status: 'planned' },
  { name: 'Dashboard — visão da rede por tier, cidade, setor',   area: 'Plataforma Web', owner: 'Marco', priority: 'high',   status: 'planned' },
  { name: 'Filtros + ficha completa enriquecida de contato',     area: 'Plataforma Web', owner: 'Marco', priority: 'high',   status: 'planned' },
  { name: 'Auth (Supabase Auth) + deploy Vercel',                area: 'Plataforma Web', owner: 'Zé',    priority: 'high',   status: 'planned' },

  // Fase 2 — App Mobile
  { name: 'App iOS — SF Network Intelligence',                   area: 'App Mobile', owner: 'Marco', priority: 'medium', status: 'planned' },
  { name: 'App Android — SF Network Intelligence',               area: 'App Mobile', owner: 'Marco', priority: 'medium', status: 'planned' },
]

export const AREA_ORDER = [
  'Coleta & Enriquecimento',
  'Banco de Dados',
  'IA de Busca',
  'Plataforma Web',
  'App Mobile',
]

export const AREA_META: Record<string, { icon: LucideIcon; initials: string; owner: string; phase: string }> = {
  'Coleta & Enriquecimento': { icon: Zap,       initials: 'C1', owner: 'Zé',    phase: 'Fase 1' },
  'Banco de Dados':          { icon: Database,  initials: 'C2', owner: 'Zé',    phase: 'Fase 1' },
  'IA de Busca':             { icon: Brain,     initials: 'C3', owner: 'Zé',    phase: 'Fase 1' },
  'Plataforma Web':          { icon: Globe,     initials: 'C4', owner: 'Marco', phase: 'Fase 1' },
  'App Mobile':              { icon: Smartphone,initials: 'C5', owner: 'Marco', phase: 'Fase 2' },
}

export function projectsByArea(area: string): Project[] {
  return PROJECTS.filter(p => p.area === area)
}

// ─── Stakeholders ─────────────────────────────────────────────────────────────
export interface Stakeholder {
  name: string
  initials: string
  role: string
  areas: string[]
  sponsor?: boolean
  lead?: boolean
}

export const STAKEHOLDERS: Stakeholder[] = [
  { name: 'SF',    initials: 'SF', role: 'Sponsor · Cliente',            areas: ['Todas'],                      sponsor: true },
  { name: 'José Roberto', initials: 'JR', role: 'Tech Lead · Backend & IA',  areas: ['Coleta & Enriquecimento', 'Banco de Dados', 'IA de Busca'], lead: true },
  { name: 'Marco', initials: 'MA', role: 'Frontend & Mobile Lead',       areas: ['Plataforma Web', 'App Mobile'] },
]

// ─── Dashboard metrics ────────────────────────────────────────────────────────
export interface Metric {
  label: string
  value: string
  delta?: string
  hint: string
}

export const DASHBOARD_METRICS: Metric[] = [
  { label: 'Build Progress',      value: '0%',   hint: 'aguardando kickoff' },
  { label: 'Módulos Mapeados',    value: '22',   hint: '22 entregáveis definidos' },
  { label: 'Camadas',             value: '4',    hint: 'Fase 1 — web completa' },
  { label: 'Contatos na Base',    value: '2.410',hint: 'HubSpot · a importar' },
  { label: 'Sprints Planejados',  value: '—',    hint: 'após kickoff' },
  { label: 'Quick Wins',          value: '—',    hint: 'após kickoff' },
  { label: 'Bugs Críticos',       value: '—',    hint: 'em produção' },
  { label: 'AI Accuracy',         value: '—',    hint: 'busca semântica' },
]

// ─── Expected deliverables ────────────────────────────────────────────────────
export const EXPECTED_RESULTS = [
  {
    metric: 'Plataforma Web (Fase 1)',
    label: 'Entregável principal',
    description: 'Chat de busca, dashboard e filtros. 2.410 contatos enriquecidos e pesquisáveis em linguagem natural.',
  },
  {
    metric: 'Motor de Enriquecimento',
    label: 'Automação contínua',
    description: 'Pipeline n8n que enriquece perfis automaticamente via LinkedIn, Instagram, site e notícias — sem trabalho manual.',
  },
  {
    metric: 'App Mobile (Fase 2)',
    label: 'Roadmap — após validação',
    description: 'A mesma inteligência da plataforma web no bolso — iOS e Android. Orçamento separado após Fase 1 validada.',
  },
]

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; tone: 'green' | 'amber' | 'muted' | 'neutral' }> = {
  'review':      { label: 'Em análise',   tone: 'muted' },
  'in-progress': { label: 'Em andamento', tone: 'green' },
  'planned':     { label: 'Planejado',    tone: 'muted' },
  'at-risk':     { label: 'Em risco',     tone: 'amber' },
  'done':        { label: 'Concluído',    tone: 'neutral' },
}

export const PRIORITY_META: Record<Priority, { label: string; dot: string }> = {
  high:   { label: 'Alta',  dot: 'bg-rose-500' },
  medium: { label: 'Média', dot: 'bg-amber-500' },
  low:    { label: 'Baixa', dot: 'bg-neutral-300' },
}
