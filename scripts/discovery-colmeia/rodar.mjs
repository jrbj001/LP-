#!/usr/bin/env node
/**
 * Leva as necessidades da reunião Discovery do Colmeia ao Monday, enriquecidas como o Cadence.
 *
 *   node --env-file=.env.local scripts/discovery-colmeia/rodar.mjs gerar [slug...] [--refazer]
 *       enriquece e grava em tmp/discovery-colmeia; pula o que já foi gerado, a menos que venha --refazer
 *   node --env-file=.env.local scripts/discovery-colmeia/rodar.mjs publicar --dry-run  mostra o que seria criado
 *   node --env-file=.env.local scripts/discovery-colmeia/rodar.mjs publicar            cria os itens no grupo Discovery Colmeia
 *
 * Precisa de OPENAI_API_KEY (gerar) e MONDAY_AGENT_API_TOKEN com acesso Padrão ao quadro Colmeia (publicar).
 */
import { createJiti } from 'jiti'
import path from 'path'
import { fileURLToPath } from 'url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const jiti = createJiti(import.meta.url, {
  alias: {
    '@': path.join(raiz, 'src'),
    'server-only': path.join(raiz, 'scripts/discovery-colmeia/server-only.cjs'),
  },
})

const [comando, ...resto] = process.argv.slice(2)
const pipeline = await jiti.import(path.join(raiz, 'scripts/discovery-colmeia/pipeline.ts'))

if (comando === 'gerar') {
  await pipeline.gerar({ filtro: resto.filter(arg => !arg.startsWith('--')), refazer: resto.includes('--refazer') })
  process.exit(process.exitCode ?? 0)
} else if (comando === 'publicar') {
  await pipeline.publicar({ dryRun: resto.includes('--dry-run') })
} else {
  console.error('Uso: rodar.mjs gerar [slug...] | publicar [--dry-run]')
  process.exit(1)
}
