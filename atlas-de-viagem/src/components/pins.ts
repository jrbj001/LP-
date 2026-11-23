const cache = new Map<string, HTMLCanvasElement>()

function canvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const ratio = 2
  const el = document.createElement('canvas')
  el.width = width * ratio
  el.height = height * ratio
  const ctx = el.getContext('2d')!
  ctx.scale(ratio, ratio)
  return [el, ctx]
}

/** Marcador em gota com miolo claro; o selecionado ganha halo e fica maior. */
export function pinImage(color: string, selected = false): HTMLCanvasElement {
  const key = `pin|${color}|${selected}`
  const hit = cache.get(key)
  if (hit) return hit
  const w = selected ? 44 : 30
  const h = selected ? 58 : 40
  const [el, ctx] = canvas(w, h)
  const r = w / 2 - (selected ? 6 : 3)
  const cx = w / 2
  const cy = r + (selected ? 6 : 3)

  if (selected) {
    ctx.beginPath()
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(244, 233, 216, 0.35)'
    ctx.fill()
  }
  ctx.beginPath()
  ctx.moveTo(cx, h - 1)
  ctx.bezierCurveTo(cx - r * 0.35, h - r * 0.9, cx - r, cy + r * 0.6, cx - r, cy)
  ctx.arc(cx, cy, r, Math.PI, 0)
  ctx.bezierCurveTo(cx + r, cy + r * 0.6, cx + r * 0.35, h - r * 0.9, cx, h - 1)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
  ctx.shadowBlur = 6
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.lineWidth = selected ? 3 : 2
  ctx.strokeStyle = '#F4E9D8'
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2)
  ctx.fillStyle = '#0E1A24'
  ctx.fill()

  cache.set(key, el)
  return el
}

/** Destino destacado da visão continental: estrela de oito pontas em areia e terracota. */
export function destinationImage(): HTMLCanvasElement {
  const key = 'destination'
  const hit = cache.get(key)
  if (hit) return hit
  const size = 44
  const [el, ctx] = canvas(size, size)
  const c = size / 2
  ctx.beginPath()
  ctx.arc(c, c, 19, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(226, 112, 74, 0.28)'
  ctx.fill()
  ctx.beginPath()
  for (let i = 0; i < 16; i++) {
    const radius = i % 2 === 0 ? 14 : 6
    const angle = (i * Math.PI) / 8 - Math.PI / 2
    ctx.lineTo(c + radius * Math.cos(angle), c + radius * Math.sin(angle))
  }
  ctx.closePath()
  ctx.fillStyle = '#F4E9D8'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 6
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.arc(c, c, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#E2704A'
  ctx.fill()
  cache.set(key, el)
  return el
}

export function clusterImage(count: number): HTMLCanvasElement {
  const label = count > 99 ? '99+' : String(count)
  const key = `cluster|${label}`
  const hit = cache.get(key)
  if (hit) return hit
  const size = count >= 10 ? 46 : 40
  const [el, ctx] = canvas(size, size)
  const c = size / 2
  ctx.beginPath()
  ctx.arc(c, c, c - 1, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(226, 112, 74, 0.3)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(c, c, c - 7, 0, Math.PI * 2)
  ctx.fillStyle = '#0E1A24'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#E2704A'
  ctx.stroke()
  ctx.fillStyle = '#F4E9D8'
  ctx.font = '700 14px Manrope, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, c, c + 1)
  cache.set(key, el)
  return el
}
