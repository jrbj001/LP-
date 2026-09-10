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

function toolsFor(intent: CopilotIntent, channel?: string): CopilotTool[] {
  if (channel !== 'whatsapp') {
    return intent === 'orient' ? [] : ['sql', 'workspace', 'github']
  }
  switch (intent) {
    case 'orient':
    case 'unclear':
      return []
    case 'numbers':
    case 'mixed':
      return ['sql']
    case 'workspace':
      return ['workspace']
    case 'code':
    case 'story':
      return ['github']
  }
}

function primaryIntent(
  found: ReturnType<typeof flags>,
  channel?: string
): CopilotIntent {
  const hits = (['story', 'numbers', 'workspace', 'code'] as const).filter(key => found[key])
  if (hits.length === 0) return 'unclear'
  if (hits.length === 1) {
    if (found.story) return 'story'
    if (found.numbers) return 'numbers'
    if (found.workspace) return 'workspace'
    return 'code'
  }
  if (channel === 'whatsapp') {
    if (found.story) return 'story'
    if (found.numbers) return 'numbers'
    if (found.workspace) return 'workspace'
    return 'code'
  }
  return 'mixed'
}

/** Escolhe a faixa do Copilot. No portal, pedido amplo ainda usa todas as ferramentas. */
export function triageCopilotAsk(input: {
  message: string
  channel?: string
}): CopilotTriage {
  const message = input.message.trim()
  if (isOrientationAsk(message)) {
    return { intent: 'orient', tools: [] }
  }
  const intent = primaryIntent(flags(message), input.channel)
  return { intent, tools: toolsFor(intent, input.channel) }
}

export function triageClarify(clientId: string): string {
  if (clientId === 'be180-ooh') {
    return [
      'Me diz o recorte que você quer que eu olhe:',
      '• um número — ex.: quantos roteiros no Colmeia?',
      '• uma reunião ou documento do portal',
      '• o fluxo no código — ex.: como o Colmeia monta um roteiro?',
    ].join('\n')
  }
  return 'Me diz se você quer um número, o que ficou numa reunião ou o fluxo no código.'
}
