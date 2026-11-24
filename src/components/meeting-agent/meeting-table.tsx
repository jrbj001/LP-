import type { MeetingTableArtifact } from '@/lib/meeting-agent/types'

function cell(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** Grade de até 12 linhas, ou o link da planilha quando o resultado é maior. */
export function MeetingTable({ artifact, href }: { artifact: MeetingTableArtifact; href?: string | null }) {
  if (artifact.kind === 'csv') {
    return (
      <p className="mt-2 text-[11px]">
        {artifact.rowCount} linhas de {artifact.sourceName}.{' '}
        {href ? (
          <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
            Baixar planilha
          </a>
        ) : (
          <span>A planilha está no chat da reunião.</span>
        )}
      </p>
    )
  }

  const rows = artifact.rows ?? []
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[11px]">
        <thead>
          <tr>
            {artifact.columns.map(column => (
              <th key={column} className="border-b border-current/15 px-2 py-1 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {artifact.columns.map(column => (
                <td key={column} className="border-b border-current/10 px-2 py-1 align-top">
                  {cell(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 opacity-60">{artifact.sourceName}</p>
    </div>
  )
}
