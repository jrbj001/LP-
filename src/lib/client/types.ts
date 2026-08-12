import type { ManualEffortItem, RepoConfig } from '@/lib/delivery/types'

export type ClientStatus = 'pilot' | 'active'

export interface OnboardingStep {
  number: string
  title: string
  description: string
  tools: string[]
}

export interface DocCategory {
  id: string
  title: string
  description: string
  articles: string[]
  badge: string
}

export interface ClientContact {
  name: string
  role: string
  email?: string
}

export interface ClientMeeting {
  id: string
  title: string
  date: string
  duration?: string
  status: 'scheduled' | 'completed'
  attendees: string[]
  owner?: string
  summary?: string
  /** Conteúdo-fonte usado no servidor para gerar o briefing com IA. */
  aiContext?: string
  href?: string
}

export interface ClientDocument {
  id: string
  title: string
  category: string
  description: string
  updatedAt?: string
  status: 'available' | 'draft' | 'coming-soon'
  href?: string
  external?: boolean
}

export type ClientProjectStatus =
  | 'active'
  | 'discovery'
  | 'proposed'
  | 'deferred'
  | 'done'

export interface ClientProject {
  id: string
  name: string
  pillar: string
  description: string
  status: ClientProjectStatus
  owner?: string
  priority?: 'Alta' | 'Média' | 'Baixa'
  updatedAt?: string
  href?: string
  tags?: string[]
}

export interface ClientWorkspace {
  id: string
  slug: string
  name: string
  sector: string
  tagline: string
  status: ClientStatus
  accent: string
  contacts: ClientContact[]
  stats: { label: string; value: string }[]
  /** Legado — clientes maduros usam `projects` no lugar. */
  onboarding?: {
    eyebrow: string
    title: string
    titleAccent: string
    steps: OnboardingStep[]
  }
  projects?: ClientProject[]
  docs: {
    eyebrow: string
    title: string
    titleAccent: string
    categories: DocCategory[]
    supportEmail: string
  }
  meetings?: ClientMeeting[]
  documents?: ClientDocument[]
  /** Repositórios GitHub que alimentam a aba Entregas. */
  delivery?: {
    repos: RepoConfig[]
    /** Esforço sem commits visíveis (infra, migrações) somado ao billing. */
    manualEffort?: ManualEffortItem[]
  }
}
