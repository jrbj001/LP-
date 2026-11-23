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
