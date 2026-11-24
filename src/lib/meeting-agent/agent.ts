import 'server-only'

import { stepCountIs, streamText } from 'ai'
import { toAiError } from '@/lib/ai/ai-error'
import { aiModel, codingModel, requireAiCredentials } from '@/lib/ai/gateway'
import type { ClientWorkspace } from '@/lib/client/types'
import { formatTranscript } from './meetings'
import { PIXELPULSELAB_PROFILE } from './pixelpulselab'
import { completedSpoken, splitAgentReply } from './speech-text'
import { listRecentSegments } from './store'
import { buildMeetingAgentTools, type ToolRunLog } from './tools'
import type { AgentSource } from './types'

/** As rotas que respondem têm 60 s; consultas aos bancos externos usam boa parte disso. */
const AGENT_TIMEOUT_MS = 50_000
const MAX_CHAT_CHARS = 2400

function agentModel(): string {
  return process.env.CADENCE_AGENT_MODEL?.trim() || codingModel()
}

function systemPrompt(client: ClientWorkspace): string {
  return `Você é o Cadence, Product Engineer de IA da PixelPulseLab, participando ao vivo de uma reunião com o time de ${client.name}.
Você é um colega experiente e conversa sobre qualquer assunto: tecnologia, produto, engenharia, negócios, mercado, ideias e conhecimento geral.
No contexto do cliente, você une produto e engenharia: explica como o sistema funciona hoje, o que já foi entregue, o que está no backlog e o que precisaria ser feito.

Quando usar ferramentas:
- Para fatos sobre o código, PRs, entregas, backlog, dados ou documentação de ${client.name}, use as ferramentas antes de afirmar. Não invente arquivos, PRs, números, prazos ou decisões.
- Para números, contagens, registros, status operacional ou qualquer dado de negócio, use consultar_dados: ela acessa os bancos do cliente (SQL Server, PostgreSQL, Supabase) e a base do Cadence, como o Copilot.
- Se as ferramentas não trouxerem evidência, diga que não encontrou e sugira onde procurar.
- Para conhecimento geral, opinião técnica ou conversa, responda direto com o que você sabe, sem ferramentas.
- Não escreva nada antes de chamar uma ferramenta.

Sobre a PixelPulseLab, para quando pedirem para apresentar a empresa ou falar dela:
${PIXELPULSELAB_PROFILE}

Formato obrigatório, sempre as duas partes nesta ordem:
FALA: o que você diz em voz alta na call. No máximo duas frases curtas (até 30 palavras no total), em português do Brasil, tom natural de conversa, como uma pessoa falaria. Vá direto ao ponto, sem repetir a pergunta. Sem listas, links, números de PR, caminhos de arquivo ou siglas soletradas. Se houver detalhes, diga algo como "mandei os detalhes no chat".
CHAT: a resposta completa para o chat da reunião: explicação, passos, links e detalhes. Texto simples, no máximo 8 tópicos curtos, sem tabelas e sem blocos de código longos. Ao falar da PixelPulseLab, inclua o link https://pixelpulselab.dev. Só quando tiver usado ferramentas, termine com uma linha "Fontes:" listando arquivos, PRs (#número), páginas do Notion, bancos consultados pelo nome ou "base do Cadence"; sem ferramentas, não escreva "Fontes:".`
}

export interface MeetingAgentAnswer {
  /** Frase curta para falar em voz. */
  spoken: string
  /** Resposta completa para o chat. */
  answer: string
  tools: string[]
  sources: AgentSource[]
}

export async function answerMeetingQuestion(input: {
  client: ClientWorkspace
  botId: string
  question: string
  speaker: string | null
  /** Chamado assim que a fala fica pronta, antes de o texto do chat terminar. */
  onSpoken?: (spoken: string) => void
}): Promise<MeetingAgentAnswer> {
  requireAiCredentials()
  const log: ToolRunLog = { tools: [], sources: [] }
  const recent = await listRecentSegments(input.botId, 5)
  const transcript = formatTranscript(recent, 6000)

  let streamError: unknown = null
  try {
    const result = streamText({
      model: aiModel(agentModel()),
      system: systemPrompt(input.client),
      prompt: `Últimos minutos da reunião:\n${transcript || '(sem transcrição ainda)'}\n\nPergunta de ${input.speaker || 'um participante'} para você: ${input.question}`,
      tools: buildMeetingAgentTools({ client: input.client, botId: input.botId, log }),
      stopWhen: stepCountIs(5),
      maxOutputTokens: 900,
      abortSignal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
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
      return { spoken: fallback, answer: fallback, tools: log.tools, sources: log.sources }
    }

    const { spoken, chat } = splitAgentReply(finalText)
    const answer = chat.length > MAX_CHAT_CHARS ? `${chat.slice(0, MAX_CHAT_CHARS - 1)}…` : chat
    return { spoken, answer, tools: log.tools, sources: log.sources }
  } catch (error) {
    throw toAiError(error)
  }
}
