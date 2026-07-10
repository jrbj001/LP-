import {
  Home, Layers, User, FolderKanban, LayoutDashboard,
  FileBarChart, FileText, type LucideIcon,
  Database, Brain, Globe, Smartphone, Zap, Target,
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
  { label: 'Home',            href: '',           icon: Home,            section: 'main' },
  { label: 'Arquitetura',     href: '/arch',      icon: Layers,          section: 'main' },
  { label: 'Roadmap',         href: '/roadmap',   icon: Target,          section: 'main' },
  { label: 'Minha Área',      href: '/my-area',   icon: User,            section: 'workspace' },
  { label: 'Módulos',         href: '/projects',  icon: FolderKanban,    section: 'workspace' },
  { label: 'Dashboard',       href: '/dashboard', icon: LayoutDashboard, section: 'workspace' },
  { label: 'Executive Review',href: '/review',    icon: FileBarChart,    section: 'workspace', locked: true },
  { label: 'Documentos',      href: '/docs',      icon: FileText,        section: 'workspace' },
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
  partners: 'PixelPulseLab',
}

// ─── Founders ─────────────────────────────────────────────────────────────────
export const FOUNDERS = [
  {
    name: 'José Roberto Baptista Jr.',
    nickname: 'Zé',
    role: 'Co-founder & Principal Engineer',
    initials: 'JB',
    quote: `"Você tem uma rede valiosa — mas ela está adormecida em uma planilha.
O SF Network Intelligence vai transformar seus 2.410 contatos em uma plataforma
que responde à pergunta certa, na hora certa — com a pessoa certa na ponta.
A gente não entrega um sistema, entrega inteligência de relacionamento."`,
  },
  {
    name: 'Marco Lúcio Moreira',
    nickname: 'Marco',
    role: 'Co-founder & CEO',
    initials: 'ML',
    quote: `"Projetos como o Frota são exatamente o que a PixelPulseLab foi criada para fazer:
transformar dados que já existem em valor real, com arquitetura sólida e sem
complexidade desnecessária. Nossa missão é que você entre no sistema,
faça uma pergunta e saia com o contato certo em menos de 10 segundos."`,
  },
]

// ─── Layers / Areas ───────────────────────────────────────────────────────────
export type Priority = 'high' | 'medium' | 'low'
export type ProjectStatus = 'review' | 'in-progress' | 'planned' | 'at-risk' | 'done'

export interface Project {
  name: string
  area: string
  owner: string
  priority: Priority
  status: ProjectStatus
  hours: number
}

export const PROJECTS: Project[] = [
  // Camada 1 — Coleta & Enriquecimento
  { name: 'Integração HubSpot — importação dos 2.410 contatos',   area: 'Coleta & Enriquecimento', owner: 'Backend',  priority: 'high',   status: 'planned', hours: 24 },
  { name: 'Scraper LinkedIn (cargo, bio, experiência, posts)',     area: 'Coleta & Enriquecimento', owner: 'Backend',  priority: 'high',   status: 'planned', hours: 40 },
  { name: 'Scraper Instagram (bio, seguidores, engajamento)',      area: 'Coleta & Enriquecimento', owner: 'Backend',  priority: 'medium', status: 'planned', hours: 24 },
  { name: 'Scraper Site da empresa (setor, serviços, equipe)',     area: 'Coleta & Enriquecimento', owner: 'Backend',  priority: 'medium', status: 'planned', hours: 16 },
  { name: 'Scraper Notícias (menções, entrevistas, prêmios)',      area: 'Coleta & Enriquecimento', owner: 'Backend',  priority: 'low',    status: 'planned', hours: 16 },
  { name: 'n8n — orquestração de lotes e automação',              area: 'Coleta & Enriquecimento', owner: 'Backend',  priority: 'high',   status: 'planned', hours: 32 },
  { name: 'OpenAI — extração de tópicos + geração de embeddings', area: 'Coleta & Enriquecimento', owner: 'IA',       priority: 'high',   status: 'planned', hours: 32 },

  // Camada 2 — Banco de Dados
  { name: 'Schema relacional de contatos (Supabase / Postgres)',  area: 'Banco de Dados', owner: 'Backend',  priority: 'high',   status: 'planned', hours: 24 },
  { name: 'pgvector — índice vetorial para busca semântica',      area: 'Banco de Dados', owner: 'Backend',  priority: 'high',   status: 'planned', hours: 20 },
  { name: 'Sistema de tiers (Inner Circle > A > B > C)',          area: 'Banco de Dados', owner: 'Backend',  priority: 'high',   status: 'planned', hours: 16 },
  { name: 'Busca textual por nome / empresa',                     area: 'Banco de Dados', owner: 'Backend',  priority: 'medium', status: 'planned', hours: 12 },
  { name: 'Redis — cache para respostas instantâneas',            area: 'Banco de Dados', owner: 'Backend',  priority: 'low',    status: 'planned', hours: 12 },

  // Camada 3 — IA de Busca
  { name: 'Busca semântica + híbrida (vetorial + textual)',       area: 'IA de Busca', owner: 'IA',       priority: 'high',   status: 'planned', hours: 40 },
  { name: 'Chat em linguagem natural (query → contatos certos)',  area: 'IA de Busca', owner: 'IA',       priority: 'high',   status: 'planned', hours: 32 },
  { name: 'Ranking por força da relação (tier-weighted)',         area: 'IA de Busca', owner: 'IA',       priority: 'high',   status: 'planned', hours: 24 },
  { name: 'Filtros: cidade, país, tier, setor',                   area: 'IA de Busca', owner: 'Backend',  priority: 'medium', status: 'planned', hours: 16 },

  // Camada 4 — Plataforma Web
  { name: 'Chat de busca (interface linguagem natural)',          area: 'Plataforma Web', owner: 'Frontend', priority: 'high',   status: 'planned', hours: 40 },
  { name: 'Dashboard — visão da rede por tier, cidade, setor',   area: 'Plataforma Web', owner: 'Frontend', priority: 'high',   status: 'planned', hours: 32 },
  { name: 'Filtros + ficha completa enriquecida de contato',     area: 'Plataforma Web', owner: 'Frontend', priority: 'high',   status: 'planned', hours: 32 },
  { name: 'Auth (Supabase Auth) + deploy Vercel',                area: 'Plataforma Web', owner: 'Backend',  priority: 'high',   status: 'planned', hours: 16 },

  // Fase 2 — App Mobile
  { name: 'App iOS — SF Network Intelligence',                   area: 'App Mobile', owner: 'Mobile',   priority: 'medium', status: 'planned', hours: 160 },
  { name: 'App Android — SF Network Intelligence',               area: 'App Mobile', owner: 'Mobile',   priority: 'medium', status: 'planned', hours: 120 },
]

export const AREA_ORDER = [
  'Coleta & Enriquecimento',
  'Banco de Dados',
  'IA de Busca',
  'Plataforma Web',
  'App Mobile',
]

export const AREA_META: Record<string, { icon: LucideIcon; initials: string; owner: string; phase: string }> = {
  'Coleta & Enriquecimento': { icon: Zap,       initials: 'C1', owner: 'Backend',  phase: 'Fase 1' },
  'Banco de Dados':          { icon: Database,  initials: 'C2', owner: 'Backend',  phase: 'Fase 1' },
  'IA de Busca':             { icon: Brain,     initials: 'C3', owner: 'IA',       phase: 'Fase 1' },
  'Plataforma Web':          { icon: Globe,     initials: 'C4', owner: 'Frontend', phase: 'Fase 1' },
  'App Mobile':              { icon: Smartphone,initials: 'C5', owner: 'Mobile',   phase: 'Fase 2' },
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
  { name: 'SF',    initials: 'SF', role: 'Sponsor · Cliente',         areas: ['Todas'],  sponsor: true },
  { name: 'PixelPulseLab', initials: 'PP', role: 'Equipe de entrega', areas: ['Todas'],  lead: true },
]

// ─── Roadmap milestones ───────────────────────────────────────────────────────
export interface Milestone {
  id: string
  week: number          // semana a partir do kickoff (semana 0)
  title: string
  description: string
  phase: 'Fase 1' | 'Fase 2'
  owners: string[]
  hours: number
  deliverables: string[]
}

export const MILESTONES: Milestone[] = [
  {
    id: 'kickoff',
    week: 0,
    title: 'Kickoff',
    description: 'Alinhamento de escopo, stack, acessos e definição final de prioridades.',
    phase: 'Fase 1',
    owners: ['Backend', 'Frontend', 'Cliente'],
    hours: 8,
    deliverables: ['Documento de escopo assinado', 'Acessos HubSpot / Supabase / Vercel configurados'],
  },
  {
    id: 'm1',
    week: 2,
    title: 'M1 — Base de dados + enriquecimento rodando',
    description: 'HubSpot importado, pipeline n8n funcional, primeiros contatos enriquecidos via LinkedIn e embeddings gerados.',
    phase: 'Fase 1',
    owners: ['Backend', 'IA'],
    hours: 120,
    deliverables: ['2.410 contatos importados', 'Pipeline n8n ativo', 'Primeiros 500 perfis enriquecidos', 'pgvector indexado'],
  },
  {
    id: 'm2',
    week: 4,
    title: 'M2 — IA de busca validada',
    description: 'Busca semântica + híbrida funcionando em staging. Chat em linguagem natural retornando os 15 contatos certos.',
    phase: 'Fase 1',
    owners: ['IA', 'Backend'],
    hours: 112,
    deliverables: ['Busca vetorial + textual operacional', 'Ranking por tier funcional', 'Chat testado com 20 queries reais'],
  },
  {
    id: 'm3',
    week: 6,
    title: 'M3 — Plataforma Web v1 em produção',
    description: 'Deploy Vercel com auth, chat de busca, dashboard e ficha de contato. Fase 1 entregue.',
    phase: 'Fase 1',
    owners: ['Frontend', 'Backend'],
    hours: 120,
    deliverables: ['Chat de busca em produção', 'Dashboard ativo', 'Filtros + fichas completas', 'Auth funcional', 'Deploy Vercel'],
  },
  {
    id: 'm4',
    week: 7,
    title: 'Validação & Ajustes Finos',
    description: 'Sessão de uso com o cliente. Correções de UX, acurácia da IA e performance.',
    phase: 'Fase 1',
    owners: ['Backend', 'Frontend', 'IA', 'Cliente'],
    hours: 40,
    deliverables: ['Relatório de usabilidade', 'Ajustes pós-uso real', 'Aceite formal da Fase 1'],
  },
  {
    id: 'm5',
    week: 10,
    title: 'M4 — App iOS beta',
    description: 'Versão beta do app iOS com chat de busca, dashboard e ficha de contato.',
    phase: 'Fase 2',
    owners: ['Mobile'],
    hours: 160,
    deliverables: ['App iOS TestFlight', 'Integração com a mesma API da web'],
  },
  {
    id: 'm6',
    week: 13,
    title: 'M5 — App Android beta + Handover',
    description: 'App Android funcional. Documentação técnica completa e entrega do código-fonte.',
    phase: 'Fase 2',
    owners: ['Mobile', 'Backend'],
    hours: 128,
    deliverables: ['App Android Play Store', 'Documentação técnica', 'Código-fonte entregue', 'Handover final'],
  },
]

// ─── Team / devs ─────────────────────────────────────────────────────────────
export interface TeamMember {
  role: string
  initials: string
  focus: string[]
  hoursPerWeek: number
  color: string
}

export const TEAM: TeamMember[] = [
  {
    role: 'Backend & IA',
    initials: 'BE',
    focus: ['Coleta & Enriquecimento', 'Banco de Dados', 'IA de Busca'],
    hoursPerWeek: 30,
    color: 'bg-neutral-900',
  },
  {
    role: 'Frontend & Mobile',
    initials: 'FE',
    focus: ['Plataforma Web', 'App Mobile'],
    hoursPerWeek: 25,
    color: 'bg-neutral-600',
  },
  {
    role: 'Backend & Dados',
    initials: 'BD',
    focus: ['Banco de Dados', 'IA de Busca'],
    hoursPerWeek: 20,
    color: 'bg-neutral-400',
  },
]
  },
]

// ─── Dashboard metrics ────────────────────────────────────────────────────────
export interface Metric {
  label: string
  value: string
  delta?: string
  hint: string
}

export const DASHBOARD_METRICS: Metric[] = [
  { label: 'Build Progress',      value: '0%',    hint: 'aguardando kickoff' },
  { label: 'Módulos Mapeados',    value: '22',    hint: '22 entregáveis definidos' },
  { label: 'Horas — Fase 1',      value: '~560h', hint: '3 devs · ~7 semanas' },
  { label: 'Horas — Fase 2',      value: '~280h', hint: 'iOS + Android' },
  { label: 'Contatos na Base',    value: '2.410', hint: 'HubSpot · a importar' },
  { label: 'Camadas',             value: '4',     hint: 'Fase 1 — web completa' },
  { label: 'Bugs Críticos',       value: '—',     hint: 'em produção' },
  { label: 'AI Accuracy',         value: '—',     hint: 'busca semântica' },
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
