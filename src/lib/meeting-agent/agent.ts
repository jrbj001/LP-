import 'server-only'

import { stepCountIs, streamText } from 'ai'
import { toAiError } from '@/lib/ai/ai-error'
import { aiModel, codingModel, requireAiCredentials } from '@/lib/ai/gateway'
import type { ClientWorkspace } from '@/lib/client/types'
import { isPortfolioWorkspace, projectsBrief } from '@/lib/knowledge/portfolio'
import { CADENCE_PRODUCT_PROFILE, LP_SITE_PROFILE } from './cadence-profile'
import { CADENCE_INTRO_CHAT, CADENCE_INTRO_SPOKEN, isSelfIntro } from './intro'
import { formatTranscript } from './meetings'
import { PIXELPULSELAB_PROFILE } from './pixelpulselab'
import { completedSpoken, splitAgentReply } from './speech-text'
import { listRecentSegments } from './store'
import type { AgentSource } from './types'

/** Conversa genérica não consulta banco: a fala sai assim que a primeira frase fecha. */
const DIRECT_TIMEOUT_MS = 20_000
const MAX_CHAT_CHARS = 2400

function agentModel(): string {
  return process.env.CADENCE_AGENT_MODEL?.trim() || codingModel()
}

/** Conversa, opinião ou tema geral: uma chamada só, sem ferramenta e sem fala de espera. */
function directPrompt(client: ClientWorkspace): string {
  const audience = isPortfolioWorkspace(client)
    ? 'numa reunião interna da PixelPulseLab. Você conhece todos os clientes e projetos do portfólio'
    : `numa reunião com o time de ${client.name}. Fale só deste cliente: nunca cite dados, projetos ou repositórios de outros clientes`
  return `Você é o Cadence, Product Engineer da PixelPulseLab, ${audience}.
Você só fala quando alguém te chama. O detalhe vai no chat.

A pergunta é conversa, opinião, explicação ou tema geral: responda na hora, com o que você sabe e com o cadastro abaixo. Não diga que vai verificar e não invente número, prazo ou decisão do cliente. Se o cadastro não tiver o detalhe pedido, diga o que sabe e sugira pedir a consulta ao código, às reuniões ou aos dados.

Formato obrigatório, sempre as duas partes nesta ordem:
FALA: no máximo duas frases curtas (até 30 palavras), em português do Brasil, tom de conversa. Se a resposta couber nisso, pare por aqui.
CHAT: no máximo duas frases completando a fala. Sem "Fontes:" e sem dizer que mandou detalhe se não houver detalhe.
Quando pedirem para explicar a PixelPulseLab, o Cadence, o site ou um projeto: FALA até três frases (até 45 palavras) com a ideia central; CHAT com até seis tópicos curtos, concretos e fiéis ao cadastro.

Sobre a PixelPulseLab:
${PIXELPULSELAB_PROFILE}

Sobre o Cadence (você mesmo, o produto):
${CADENCE_PRODUCT_PROFILE}
${isPortfolioWorkspace(client) ? `\nSobre o site e o repositório LP-:\n${LP_SITE_PROFILE}\n` : ''}
Cadastro dos projetos:
${projectsBrief(client)}`
}

export interface MeetingAgentAnswer {
  /** Frase curta para falar em voz. */
  spoken: string
  /** Resposta completa para o chat. */
  answer: string
  tools: string[]
  sources: AgentSource[]
  artifact: null
}

export async function answerMeetingQuestion(input: {
  client: ClientWorkspace
  botId: string
  question: string
  speaker: string | null
  /** Chamado assim que a fala fica pronta, antes de o texto do chat terminar. */
  onSpoken?: (spoken: string) => void
}): Promise<MeetingAgentAnswer> {
  if (isSelfIntro(input.question)) {
    input.onSpoken?.(CADENCE_INTRO_SPOKEN)
    return {
      spoken: CADENCE_INTRO_SPOKEN,
      answer: CADENCE_INTRO_CHAT,
      tools: [],
      sources: [],
      artifact: null,
    }
  }

  requireAiCredentials()
  const recent = await listRecentSegments(input.botId, 5)
  const transcript = formatTranscript(recent, 6000)

  let streamError: unknown = null
  try {
    const result = streamText({
      model: aiModel(agentModel()),
      system: directPrompt(input.client),
      prompt: `Últimos minutos da reunião:\n${transcript || '(sem transcrição ainda)'}\n\nPergunta de ${input.speaker || 'um participante'} para você: ${input.question}`,
      stopWhen: stepCountIs(1),
      maxOutputTokens: 700,
      abortSignal: AbortSignal.timeout(DIRECT_TIMEOUT_MS),
      onError: ({ error }) => {
        streamError = error
      },
    })

    let partial = ''
    let spokenSent = false
    for await (const delta of result.textStream) {
      partial += delta
      if (!spokenSent && input.onSpoken) {
        const spoken = completedSpoken(partial)
        if (spoken) {
          spokenSent = true
          input.onSpoken(spoken)
        }
      }
    }
    if (streamError) throw streamError

    const steps = await result.steps
    const finalText = (steps[steps.length - 1]?.text || partial).trim()
    if (!finalText) {
      const fallback = 'Não consegui formular uma resposta agora.'
      return { spoken: fallback, answer: fallback, tools: [], sources: [], artifact: null }
    }

    const { spoken, chat } = splitAgentReply(finalText)
    const answer = chat.length > MAX_CHAT_CHARS ? `${chat.slice(0, MAX_CHAT_CHARS - 1)}…` : chat
    return { spoken, answer, tools: [], sources: [], artifact: null }
  } catch (error) {
    throw toAiError(error)
  }
}
