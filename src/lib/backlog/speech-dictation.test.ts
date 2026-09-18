import { describe, expect, it } from 'vitest'
import {
  collectSpeechTranscript,
  mergeSpeechDraft,
  speechDictationErrorMessage,
} from './speech-dictation'

describe('mergeSpeechDraft', () => {
  it('usa só o falado quando o composer está vazio', () => {
    expect(mergeSpeechDraft('  ', '  Quantos usuários ativos?  ')).toBe('Quantos usuários ativos?')
  })

  it('acrescenta o ditado ao texto já digitado', () => {
    expect(mergeSpeechDraft('Quantos usuários', 'temos hoje no Like:Me?')).toBe(
      'Quantos usuários temos hoje no Like:Me?'
    )
  })
})

describe('collectSpeechTranscript', () => {
  it('separa trechos finais do rascunho ao vivo', () => {
    expect(
      collectSpeechTranscript({
        resultIndex: 0,
        results: [
          { isFinal: true, 0: { transcript: 'Quantos usuários ' } },
          { isFinal: false, 0: { transcript: ' temos hoje' } },
        ],
      })
    ).toEqual({ finals: 'Quantos usuários', interim: 'temos hoje' })
  })
})

describe('speechDictationErrorMessage', () => {
  it('explica bloqueio de microfone e ignora silêncio', () => {
    expect(speechDictationErrorMessage('not-allowed')).toMatch(/microfone/)
    expect(speechDictationErrorMessage('no-speech')).toBeNull()
    expect(speechDictationErrorMessage('aborted')).toBeNull()
  })
})
