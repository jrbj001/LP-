import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const dir = '/Users/jroberto/.cursor/browser-logs'
const latest = readdirSync(dir)
  .filter(name => name.startsWith('cdp-response-Page.captureScreenshot'))
  .map(name => path.join(dir, name))
  .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0]
const json = JSON.parse(readFileSync(latest, 'utf8'))
writeFileSync(path.join(import.meta.dirname, process.argv[2]), Buffer.from(json.data ?? json.result.data, 'base64'))
