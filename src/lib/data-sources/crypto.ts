import 'server-only'

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto'
import type { PostgresDataSourceConfig } from './types'
import type { SqlServerDataSourceConfig } from './sqlserver'

export type EncryptedSourceConfig = PostgresDataSourceConfig | SqlServerDataSourceConfig

interface EncryptedPayloadV1 {
  version: 1
  iv: string
  tag: string
  ciphertext: string
}

export class DataSourceEncryptionConfigurationError extends Error {}

function encryptionKey(): Buffer {
  const secret = process.env.DATA_SOURCE_ENCRYPTION_KEY
  if (!secret) {
    throw new DataSourceEncryptionConfigurationError(
      'DATA_SOURCE_ENCRYPTION_KEY não configurada'
    )
  }
  return createHash('sha256').update(secret, 'utf8').digest()
}

export function encryptDataSourceConfig(config: EncryptedSourceConfig): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  cipher.setAAD(Buffer.from('data-source-config:v1'))

  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(config), 'utf8'),
    cipher.final(),
  ])

  const payload: EncryptedPayloadV1 = {
    version: 1,
    iv: iv.toString('base64url'),
    tag: cipher.getAuthTag().toString('base64url'),
    ciphertext: ciphertext.toString('base64url'),
  }
  return JSON.stringify(payload)
}

export function decryptDataSourceConfig<T extends EncryptedSourceConfig = EncryptedSourceConfig>(
  encrypted: string
): T {
  let payload: EncryptedPayloadV1
  try {
    payload = JSON.parse(encrypted) as EncryptedPayloadV1
    if (
      payload.version !== 1 ||
      typeof payload.iv !== 'string' ||
      typeof payload.tag !== 'string' ||
      typeof payload.ciphertext !== 'string'
    ) {
      throw new Error('Formato inválido')
    }
  } catch {
    throw new Error('Configuração criptografada inválida')
  }

  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      encryptionKey(),
      Buffer.from(payload.iv, 'base64url')
    )
    decipher.setAAD(Buffer.from('data-source-config:v1'))
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64url'))
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64url')),
      decipher.final(),
    ])
    return JSON.parse(plaintext.toString('utf8')) as T
  } catch (error) {
    if (error instanceof DataSourceEncryptionConfigurationError) throw error
    throw new Error('Não foi possível descriptografar a configuração da fonte')
  }
}
