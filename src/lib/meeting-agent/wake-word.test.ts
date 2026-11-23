import { describe, expect, it } from 'vitest'
import { detectWakeWord, priorQuestion } from './wake-word'

describe('detectWakeWord', () => {
  it('reconhece a pergunta logo após o nome', () => {
    expect(detectWakeWord('Cadence, qual o status do PR de login?')).toEqual({
      kind: 'question',
      question: 'qual o status do PR de login?',
    })
  })

  it('entende o nome quando a transcrição erra Cadence', () => {
    expect(detectWakeWord('Karen, como está o fluxo hoje de publicação no banco de ativos?')).toEqual({
      kind: 'question',
      question: 'como está o fluxo hoje de publicação no banco de ativos?',
    })
    expect(detectWakeWord('Cadê esse? Como está o fluxo de publicação no banco de ativos?')).toEqual({
      kind: 'question',
      question: 'Como está o fluxo de publicação no banco de ativos?',
    })
  })

  it('aceita variações comuns de transcrição', () => {
    for (const text of ['Cadência, o que falta no checkout?', 'ok cadencia o que falta no checkout', 'Kadence, o que falta no checkout']) {
      expect(detectWakeWord(text).kind).toBe('question')
    }
  })

  it('marca chamado sem pergunta para juntar com a próxima fala', () => {
    expect(detectWakeWord('Cadence?')).toEqual({ kind: 'wake-only' })
    expect(detectWakeWord('Ei, Cadence.')).toEqual({ kind: 'wake-only' })
  })

  it('ignora menção no meio da frase', () => {
    expect(detectWakeWord('ontem o card que o Cadence gerou ficou bom demais')).toEqual({ kind: 'none' })
  })

  it('ignora palavras que só contêm o nome', () => {
    expect(detectWakeWord('a cadenciada das entregas melhorou')).toEqual({ kind: 'none' })
  })

  it('um @Cadence sozinho usa a fala anterior de quem chamou', () => {
    expect(
      priorQuestion(
        [
          { speaker: 'Jose', text: 'Me ajude com o fluxo do banco de ativos.' },
          { speaker: 'Jose', text: '@Cadence' },
        ],
        'Jose'
      )
    ).toBe('Me ajude com o fluxo do banco de ativos.')
  })

  it('ignora cumprimento curto antes do chamado', () => {
    expect(priorQuestion([{ speaker: 'Jose', text: 'Oi.' }], 'Jose')).toBeNull()
  })

  it('no chat aceita @Cadence em qualquer posição', () => {
    expect(detectWakeWord('pessoal, @Cadence onde fica a regra de frete?', 'chat')).toEqual({
      kind: 'question',
      question: 'pessoal, onde fica a regra de frete?',
    })
  })
})
