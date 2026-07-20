import type { RepoConfig } from '@/lib/delivery/types'

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
  onboarding: {
    eyebrow: string
    title: string
    titleAccent: string
    steps: OnboardingStep[]
  }
  docs: {
    eyebrow: string
    title: string
    titleAccent: string
    categories: DocCategory[]
    supportEmail: string
  }
  /** Repositórios GitHub que alimentam a aba Entregas. */
  delivery?: {
    repos: RepoConfig[]
  }
}
