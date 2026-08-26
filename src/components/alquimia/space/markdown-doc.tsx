import type { ReactNode } from 'react'

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded bg-black/[0.05] px-1 py-0.5 text-[12px]">
          {part.slice(1, -1)}
        </code>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      return (
        <a key={index} href={link[2]} className="font-medium text-[#00435D] underline" target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export function MarkdownDoc({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, '\n').split(/\n{2,}/)
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const trimmed = block.trim()
        if (!trimmed) return null
        if (/^---+$/.test(trimmed)) {
          return <hr key={index} className="border-black/10" />
        }
        const heading = trimmed.match(/^(#{1,4})\s+([\s\S]+)$/)
        if (heading) {
          const level = heading[1].length
          const className =
            level === 1
              ? 'text-[28px] font-medium tracking-[-0.03em] text-[#003b52]'
              : level === 2
                ? 'text-[18px] font-semibold text-[#003b52]'
                : 'text-[15px] font-semibold text-[#003b52]'
          const Tag = (level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3') as 'h1' | 'h2' | 'h3'
          return (
            <Tag key={index} className={className}>
              {inline(heading[2].replace(/\n/g, ' '))}
            </Tag>
          )
        }
        if (trimmed.startsWith('```')) {
          const body = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')
          return (
            <pre key={index} className="overflow-x-auto rounded-xl bg-[#002f42] p-4 text-[11px] leading-relaxed text-[#E0CE7A]">
              {body}
            </pre>
          )
        }
        const lines = trimmed.split('\n')
        if (lines.every(line => /^\s*([-*•]|\d+[.)])\s+/.test(line))) {
          return (
            <ul key={index} className="space-y-1.5 pl-1">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="relative pl-4 text-[13.5px] leading-relaxed text-black/70">
                  <span className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-[#00435D]/40" />
                  {inline(line.replace(/^\s*([-*•]|\d+[.)])\s+/, ''))}
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-black/70">
            {inline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}
