import {
  Home, Layers, Compass, User, FolderKanban, LayoutDashboard,
  FileBarChart, FileText, type LucideIcon,
  Target, ClipboardList, Cog, Server, Sparkles,
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
  { label: 'Home',             href: '',                  icon: Home,            section: 'main' },
  { label: 'Framework',        href: '/framework',        icon: Layers,          section: 'main' },
  { label: 'Discovery',        href: '/discovery',        icon: Compass,         section: 'main' },
  { label: 'Minha Área',       href: '/my-area',          icon: User,            section: 'workspace' },
  { label: 'Projetos',         href: '/projects',         icon: FolderKanban,    section: 'workspace' },
  { label: 'Dashboard',        href: '/dashboard',        icon: LayoutDashboard, section: 'workspace' },
  { label: 'Executive Review', href: '/executive-review', icon: FileBarChart,    section: 'workspace', locked: true },
  { label: 'Documentos',       href: '/documents',        icon: FileText,        section: 'workspace' },
]

// ─── Assessment timeline ──────────────────────────────────────────────────────
export interface TimelineStep {
  id: string
  title: string
  description: string
  status: 'done' | 'active' | 'upcoming'
}

export const TIMELINE: TimelineStep[] = [
  { id: 'kickoff',   title: 'Kickoff',            description: 'Alinhamento de escopo, stakeholders e objetivos do assessment.', status: 'done' },
  { id: 'discovery', title: 'Discovery Sessions', description: 'Sessões individuais com cada líder de área para entender a realidade operacional.', status: 'active' },
  { id: 'assessment',title: 'Assessment',         description: 'Análise cruzada de negócio, portfólio, operação, tecnologia e IA.', status: 'upcoming' },
  { id: 'review',    title: 'Executive Review',   description: 'Apresentação executiva com o Adaptive Index™ e recomendações.', status: 'upcoming' },
  { id: 'roadmap',   title: 'Roadmap',            description: 'Roadmap adaptativo priorizado por impacto no negócio.', status: 'upcoming' },
]

// ─── Framework pillars ────────────────────────────────────────────────────────
export interface Pillar {
  index: string
  name: string
  icon: LucideIcon
  question: string
  description: string
  outputs: string[]
}

export const PILLARS: Pillar[] = [
  {
    index: '01',
    name: 'Business Alignment™',
    icon: Target,
    question: 'Estamos resolvendo os problemas certos?',
    description: 'Entendemos objetivos estratégicos, indicadores, prioridades e desafios do negócio.',
    outputs: ['Business Score', 'Strategic Risks', 'Business Opportunities'],
  },
  {
    index: '02',
    name: 'Portfolio Health™',
    icon: ClipboardList,
    question: 'Estamos investindo energia nas iniciativas corretas?',
    description: 'Analisamos projetos existentes, prioridades, dependências, riscos e alinhamento estratégico.',
    outputs: ['Portfolio Score', 'Priority Matrix', 'Quick Wins'],
  },
  {
    index: '03',
    name: 'Operational Excellence™',
    icon: Cog,
    question: 'Como as equipes realmente trabalham?',
    description: 'Mapeamos processos, gargalos, retrabalho, integrações e desperdícios.',
    outputs: ['Process Score', 'Automation Opportunities', 'Operational Risks'],
  },
  {
    index: '04',
    name: 'Technology Readiness™',
    icon: Server,
    question: 'A tecnologia suporta o crescimento do negócio?',
    description: 'Avaliamos arquitetura, integrações, qualidade técnica, governança, segurança e escalabilidade.',
    outputs: ['Technology Score', 'Technical Debt', 'Architecture Review'],
  },
  {
    index: '05',
    name: 'AI Readiness™',
    icon: Sparkles,
    question: 'Onde Inteligência Artificial pode gerar maior impacto?',
    description: 'Identificamos oportunidades práticas para automação, apoio à decisão e criação de novos produtos.',
    outputs: ['AI Score', 'AI Opportunity Map', 'AI Roadmap'],
  },
]

// ─── Discovery questions (Typeform-style) ─────────────────────────────────────
export interface DiscoveryQuestion {
  id: number
  question: string
  helper: string
  type: 'text' | 'longtext'
}

export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  { id: 1,  question: 'Qual é hoje o principal objetivo da sua área?', helper: 'Pense no resultado mais importante para os próximos 6 a 12 meses.', type: 'longtext' },
  { id: 2,  question: 'Quais projetos listados são prioritários?', helper: 'Liste os que mais impactam o resultado da área.', type: 'longtext' },
  { id: 3,  question: 'Existe algum projeto que perdeu prioridade?', helper: 'Iniciativas que já não fazem tanto sentido hoje.', type: 'longtext' },
  { id: 4,  question: 'Existe alguma iniciativa importante que ainda não está no portfólio?', helper: 'Algo que deveria estar sendo feito e ainda não começou.', type: 'longtext' },
  { id: 5,  question: 'Qual é hoje o maior desafio da sua área?', helper: 'O obstáculo que mais consome energia da equipe.', type: 'longtext' },
  { id: 6,  question: 'Onde a tecnologia mais ajuda?', helper: 'Ferramentas e sistemas que realmente aceleram o trabalho.', type: 'longtext' },
  { id: 7,  question: 'Onde ela mais dificulta?', helper: 'Onde a tecnologia atrapalha ou gera retrabalho.', type: 'longtext' },
  { id: 8,  question: 'Qual processo mais gostaria de automatizar?', helper: 'Tarefas repetitivas que consomem tempo do time.', type: 'longtext' },
  { id: 9,  question: 'Onde IA poderia gerar maior impacto?', helper: 'Decisões, automações ou produtos possíveis com IA.', type: 'longtext' },
  { id: 10, question: 'Se fosse CIO por um dia, qual seria sua primeira decisão?', helper: 'Sem restrições de orçamento ou política interna.', type: 'longtext' },
  { id: 11, question: 'Comentários finais.', helper: 'Qualquer coisa que queira registrar para o assessment.', type: 'longtext' },
]

// ─── Expected results (Home onboarding) ───────────────────────────────────────
export interface ExpectedResult {
  metric: string
  label: string
  description: string
}

export const EXPECTED_RESULTS: ExpectedResult[] = [
  { metric: 'Adaptive Index™',        label: 'Índice de Maturidade',   description: 'Um score consolidado da capacidade adaptativa da organização.' },
  { metric: 'AI Opportunity Map™',    label: 'Mapa de Oportunidades',  description: 'Onde a inteligência artificial gera maior impacto no negócio.' },
  { metric: 'Adaptive Roadmap™',      label: 'Roadmap Executivo',      description: 'Um plano priorizado por impacto, risco e esforço.' },
]

// ─── Stakeholder & projects ───────────────────────────────────────────────────
export type Priority = 'high' | 'medium' | 'low'
export type ProjectStatus = 'in-progress' | 'planned' | 'at-risk' | 'done'

export interface Project {
  name: string
  priority: Priority
  status: ProjectStatus
  description: string
}

export interface StakeholderArea {
  area: string
  owner: string
  ownerInitials: string
  discoveryStatus: 'pending' | 'in-progress' | 'done'
  projects: Project[]
}

export const MY_AREA: StakeholderArea = {
  area: 'Comercial',
  owner: 'Cristiane',
  ownerInitials: 'CR',
  discoveryStatus: 'pending',
  projects: [
    { name: 'CRM Unificado',            priority: 'high',   status: 'in-progress', description: 'Consolidação de leads e pipeline em uma única plataforma.' },
    { name: 'Automação de Propostas',   priority: 'high',   status: 'planned',     description: 'Geração automática de propostas comerciais com IA.' },
    { name: 'Dashboard de Vendas',      priority: 'medium', status: 'in-progress', description: 'Visão em tempo real de metas, funil e forecast.' },
    { name: 'Integração ERP',           priority: 'medium', status: 'at-risk',     description: 'Sincronização de pedidos entre CRM e ERP legado.' },
    { name: 'Portal do Cliente',        priority: 'low',    status: 'planned',     description: 'Autoatendimento para acompanhamento de pedidos.' },
  ],
}

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; tone: 'green' | 'amber' | 'muted' | 'neutral' }> = {
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

// ─── Dashboard metrics ────────────────────────────────────────────────────────
export interface Metric {
  label: string
  value: string
  delta?: string
  hint: string
}

export const DASHBOARD_METRICS: Metric[] = [
  { label: 'Assessment Progress', value: '15%', hint: 'Discovery em andamento' },
  { label: 'Projects Reviewed',   value: '4',   delta: 'de 23', hint: 'portfólio total' },
  { label: 'Stakeholders',        value: '8',   delta: '2 ativos', hint: 'líderes de área' },
  { label: 'Discovery Sessions',  value: '2/8', hint: 'sessões concluídas' },
  { label: 'Quick Wins',          value: '6',   hint: 'oportunidades imediatas' },
  { label: 'Critical Risks',      value: '3',   hint: 'exigem atenção' },
  { label: 'AI Opportunities',    value: '9',   hint: 'mapeadas até agora' },
]
