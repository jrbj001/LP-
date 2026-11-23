const SPOKEN = /FALA:\s*([\s\S]*?)\s*CHAT:/i
const CHAT = /CHAT:\s*([\s\S]*)$/i

/** A fala fica completa assim que o modelo começa a escrever a parte do chat. */
export function completedSpoken(partial: string): string | null {
  const match = SPOKEN.exec(partial)
  return match?.[1]?.trim() || null
}

/**
 * Separa a resposta do agente em fala curta e texto completo do chat.
 * Sem as marcações, usa o começo da resposta como fala.
 */
export function splitAgentReply(text: string): { spoken: string; chat: string } {
  const spoken = completedSpoken(text)
  const chat = CHAT.exec(text)?.[1]?.trim()
  if (spoken && chat) return { spoken, chat }

  const plain = text.replace(/^\s*(FALA|CHAT):\s*/gim, '').trim()
  return { spoken: speakableText(plain, 220), chat: plain }
}

/**
 * Transforma a resposta escrita do agente em fala: remove a linha de fontes, links e marcações,
 * que não fazem sentido ouvidos em voz alta.
 */
export function speakableText(answer: string, max = 420): string {
  const withoutSources = answer
    .split('\n')
    .filter(line => !/^\s*fontes\s*:/i.test(line))
    .join(' ')

  const text = withoutSources
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/#(\d+)/g, (_, number: string) => `número ${number}`)
    .replace(/[*_`#>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '))
  return lastStop > max * 0.5 ? cut.slice(0, lastStop + 1) : `${cut.trimEnd()}.`
}
