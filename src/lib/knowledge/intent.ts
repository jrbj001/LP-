export const KNOWLEDGE_TIME_ZONE = 'America/Sao_Paulo'

export type QuestionIntentKind =
  | 'count'
  | 'list'
  | 'rank'
  | 'status'
  | 'catalog'
  | 'flow'
  | 'chitchat'
  | 'unclear'

export type KnowledgeSourceHint =
  | 'cadence'
  | 'likeme-production'
  | 'be180-colmeia'
  | 'be180-ativos'
  | 'none'

export interface KnowledgeTimeRange {
  from: string
  to: string
  label: string
}

export interface QuestionIntent {
  intent: QuestionIntentKind
  metric: string | null
  entity: string | null
  dimensions: string[]
  filters: Record<string, string>
  timeRange: KnowledgeTimeRange | null
  sourceHint: KnowledgeSourceHint
  confidence: number
  needsClarification: boolean
  clarifyingQuestion: string | null
  rewrittenQuestion: string
}

export interface QuestionClarification {
  originalQuestion: string
  question: string
  options: string[]
}

export interface ResolvedQuestionIntent {
  intent: QuestionIntent
  researchQuestion: string
  clarification: QuestionClarification | null
}

const CHITCHAT =
  /^(oi|ol[aá]|hey|hello|bom dia|boa tarde|boa noite|obrigad[oa]|valeu|ok|beleza)[\s!.?]*$/i
const ORIENT =
  /^(ajuda|help|menu|o que (voc[eê]|tu) (faz|pode)|come[cç]ar)\b/i
const COUNT = /\b(quantos?|quantas|quantidade|total|n[uú]mero|contagem|existem|temos)\b/i
const LIST = /\b(lista|liste|quais\b|mostra|me (mostra|traga))\b/i
const RANK = /\b(ranking|top\s*\d+|mais (recente|vendid|usado)|principais)\b/i
const STATUS = /\b(status|situa[cç][aã]o|pendente|publicado|ativo|inativo)\b/i
const CATALOG =
  /\b(quais (s[aã]o )?as tabelas|listar (as )?tabelas|liste as tabelas|cat[aá]logo|todas as tabelas)\b/i
const FLOW =
  /\b(como (o |a |os |as )?(colmeia|banco|fluxo|c[oó]digo|sistema|empresa|time|opera[cç][aã]o|produto)|como .{0,40}\b(funciona|trata|acontece)|monta(r| um)? roteiro|jornada|funil)\b/i
const WORKSPACE =
  /\b(cards?|backlog|prs?|pull requests?|commits?|reuni[aã]o|reuni[oõ]es|atas?|documentos?|workspace|cadence)\b/i
/** Pergunta de memória: o que foi dito, combinado ou decidido — busca evidência, não número. */
const RECALL =
  /\b(combinamos|falamos|conversamos|decidimos|discutimos|tratamos|ficou (definido|combinado|decidido)|foi (dito|combinado|decidido))\b/i
const PERIOD = /\b(hoje|ontem|semana|m[eê]s|ano|atualmente|passad[oa]|[uú]ltim[oa]s?)\b/i

function lastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
}

export function calendarDateInTimeZone(
  date: Date,
  timeZone = KNOWLEDGE_TIME_ZONE
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const pick = (type: string) => Number(parts.find(part => part.type === type)?.value)
  return { year: pick('year'), month: pick('month'), day: pick('day') }
}

export function previousCalendarMonth(
  date: Date,
  timeZone = KNOWLEDGE_TIME_ZONE
): KnowledgeTimeRange {
  const { year, month } = calendarDateInTimeZone(date, timeZone)
  const previous = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 }
  const last = lastDayOfMonth(previous.year, previous.month - 1)
  const from = `${previous.year}-${String(previous.month).padStart(2, '0')}-01`
  const to = `${previous.year}-${String(previous.month).padStart(2, '0')}-${String(last).padStart(2, '0')}`
  return { from, to, label: 'mês passado' }
}

export function rewriteQuestionWithTime(
  question: string,
  now: Date = new Date(),
  timeZone = KNOWLEDGE_TIME_ZONE
): { rewritten: string; timeRange: KnowledgeTimeRange | null } {
  if (!/\bm[eê]s passado\b/i.test(question)) {
    return { rewritten: question.trim(), timeRange: null }
  }
  const timeRange = previousCalendarMonth(now, timeZone)
  const rewritten = question
    .trim()
    .replace(
      /\bm[eê]s passado\b/gi,
      `entre ${timeRange.from} e ${timeRange.to} (fuso ${timeZone})`
    )
  return { rewritten, timeRange }
}

function sourceHintFor(clientId: string, question: string): KnowledgeSourceHint {
  if (WORKSPACE.test(question)) return 'cadence'
  if (clientId === 'likeme') {
    if (/\b(usu[aá]rios?|comunidade|marketplace|assinatur|produto)\b/i.test(question)) {
      return 'likeme-production'
    }
  }
  if (clientId === 'be180-ooh') {
    if (/\b(invent[aá]rio|pontos?|exibidor|media kit|ativos?)\b/i.test(question)) {
      return 'be180-ativos'
    }
    if (/\b(colmeia|roteiros?|campanhas?|planejador)\b/i.test(question)) {
      return 'be180-colmeia'
    }
  }
  return 'none'
}

function classifyIntent(question: string): QuestionIntentKind {
  const text = question.trim()
  if (!text || CHITCHAT.test(text) || ORIENT.test(text)) return 'chitchat'
  if (CATALOG.test(text)) return 'catalog'
  if (RECALL.test(text) && !COUNT.test(text)) return 'flow'
  // "o que ... reunião/ata/documento" busca o que ficou registrado, mesmo com erro de digitação no verbo.
  if (WORKSPACE.test(text) && /\bo que\b/i.test(text) && !COUNT.test(text)) return 'flow'
  if (FLOW.test(text) && !COUNT.test(text)) return 'flow'
  if (RANK.test(text)) return 'rank'
  if (/\b(quantos?|quantas|quantidade|total|contagem)\b/i.test(text)) return 'count'
  if (LIST.test(text)) return 'list'
  if (COUNT.test(text)) return 'count'
  if (STATUS.test(text)) return 'status'
  if (FLOW.test(text)) return 'flow'
  return 'unclear'
}

function entityFor(question: string): string | null {
  if (/\busu[aá]rios?\b/i.test(question)) return 'usuario'
  if (/\broteiros?\b/i.test(question)) return 'roteiro'
  if (/\bcampanhas?\b/i.test(question)) return 'campanha'
  if (/\binvent[aá]rio|exibidor|pontos?\b/i.test(question)) return 'inventario'
  if (/\bcards?\b/i.test(question)) return 'card'
  if (/\btabelas?\b/i.test(question)) return 'tabela'
  return null
}

function clarificationFor(
  clientId: string,
  question: string,
  intent: QuestionIntentKind,
  entity: string | null,
  sourceHint: KnowledgeSourceHint
): { needsClarification: boolean; clarifyingQuestion: string | null; confidence: number } {
  if (intent === 'chitchat' || intent === 'catalog' || intent === 'flow') {
    return { needsClarification: false, clarifyingQuestion: null, confidence: 0.9 }
  }

  // Workspace (reuniões, atas, documentos, backlog) se resolve pela busca de evidência.
  if (sourceHint === 'cadence') {
    return { needsClarification: false, clarifyingQuestion: null, confidence: 0.75 }
  }

  if (clientId === 'likeme' && entity === 'usuario' && /\bativos?\b/i.test(question)) {
    return {
      needsClarification: true,
      clarifyingQuestion:
        'Você quer o total cadastrado em public.user, só quem está ativo no produto, ou identidades do login (auth.users)?',
      confidence: 0.45,
    }
  }

  if (
    clientId === 'be180-ooh' &&
    COUNT.test(question) &&
    sourceHint === 'none' &&
    !entity
  ) {
    return {
      needsClarification: true,
      clarifyingQuestion:
        'Isso é volume do Colmeia (roteiros/campanhas) ou do Banco de Ativos (inventário/pontos)?',
      confidence: 0.35,
    }
  }

  // Sem um eixo de ambiguidade que dê para nomear, pesquisar é melhor que perguntar de volta.
  if (intent === 'unclear') {
    return { needsClarification: false, clarifyingQuestion: null, confidence: 0.4 }
  }

  const factual = intent === 'count' || intent === 'list' || intent === 'rank'
  const confidence =
    factual && sourceHint !== 'none' ? 0.86 : factual ? 0.62 : PERIOD.test(question) ? 0.7 : 0.55
  return { needsClarification: false, clarifyingQuestion: null, confidence }
}

export function inferQuestionIntent(input: {
  clientId: string
  question: string
  now?: Date
}): QuestionIntent {
  const question = input.question.trim()
  const { rewritten, timeRange } = rewriteQuestionWithTime(question, input.now)
  const intent = classifyIntent(question)
  const entity = entityFor(question)
  const sourceHint = sourceHintFor(input.clientId, question)
  const metric = intent === 'count' ? 'total' : intent === 'rank' ? 'ranking' : null
  const { needsClarification, clarifyingQuestion, confidence } = clarificationFor(
    input.clientId,
    question,
    intent,
    entity,
    sourceHint
  )

  return {
    intent,
    metric,
    entity,
    dimensions: [],
    filters: {},
    timeRange,
    sourceHint,
    confidence,
    needsClarification,
    clarifyingQuestion,
    rewrittenQuestion: rewritten,
  }
}

function clarificationOptions(intent: QuestionIntent): string[] {
  if (intent.sourceHint === 'likeme-production' && intent.entity === 'usuario') {
    return [
      'Total cadastrado no produto',
      'Só quem está ativo no produto',
      'Identidades de login do Supabase Auth',
    ]
  }
  if (intent.sourceHint === 'none') {
    return ['Colmeia: roteiros e campanhas', 'Banco de Ativos: inventário e pontos']
  }
  return []
}

/**
 * Resolve a pergunta efetiva do turno. Se o turno anterior pediu uma
 * clarificação, a resposta curta da pessoa é anexada à pergunta original e o
 * gate não pergunta novamente.
 */
export function resolveQuestionIntent(input: {
  clientId: string
  question: string
  pendingClarification?: QuestionClarification | null
  now?: Date
}): ResolvedQuestionIntent {
  const original = input.pendingClarification?.originalQuestion
  const researchQuestion = original
    ? `${original}\nEsclarecimento da pessoa: ${input.question.trim()}`
    : input.question.trim()
  const inferred = inferQuestionIntent({
    clientId: input.clientId,
    question: researchQuestion,
    now: input.now,
  })

  if (input.pendingClarification) {
    return {
      researchQuestion: inferred.rewrittenQuestion,
      intent: {
        ...inferred,
        needsClarification: false,
        clarifyingQuestion: null,
      },
      clarification: null,
    }
  }

  if (!inferred.needsClarification || !inferred.clarifyingQuestion) {
    return {
      intent: inferred,
      researchQuestion: inferred.rewrittenQuestion,
      clarification: null,
    }
  }

  return {
    intent: inferred,
    researchQuestion: inferred.rewrittenQuestion,
    clarification: {
      originalQuestion: input.question.trim(),
      question: inferred.clarifyingQuestion,
      options: clarificationOptions(inferred),
    },
  }
}

export function parseQuestionIntent(
  value: unknown,
  fallback: { clientId: string; question: string; now?: Date }
): QuestionIntent {
  const inferred = inferQuestionIntent(fallback)
  if (!value || typeof value !== 'object') return inferred
  const raw = value as Record<string, unknown>
  const kinds: QuestionIntentKind[] = [
    'count',
    'list',
    'rank',
    'status',
    'catalog',
    'flow',
    'chitchat',
    'unclear',
  ]
  const intent = kinds.includes(raw.intent as QuestionIntentKind)
    ? (raw.intent as QuestionIntentKind)
    : inferred.intent
  const hints: KnowledgeSourceHint[] = [
    'cadence',
    'likeme-production',
    'be180-colmeia',
    'be180-ativos',
    'none',
  ]
  const sourceHint = hints.includes(raw.sourceHint as KnowledgeSourceHint)
    ? (raw.sourceHint as KnowledgeSourceHint)
    : inferred.sourceHint
  const rewritten =
    typeof raw.rewrittenQuestion === 'string' && raw.rewrittenQuestion.trim()
      ? raw.rewrittenQuestion.trim()
      : inferred.rewrittenQuestion
  const confidence =
    typeof raw.confidence === 'number' && raw.confidence >= 0 && raw.confidence <= 1
      ? raw.confidence
      : inferred.confidence

  return {
    intent,
    metric: typeof raw.metric === 'string' ? raw.metric : inferred.metric,
    entity: typeof raw.entity === 'string' ? raw.entity : inferred.entity,
    dimensions: Array.isArray(raw.dimensions)
      ? raw.dimensions.filter((item): item is string => typeof item === 'string')
      : inferred.dimensions,
    filters:
      raw.filters && typeof raw.filters === 'object' && !Array.isArray(raw.filters)
        ? Object.fromEntries(
            Object.entries(raw.filters as Record<string, unknown>).filter(
              (entry): entry is [string, string] => typeof entry[1] === 'string'
            )
          )
        : inferred.filters,
    timeRange: inferred.timeRange,
    sourceHint,
    confidence,
    needsClarification:
      typeof raw.needsClarification === 'boolean' ? raw.needsClarification : inferred.needsClarification,
    clarifyingQuestion:
      typeof raw.clarifyingQuestion === 'string' ? raw.clarifyingQuestion : inferred.clarifyingQuestion,
    rewrittenQuestion: rewritten,
  }
}
