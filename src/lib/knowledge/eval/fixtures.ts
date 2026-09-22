import type { QuestionIntentKind } from '../intent'

export type KnowledgeEvalClass =
  | 'count'
  | 'list'
  | 'rank'
  | 'period'
  | 'status'
  | 'catalog'
  | 'flow'
  | 'ambiguous'
  | 'chitchat'

export interface KnowledgeEvalCase {
  id: string
  clientId: 'likeme' | 'be180-ooh' | 'cadence'
  question: string
  class: KnowledgeEvalClass
  expected: {
    intent: QuestionIntentKind
    needsClarification: boolean
    sourceId: 'cadence' | 'likeme-supabase' | 'be180-ativos' | 'be180-colmeia' | 'none'
    tables?: Array<{ schema: string; table: string }>
    rewrittenContains?: string
  }
}

export const KNOWLEDGE_EVAL_NOW = new Date('2026-09-21T15:00:00-03:00')

export const KNOWLEDGE_EVAL_CASES: KnowledgeEvalCase[] = [
  {
    id: 'lm-chitchat-oi',
    clientId: 'likeme',
    question: 'oi',
    class: 'chitchat',
    expected: { intent: 'chitchat', needsClarification: false, sourceId: 'none' },
  },
  {
    id: 'lm-count-users',
    clientId: 'likeme',
    question: 'Quantos usuários temos hoje na base do Like:Me?',
    class: 'count',
    expected: {
      intent: 'count',
      needsClarification: false,
      sourceId: 'likeme-supabase',
      tables: [{ schema: 'public', table: 'user' }],
    },
  },
  {
    id: 'lm-count-users-active-ambiguous',
    clientId: 'likeme',
    question: 'Quantos usuários ativos temos?',
    class: 'ambiguous',
    expected: {
      intent: 'count',
      needsClarification: true,
      sourceId: 'likeme-supabase',
      tables: [{ schema: 'public', table: 'user' }],
    },
  },
  {
    id: 'lm-period-signups',
    clientId: 'likeme',
    question: 'Quantos usuários entraram mês passado?',
    class: 'period',
    expected: {
      intent: 'count',
      needsClarification: false,
      sourceId: 'likeme-supabase',
      tables: [{ schema: 'public', table: 'user' }],
      rewrittenContains: '2026-08-01',
    },
  },
  {
    id: 'lm-catalog',
    clientId: 'likeme',
    question: 'Quais são as tabelas deste banco?',
    class: 'catalog',
    expected: { intent: 'catalog', needsClarification: false, sourceId: 'likeme-supabase' },
  },
  {
    id: 'lm-flow-health',
    clientId: 'likeme',
    question: 'Como é a jornada de saúde hoje?',
    class: 'flow',
    expected: { intent: 'flow', needsClarification: false, sourceId: 'none' },
  },
  {
    id: 'lm-workspace-backlog',
    clientId: 'likeme',
    question: 'Quantos cards existem no backlog do app?',
    class: 'count',
    expected: { intent: 'count', needsClarification: false, sourceId: 'cadence' },
  },
  {
    id: 'lm-list-communities',
    clientId: 'likeme',
    question: 'Quais comunidades existem no produto?',
    class: 'list',
    expected: { intent: 'list', needsClarification: false, sourceId: 'likeme-supabase' },
  },
  {
    id: 'lm-rank-marketplace',
    clientId: 'likeme',
    question: 'Qual o ranking de categorias mais usadas no marketplace?',
    class: 'rank',
    expected: { intent: 'rank', needsClarification: false, sourceId: 'likeme-supabase' },
  },
  {
    id: 'be-chitchat',
    clientId: 'be180-ooh',
    question: 'bom dia',
    class: 'chitchat',
    expected: { intent: 'chitchat', needsClarification: false, sourceId: 'none' },
  },
  {
    id: 'be-count-roteiros',
    clientId: 'be180-ooh',
    question: 'Quantos roteiros existem no Colmeia?',
    class: 'count',
    expected: {
      intent: 'count',
      needsClarification: false,
      sourceId: 'be180-colmeia',
      tables: [{ schema: 'dbo', table: 'roteiros' }],
    },
  },
  {
    id: 'be-count-campanhas',
    clientId: 'be180-ooh',
    question: 'Quantas campanhas temos no planejador?',
    class: 'count',
    expected: { intent: 'count', needsClarification: false, sourceId: 'be180-colmeia' },
  },
  {
    id: 'be-count-inventario',
    clientId: 'be180-ooh',
    question: 'Quantos pontos de inventário estão no Banco de Ativos?',
    class: 'count',
    expected: {
      intent: 'count',
      needsClarification: false,
      sourceId: 'be180-ativos',
      tables: [{ schema: 'public', table: 'bancoAtivosJoin_ft' }],
    },
  },
  {
    id: 'be-count-exibidores',
    clientId: 'be180-ooh',
    question: 'Quantos exibidores temos no inventário?',
    class: 'count',
    expected: {
      intent: 'count',
      needsClarification: false,
      sourceId: 'be180-ativos',
      tables: [{ schema: 'public', table: 'exibidor' }],
    },
  },
  {
    id: 'be-period-roteiros',
    clientId: 'be180-ooh',
    question: 'Quantos roteiros o Colmeia criou mês passado?',
    class: 'period',
    expected: {
      intent: 'count',
      needsClarification: false,
      sourceId: 'be180-colmeia',
      rewrittenContains: '2026-08-31',
    },
  },
  {
    id: 'be-ambiguous-quantos',
    clientId: 'be180-ooh',
    question: 'Quantos temos hoje?',
    class: 'ambiguous',
    expected: { intent: 'count', needsClarification: true, sourceId: 'none' },
  },
  {
    id: 'be-flow-roteiro',
    clientId: 'be180-ooh',
    question: 'Como o Colmeia monta um roteiro?',
    class: 'flow',
    expected: { intent: 'flow', needsClarification: false, sourceId: 'none' },
  },
  {
    id: 'be-workspace-meeting',
    clientId: 'be180-ooh',
    question: 'O que combinamos na reunião de inventário?',
    class: 'flow',
    expected: { intent: 'flow', needsClarification: false, sourceId: 'cadence' },
  },
  {
    id: 'be-workspace-meeting-typo',
    clientId: 'be180-ooh',
    question: 'o que famos em nossa primeira reuniao ?',
    class: 'flow',
    expected: { intent: 'flow', needsClarification: false, sourceId: 'cadence' },
  },
  {
    id: 'be-catalog',
    clientId: 'be180-ooh',
    question: 'Liste as tabelas do catálogo',
    class: 'catalog',
    expected: { intent: 'catalog', needsClarification: false, sourceId: 'none' },
  },
  {
    id: 'be-status-campanha',
    clientId: 'be180-ooh',
    question: 'Qual o status das campanhas no Colmeia?',
    class: 'status',
    expected: { intent: 'status', needsClarification: false, sourceId: 'be180-colmeia' },
  },
  {
    id: 'cd-count-cards',
    clientId: 'cadence',
    question: 'Quantos cards estão prontos no backlog?',
    class: 'count',
    expected: { intent: 'count', needsClarification: false, sourceId: 'cadence' },
  },
  {
    id: 'cd-list-prs',
    clientId: 'cadence',
    question: 'Quais PRs foram mergeados recentemente?',
    class: 'list',
    expected: { intent: 'list', needsClarification: false, sourceId: 'cadence' },
  },
  {
    id: 'cd-chitchat',
    clientId: 'cadence',
    question: 'olá',
    class: 'chitchat',
    expected: { intent: 'chitchat', needsClarification: false, sourceId: 'none' },
  },
  {
    id: 'lm-trap-auth-users',
    clientId: 'likeme',
    question: 'Quantas pessoas temos na base?',
    class: 'count',
    expected: {
      intent: 'count',
      needsClarification: false,
      sourceId: 'likeme-supabase',
      tables: [{ schema: 'public', table: 'user' }],
    },
  },
  {
    id: 'lm-flow-community',
    clientId: 'likeme',
    question: 'Como a empresa trata uma interação na comunidade hoje?',
    class: 'flow',
    expected: { intent: 'flow', needsClarification: false, sourceId: 'none' },
  },
]
