import {
  AS_IS,
  USER_STORIES,
  WORK_PLAN,
  type UserStory,
} from '@/components/client/documents/colmeia-agent-architecture-data'
import { getBacklogBoards } from './boards'
import { type BacklogBoardId, type BacklogCard } from './types'

function nowIso(): string {
  return new Date().toISOString()
}

function boardForStory(story: UserStory): BacklogBoardId {
  const hay = `${story.stageId} ${story.persona} ${story.want} ${story.soThat}`.toLowerCase()
  if (
    story.stageId === 'foundation' ||
    /exibidor|invent[aá]rio|media kit|ipv|ve[ií]culos|cadastro|admin/.test(hay)
  ) {
    if (/agente|briefing|copiloto|layer|orquestra/.test(hay) && story.stageId !== 'foundation') {
      return 'agentes'
    }
    if (story.stageId === 'foundation' || /exibidor|invent|media kit|ipv|ve[ií]culos|cadastro/.test(hay)) {
      return 'banco-ativos'
    }
  }
  if (
    story.stageId === 'layer' ||
    story.stageId === 'entrada' ||
    story.stageId === 'compra' ||
    story.stageId === 'validacao' ||
    story.stageId === 'pos-venda' ||
    /agente|copiloto|layer|briefing|pi\b|comprov/.test(hay)
  ) {
    return 'agentes'
  }
  return 'colmeia'
}

function boardForGap(gap: string): BacklogBoardId {
  const hay = gap.toLowerCase()
  if (/agente|copiloto|llm|layer|guardrail|contrato/.test(hay)) return 'agentes'
  if (/banco de ativos|invent[aá]rio|exibidor|media kit|cadastro|funil|ipv|doaç/.test(hay)) {
    return 'banco-ativos'
  }
  if (/visibil|image|brand/.test(hay)) return 'visibilidade'
  return 'colmeia'
}

function boardForMilestoneDeliverable(milestoneId: string, text: string): BacklogBoardId {
  const hay = text.toLowerCase()
  if (/agente|copiloto|rag|layer|orquestra|guardrail|avaliac/.test(hay)) return 'agentes'
  if (/invent[aá]rio|media kit|exibidor|cadastro|ipv|funil|banco de ativos/.test(hay)) {
    return 'banco-ativos'
  }
  if (milestoneId === 'm1' && /upload|admin|onboarding/.test(hay)) return 'banco-ativos'
  return 'colmeia'
}

function storyTitle(story: UserStory): string {
  return `Como ${story.persona}, quero ${story.want}`
}

/** Seed imutável derivado dos documentos — overrides ficam no store. */
export function buildSeedCards(clientId: string): BacklogCard[] {
  if (clientId === 'adaptive-layer') return buildAdaptiveLayerMissionsCards()
  if (clientId !== 'be180-ooh') return []

  const ts = nowIso()
  const cards: BacklogCard[] = []

  for (const story of USER_STORIES) {
    cards.push({
      id: `seed-${story.id}`,
      boardId: boardForStory(story),
      column: 'story',
      title: storyTitle(story),
      level: 'story',
      persona: story.persona,
      want: story.want,
      soThat: story.soThat,
      acceptance: [...story.acceptance],
      phase: story.phase,
      priority: story.phase === 'M1' ? 'Alta' : story.phase === 'M2' ? 'Média' : 'Baixa',
      source: { kind: 'user-story', ref: story.id },
      createdAt: ts,
      updatedAt: ts,
    })
  }

  AS_IS.gaps.forEach((gap, index) => {
    cards.push({
      id: `seed-gap-${index + 1}`,
      boardId: boardForGap(gap),
      column: 'requirement',
      title: gap,
      level: 'raw',
      context: 'Gap identificado no as-is (Arquitetura de Agentes · sessão 04/08).',
      priority: /banco de ativos|invent|agente|infra/i.test(gap) ? 'Alta' : 'Média',
      source: { kind: 'gap', ref: `gap-${index + 1}` },
      createdAt: ts,
      updatedAt: ts,
    })
  })

  for (const milestone of WORK_PLAN) {
    milestone.deliverables.forEach((deliverable, index) => {
      cards.push({
        id: `seed-${milestone.id}-d${index + 1}`,
        boardId: boardForMilestoneDeliverable(milestone.id, deliverable),
        column: 'requirement',
        title: deliverable,
        level: 'raw',
        context: `${milestone.number} · ${milestone.title} — ${milestone.focus}`,
        acceptance: milestone.acceptance.slice(0, 2),
        phase: milestone.number,
        priority: milestone.id === 'm0' || milestone.id === 'm1' ? 'Alta' : 'Média',
        source: { kind: 'milestone', ref: `${milestone.id}:d${index + 1}` },
        createdAt: ts,
        updatedAt: ts,
      })
    })
  }

  // Seed mínimo do board de visibilidade (ainda sem stories formais nos docs).
  cards.push({
    id: 'seed-vis-1',
    boardId: 'visibilidade',
    column: 'requirement',
    title: 'Integrar teste de visibilidade ao fluxo operacional do Colmeia',
    level: 'raw',
    context:
      'Repos: PixelPulseLab/image_brand_processing (backend) e PixelPulseLab/visibilidade-front (frontend).',
    priority: 'Média',
    source: { kind: 'manual', ref: 'visibilidade-seed' },
    createdAt: ts,
    updatedAt: ts,
  })
  cards.push({
    id: 'seed-vis-2',
    boardId: 'visibilidade',
    column: 'requirement',
    title: 'Documentar contrato de API entre frontend e backend do teste de visibilidade',
    level: 'raw',
    priority: 'Média',
    source: { kind: 'manual', ref: 'visibilidade-api' },
    createdAt: ts,
    updatedAt: ts,
  })

  return cards
}

export function listBoards(clientId: string) {
  return getBacklogBoards(clientId)
}

/**
 * Seed do plano "SDK de Missions e revetorização" — três frentes, três devs
 * (João, Pedro, Henrique). Fonte: documento `missions-sdk-revetorizacao`.
 */
function buildAdaptiveLayerMissionsCards(): BacklogCard[] {
  const ts = nowIso()
  const docRef = 'missions-sdk-revetorizacao'

  type Seed = {
    id: string
    column: BacklogCard['column']
    title: string
    dev: 'João' | 'Pedro' | 'Henrique'
    frente: 'Frente A' | 'Frente B' | 'Frente C'
    want: string
    soThat: string
    acceptance?: string[]
    context?: string
    implementationNotes?: string
    filesLikely?: string[]
    testPlan?: string[]
    risks?: string[]
    priority: 'Alta' | 'Média' | 'Baixa'
  }

  const seeds: Seed[] = [
    {
      id: 'adaptive-layer-missions-a1-tipos',
      column: 'ready',
      title: 'PR1 · Tipos de Mission em @pixelpulse/core',
      dev: 'João',
      frente: 'Frente A',
      want: 'criar os tipos de Mission em packages/core/src/missions/types.ts',
      soThat: 'a Frente B consiga validar o shape do runtime e o LP- tenha tipos confiáveis',
      acceptance: [
        'Cobre Mission, MissionTask, MissionArtifact, MissionEvent, Actor, CreateMissionInput, approvals, plan, contextEngine, learned.',
        'status usa union literal (WAITING_APPROVAL, COMPLETED, FAILED…), não string solta.',
        'runtimeEvents, scheduling, history, historyFrames e historyFramesTruncated ficam opcionais/experimentais.',
      ],
      context: 'Primeiro PR a sair — desbloqueia o teste da Frente B.',
      implementationNotes:
        'Ponto de partida: tipos já presentes em apps/cadence/src/lib/runtime.ts, linhas 9–117. Conferir campo a campo contra o JSON real do pipeline.ts, sem copiar no escuro.',
      filesLikely: ['packages/core/src/missions/types.ts'],
      priority: 'Alta',
    },
    {
      id: 'adaptive-layer-missions-a2-cliente',
      column: 'requirement',
      title: 'PR2 · PixelRuntimeClient (cliente HTTP de Missions)',
      dev: 'João',
      frente: 'Frente A',
      want: 'uma classe PixelRuntimeClient separada do PixelPulseClient, com os 9 métodos de missions',
      soThat: 'o LP- chame client.missions.* só por HTTP, com Bearer em vez de x-pixelpulse-api-key',
      acceptance: [
        'create, get, list, tasks, events, artifacts, approve, lesson, remove batem 1:1 com as rotas de apps/tools-service/src/http/express-app.ts (linhas 69–77).',
        'Construtor recebe { baseUrl, apiKey, fetch? } — sem leitura de process.env dentro do pacote.',
        'approve aceita reviewer opcional (header X-Cadence-Reviewer) e lesson opcional.',
        'RuntimeError portado com status e code, incluindo RUNTIME_OFFLINE.',
      ],
      context: 'Depende do PR1 (tipos). sameSiteMotor e callEmbedded ficam de fora.',
      filesLikely: ['packages/core/src/missions/client.ts'],
      priority: 'Alta',
    },
    {
      id: 'adaptive-layer-missions-a3-pacote',
      column: 'requirement',
      title: 'PR3 · Pacote instalável fora do monorepo',
      dev: 'João',
      frente: 'Frente A',
      want: 'gerar build em dist com .js e .d.ts e ajustar exports, files e versão',
      soThat: 'o LP- consiga instalar @pixelpulse/core fora do monorepo',
      acceptance: [
        'Decisão do time: registry privado, GitHub Packages ou tarball.',
        'Smoke test: pnpm pack, instalar o tarball num diretório vazio e compilar um import de PixelRuntimeClient.',
      ],
      context: 'Hoje main/types apontam para ./src/index.ts, o que só funciona dentro do monorepo.',
      priority: 'Média',
    },
    {
      id: 'adaptive-layer-missions-a4-testes',
      column: 'requirement',
      title: 'Testes unitários do PixelRuntimeClient',
      dev: 'João',
      frente: 'Frente A',
      want: 'testes com fetch mockado cobrindo headers, encoding do id, erros e desembrulho',
      soThat: 'regressões no cliente sejam pegas antes de chegar no consumidor',
      testPlan: [
        'Headers (Authorization: Bearer, X-Cadence-Reviewer).',
        'Encoding do id na URL.',
        'Mapeamento de erro (RuntimeError, RUNTIME_OFFLINE).',
        'Desembrulho de { mission } e { missions }.',
      ],
      priority: 'Média',
    },
    {
      id: 'adaptive-layer-missions-b1-harness',
      column: 'ready',
      title: 'Harness do teste de integração (porta efêmera + polling)',
      dev: 'Pedro',
      frente: 'Frente B',
      want: 'montar o harness do teste (servidor numa porta efêmera e o polling)',
      soThat: 'o trabalho comece no dia 1 sem depender do PR1 da Frente A',
      implementationNotes:
        'Base: http-missions-pipeline.test.ts, que já usa createApp, createCadencePipeline({ github: false }) e setChatCompletionForTests — sem LLM nem GITHUB_TOKEN. Em vez de supertest, subir createApp(...).listen(0) e usar o PixelRuntimeClient contra http://127.0.0.1:<porta>.',
      filesLikely: ['apps/tools-service/test/sdk-missions.integration.test.ts'],
      priority: 'Alta',
    },
    {
      id: 'adaptive-layer-missions-b2-integracao',
      column: 'requirement',
      title: 'Teste de integração completo + validação de shape',
      dev: 'Pedro',
      frente: 'Frente B',
      want: 'provar que o que o SDK promete é o que o runtime entrega hoje',
      soThat: 'divergências entre o tipo e o JSON real sejam pegas antes do LP- consumir',
      acceptance: [
        'Roteiro: create (repository "fictional/padaria") → polling até WAITING_APPROVAL → approve em cada aprovação pendente → COMPLETED → tasks/events/artifacts/lesson → remove.',
        'Type guards (assertMission, assertMissionEvent) validam o JSON contra os tipos.',
        'Um teste falha se o runtime devolver uma chave que o tipo não conhece.',
      ],
      context: 'Depende do PR1 da Frente A (tipos) para validar o shape.',
      priority: 'Alta',
    },
    {
      id: 'adaptive-layer-missions-b3-erros',
      column: 'requirement',
      title: 'Cobertura de erros: 401, 404 e REJECTED',
      dev: 'Pedro',
      frente: 'Frente B',
      want: 'cobrir 401 sem Bearer, 404 de Mission inexistente e a decisão REJECTED',
      soThat: 'o guia de consumo documente o catálogo de erros com confiança',
      priority: 'Média',
    },
    {
      id: 'adaptive-layer-missions-b4-guia',
      column: 'requirement',
      title: 'Guia de consumo em docs/product/missions-sdk.md',
      dev: 'Pedro',
      frente: 'Frente B',
      want: 'escrever instalação, exemplo de TypeScript, tabela de status/transições e catálogo de erros',
      soThat: 'o LP- saiba consumir o SDK sem depender de contexto tribal',
      acceptance: [
        'Deixa claro que não existe stream — só GET /events, com polling por sequence.',
        'O exemplo do guia é o mesmo código do teste de integração, ou extraído dele.',
      ],
      context: 'O pacote só sai para o LP- com este guia e o teste da Frente B verdes.',
      filesLikely: ['docs/product/missions-sdk.md'],
      priority: 'Média',
    },
    {
      id: 'adaptive-layer-rag-c1-fonte-colmeia',
      column: 'ready',
      title: 'Confirmar fonte, conector e sourceName da Colmeia',
      dev: 'Henrique',
      frente: 'Frente C',
      want: 'confirmar com o time qual é a fonte, o conector e o sourceName canônico da Colmeia',
      soThat: 'a revetorização da Colmeia não comece sobre uma suposição errada',
      context: 'A "Colmeia" não aparece em nenhum lugar do repositório — bloqueante, item de dia 1.',
      priority: 'Alta',
    },
    {
      id: 'adaptive-layer-rag-c2-baseline',
      column: 'ready',
      title: 'Baseline de qualidade (recall@k, MRR, taxa de resposta)',
      dev: 'Henrique',
      frente: 'Frente C',
      want: 'medir recall@k, MRR e taxa de resposta correta antes de mudar qualquer coisa',
      soThat: 'dê para provar que a mudança melhorou, com número e não opinião',
      implementationNotes:
        'Usar o benchmark existente (entity-graph-benchmark.ts, página indexed-data/benchmark) mais um conjunto de perguntas reais da Colmeia e do Banco de Ativos.',
      priority: 'Alta',
    },
    {
      id: 'adaptive-layer-rag-c3-correcoes',
      column: 'requirement',
      title: 'Corrigir embedBatch, retry/backoff e unificar chunking',
      dev: 'Henrique',
      frente: 'Frente C',
      want: 'corrigir o desalinhamento do embedBatch, adicionar retry/backoff e unificar os dois defaults de chunking',
      soThat: 'nenhum embedding vá parar no documento errado e a indexação resista a 429/5xx',
      acceptance: [
        'embedBatch devolve os vetores na posição original (ou falha), sem truncar ou desalinhar.',
        'Retry/backoff cobre 429 e 5xx da API de embeddings.',
        'Uma política única de chunking por tipo de fonte (hoje há 1000/200 e 500/50, indexer.ts ~linha 986).',
        'CohereEmbeddings e NeonPostgresVectorStore removidos ou marcados claramente como stub/TODO.',
      ],
      filesLikely: ['embeddings.ts', 'indexer.ts'],
      priority: 'Alta',
    },
    {
      id: 'adaptive-layer-rag-c4-melhorias',
      column: 'requirement',
      title: 'Melhorias de qualidade medidas contra o baseline',
      dev: 'Henrique',
      frente: 'Frente C',
      want: 'chunking por estrutura, envelope de contexto, embedding maior e ajuste do hybrid/reranker',
      soThat: 'a recuperação melhore de forma mensurável nas fontes tabulares',
      implementationNotes:
        'Chunking por estrutura (registro e campos semânticos) nas fontes tabulares; envelope de contexto via applyChunkEnvelope; avaliar text-embedding-3-large/dimensions maiores com cost-estimator.ts; ajustar peso do hybrid e avaliar reranker.',
      priority: 'Média',
    },
    {
      id: 'adaptive-layer-rag-c5-revetorizacao',
      column: 'requirement',
      title: 'Revetorização blue/green: Banco de Ativos → Colmeia',
      dev: 'Henrique',
      frente: 'Frente C',
      want: 'subir PIPELINE_VERSION para catalog-2, indexar em namespace novo e fazer o cutover',
      soThat: 'a revetorização aconteça sem downtime e com rollback possível',
      acceptance: [
        'Modelo, versão e chunking registrados no ledger (vector-job.ts).',
        'census, reconcile e coverage rodados no índice novo e comparados ao baseline antes do cutover.',
        'Ordem: primeiro Banco de Ativos (Be180, já tem projeção e testes), depois Colmeia.',
        'catalog-1 purgado com vector-catalog-purge só depois do cutover aprovado.',
      ],
      risks: ['Cutover sem baseline aprovado.', 'Purgar catalog-1 antes de confirmar cobertura 100% em catalog-2.'],
      priority: 'Alta',
    },
  ]

  return seeds.map<BacklogCard>(seed => ({
    id: seed.id,
    boardId: 'adaptive-layer',
    column: seed.column,
    title: seed.title,
    level: 'spec',
    persona: `${seed.dev} · ${seed.frente}`,
    want: seed.want,
    soThat: seed.soThat,
    acceptance: seed.acceptance,
    context: seed.context,
    implementationNotes: seed.implementationNotes,
    filesLikely: seed.filesLikely,
    testPlan: seed.testPlan,
    risks: seed.risks,
    phase: seed.frente,
    priority: seed.priority,
    source: { kind: 'document', ref: docRef, entityId: docRef },
    createdAt: ts,
    updatedAt: ts,
  }))
}
