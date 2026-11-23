/**
 * "Cadence" como a transcrição em pt-BR costuma grafar: cadência, cadencia, kadence,
 * e também os erros já vistos na call: "Karen" e "Cadê esse".
 */
const WAKE =
  /(?<![\p{L}\p{N}])(?:@?(?:[ck]ad[eêé]n[cs](?:e|ia|ía|i)?|karen|karem|caren)|cad[eêé]\s+esse)(?![\p{L}\p{N}])/iu

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

/**
 * Quando a pessoa só chama o Cadence, a pergunta pode ser a fala de pouco antes.
 * Prefere a última fala substantiva de quem chamou.
 */
export function priorQuestion(
  segments: { speaker: string | null; text: string }[],
  speaker: string | null
): string | null {
  const candidates = segments
    .map(segment => ({ speaker: segment.speaker, text: addressableText(segment.text) }))
    .filter((segment): segment is { speaker: string | null; text: string } => segment.text !== null)
  const own = [...candidates].reverse().find(segment => (segment.speaker ?? '') === (speaker ?? ''))
  return (own ?? candidates[candidates.length - 1])?.text ?? null
}

function addressableText(text: string): string | null {
  const wake = detectWakeWord(text, 'chat')
  if (wake.kind === 'wake-only') return null
  if (wake.kind === 'question') return wake.question
  return wordCount(text) >= MIN_QUESTION_WORDS ? text : null
}
