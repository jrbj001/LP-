const TARGET_RATE = 16_000

/** Junta os quadros capturados, reduz para 16 kHz mono e codifica em WAV PCM16. */
export function encodeWav(frames: Float32Array[], sourceRate: number): Uint8Array<ArrayBuffer> {
  const length = frames.reduce((sum, frame) => sum + frame.length, 0)
  const merged = new Float32Array(length)
  let offset = 0
  for (const frame of frames) {
    merged.set(frame, offset)
    offset += frame.length
  }

  const ratio = Math.max(1, sourceRate / TARGET_RATE)
  const outLength = Math.floor(merged.length / ratio)
  const samples = new Int16Array(outLength)
  for (let i = 0; i < outLength; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.min(merged.length, Math.floor((i + 1) * ratio))
    let sum = 0
    for (let j = start; j < end; j++) sum += merged[j]
    const value = Math.max(-1, Math.min(1, sum / Math.max(1, end - start)))
    samples[i] = value < 0 ? value * 0x8000 : value * 0x7fff
  }

  const rate = Math.round(sourceRate / ratio)
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)
  const write = (at: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(at + i, text.charCodeAt(i))
  }
  write(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, 'data')
  view.setUint32(40, samples.length * 2, true)
  new Int16Array(buffer, 44).set(samples)
  return new Uint8Array(buffer)
}
