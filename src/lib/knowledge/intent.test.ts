import { describe, expect, it } from 'vitest'
import {
  inferQuestionIntent,
  parseQuestionIntent,
  resolveQuestionIntent,
  rewriteQuestionWithTime,
} from './intent'

const NOW = new Date('2026-09-21T15:00:00-03:00')

describe('rewriteQuestionWithTime', () => {
  it('expande mês passado para o calendário de São Paulo', () => {
    const result = rewriteQuestionWithTime('Quantos usuários entraram mês passado?', NOW)
    expect(result.timeRange).toEqual({
      from: '2026-08-01',
      to: '2026-08-31',
      label: 'mês passado',
    })
    expect(result.rewritten).toContain('2026-08-01')
    expect(result.rewritten).toContain('America/Sao_Paulo')
  })
})

describe('inferQuestionIntent', () => {
  it('não consulta banco em saudação', () => {
    expect(inferQuestionIntent({ clientId: 'likeme', question: 'oi' }).intent).toBe('chitchat')
  })

  it('pede clarificação para usuário ativo no Like:Me', () => {
    const intent = inferQuestionIntent({
      clientId: 'likeme',
      question: 'Quantos usuários ativos temos?',
    })
    expect(intent.needsClarification).toBe(true)
    expect(intent.sourceHint).toBe('likeme-production')
  })

  it('não interroga pergunta sobre reunião, mesmo com erro de digitação', () => {
    for (const question of [
      'o que famos em nossa primeira reuniao ?',
      'O que combinamos na reunião de inventário?',
      'O que ficou definido sobre o roteiro?',
    ]) {
      const intent = inferQuestionIntent({ clientId: 'be180-ooh', question })
      expect(intent.needsClarification, question).toBe(false)
      expect(intent.intent, question).toBe('flow')
    }
  })

  it('pesquisa em vez de perguntar quando não há eixo de ambiguidade para nomear', () => {
    const intent = inferQuestionIntent({
      clientId: 'likeme',
      question: 'e sobre o app, alguma novidade?',
    })
    expect(intent.intent).toBe('unclear')
    expect(intent.needsClarification).toBe(false)
    expect(intent.clarifyingQuestion).toBeNull()
  })

  it('mantém o gate onde o eixo é nomeável', () => {
    expect(
      inferQuestionIntent({ clientId: 'be180-ooh', question: 'Quantos temos hoje?' })
        .clarifyingQuestion
    ).toContain('Colmeia')
  })

  it('aponta Colmeia e Ativos no vocabulário Be180', () => {
    expect(
      inferQuestionIntent({
        clientId: 'be180-ooh',
        question: 'Quantos roteiros existem no Colmeia?',
      }).sourceHint
    ).toBe('be180-colmeia')
    expect(
      inferQuestionIntent({
        clientId: 'be180-ooh',
        question: 'Quantos exibidores temos no inventário?',
      }).sourceHint
    ).toBe('be180-ativos')
  })
})

describe('parseQuestionIntent', () => {
  it('cai no inferido quando o JSON é inválido', () => {
    expect(parseQuestionIntent(null, { clientId: 'likeme', question: 'oi' }).intent).toBe(
      'chitchat'
    )
  })

  it('preserva intent válido do modelo', () => {
    expect(
      parseQuestionIntent(
        { intent: 'catalog', rewrittenQuestion: 'listar tabelas' },
        { clientId: 'likeme', question: 'oi' }
      )
    ).toMatchObject({ intent: 'catalog', rewrittenQuestion: 'listar tabelas' })
  })
})

describe('resolveQuestionIntent', () => {
  it('abre um gate antes de consultar uma métrica ambígua', () => {
    const result = resolveQuestionIntent({
      clientId: 'likeme',
      question: 'Quantos usuários ativos temos?',
    })
    expect(result.clarification).toMatchObject({
      originalQuestion: 'Quantos usuários ativos temos?',
    })
    expect(result.clarification?.options).toContain('Total cadastrado no produto')
    expect(result.intent.needsClarification).toBe(true)
  })

  it('combina a resposta com a pergunta anterior sem entrar em loop', () => {
    const result = resolveQuestionIntent({
      clientId: 'likeme',
      question: 'Só quem está ativo no produto',
      pendingClarification: {
        originalQuestion: 'Quantos usuários ativos temos?',
        question: 'Qual definição de usuário você quer?',
        options: ['Total cadastrado no produto', 'Só quem está ativo no produto'],
      },
    })
    expect(result.clarification).toBeNull()
    expect(result.intent.needsClarification).toBe(false)
    expect(result.researchQuestion).toContain('Quantos usuários ativos temos?')
    expect(result.researchQuestion).toContain('Só quem está ativo no produto')
  })
})
