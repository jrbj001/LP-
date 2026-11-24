import { WORKSPACE_ASK } from '@/lib/knowledge/routing'
import { WORKSPACE_SOURCES } from '@/lib/knowledge/source-guide'

/** Mais estreito que o do orquestrador: "hoje" e "temos" sozinhos são conversa, não consulta. */
const FACT_ASK = /\b(quantos?|quantas|total|quantidade|n[uú]mero|lista|liste|ranking|m[eé]dia|status)\b/i

/**
 * Sinais de dado operacional. Não inclui "ativo" no singular: em conversa é adjetivo
 * ("o time está ativo") e mandaria uma pergunta genérica para a pesquisa.
 */
const NOTION_ASK = /\bnotion\b/i

const DATA_TOPIC =
  /\b(banco de dados|tabelas?|sql|usu[aá]rios?|pontos? de m[ií]dia|roteiros?|campanhas?|invent[aá]rio|exibidor\w*|amostras?|lotes?|registros?|m[eé]tricas?|pedidos?|vendas?)\b/i

/**
 * true quando a pergunta pede fato, código, reunião, documento ou dado.
 * false para conversa, opinião e tema genérico: esses respondem na hora, sem pesquisa.
 */
export function questionNeedsLookup(question: string): boolean {
  const text = question.trim()
  if (!text) return false
  if (FACT_ASK.test(text) || WORKSPACE_ASK.test(text) || DATA_TOPIC.test(text) || NOTION_ASK.test(text)) return true
  return WORKSPACE_SOURCES.some(source => source.askPattern.test(text))
}
