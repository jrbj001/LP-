import { isOrientationAsk } from './welcome'

export type CopilotIntent = 'orient' | 'numbers' | 'workspace' | 'code' | 'story' | 'mixed' | 'unclear'
export type CopilotTool = 'sql' | 'workspace' | 'github'

export interface CopilotTriage {
  intent: CopilotIntent
  tools: CopilotTool[]
}

export function wantsStoryNow(message: string): boolean {
  return /user story|rascunho completo da user story|escreva a user story|escreva uma user story|gerar rascunho|aplicar no board/i.test(
    message
  )
}

const NUMBERS =
  /\b(quantos?|quantas|quantidade|total|ranking|m[eé]dia|somat[oó]rio)\b/i
const WORKSPACE =
  /\b(reuni[aã]o|atas?|combinamos|documento|portal|briefing|o que ficou|o que combin)\b/i
const CODE =
  /\b(como (o |a |os |as )?(colmeia|banco|fluxo|c[oó]digo|handler|endpoint|sistema)|monta(r| um)? roteiro|handler|endpoint|reposit[oó]rio|github|tabela no c[oó]digo|fluxo no c[oó]digo)\b/i

function flags(message: string) {
  return {
    story: wantsStoryNow(message),
    numbers: NUMBERS.test(message),
    workspace: WORKSPACE.test(message),
    code: CODE.test(message),
  }
}

/**
 * WhatsApp e web compartilham o mesmo Copiloto.
 * Saudação: nenhum agente.
 * Todo o resto: workspace sempre + agente de dados (ele decide se consulta).
 * Código só quando o pedido é de fluxo ou implementação.
 */
function toolsFor(intent: CopilotIntent, found: ReturnType<typeof flags>): CopilotTool[] {
  if (intent === 'orient') return []
  const tools: CopilotTool[] = ['sql', 'workspace']
  if (intent === 'code' || intent === 'story' || found.code) {
    tools.push('github')
  }
  return tools
}

function primaryIntent(found: ReturnType<typeof flags>): CopilotIntent {
  const hits = (['story', 'numbers', 'workspace', 'code'] as const).filter(key => found[key])
  if (hits.length === 0) return 'unclear'
  if (hits.length === 1) {
    if (found.story) return 'story'
    if (found.numbers) return 'numbers'
    if (found.workspace) return 'workspace'
    return 'code'
  }
  return 'mixed'
}

/** Escolhe a faixa do Copiloto. O canal não muda as ferramentas. */
export function triageCopilotAsk(input: {
  message: string
  channel?: string
}): CopilotTriage {
  const message = input.message.trim()
  if (isOrientationAsk(message)) {
    return { intent: 'orient', tools: [] }
  }
  const found = flags(message)
  const intent = primaryIntent(found)
  return { intent, tools: toolsFor(intent, found) }
}
