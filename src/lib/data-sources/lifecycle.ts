export function seededDataSourceEnabled(
  existing?: { enabled: boolean } | null
): boolean {
  return existing?.enabled ?? true
}

export function isDataSourceRemovable(source: { managed: boolean }): boolean {
  return !source.managed
}
