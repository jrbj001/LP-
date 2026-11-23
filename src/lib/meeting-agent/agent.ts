import 'server-only'

import { generateText, stepCountIs } from 'ai'
import { toAiError } from '@/lib/ai/ai-error'
import { aiModel, codingModel, requireAiCredentials } from '@/lib/ai/gateway'
import type { ClientWorkspace } from '@/lib/client/types'
import { formatTranscript } from './meetings'
import { listRecentSegments } from './store'
import { buildMeetingAgentTools, type ToolRunLog } from './tools'
import type { AgentSource } from './types'

const AGENT_TIMEOUT_MS = 45_000
const MAX_ANSWER_CHARS = 1200

function systemPrompt(client: ClientWorkspace): string {
  return `Você é o Cadence, Product Engineer do time de ${client.name}, participando ao vivo de uma reunião.
Seu papel: unir produto e engenharia. Você esclarece como o sistema funciona hoje, o que já foi entregue,
o que está no backlog, quais requisitos estão documentados e o que precisaria ser feito para atender um pedido.

Regras:
- Responda em português do Brasil, curto e direto: no máximo 5 frases ou 5 tópicos curtos. A resposta vai para o chat da reunião.
- Use as ferramentas antes de afirmar fatos sobre código, entregas, backlog ou documentação. Não invente arquivos, PRs, números, prazos ou decisões.
- Se as ferramentas não trouxerem evidência, diga claramente que não encontrou e sugira onde procurar ou quem perguntar.
- Quando pedirem "o que precisa ser feito", proponha passos concretos (o que muda, onde no código, riscos) ancorados no que encontrou.
- Termine com uma linha "Fontes:" listando arquivos, PRs (#número), páginas do Notion ou "base do Cadence" usados. Omita a linha se não usou fonte.
- Texto puro: sem tabelas, sem markdown pesado, sem blocos de código longos.`
}

export interface MeetingAgentAnswer {
  answer: string
  tools: string[]
  sources: AgentSource[]
}

export async function answerMeetingQuestion(input: {
  client: ClientWorkspace
  botId: string
  question: string
  speaker: string | null
}): Promise<MeetingAgentAnswer> {
  requireAiCredentials()
  const log: ToolRunLog = { tools: [], sources: [] }
  const recent = await listRecentSegments(input.botId, 5)
  const transcript = formatTranscript(recent, 6000)

  try {
    const result = await generateText({
      model: aiModel(codingModel()),
      system: systemPrompt(input.client),
      prompt: `Últimos minutos da reunião:\n${transcript || '(sem transcrição ainda)'}\n\nPergunta de ${input.speaker || 'um participante'} para você: ${input.question}`,
      tools: buildMeetingAgentTools({ client: input.client, botId: input.botId, log }),
      stopWhen: stepCountIs(6),
      maxOutputTokens: 700,
      abortSignal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
    })
    const text = result.text.trim()
    const answer = text
      ? text.length > MAX_ANSWER_CHARS
        ? `${text.slice(0, MAX_ANSWER_CHARS - 1)}…`
        : text
      : 'Não consegui formular uma resposta com as fontes disponíveis.'
    return { answer, tools: log.tools, sources: log.sources }
  } catch (error) {
    throw toAiError(error)
  }
}
