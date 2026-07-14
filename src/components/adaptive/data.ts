import {
  Home, Layers, User, FolderKanban, LayoutDashboard,
  FileBarChart, FileText, type LucideIcon,
  Target, ClipboardList, Cog, Server, Sparkles, ClipboardCheck, Activity, Mic2,
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
  { label: 'Começar',          href: '/onboard',          icon: ClipboardCheck,  section: 'main' },
  { label: 'Minha Área',       href: '/my-area',          icon: User,            section: 'workspace' },
  { label: 'Projetos',         href: '/projects',         icon: FolderKanban,    section: 'workspace' },
  { label: 'Dashboard',        href: '/dashboard',        icon: LayoutDashboard, section: 'workspace' },
  { label: 'Acompanhamento',   href: '/onboarding',       icon: Activity,        section: 'workspace' },
  { label: 'Reuniões',         href: '/meetings',         icon: Mic2,            section: 'workspace' },
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
  { id: 'identify',  title: 'Identificar',        description: 'Cada stakeholder confirma nome + WhatsApp (convite Diego).', status: 'active' },
  { id: 'projects',  title: 'Meus projetos',      description: 'Revisa os projetos do Comitê de TI sob sua responsabilidade.', status: 'upcoming' },
  { id: 'assessment',title: 'Assessment online',  description: '11 perguntas sobre objetivos, desafios, tecnologia e IA da área.', status: 'upcoming' },
  { id: 'session',   title: 'Sessão 30 min',      description: 'Agenda presencial com PixelPulseLab para aprofundar o discovery.', status: 'upcoming' },
  { id: 'review',    title: 'Executive Review',   description: 'Apresentação executiva com Adaptive Index™ e recomendações.', status: 'upcoming' },
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

// ─── Client (Grupo Orfeu) ─────────────────────────────────────────────────────
export const CLIENT_ID = 'orfeu'

export const CLIENT = {
  id: CLIENT_ID,
  name: 'Grupo Orfeu',
  sector: 'Café · Agroindústria & Varejo',
  /** Convida e acompanha o processo — NÃO participa das sessões presenciais */
  facilitator: { name: 'Diego', role: 'Facilitador · Gente & Gestão', initials: 'DI' },
  /** Host das sessões presenciais de 30min */
  meetingHost: { name: 'José Roberto', role: 'PixelPulseLab · Principal Engineer', initials: 'JR' },
  sponsor: { name: 'Ricardo Madureira', role: 'Sponsor Executivo' },
  partners: 'José Roberto (Zé) & Marco Lúcio — PixelPulseLab',
}

/** Janela de agenda presencial (slots de 30min). Amplie weekdays/horas quando precisar. */
export const SLOT_WINDOW = {
  clientId: CLIENT_ID,
  /** Ajuste a data de início do assessment quando definir o calendário real */
  startDate: '2026-07-21',
  weekdays: 4,
  dayStartHour: 9,
  dayEndHour: 13,
  host: 'José Roberto',
  location: 'Presencial' as const,
}

export const STORAGE_KEY = 'adaptive.orfeu.onboard'

export interface StoredOnboard {
  clientId: string
  stakeholder: string
  whatsapp: string
  areas?: string
  role?: string
}

// ─── Stakeholder & projects ───────────────────────────────────────────────────
export type Priority = 'high' | 'medium' | 'low'
export type ProjectStatus = 'review' | 'in-progress' | 'planned' | 'at-risk' | 'done'

export interface Project {
  name: string
  area: string
  requester: string
  priority: Priority
  status: ProjectStatus
}

// Full portfolio from Grupo Orfeu's "Comitê de TI" spreadsheet.
export const PROJECTS: Project[] = [
  // Comercial
  { name: 'Site Compra B2B (cafeterias e restaurantes)', area: 'Comercial', requester: 'Cristiane', priority: 'high',   status: 'review' },
  { name: 'Página Office (assinaturas B2B)',              area: 'Comercial', requester: 'Cristiane', priority: 'medium', status: 'review' },
  { name: 'CRM Jornada do Vendedor (Dashboard) API Protheus', area: 'Comercial', requester: 'Cristiane', priority: 'high', status: 'review' },
  { name: 'App Baristas Orfeu',                           area: 'Comercial', requester: 'Joyce',     priority: 'medium', status: 'review' },
  { name: 'Calculadora de Elasticidade de Preço (varejo)',area: 'Comercial', requester: 'Silvia',    priority: 'medium', status: 'review' },
  { name: 'Faturamento simultâneo — fechamento de mês no Protheus', area: 'Comercial', requester: 'RM', priority: 'high', status: 'review' },
  { name: 'Automação faturamento pedidos com ruptura canal B2C', area: 'Comercial', requester: 'Cibele', priority: 'high', status: 'review' },
  { name: 'Faturamento automático canais B2B e varejo',  area: 'Comercial', requester: 'Cristiane', priority: 'high',   status: 'review' },
  // Compras
  { name: 'Implantar a Jornada de Compras',              area: 'Compras',   requester: 'Alene',     priority: 'medium', status: 'review' },
  { name: 'BI de Compras',                               area: 'Compras',   requester: 'Alene',     priority: 'medium', status: 'review' },
  // Fazenda
  { name: 'Gerente Agrícola — automação custos indiretos Protheus × GA', area: 'Fazenda', requester: 'Lucas', priority: 'medium', status: 'review' },
  { name: 'Gerente Agrícola — automação custos indiretos GA × Protheus', area: 'Fazenda', requester: 'Lucas', priority: 'medium', status: 'review' },
  { name: 'BI correlação manejo × qualidade × produtividade', area: 'Fazenda', requester: 'Lucas', priority: 'high', status: 'review' },
  // Financeiro
  { name: 'Conciliação financeira/fiscal Mercado Livre', area: 'Financeiro', requester: 'Rafaela',  priority: 'high',   status: 'review' },
  { name: 'Controle de máquinas em comodato',            area: 'Financeiro', requester: 'Rafaela',  priority: 'medium', status: 'review' },
  { name: 'Conciliação financeira PagBrasil',            area: 'Financeiro', requester: 'Rafaela',  priority: 'medium', status: 'review' },
  // Gestão
  { name: 'Migração versão Protheus',                    area: 'Gestão',    requester: 'André Martins', priority: 'high', status: 'review' },
  { name: 'Bloqueio de saídas de estoque no Protheus em dias de inventário (Fazenda + Orfeu)', area: 'Gestão', requester: 'Rafaela', priority: 'medium', status: 'review' },
  { name: 'Dashboard de resultados da N1 mensal',        area: 'Gestão',    requester: 'Rafaela',  priority: 'medium', status: 'review' },
  { name: 'Dashboard de resultados da N1 semanal (OPR)', area: 'Gestão',    requester: 'Rafaela',  priority: 'medium', status: 'review' },
  // Indústria
  { name: 'Integração OpsFactor × Protheus',             area: 'Indústria', requester: 'Gustavo',  priority: 'high',   status: 'review' },
  { name: 'Implantação módulo Controle da Qualidade',    area: 'Indústria', requester: 'Gustavo',  priority: 'medium', status: 'review' },
  { name: 'Implantação módulo Manutenção de Ativos',     area: 'Indústria', requester: 'Gustavo',  priority: 'medium', status: 'review' },
  { name: 'Aplicativo para Orfeu — análise sensorial (Cropster)', area: 'Indústria', requester: 'Milena', priority: 'medium', status: 'review' },
  // Inteligência
  { name: 'Segurança da informação / LGPD / código-fonte de aplicações e sites', area: 'Inteligência', requester: 'Diego', priority: 'high', status: 'review' },
  { name: 'Dashboard forecast × realizado — nível vendedor/cliente/SKU', area: 'Inteligência', requester: 'Amanda Raquel', priority: 'high', status: 'review' },
  { name: 'Amazon Hub',                                  area: 'Inteligência', requester: 'Amanda Raquel', priority: 'medium', status: 'review' },
  // Logística
  { name: 'EDI Transportadoras',                         area: 'Logística', requester: 'Ricardo Silva', priority: 'medium', status: 'review' },
  { name: 'Implantar WMS na expedição Botelhos',         area: 'Logística', requester: 'Ricardo Silva', priority: 'high', status: 'review' },
  // Qualidade
  { name: 'BI de Qualidade',                             area: 'Qualidade', requester: 'Jéssica Viana', priority: 'medium', status: 'review' },
  // SOP
  { name: 'Implantação OpsFactor',                       area: 'SOP',       requester: 'Gustavo',  priority: 'medium', status: 'review' },
]

// Area leaders (owner) derived from the portfolio.
export const AREA_OWNERS: Record<string, { owner: string; initials: string }> = {
  'Comercial':    { owner: 'Cristiane',      initials: 'CR' },
  'Compras':      { owner: 'Alene',          initials: 'AL' },
  'Fazenda':      { owner: 'Lucas',          initials: 'LU' },
  'Financeiro':   { owner: 'Rafaela',        initials: 'RA' },
  'Gestão':       { owner: 'André Martins',  initials: 'AM' },
  'Indústria':    { owner: 'Gustavo',        initials: 'GU' },
  'Inteligência': { owner: 'Diego',          initials: 'DI' },
  'Logística':    { owner: 'Ricardo Silva',  initials: 'RS' },
  'Qualidade':    { owner: 'Jéssica Viana',  initials: 'JV' },
  'SOP':          { owner: 'Gustavo',        initials: 'GU' },
}

export const AREA_ORDER = [
  'Comercial', 'Compras', 'Fazenda', 'Financeiro', 'Gestão',
  'Indústria', 'Inteligência', 'Logística', 'Qualidade', 'SOP',
]

export function projectsByArea(area: string): Project[] {
  return PROJECTS.filter(p => p.area === area)
}

export function projectsByRequester(name: string): Project[] {
  return PROJECTS.filter(p => p.requester === name)
}

// ─── Stakeholders (each person selects their own name) ────────────────────────
export interface Stakeholder {
  name: string
  initials: string
  areas: string[]
  email?: string
  facilitator?: boolean
  sponsor?: boolean
  /** Apoia sponsor/facilitador na priorização — visão de todo o portfólio */
  consultant?: boolean
  role?: string
}

export const STAKEHOLDERS: Stakeholder[] = [
  { name: 'Ricardo Madureira', initials: 'RM', areas: ['Todas as áreas'], sponsor: true, role: 'CEO · Sponsor Executivo' },
  { name: 'Diego',         initials: 'DI', areas: ['Todas as áreas'], facilitator: true, role: 'Facilitador · Gente & Gestão' },
  {
    name: 'Felipe Szpigel',
    initials: 'FS',
    areas: ['Todas as áreas'],
    email: 'fszpigel@gmail.com',
    consultant: true,
    role: 'Consultor · Priorização',
  },
  {
    name: 'Selton Cordts',
    initials: 'SC',
    areas: ['Todas as áreas'],
    email: 'selton.cordts@gmail.com',
    consultant: true,
    role: 'Consultor · Priorização',
  },
  { name: 'Cristiane',     initials: 'CR', areas: ['Comercial'] },
  { name: 'Joyce',         initials: 'JO', areas: ['Comercial'] },
  { name: 'Silvia',        initials: 'SI', areas: ['Comercial'] },
  { name: 'RM',            initials: 'RM', areas: ['Comercial'] },
  { name: 'Cibele',        initials: 'CI', areas: ['Comercial'] },
  { name: 'Alene',         initials: 'AL', areas: ['Compras'] },
  { name: 'Lucas',         initials: 'LU', areas: ['Fazenda'] },
  { name: 'Rafaela',       initials: 'RA', areas: ['Financeiro', 'Gestão'] },
  { name: 'André Martins', initials: 'AM', areas: ['Gestão'] },
  { name: 'Gustavo',       initials: 'GU', areas: ['Indústria', 'SOP'] },
  { name: 'Milena',        initials: 'MI', areas: ['Indústria'] },
  { name: 'Amanda Raquel', initials: 'AR', areas: ['Inteligência'] },
  { name: 'Ricardo Silva', initials: 'RS', areas: ['Logística'] },
  { name: 'Jéssica Viana', initials: 'JV', areas: ['Qualidade'] },
]

export function findStakeholder(name: string): Stakeholder | undefined {
  return STAKEHOLDERS.find(s => s.name === name)
}

/** Sponsor, facilitador e consultores veem todo o portfólio + stakeholders */
export function hasFullAccess(s: Stakeholder): boolean {
  return Boolean(s.sponsor || s.facilitator || s.consultant)
}

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

// ─── Derived counts ───────────────────────────────────────────────────────────
const UNIQUE_REQUESTERS = new Set(PROJECTS.map(p => p.requester)).size
const TOTAL_PROJECTS = PROJECTS.length
const TOTAL_AREAS = AREA_ORDER.length

// ─── Dashboard metrics ────────────────────────────────────────────────────────
export interface Metric {
  label: string
  value: string
  delta?: string
  hint: string
}

export const DASHBOARD_METRICS: Metric[] = [
  { label: 'Assessment Progress', value: '0%',                       hint: 'aguardando kickoff' },
  { label: 'Projects Mapped',     value: String(TOTAL_PROJECTS),     hint: 'no Comitê de TI' },
  { label: 'Áreas',               value: String(TOTAL_AREAS),        hint: 'em avaliação' },
  { label: 'Stakeholders',        value: String(UNIQUE_REQUESTERS),  hint: 'solicitantes mapeados' },
  { label: 'Discovery Sessions',  value: `0/${TOTAL_AREAS}`,         hint: 'a agendar' },
  { label: 'Quick Wins',          value: '—',                        hint: 'após Discovery' },
  { label: 'Critical Risks',      value: '—',                        hint: 'após Discovery' },
  { label: 'AI Opportunities',    value: '—',                        hint: 'após Discovery' },
]
