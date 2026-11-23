import { describe, expect, it } from 'vitest'
import { encodeWav } from './wav'

describe('encodeWav', () => {
  it('gera WAV mono 16 kHz a partir de áudio a 48 kHz', () => {
    const frame = new Float32Array(4800).fill(0.5)
    const wav = encodeWav([frame, frame], 48_000)
    const view = new DataView(wav.buffer)

    expect(String.fromCharCode(...wav.slice(0, 4))).toBe('RIFF')
    expect(String.fromCharCode(...wav.slice(8, 12))).toBe('WAVE')
    expect(view.getUint16(22, true)).toBe(1)
    expect(view.getUint32(24, true)).toBe(16_000)
    expect(view.getUint32(40, true)).toBe(3200 * 2)
    expect(view.getInt16(44, true)).toBe(Math.floor(0.5 * 0x7fff))
  })
})
