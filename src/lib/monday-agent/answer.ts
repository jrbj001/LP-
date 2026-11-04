import 'server-only'

import { answerKnowledgeQuestion } from '@/lib/knowledge/research'

const CLIENT_ID = 'be180-ooh'
const HELP =
  'Pergunte em português sobre o Banco de Ativos ou o Colmeia. Exemplo: quantos pontos ativos existem em São Paulo?'

export async function answerBe180Question(question: string): Promise<string> {
  const asked = question.trim()
  if (!asked) return HELP
  const result = await answerKnowledgeQuestion({ clientId: CLIENT_ID, question: asked })
  return result.answer.trim() || 'Não consegui formular uma resposta com as fontes disponíveis.'
}
