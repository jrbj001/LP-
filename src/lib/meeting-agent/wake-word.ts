/** "Cadence" como a transcrição em pt-BR costuma grafar: cadência, cadencia, kadence, cadense… */
const WAKE = /(?<![\p{L}\p{N}])@?[ck]ad[eêé]n[cs](?:e|ia|ía|i)?(?![\p{L}\p{N}])/iu

/** O nome só conta como chamado se vier no começo da fala; citado no meio é só menção. */
const MAX_LEADING_WORDS = 3
const MIN_QUESTION_WORDS = 3

export type WakeResult =
  | { kind: 'none' }
  | { kind: 'wake-only' }
  | { kind: 'question'; question: string }

function wordCount(text: string): number {
  return text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length
}

function cleanQuestion(text: string): string {
  return text.replace(/^[\s,.:;!?\-–—]+/u, '').replace(/\s+/g, ' ').trim()
}

export function detectWakeWord(text: string, source: 'speech' | 'chat' = 'speech'): WakeResult {
  const match = WAKE.exec(text)
  if (!match) return { kind: 'none' }

  const before = text.slice(0, match.index)
  const mentioned = source === 'chat' && match[0].startsWith('@')
  if (!mentioned && wordCount(before) > MAX_LEADING_WORDS) return { kind: 'none' }

  const after = cleanQuestion(text.slice(match.index + match[0].length))
  const question = mentioned ? cleanQuestion(`${before} ${after}`) : after
  if (wordCount(question) < MIN_QUESTION_WORDS) return { kind: 'wake-only' }
  return { kind: 'question', question }
}
