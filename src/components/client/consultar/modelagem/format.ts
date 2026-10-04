export function formatNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('pt-BR').format(Math.round(value))
}

export function formatBytes(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value) || value < 0) return '—'
  if (value < 1024) return `${value} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let size = value / 1024
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }
  return `${size.toFixed(size >= 100 ? 0 : 1)} ${units[unit]}`
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(date)
}

export function formatRelativeDays(value: string | null | undefined): string {
  if (!value) return 'nunca'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000)
  if (days <= 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  return months === 1 ? 'há 1 mês' : `há ${months} meses`
}

export function tableTypeLabel(type: string): string {
  switch (type) {
    case 'view':
      return 'View'
    case 'materialized_view':
      return 'View materializada'
    case 'foreign_table':
      return 'Tabela externa'
    default:
      return 'Tabela'
  }
}
