#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const live = process.env.EVAL_KNOWLEDGE_LIVE === '1'
if (live) {
  console.error(
    'EVAL_KNOWLEDGE_LIVE ainda não consulta staging. Rode sem a flag para o golden set local.'
  )
  process.exit(1)
}

const result = spawnSync(
  'npx',
  ['vitest', 'run', 'src/lib/knowledge/eval/score.test.ts'],
  { stdio: 'inherit', cwd: process.cwd() }
)
process.exit(result.status ?? 1)
