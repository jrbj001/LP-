// Deterministic frame capture for the Adaptive Layer product film.
// Drives window.__render(t) frame by frame and screenshots the stage in 2x.

import { chromium } from 'playwright-core'
import { mkdir, rm, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

function arg(name, fallback) {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const html = path.resolve(arg('html', 'scripts/gaistudio/product-film/film.html'))
const outDir = path.resolve(arg('out', 'tmp/product-film/frames'))
const fps = Number(arg('fps', '30'))
const scale = Number(arg('scale', '2'))
const timelinePath = arg('timeline', '')
const stills = arg('stills', '')
const start = Number(arg('start', '0'))

if (!existsSync(CHROME)) {
  console.error('Chrome not found at', CHROME)
  process.exit(1)
}

const timeline = timelinePath
  ? JSON.parse(await readFile(path.resolve(timelinePath), 'utf8'))
  : null

const duration = Number(
  arg('duration', timeline ? String(timeline[timeline.length - 1].end) : '30')
)

if (start === 0) await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'],
})

const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: scale,
})

await page.goto(`file://${html}`)
await page.waitForFunction(() => document.documentElement.dataset.ready === '1')
if (timeline) await page.evaluate(tl => window.__setTimeline(tl), timeline)
await page.waitForTimeout(400)

const stage = page.locator('#stage')

if (stills) {
  const times = stills.split(',').map(Number)
  for (const t of times) {
    await page.evaluate(v => window.__render(v), t)
    await page.waitForTimeout(60)
    const name = `still-${t.toFixed(2).replace('.', '_')}.jpg`
    await stage.screenshot({ path: path.join(outDir, name), type: 'jpeg', quality: 96 })
    console.log('still', t.toFixed(2), '→', name)
  }
} else {
  const total = Math.round(duration * fps)
  console.log(`capturing ${total} frames · ${fps}fps · ${duration}s · ${scale}x`)
  for (let i = start; i < total; i++) {
    const t = i / fps
    await page.evaluate(v => window.__render(v), t)
    const file = path.join(outDir, `f_${String(i).padStart(5, '0')}.jpg`)
    await stage.screenshot({ path: file, type: 'jpeg', quality: 95 })
    if (i % 60 === 0) console.log(`  ${i}/${total}  t=${t.toFixed(2)}s`)
  }
  console.log(`done · ${total} frames → ${outDir}`)
}

await browser.close()
