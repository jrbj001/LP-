import { WORKSPACE_ASK } from '@/lib/knowledge/routing'
import { WORKSPACE_SOURCES } from '@/lib/knowledge/source-guide'
import { isSelfIntro } from './intro'

/** Mais estreito que o do orquestrador: "hoje" e "temos" sozinhos são conversa, não consulta. */
const FACT_ASK = /\b(quantos?|quantas|total|quantidade|n[uú]mero|lista|liste|ranking|m[eé]dia|status)\b/i

/**
 * Sinais de dado operacional. Não inclui "ativo" no singular: em conversa é adjetivo
 * ("o time está ativo") e mandaria uma pergunta genérica para a pesquisa.
 */
const NOTION_ASK = /\b(notion|monday)\b/i

const DATA_TOPIC =
  /\b(banco de dados|tabelas?|sql|usu[aá]rios?|pontos? de m[ií]dia|roteiros?|campanhas?|invent[aá]rio|exibidor\w*|amostras?|lotes?|registros?|m[eé]tricas?|pedidos?|vendas?)\b/i

/** Na reunião, "Cadence" é o nome dele. Sozinho na frase, é chamado, não pedido de workspace. */
const AGENT_NAME = /\bcad[eê]nce\b/gi

/**
 * true quando a pergunta pede fato, código, reunião, documento ou dado.
 * false para conversa, opinião, apresentação e tema genérico: esses respondem na hora, sem pesquisa.
 */
export function questionNeedsLookup(question: string): boolean {
  const text = question.trim()
  if (!text) return false
  if (isSelfIntro(text)) return false
  const withoutName = text.replace(AGENT_NAME, ' ')
  if (FACT_ASK.test(withoutName) || WORKSPACE_ASK.test(withoutName) || DATA_TOPIC.test(withoutName) || NOTION_ASK.test(withoutName)) {
    return true
  }
  return WORKSPACE_SOURCES.some(source => source.askPattern.test(withoutName))
}
