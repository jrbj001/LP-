import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import {
  applySpecEnrichment,
  applyStoryEnrichment,
  enrichCardToSpec,
  enrichCardToStory,
  type BacklogClientContext,
} from '@/lib/backlog/enrich'
import { getBacklogBoards } from '@/lib/backlog/boards'
import type { BacklogCard } from '@/lib/backlog/types'
import { getClient } from '@/lib/client/registry'
import type { RepoConfig } from '@/lib/delivery/types'
import {
  createMondayItem,
  createMondaySubitem,
  listMondayGroupItems,
  postMondayUpdate,
  readBe180MondayConfig,
} from '@/lib/monday/publish'
import { BE180_MONDAY_CLIENT_ID, formatMondayItemName, formatMondayStoryHtml, mondayItemUrl } from '@/lib/monday/story'
import { EPICO_PLANILHA, NECESSIDADES, OBJETIVO, REUNIAO, type Necessidade } from './necessidades'

export const COLMEIA_BOARD_ID = '18412647269'
export const DISCOVERY_GROUP_ID = 'group_mm91sbcm'
const SAIDA = path.join(process.cwd(), 'tmp', 'discovery-colmeia')

const ORIENTACAO = `Como escrever esta story:
- Parta dos arquivos, rotas de API, tabelas, views e procedures citados no contexto. O que precisar ser criado deve vir
  marcado como novo (ex.: "nova tabela", "nova rota").
- Escreva de 6 a 10 critérios de aceite, cada um verificável e com o resultado esperado; inclua os dados reais citados
  (praças, contagens, itens já abertos) quando servirem de caso de teste.
- O plano de testes (testPlan) diz como testar cada critério, na ordem dos critérios: a tela e o clique, a chamada de API
  (método e rota) ou a consulta SQL de leitura, e o resultado que confirma.
- Escreva em português do Brasil, com os termos de OOH usados pela Be180.`

interface Gerado {
  slug: string
  pai?: string
  card: BacklogCard
}

function itens(): { necessidade: Necessidade; pai?: string }[] {
  return [
    ...NECESSIDADES.map(necessidade => ({ necessidade })),
    { necessidade: EPICO_PLANILHA },
    ...EPICO_PLANILHA.filhas.map(necessidade => ({ necessidade, pai: EPICO_PLANILHA.slug })),
  ]
}

function cardBruto(necessidade: Necessidade, pai?: string): BacklogCard {
  const now = new Date().toISOString()
  const epico = pai ? `\n\nEsta story faz parte do ${EPICO_PLANILHA.titulo}.` : ''
  return {
    id: `discovery-colmeia-${necessidade.slug}`,
    boardId: 'colmeia',
    column: 'requirement',
    title: necessidade.titulo,
    level: 'raw',
    context: [
      OBJETIVO,
      `O que foi dito na reunião:\n${necessidade.reuniao}`,
      `O que já existe no Colmeia (código, APIs e banco):\n${necessidade.base}${epico}`,
      ORIENTACAO,
    ].join('\n\n'),
    source: { kind: 'meeting', ref: REUNIAO.url },
    createdAt: now,
    updatedAt: now,
  }
}

function clienteBe180(): { contexto: BacklogClientContext; repos: RepoConfig[] } {
  const client = getClient(BE180_MONDAY_CLIENT_ID)
  if (!client) throw new Error('Cliente Be180 não encontrado.')
  return {
    contexto: { clientId: client.slug, clientName: client.name, sector: client.sector },
    repos: client.delivery?.repos ?? [],
  }
}

/** Enriquece cada necessidade como o Cadence: user story e depois especificação com plano de testes. */
export async function gerar(options: { filtro: string[]; refazer: boolean }): Promise<void> {
  const { contexto, repos } = clienteBe180()
  await mkdir(SAIDA, { recursive: true })
  const falhas: string[] = []
  for (const { necessidade, pai } of itens()) {
    if (options.filtro.length && !options.filtro.includes(necessidade.slug)) continue
    if (!options.refazer && (await lerGerado(necessidade.slug).catch(() => null))) {
      console.log(`pronta  ${necessidade.slug}`)
      continue
    }
    try {
      await comLimite(gerarUma(contexto, repos, necessidade, pai), LIMITE_POR_STORY_MS)
    } catch (error) {
      falhas.push(necessidade.slug)
      console.error(`falhou  ${necessidade.slug}  ${error instanceof Error ? error.message.split('\n')[0] : error}`)
    }
  }
  if (falhas.length) {
    console.error(`\n${falhas.length} falharam; rode gerar de novo para tentar só elas: ${falhas.join(' ')}`)
    process.exitCode = 1
  }
}

const LIMITE_POR_STORY_MS = 4 * 60_000

function comLimite<T>(promessa: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined
  const limite = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`sem resposta em ${ms / 1000} s`)), ms)
  })
  return Promise.race([promessa, limite]).finally(() => clearTimeout(timer))
}

async function gerarUma(
  contexto: BacklogClientContext,
  repos: RepoConfig[],
  necessidade: Necessidade,
  pai?: string
): Promise<void> {
  const bruto = cardBruto(necessidade, pai)
  const story = applyStoryEnrichment(bruto, await enrichCardToStory(contexto, bruto, repos))
  const spec = applySpecEnrichment(story, await enrichCardToSpec(contexto, story, repos))
  const card: BacklogCard = {
    ...spec,
    context: [
      spec.context,
      `O que foi dito na reunião: ${necessidade.reuniao}`,
      `O que já existe no Colmeia: ${necessidade.base}`,
    ].map(bloco => bloco?.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean).join('\n\n'),
    testPlan: spec.testPlan?.map(passo => passo.replace(/^\s*\d+[.)]\s*/, '')),
  }
  const gerado: Gerado = { slug: necessidade.slug, pai, card }
  await writeFile(path.join(SAIDA, `${necessidade.slug}.json`), JSON.stringify(gerado, null, 2))
  console.log(`gerada  ${necessidade.slug}  ${card.title}  (${card.acceptance?.length ?? 0} critérios, ${card.testPlan?.length ?? 0} testes)`)
}

async function lerGerado(slug: string): Promise<Gerado> {
  return JSON.parse(await readFile(path.join(SAIDA, `${slug}.json`), 'utf8')) as Gerado
}

function corpo(card: BacklogCard, boardLabel: string): string {
  return `${formatMondayStoryHtml(card, boardLabel)}<p>Origem: <a href="${REUNIAO.url}">${REUNIAO.titulo}</a></p>`
}

/** Cria os itens no grupo Discovery Colmeia; o épico vira item com as filhas como subitens. Não duplica pelo nome. */
export async function publicar(options: { dryRun: boolean }): Promise<void> {
  const configured = readBe180MondayConfig()
  if (!configured.ok) throw new Error(`Monday sem configuração: ${configured.missing.join(', ')}.`)
  const config = configured.config
  const boardLabel = getBacklogBoards(BE180_MONDAY_CLIENT_ID).find(board => board.id === 'colmeia')?.productLabel ?? 'colmeia'
  const existentes = await listMondayGroupItems({ config, boardId: COLMEIA_BOARD_ID, groupId: DISCOVERY_GROUP_ID })
  const porNome = new Map(existentes.map(item => [item.name, item]))
  const idPorSlug = new Map<string, string>()

  for (const { necessidade, pai } of itens()) {
    const gerado = await lerGerado(necessidade.slug).catch(() => null)
    if (!gerado) {
      console.log(`falta   ${necessidade.slug}  (rode gerar antes)`)
      continue
    }
    const { card } = gerado
    const nome = formatMondayItemName(card.title)

    if (!pai) {
      const atual = porNome.get(nome)
      if (atual) {
        idPorSlug.set(necessidade.slug, atual.id)
        console.log(`existe  ${necessidade.slug}  ${mondayItemUrl(config.accountSlug!, COLMEIA_BOARD_ID, atual.id)}`)
        continue
      }
      if (options.dryRun) {
        console.log(`criaria ${necessidade.slug}  ${nome}`)
        continue
      }
      const itemId = await createMondayItem({ config, boardId: COLMEIA_BOARD_ID, groupId: DISCOVERY_GROUP_ID, name: nome })
      await postMondayUpdate({ config, itemId, body: corpo(card, boardLabel) })
      idPorSlug.set(necessidade.slug, itemId)
      console.log(`criado  ${necessidade.slug}  ${mondayItemUrl(config.accountSlug!, COLMEIA_BOARD_ID, itemId)}`)
      continue
    }

    const paiId = idPorSlug.get(pai)
    const paiExistente = existentes.find(item => item.id === paiId)
    if (paiExistente?.subitems.some(sub => sub.name === nome)) {
      console.log(`existe  ${necessidade.slug}  (subitem)`)
      continue
    }
    if (options.dryRun || !paiId) {
      console.log(`criaria ${necessidade.slug}  ${nome}  (subitem)`)
      continue
    }
    const sub = await createMondaySubitem({ config, parentItemId: paiId, name: nome })
    await postMondayUpdate({ config, itemId: sub.id, body: corpo(card, boardLabel) })
    console.log(`criado  ${necessidade.slug}  (subitem ${sub.id})`)
  }
}
