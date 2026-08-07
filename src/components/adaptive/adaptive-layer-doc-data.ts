// Documento exclusivo — Adaptive Layer™ · Grupo Orfeu
// Introdução + sistemas legados atuais + squad de agentes.

import { ADAPTIVE_LAYER } from '@/components/adaptive/executive-review-data'
import {
  AGENT_LOOP,
  AGENT_WALKTHROUGH,
  OTD_AGENTS,
  OTD_AI_OPPORTUNITIES,
} from '@/lib/adaptive/b2b-process/agents'

export const LAYER_DOC_META = {
  password: 'orfeu-layer',
  title: 'Adaptive Layer™',
  client: 'Grupo Orfeu',
  date: '07/08/2026',
  validity: 'Documento exclusivo · compartilhável com senha',
  path: '/adaptive/adaptive-layer',
}

export const LAYER_INTRO = {
  eyebrow: 'Documento técnico-executivo',
  title: 'O que é a Adaptive Layer™ — e por que ela entra agora',
  lead:
    'A Orfeu já tem sistemas. O que falta é uma camada que os faça conversar sem redigitação, sem planilha e sem back-office no meio do pedido.',
  narrative: [
    'Nas discoveries, o padrão se repetiu: Protheus, WMS, portal, EDI e Jornada do Vendedor resolvem pedaços da operação — mas o order-to-delivery ainda depende de intervenções humanas entre essas etapas. Cada passagem manual cria risco de margem, atraso e retrabalho.',
    'A Adaptive Layer™ não substitui esses sistemas. Ela é a entrega-mãe: conectores, eventos e uma verdade operacional única sobre o pedido. Os quick wins OTD nascem plugados nela; o LLM e os agentes só sobem quando o fluxo já está limpo e rastreável.',
    'Este documento detalha três camadas da decisão: (1) o sistema legado atual e o papel de cada um; (2) o que a Adaptive Layer™ faz entre eles; (3) o squad de agentes que opera sobre a camada.',
  ],
  principles: [
    {
      title: 'Não substituir',
      detail: 'Protheus, WMS, portal, EDI e JV continuam. A Layer conecta — não reinventa o ERP.',
    },
    {
      title: 'Pedido como verdade',
      detail: 'Cada evento do order-to-delivery (crédito, NF, ruptura, EDI) fica auditável numa linha do tempo.',
    },
    {
      title: 'QW → Layer → IA',
      detail: 'Primeiro eliminamos a intervenção manual; depois a Layer estabiliza; só então agentes e LLM entram.',
    },
    {
      title: 'Uma jornada, vários agentes',
      detail: 'Agentes especializados por etapa, orquestrados sobre a mesma Adaptive Layer™ — sem bases paralelas.',
    },
  ],
}

export interface LegacySystem {
  id: string
  name: string
  role: string
  today: string
  pain: string
  layerRole: string
  owners: string
}

/** Sistemas legados atuais da Orfeu — o que a Layer conecta sem substituir. */
export const LEGACY_SYSTEMS: LegacySystem[] = [
  {
    id: 'protheus',
    name: 'Protheus (TOTVS)',
    role: 'ERP core · regras fiscais, crédito, faturamento e estoque',
    today:
      'Sistema-mãe com 400+ regras. Concentra liberação de pedido, crédito, NF-e e boa parte do back-office B2B.',
    pain:
      'Exceções e regras pouco documentadas viram fila humana. Faturamento B2B ainda exige intervenção; status do pedido não flui sozinho para o comercial.',
    layerRole:
      'Conector de eventos e consultas (pedido, crédito, NF, saldo). A Layer não reescreve o ERP — expõe o que o fluxo OTD precisa, com guardrails.',
    owners: 'André · TI · Financeiro',
  },
  {
    id: 'wms',
    name: 'WMS',
    role: 'Armazém · separação, conferência e expedição',
    today: 'Opera a logística física do pedido após a liberação no Protheus.',
    pain:
      'Desvios de separação/volumetria e handoffs manuais com o ERP geram retrabalho e atraso antes do EDI.',
    layerRole:
      'Sincroniza status de separação/expedição com o pedido na Layer, para tracking e agentes de logística.',
    owners: 'Gustavo · Ricardo Silva · Logística',
  },
  {
    id: 'portal',
    name: 'Portal de Vendas',
    role: 'Canal B2B · entrada e acompanhamento de pedidos',
    today: 'Ponto de contato digital do cliente/comercial para pedidos e consultas.',
    pain:
      'Nem todo o fluxo OTD (crédito, ruptura, tracking) está fechado no portal; parte ainda depende de telefone, e-mail e planilha.',
    layerRole:
      'Consome a verdade do pedido na Layer — status, pendências e próximos passos sem redigitar no Protheus.',
    owners: 'Cristiane · Selton · Comercial',
  },
  {
    id: 'edi',
    name: 'EDI / transportadoras',
    role: 'Integração logística · status de coleta e entrega',
    today: 'Troca eletrônica de documentos e status com operadores logísticos.',
    pain:
      'Atrasos e exceções chegam tarde; o comercial só descobre quando o cliente cobra.',
    layerRole:
      'Eventos de EDI entram na linha do tempo do pedido; agentes antecipam risco de SLA.',
    owners: 'Logística · Cristiane',
  },
  {
    id: 'jv',
    name: 'Jornada do Vendedor (JV)',
    role: 'App comercial · funil, visita, proposta e relacionamento',
    today: 'Ferramenta do time de campo/comercial para prospecção e negociação B2B/HORECA.',
    pain:
      'Proposta, pricing e recompra ainda quebram o fluxo (Word, e-mail, planilha) antes de chegar ao ERP.',
    layerRole:
      'Leva proposta/pedido e traz status/risco/recompra do OTD limpo — sem silo paralelo.',
    owners: 'Cristiane · Selton · Executivos de Vendas',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    role: 'E-commerce B2C / canais digitais',
    today: 'Canal digital de venda (e-commerce), com faturamento B2C já mais automatizado que o B2B.',
    pain:
      'Experiência digital B2C avançou; B2B ainda não tem o mesmo grau de automação ponta a ponta.',
    layerRole:
      'Ponto de integração satélite na mesma Layer — sem misturar regras B2B e B2C.',
    owners: 'Digital · TI',
  },
  {
    id: 'suri',
    name: 'Suri',
    role: 'Atendimento / CX',
    today: 'Canal de atendimento ao cliente e tickets.',
    pain:
      'Contexto do pedido (status, ruptura, crédito) nem sempre chega junto do chamado.',
    layerRole:
      'Enriquece o atendimento com o estado do pedido na Layer — menos “vou verificar e retorno”.',
    owners: 'CX · Comercial',
  },
  {
    id: 'cropster',
    name: 'Cropster',
    role: 'Qualidade · torra e perfil de café',
    today: 'Dados de qualidade e processo de torra — trilha satélite ao OTD comercial.',
    pain:
      'Informação de qualidade não flui automaticamente para decisões comerciais/CX.',
    layerRole:
      'Plug futuro na mesma Layer (qualidade → narrativa e recompra), sem competir com QWs OTD.',
    owners: 'Qualidade · Operações',
  },
  {
    id: 'opsfactor',
    name: 'OpsFactor / sensores',
    role: 'Indústria 4.0 · telemetria e chão de fábrica',
    today: 'Sensores e operação industrial — roadmap paralelo (não é o drive OTD).',
    pain:
      'Dados industriais ainda não entram no mesmo modelo de eventos do pedido.',
    layerRole:
      'Opção futura na Layer; fora do escopo-base OTD → Layer → agentes.',
    owners: 'Operações · TI',
  },
]

export const LAYER_DETAILS = {
  title: 'Como a camada funciona entre o legado e a IA',
  subtitle: 'Quatro capacidades da Adaptive Layer™ — o meio-campo entre sistemas e agentes',
  capabilities: [
    {
      id: 'integration',
      title: 'Integração & eventos',
      detail:
        'Conectores dedicados publicam o que importa do Protheus, WMS, portal, EDI e JV: pedido criado, crédito liberado, NF emitida, ruptura, coleta, entrega.',
    },
    {
      id: 'data',
      title: 'Dados unificados',
      detail:
        'Uma linha do tempo do pedido B2B — quem tocou, o que mudou, qual exceção. Sem BI paralelo e sem planilha como fonte da verdade.',
    },
    {
      id: 'apis',
      title: 'APIs & automação',
      detail:
        'Quick wins e automações (faturamento B2B, tracking, pricing no fluxo) consomem a mesma API. Cada QW amplia a Layer.',
    },
    {
      id: 'security',
      title: 'Segurança & LGPD',
      detail:
        'Acesso, auditoria e isolamento por desenho — requisito do CEO e pré-condição para LLM/agentes sobre dados reais.',
    },
  ],
  formula: ADAPTIVE_LAYER.tagline,
  unlocks: ADAPTIVE_LAYER.unlocks,
}

export { OTD_AGENTS, OTD_AI_OPPORTUNITIES, AGENT_LOOP, AGENT_WALKTHROUGH, ADAPTIVE_LAYER }
