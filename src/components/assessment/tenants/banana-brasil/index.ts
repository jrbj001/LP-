import type { AssessmentWorkspace, AssessmentDocument } from '@/lib/assessment/types'
import { home } from './home'
import { diagnostic } from './diagnostic'
import { layer } from './layer'

const documents: AssessmentDocument[] = [
  {
    name: 'NDA e autorização LGPD',
    type: 'Página web · aceite',
    size: 'Confidencialidade + tratamento de dados · dar ok',
    status: 'available',
    href: '/adaptive/banana-brasil/lgpd-nda',
    highlight: true,
  },
  {
    name: 'Como funciona a Adaptive Layer™',
    type: 'Página web · metodologia',
    size: 'Guia visual · camada + agentes',
    status: 'available',
    href: '/adaptive/banana-brasil/como-funciona',
  },
  {
    name: 'Diagnóstico Digital — mercado + operação',
    type: 'Página web',
    size: 'Demanda, canal, UGC, benchmarks e recomendações',
    status: 'available',
    href: '/adaptive/banana-brasil/diagnostico',
  },
  {
    name: 'Adaptive Layer™ — aplicação ao stack',
    type: 'Página web',
    size: 'Sistemas, agentes, alertas e quick wins',
    status: 'available',
    href: '/adaptive/banana-brasil/adaptive-layer',
  },
  {
    name: 'Análise de Mercado & Diagnóstico Digital (referência)',
    type: 'Documento web',
    size: 'Peça de pesquisa original',
    status: 'available',
    external: '/apresentacoes/banana-brasil/index.html',
  },
  { name: 'Adaptive Roadmap™ — QW → Layer → IA', type: 'PDF', size: 'liberação pós-review', status: 'locked' },
]

export const bananaBrasil: AssessmentWorkspace = {
  client: {
    id: 'banana-brasil',
    slug: 'banana-brasil',
    name: 'Banana Brasil',
    sector: 'Snacks saudáveis · CPG',
    accent: '#F5B301',
    tagline: 'Ativos maduros, motor verde: a lacuna é de motor de demanda e de instrumentação.',
  },
  features: ['home', 'lgpdNda', 'framework', 'diagnostico', 'adaptiveLayer', 'documentos'],
  password: 'bananapixel2026',
  home,
  diagnostic,
  layer,
  documents,
}
