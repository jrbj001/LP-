import 'server-only'

import { createHash, timingSafeEqual } from 'node:crypto'

export class DataSourceAdminConfigurationError extends Error {}

export function isDataSourceAdminRequest(request: Request): boolean {
  const expected = process.env.DATA_SOURCE_ADMIN_SECRET
  if (!expected) {
    throw new DataSourceAdminConfigurationError(
      'DATA_SOURCE_ADMIN_SECRET não configurado'
    )
  }

  const provided = request.headers.get('x-data-source-admin-key')
  if (!provided) return false

  const expectedDigest = createHash('sha256').update(expected, 'utf8').digest()
  const providedDigest = createHash('sha256').update(provided, 'utf8').digest()
  return timingSafeEqual(providedDigest, expectedDigest)
}
