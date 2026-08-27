import {
  Home, Layers, FileBarChart, Server, FileText, BookOpen, ShieldCheck,
} from 'lucide-react'
import type { AssessmentWorkspace, AssessmentFeature, AssessmentNavItem } from './types'
import { bananaBrasil } from '@/components/assessment/tenants/banana-brasil'

const ASSESSMENTS: AssessmentWorkspace[] = [bananaBrasil]

/**
 * Segmentos estáticos sob /adaptive que NÃO podem ser usados como slug de
 * cliente (senão a rota dinâmica [clientId] colidiria com uma página real).
 * Inclui as rotas legadas do Orfeu e a metodologia compartilhada.
 */
export const RESERVED_SLUGS = new Set<string>([
  'framework', 'onboard', 'my-area', 'projects', 'dashboard', 'onboarding',
  'meetings', 'processo-b2b', 'executive-review', 'documents', 'adaptive-layer',
  'proposta', 'discovery', 'como-funciona',
])

export function listAssessments(): AssessmentWorkspace[] {
  return ASSESSMENTS
}

export function getAssessment(slug: string): AssessmentWorkspace | undefined {
  if (RESERVED_SLUGS.has(slug)) return undefined
  return ASSESSMENTS.find(a => a.client.slug === slug || a.client.id === slug)
}

export function isAssessmentSlug(slug: string): boolean {
  return getAssessment(slug) !== undefined
}

// ─── Navegação derivada das features ────────────────────────────────────────
const FEATURE_NAV: Partial<Record<AssessmentFeature, Omit<AssessmentNavItem, 'absolute'>>> = {
  home:          { label: 'Home',            href: '',                icon: Home },
  lgpdNda:       { label: 'NDA & LGPD',      href: '/lgpd-nda',       icon: ShieldCheck },
  framework:     { label: 'Framework',       href: '/framework',      icon: Layers },
  diagnostico:   { label: 'Diagnóstico',     href: '/diagnostico',    icon: FileBarChart },
  adaptiveLayer: { label: 'Adaptive Layer™', href: '/adaptive-layer', icon: Server },
  documentos:    { label: 'Documentos',      href: '/documentos',     icon: FileText },
}

const FEATURE_ORDER: AssessmentFeature[] = [
  'home', 'lgpdNda', 'framework', 'diagnostico', 'adaptiveLayer', 'documentos',
]

/**
 * Item fixo: metodologia didática. Fica sob a base do tenant para o cliente
 * não perder o contexto do próprio assessment ao abri-la.
 */
export const HOW_IT_WORKS_NAV: AssessmentNavItem = {
  label: 'Como funciona a Layer',
  href: '/como-funciona',
  icon: BookOpen,
}

export function navForAssessment(workspace: AssessmentWorkspace): AssessmentNavItem[] {
  const items = FEATURE_ORDER
    .filter(f => workspace.features.includes(f) && FEATURE_NAV[f])
    .map(f => FEATURE_NAV[f]!)
  return [...items, HOW_IT_WORKS_NAV]
}
