import 'server-only'

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import type { ArchiveDocument } from './documents'
import { ORFEU_ARCHIVE_ROOT, fileKey } from './documents'

export function archiveRoot(): string {
  return path.join(process.cwd(), ORFEU_ARCHIVE_ROOT)
}

function listFilesRecursive(dir: string): string[] {
  if (!existsSync(dir)) return []
  const entries = readdirSync(dir, { withFileTypes: true })
  return entries.flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFilesRecursive(full)
    return [full]
  })
}

export function resolveArchiveFile(relativePath: string): string | null {
  const root = archiveRoot()
  const exact = path.join(root, relativePath)
  const resolved = path.resolve(exact)
  if (!resolved.startsWith(path.resolve(root))) return null
  if (existsSync(resolved) && statSync(resolved).isFile() && statSync(resolved).size > 64) {
    return resolved
  }

  const expectedDir = path.dirname(relativePath)
  const expectedName = path.basename(relativePath)
  const searchDir = path.join(root, expectedDir)
  if (!existsSync(searchDir)) return null
  const expectedKey = fileKey(expectedName)
  const match = listFilesRecursive(searchDir).find(candidate => fileKey(path.basename(candidate)) === expectedKey)
  return match && statSync(match).size > 64 ? match : null
}

export function archiveFileExists(relativePath: string): boolean {
  return Boolean(resolveArchiveFile(relativePath))
}

export function readArchiveText(doc: ArchiveDocument): string | null {
  const file = resolveArchiveFile(doc.path)
  if (!file) return null
  return readFileSync(file, 'utf8')
}

export function readArchiveBuffer(doc: ArchiveDocument): Buffer | null {
  const file = resolveArchiveFile(doc.path)
  if (!file) return null
  return readFileSync(file)
}

export function documentAvailability(docs: ArchiveDocument[]): Record<string, boolean> {
  return Object.fromEntries(docs.map(item => [item.id, archiveFileExists(item.path)]))
}
