import 'server-only'

import { asStringArray, callOpenAiJson, codingModel } from '@/lib/backlog/llm'
import { syncCadenceMeetings } from '@/lib/cadence/sync'
import { getClient } from '@/lib/client/registry'
import type { ClientWorkspace } from '@/lib/client/types'
import { formatTranscript, listAgentMeetings } from './meetings'
import { claimReport, failReport, getBotRecord, listInteractions, listSegments, saveReport } from './store'
import type { MeetingReport, MeetingReportItem, MeetingReportStory } from './types'

const PRIORITIES = new Set(['Alta', 'Média', 'Baixa'])
const MIN_TRANSCRIPT_CHARS = 200

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : ''
}

function parseItems(value: unknown): MeetingReportItem[] {
  if (!Array.isArray(value)) return []
  return value
    .map(item => {
      const raw = (item ?? {}) as Record<string, unknown>
      const priority = clean(raw.priority, 10)
      return {
        title: clean(raw.title, 200),
        owner: clean(raw.owner, 80) || 'A definir',
        priority: (PRIORITIES.has(priority) ? priority : 'Média') as MeetingReportItem['priority'],
      }
    })
    .filter(item => item.title.length >= 4)
    .slice(0, 10)
}

function parseStories(value: unknown): MeetingReportStory[] {
  if (!Array.isArray(value)) return []
  return value
    .map(item => {
      const raw = (item ?? {}) as Record<string, unknown>
      return {
        title: clean(raw.title, 180),
        persona: clean(raw.persona, 120),
        want: clean(raw.want, 300),
        soThat: clean(raw.soThat, 300),
        acceptance: asStringArray(raw.acceptance)
          .map(entry => clean(entry, 300))
          .filter(Boolean)
          .slice(0, 8),
      }
    })
    .filter(story => story.title && story.persona && story.want && story.soThat && story.acceptance.length > 0)
    .slice(0, 8)
}

export function parseMeetingReport(value: unknown, attendees: string[], model: string): MeetingReport {
  if (!value || typeof value !== 'object') throw new Error('A IA retornou um relatório inválido.')
  const raw = value as Record<string, unknown>
  const summary = clean(raw.summary, 1500)
  if (summary.length < 20) throw new Error('A IA retornou um resumo vazio.')
  return {
    title: clean(raw.title, 140) || 'Reunião com o Cadence',
    summary,
    decisions: asStringArray(raw.decisions).map(item => clean(item, 300)).filter(Boolean).slice(0, 10),
    risks: asStringArray(raw.risks).map(item => clean(item, 300)).filter(Boolean).slice(0, 8),
    actionItems: parseItems(raw.actionItems),
    stories: parseStories(raw.stories),
    attendees,
    model,
    generatedAt: new Date().toISOString(),
  }
}

async function buildReport(client: ClientWorkspace, botId: string): Promise<MeetingReport> {
  const [segments, interactions] = await Promise.all([listSegments(botId, 0, 4000), listInteractions(botId)])
  const transcript = formatTranscript(segments, 60_000)
  if (transcript.length < MIN_TRANSCRIPT_CHARS) {
    throw new Error('A transcrição ficou curta demais para gerar um relatório.')
  }
  const attendees = [...new Set(segments.map(item => item.speaker).filter((item): item is string => Boolean(item)))]
  const qa = interactions
    .filter(item => item.answer)
    .map(item => `P (${item.speaker || 'participante'}): ${item.question}\nR (Cadence): ${item.answer}`)
    .join('\n\n')
  const model = codingModel()

  const parsed = await callOpenAiJson(
    `Você é o Cadence, Product Engineer sênior. Transforme a transcrição de uma reunião em um relatório de produto em português do Brasil.
Use somente fatos ditos na reunião. Não invente decisões, responsáveis, datas, métricas ou escopo.
Decisões são apenas o que foi explicitamente acordado. Riscos são dúvidas, bloqueios ou dependências citadas.
User stories só para necessidades de produto claramente discutidas, com critérios de aceite observáveis e testáveis.
Retorne somente JSON.`,
    `Cliente: ${client.name}
Participantes identificados: ${attendees.join(', ') || 'não identificados'}

Transcrição:
${transcript}

${qa ? `Perguntas respondidas pelo Cadence durante a reunião:\n${qa}\n` : ''}
Formato:
{
  "title": "título curto da reunião",
  "summary": "resumo objetivo, até 150 palavras",
  "decisions": ["decisão acordada"],
  "risks": ["risco, bloqueio ou dúvida em aberto"],
  "actionItems": [{"title": "tarefa acionável", "owner": "responsável citado ou A definir", "priority": "Alta|Média|Baixa"}],
  "stories": [{"title": "...", "persona": "...", "want": "...", "soThat": "...", "acceptance": ["critério testável"]}]
}`,
    { temperature: 0.1, maxTokens: 3000, model }
  )
  return parseMeetingReport(parsed, attendees, model)
}

/** Idempotente: só um worker gera o relatório, mesmo que webhook e polling disparem juntos. */
export async function runPostMeeting(clientId: string, botId: string): Promise<void> {
  const client = getClient(clientId)
  if (!client) return
  const bot = await getBotRecord(client.slug, botId)
  if (!bot || !(await claimReport(bot.id))) return

  try {
    const report = await buildReport(client, bot.id)
    await saveReport(bot.id, report)
    const agentMeetings = await listAgentMeetings(client.slug)
    await syncCadenceMeetings(client.slug, [...(client.meetings ?? []), ...agentMeetings])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar relatório.'
    console.error('[meeting-agent/post-meeting]', message)
    await failReport(bot.id, message)
  }
}
