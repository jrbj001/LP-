import { isChitChat } from '@/lib/twilio/format'
import type { BacklogDiagram } from './types'

export function isOrientationAsk(message: string): boolean {
  const text = message.trim()
  if (isChitChat(text)) return true
  return /^(ajuda|help|menu|oi[,.]?\s+ajuda|o que (voc[eê]|tu) (faz|pode)|o que (d[aá]|pode) (pra |para )?(fazer|ver)|come[cç]ar)\b/i.test(
    text
  )
}

export function firstTurnWelcome(clientId: string, clientName: string): string {
  if (clientId === 'likeme') {
    return [
      `Oi — sou o Copiloto da ${clientName}.`,
      '',
      'Posso olhar com você o app, a landing e o backend: jornada de saúde, marketplace, comunidade e o que já está no backlog e nas reuniões.',
      '',
      'Pode perguntar assim:',
      '• Como é a jornada de saúde hoje?',
      '• O que o backlog do app já descreve sobre compra no marketplace?',
      '• Como a empresa trata uma interação na comunidade?',
      '',
      'O que você quer ver primeiro?',
    ].join('\n')
  }

  if (clientId === 'be180-ooh') {
    return [
      `Oi — sou o Copiloto da ${clientName} no Cadence.`,
      '',
      'Posso olhar com você:',
      '• números do Colmeia — roteiros, campanhas, operação',
      '• inventário do Banco de Ativos — pontos e exibidores',
      '• Teste de Visibilidade',
      '• o que ficou nas reuniões e nos documentos do portal',
      '• o fluxo no código, se a pergunta for de produto',
      '',
      'Pode perguntar assim:',
      '• Quantos roteiros existem no Colmeia?',
      '• Como está a promoção de inventário para o Banco de Ativos?',
      '• O que combinamos na reunião de inventário?',
      '• Como o Colmeia monta um roteiro?',
      '',
      'O que você quer ver primeiro?',
    ].join('\n')
  }

  return [
    `Oi — sou o Copiloto da ${clientName}.`,
    '',
    'Posso olhar workspace, backlog, documentos e o que o canal WhatsApp já conversou.',
    '',
    'Pode perguntar assim:',
    '• O que este workspace já cobre hoje?',
    '• Quais cards estão prontos no backlog?',
    '',
    'Por onde começamos?',
  ].join('\n')
}

export function firstTurnFooter(clientId: string): string {
  if (clientId === 'be180-ooh') {
    return 'Também posso números, atas e fluxo. Ex.: “quantos pontos no Banco de Ativos?” ou “o que ficou na reunião de inventário?”'
  }
  if (clientId === 'likeme') {
    return 'Também posso jornada, backlog e comunidade. Ex.: “como é a compra no marketplace?”'
  }
  return 'Se quiser, peça um número, um fluxo ou o que ficou numa reunião.'
}

export function welcomeFollowUps(clientId: string): string[] {
  if (clientId === 'be180-ooh') {
    return [
      'Quantos roteiros existem no Colmeia?',
      'Como está a promoção de inventário?',
      'O que combinamos na reunião de inventário?',
    ]
  }
  if (clientId === 'likeme') {
    return [
      'Como é a jornada de saúde hoje?',
      'O que o backlog já diz sobre o marketplace?',
      'Como a comunidade trata uma interação?',
    ]
  }
  return ['O que este workspace já cobre hoje?', 'Quais cards estão prontos no backlog?']
}

export function welcomeDiagram(clientName: string): BacklogDiagram {
  return {
    title: `O que o Copiloto da ${clientName} pode fazer`,
    nodes: [
      { id: 'pessoa', label: 'Você', kind: 'actor' },
      { id: 'copiloto', label: 'Copiloto', detail: 'Conversa em português', kind: 'process' },
      { id: 'fatos', label: 'Números e atas', kind: 'system' },
      { id: 'fluxo', label: 'Código e produto', kind: 'system' },
    ],
    edges: [
      { from: 'pessoa', to: 'copiloto', label: 'pergunta' },
      { from: 'copiloto', to: 'fatos', label: 'consulta' },
      { from: 'copiloto', to: 'fluxo', label: 'lê' },
    ],
  }
}
