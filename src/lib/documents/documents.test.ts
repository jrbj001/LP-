import { describe, expect, it } from 'vitest'
import type { BacklogCard } from '@/lib/backlog/types'
import { parseArchitecture, parseDrafts, parseWorkPlan } from './analyze'
import {
  documentItemsToCards,
  markAlreadyExported,
  parseDocumentApplyItems,
} from './backlog-export'
import { extractDocumentText, truncateForPrompt } from './extract'
import {
  ACCEPTED_UPLOAD_EXTENSIONS,
  MAX_EXTRACTED_CHARS,
  detectDocumentKind,
  documentSourceRef,
  extensionOf,
  normalizeDraftTitle,
  type ClientDocumentRecord,
} from './types'

const CLIENT_ID = 'be180-ooh'

function documentFixture(overrides: Partial<ClientDocumentRecord> = {}): ClientDocumentRecord {
  return {
    id: 'doc-1',
    clientId: CLIENT_ID,
    title: 'Escopo do projeto',
    fileName: 'escopo.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 2048,
    kind: 'pdf',
    status: 'extracted',
    createdAt: '2026-08-18T12:00:00.000Z',
    updatedAt: '2026-08-18T12:00:00.000Z',
    ...overrides,
  }
}

describe('detecção de formato', () => {
  it('resolve pela extensão, inclusive quando o mime é genérico', () => {
    expect(detectDocumentKind('metas.xlsx', 'application/octet-stream')).toBe('spreadsheet')
    expect(detectDocumentKind('ata.docx', '')).toBe('document')
    expect(detectDocumentKind('contrato.PDF', '')).toBe('pdf')
    expect(detectDocumentKind('fluxo.png', '')).toBe('image')
    expect(detectDocumentKind('notas.md', '')).toBe('text')
  })

  it('cai para o mime quando a extensão é desconhecida', () => {
    expect(detectDocumentKind('captura', 'image/heic')).toBe('image')
    expect(detectDocumentKind('planilha', 'text/csv')).toBe('spreadsheet')
  })

  it('rejeita formatos fora da lista', () => {
    expect(detectDocumentKind('malware.exe', 'application/x-msdownload')).toBeNull()
    expect(detectDocumentKind('video.mp4', 'video/mp4')).toBeNull()
  })

  it('extrai a extensão em minúsculas e ignora espaços', () => {
    expect(extensionOf('  Relatório.XLSX  ')).toBe('xlsx')
    expect(extensionOf('sem-extensao')).toBe('')
  })

  it('mantém a lista de extensões aceitas em sincronia com a detecção', () => {
    for (const extension of ACCEPTED_UPLOAD_EXTENSIONS) {
      expect(detectDocumentKind(`arquivo.${extension}`, '')).not.toBeNull()
    }
  })
})

describe('truncamento para o prompt', () => {
  it('preserva textos dentro do limite', () => {
    const result = truncateForPrompt('  conteúdo curto  ')
    expect(result.text).toBe('conteúdo curto')
    expect(result.truncated).toBe(false)
  })

  it('corta e sinaliza textos acima do limite', () => {
    const result = truncateForPrompt('a'.repeat(MAX_EXTRACTED_CHARS + 500))
    expect(result.truncated).toBe(true)
    expect(result.text).toHaveLength(MAX_EXTRACTED_CHARS)
  })

  it('remove bytes nulos que quebram o JSON do prompt', () => {
    expect(truncateForPrompt('linha\u0000 final').text).toBe('linha final')
  })
})

describe('refs e normalização de título', () => {
  it('gera o mesmo ref para variações de acento, caixa e pontuação', () => {
    expect(normalizeDraftTitle('Integração de Pedidos!')).toBe('integracao-de-pedidos')
    expect(documentSourceRef('doc-1', 'Integração de Pedidos!')).toBe(
      documentSourceRef('doc-1', 'integracao de pedidos')
    )
  })

  it('separa refs de documentos diferentes com o mesmo título', () => {
    expect(documentSourceRef('doc-1', 'Login')).not.toBe(documentSourceRef('doc-2', 'Login'))
  })
})

describe('dedup contra o backlog', () => {
  const drafts = [
    {
      id: 'document-draft-a',
      mode: 'requirement' as const,
      boardId: 'colmeia' as const,
      title: 'Integração de Pedidos',
      priority: 'Alta' as const,
      context: 'Seção 3 do escopo.',
    },
    {
      id: 'document-draft-b',
      mode: 'requirement' as const,
      boardId: 'colmeia' as const,
      title: 'Painel de acompanhamento',
      priority: 'Média' as const,
      context: 'Seção 4 do escopo.',
    },
  ]

  function cardFixture(overrides: Partial<BacklogCard>): BacklogCard {
    return {
      id: 'card-1',
      boardId: 'colmeia',
      column: 'requirement',
      title: 'Integração de Pedidos',
      level: 'raw',
      source: { kind: 'document', ref: documentSourceRef('doc-1', 'Integração de Pedidos') },
      createdAt: '2026-08-18T12:00:00.000Z',
      updatedAt: '2026-08-18T12:00:00.000Z',
      ...overrides,
    }
  }

  it('marca apenas o item já exportado', () => {
    const result = markAlreadyExported('doc-1', drafts, [cardFixture({})])
    expect(result.map(draft => draft.alreadyExported)).toEqual([true, false])
  })

  it('ignora cards de outro documento', () => {
    const other = cardFixture({
      source: { kind: 'document', ref: documentSourceRef('doc-9', 'Integração de Pedidos') },
    })
    expect(markAlreadyExported('doc-1', drafts, [other]).every(d => !d.alreadyExported)).toBe(true)
  })

  it('ignora cards de outra origem com título igual', () => {
    const fromMeeting = cardFixture({ source: { kind: 'meeting', ref: 'meeting:m1:integracao-de-pedidos' } })
    expect(markAlreadyExported('doc-1', drafts, [fromMeeting]).every(d => !d.alreadyExported)).toBe(true)
  })
})

describe('validação do payload de apply', () => {
  const validItem = {
    id: 'document-draft-a',
    mode: 'requirement',
    boardId: 'colmeia',
    title: 'Integração de Pedidos',
    priority: 'Alta',
    context: 'Seção 3.',
  }

  it('aceita um requisito válido', () => {
    const items = parseDocumentApplyItems({ items: [validItem] }, CLIENT_ID)
    expect(items).toHaveLength(1)
    expect(items[0].mode).toBe('requirement')
  })

  it('recusa board que não pertence ao cliente', () => {
    expect(() =>
      parseDocumentApplyItems({ items: [{ ...validItem, boardId: 'likeme-app' }] }, CLIENT_ID)
    ).toThrow(/Board inválido/)
  })

  it('recusa prioridade fora do domínio', () => {
    expect(() =>
      parseDocumentApplyItems({ items: [{ ...validItem, priority: 'Urgente' }] }, CLIENT_ID)
    ).toThrow(/Prioridade inválida/)
  })

  it('recusa id que não veio do fluxo de documentos', () => {
    expect(() =>
      parseDocumentApplyItems({ items: [{ ...validItem, id: 'meeting-draft-a' }] }, CLIENT_ID)
    ).toThrow(/Identificação ou título inválido/)
  })

  it('recusa lista vazia ou acima do teto', () => {
    expect(() => parseDocumentApplyItems({ items: [] }, CLIENT_ID)).toThrow(/entre 1 e 12/)
    expect(() =>
      parseDocumentApplyItems({ items: Array.from({ length: 13 }, () => validItem) }, CLIENT_ID)
    ).toThrow(/entre 1 e 12/)
  })

  it('recusa user story sem os campos obrigatórios', () => {
    expect(() =>
      parseDocumentApplyItems({ items: [{ ...validItem, mode: 'story', persona: 'PM' }] }, CLIENT_ID)
    ).toThrow(/User story incompleta/)
  })

  it('aceita user story completa', () => {
    const items = parseDocumentApplyItems(
      {
        items: [
          {
            ...validItem,
            mode: 'story',
            persona: 'Analista de mídia',
            want: 'importar a planilha de inventário',
            soThat: 'a curadoria não seja manual',
            acceptance: ['Importação valida colunas obrigatórias', ''],
          },
        ],
      },
      CLIENT_ID
    )
    expect(items[0].acceptance).toEqual(['Importação valida colunas obrigatórias'])
  })
})

describe('conversão em cards do backlog', () => {
  const document = documentFixture({ sourceUrl: 'https://notion.so/escopo' })

  it('mapeia requisito e story para coluna e nível corretos', () => {
    const [requirement, story] = documentItemsToCards(document, [
      {
        id: 'document-draft-a',
        mode: 'requirement',
        boardId: 'colmeia',
        title: 'Integração de Pedidos',
        priority: 'Alta',
        context: 'Seção 3.',
      },
      {
        id: 'document-draft-b',
        mode: 'story',
        boardId: 'colmeia',
        title: 'Importar inventário',
        priority: 'Média',
        context: 'Seção 4.',
        persona: 'Analista',
        want: 'importar a planilha',
        soThat: 'ganhar tempo',
        acceptance: ['Valida colunas'],
      },
    ])

    expect(requirement.column).toBe('requirement')
    expect(requirement.level).toBe('raw')
    expect(requirement.persona).toBeUndefined()
    expect(story.column).toBe('story')
    expect(story.level).toBe('story')
    expect(story.acceptance).toEqual(['Valida colunas'])
  })

  it('usa source.kind document e ref determinístico para o dedup', () => {
    const item = {
      id: 'document-draft-a',
      mode: 'requirement' as const,
      boardId: 'colmeia' as const,
      title: 'Integração de Pedidos',
      priority: 'Alta' as const,
      context: 'Seção 3.',
    }
    const [first] = documentItemsToCards(document, [item])
    const [second] = documentItemsToCards(document, [item])

    expect(first.source.kind).toBe('document')
    expect(first.source.ref).toBe(documentSourceRef(document.id, item.title))
    expect(second.id).toBe(first.id)
  })

  it('registra a origem rastreável no contexto do card', () => {
    const [card] = documentItemsToCards(document, [
      {
        id: 'document-draft-a',
        mode: 'requirement',
        boardId: 'colmeia',
        title: 'Integração de Pedidos',
        priority: 'Alta',
        context: 'Seção 3.',
      },
    ])
    expect(card.context).toContain('Escopo do projeto')
    expect(card.context).toContain('https://notion.so/escopo')
    expect(card.context).toContain('Seção 3.')
  })
})

describe('validação do plano de trabalho gerado', () => {
  const valid = {
    title: 'Plano de integração O2C',
    summary: 'Integrar pedidos e faturamento em três ondas.',
    milestones: [
      {
        title: 'Descoberta técnica',
        objective: 'Mapear os sistemas envolvidos.',
        deliverables: ['Inventário de integrações'],
        acceptanceCriteria: ['Documento revisado pelo cliente'],
      },
    ],
    risks: ['Acesso tardio ao ERP'],
  }

  it('aceita um plano completo', () => {
    const plan = parseWorkPlan(valid)
    expect(plan.milestones).toHaveLength(1)
    expect(plan.milestones[0].id).toBe('m0')
    expect(plan.generatedAt).toBeTruthy()
  })

  it('recusa plano sem título ou resumo', () => {
    expect(() => parseWorkPlan({ ...valid, title: '' })).toThrow(/título ou resumo/)
    expect(() => parseWorkPlan({ ...valid, summary: '   ' })).toThrow(/título ou resumo/)
  })

  it('recusa plano sem milestone utilizável', () => {
    expect(() => parseWorkPlan({ ...valid, milestones: [] })).toThrow(/milestones/)
    expect(() =>
      parseWorkPlan({ ...valid, milestones: [{ title: 'X', objective: 'Y', deliverables: [] }] })
    ).toThrow(/milestones/)
  })

  it('descarta tipos inesperados em vez de propagá-los', () => {
    const plan = parseWorkPlan({
      ...valid,
      risks: 'não é lista',
      milestones: [{ ...valid.milestones[0], acceptanceCriteria: null }],
    })
    expect(plan.risks).toEqual([])
    expect(plan.milestones[0].acceptanceCriteria).toEqual([])
  })

  it('recusa payload que não é objeto', () => {
    expect(() => parseWorkPlan(null)).toThrow(/inválido/)
    expect(() => parseWorkPlan('texto')).toThrow(/inválido/)
  })
})

describe('validação da arquitetura gerada', () => {
  const valid = {
    title: 'Arquitetura do fluxo O2C',
    overview: 'Camada de integração entre ERP e portal.',
    components: [
      { name: 'Gateway de pedidos', responsibility: 'Recebe e valida pedidos.', touchpoints: ['org/repo:src/api'] },
    ],
    integrations: ['ERP via REST'],
    decisions: ['Fila assíncrona para picos'],
    risks: ['Latência do ERP'],
  }

  it('aceita uma arquitetura completa', () => {
    const architecture = parseArchitecture(valid)
    expect(architecture.components[0].touchpoints).toEqual(['org/repo:src/api'])
    expect(architecture.diagram).toBeUndefined()
  })

  it('aproveita o diagrama quando ele é válido', () => {
    const architecture = parseArchitecture({
      ...valid,
      diagram: {
        title: 'Fluxo',
        nodes: [
          { id: 'n1', label: 'Pedido', kind: 'input' },
          { id: 'n2', label: 'Gateway', kind: 'process' },
        ],
        edges: [{ from: 'n1', to: 'n2' }],
      },
    })
    expect(architecture.diagram?.nodes).toHaveLength(2)
  })

  it('ignora diagrama malformado sem derrubar o artefato', () => {
    const architecture = parseArchitecture({ ...valid, diagram: { title: 'Fluxo' } })
    expect(architecture.diagram).toBeUndefined()
    expect(architecture.title).toBe(valid.title)
  })

  it('recusa arquitetura sem componentes', () => {
    expect(() => parseArchitecture({ ...valid, components: [] })).toThrow(/componentes/)
  })
})

describe('validação dos drafts gerados pela IA', () => {
  const base = {
    boardId: 'colmeia',
    title: 'Integração de Pedidos',
    priority: 'Alta',
    context: 'Seção 3 do escopo.',
  }

  it('gera ids determinísticos por documento e título', () => {
    const [first] = parseDrafts({ drafts: [{ ...base, mode: 'requirement' }] }, CLIENT_ID, 'doc-1')
    const [again] = parseDrafts({ drafts: [{ ...base, mode: 'requirement' }] }, CLIENT_ID, 'doc-1')
    const [other] = parseDrafts({ drafts: [{ ...base, mode: 'requirement' }] }, CLIENT_ID, 'doc-2')
    expect(first.id).toBe(again.id)
    expect(first.id).not.toBe(other.id)
    expect(first.id.startsWith('document-draft-')).toBe(true)
  })

  it('remove duplicatas equivalentes por título', () => {
    const drafts = parseDrafts(
      {
        drafts: [
          { ...base, mode: 'requirement' },
          { ...base, mode: 'requirement', title: 'integracao de pedidos' },
        ],
      },
      CLIENT_ID,
      'doc-1'
    )
    expect(drafts).toHaveLength(1)
  })

  it('descarta itens com board inexistente para o cliente', () => {
    expect(() =>
      parseDrafts({ drafts: [{ ...base, mode: 'requirement', boardId: 'likeme-app' }] }, CLIENT_ID, 'doc-1')
    ).toThrow(/Nenhum item/)
  })

  it('rebaixa story incompleta para requisito em vez de descartar', () => {
    const [draft] = parseDrafts(
      { drafts: [{ ...base, mode: 'story', persona: 'Analista' }] },
      CLIENT_ID,
      'doc-1'
    )
    expect(draft.mode).toBe('requirement')
    expect(draft.persona).toBeUndefined()
  })

  it('preserva a story quando todos os campos vêm preenchidos', () => {
    const [draft] = parseDrafts(
      {
        drafts: [
          {
            ...base,
            mode: 'story',
            persona: 'Analista',
            want: 'importar a planilha',
            soThat: 'ganhar tempo',
            acceptance: ['Valida colunas'],
          },
        ],
      },
      CLIENT_ID,
      'doc-1'
    )
    expect(draft.mode).toBe('story')
    expect(draft.acceptance).toEqual(['Valida colunas'])
  })

  it('recusa resposta sem a chave drafts', () => {
    expect(() => parseDrafts({}, CLIENT_ID, 'doc-1')).toThrow(/não retornou itens/)
  })
})

describe('extração real por formato', () => {
  it('lê planilha xlsx aba por aba', async () => {
    const ExcelJS = (await import('exceljs')).default
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Inventário')
    sheet.addRow(['Praça', 'Faces', 'Ocupação'])
    sheet.addRow(['São Paulo', 120, 0.82])
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer())

    const extraction = await extractDocumentText('spreadsheet', buffer, '', 'inventario.xlsx')

    expect(extraction.method).toBe('exceljs')
    expect(extraction.sheets).toEqual(['Inventário'])
    expect(extraction.text).toContain('## Aba: Inventário')
    expect(extraction.text).toContain('Praça | Faces | Ocupação')
    expect(extraction.text).toContain('São Paulo | 120 | 0.82')
    expect(extraction.truncated).toBe(false)
  })

  it('trata csv como texto puro', async () => {
    const extraction = await extractDocumentText(
      'spreadsheet',
      Buffer.from('praca,faces\nSão Paulo,120\n', 'utf8'),
      'text/csv',
      'inventario.csv'
    )
    expect(extraction.method).toBe('plain')
    expect(extraction.text).toContain('São Paulo,120')
  })

  it('decodifica markdown preservando acentos', async () => {
    const extraction = await extractDocumentText(
      'text',
      Buffer.from('# Escopo\n\nIntegração de pedidos.', 'utf8'),
      'text/markdown',
      'escopo.md'
    )
    expect(extraction.method).toBe('plain')
    expect(extraction.text).toContain('Integração de pedidos.')
    expect(extraction.charCount).toBe(extraction.text.length)
  })
})

describe('contexto do card', () => {
  it('limita o contexto para não estourar o card do backlog', () => {
    const [card] = documentItemsToCards(documentFixture(), [
      {
        id: 'document-draft-a',
        mode: 'requirement',
        boardId: 'colmeia',
        title: 'Integração de Pedidos',
        priority: 'Alta',
        context: 'x'.repeat(5000),
      },
    ])
    expect(card.context?.length).toBeLessThanOrEqual(1800)
  })

  it('omite o link quando o documento não tem origem externa', () => {
    const [card] = documentItemsToCards(documentFixture(), [
      {
        id: 'document-draft-a',
        mode: 'requirement',
        boardId: 'colmeia',
        title: 'Integração de Pedidos',
        priority: 'Alta',
        context: 'Seção 3.',
      },
    ])
    expect(card.context).not.toContain('Link:')
  })
})
