export const MISSIONS_SDK_REVETORIZACAO_META = {
  title: 'SDK de Missions e revetorização',
  status: 'Plano aprovado · Dia 1',
  scope: '3 frentes · 3 devs',
  target: 'SDK instalável fora do monorepo + índice revetorizado',
  team: ['João', 'Pedro', 'Henrique'],
}

export const FRENTES_TABLE: {
  frente: string
  dev: string
  entrega: string
  ondeMexe: string
}[] = [
  {
    frente: 'A',
    dev: 'João',
    entrega: 'Tipos e PixelRuntimeClient.missions instalável',
    ondeMexe: 'packages/core',
  },
  {
    frente: 'B',
    dev: 'Pedro',
    entrega: 'Teste de integração e guia de consumo',
    ondeMexe: 'apps/tools-service/test, docs/product',
  },
  {
    frente: 'C',
    dev: 'Henrique',
    entrega: 'Melhorias de embedding/RAG e revetorização da Colmeia e do Banco de Ativos',
    ondeMexe: 'packages/rag, jobs de indexação',
  },
]

export interface RoadmapTask {
  id: string
  title: string
  implementation: string[]
  acceptance?: string[]
}

export interface RoadmapOwner {
  id: string
  dev: string
  frente: string
  objective: string
  ownership: string
  tasks: RoadmapTask[]
  definitionOfDone: string
}

export const ROADMAP_OWNERS: RoadmapOwner[] = [
  {
    id: 'frente-a',
    dev: 'João',
    frente: 'Frente A',
    objective: 'O LP- instala @pixelpulse/core e chama client.missions.* só por HTTP.',
    ownership: 'Tipos e cliente em @pixelpulse/core',
    tasks: [
      {
        id: 'A1',
        title: 'Tipos de Mission (PR 1 — primeiro a sair, desbloqueia a Frente B)',
        implementation: [
          'Criar packages/core/src/missions/types.ts com Mission, MissionTask, MissionArtifact, MissionEvent, Actor, CreateMissionInput, approvals, plan, contextEngine, learned.',
          'Ponto de partida: tipos já presentes em apps/cadence/src/lib/runtime.ts, linhas 9–117 — conferir campo a campo contra o JSON real, sem copiar no escuro.',
          'Decisão a tomar: runtimeEvents, scheduling, history, historyFrames e historyFramesTruncated são contrato público ou detalhe interno do harness? Sugestão: opcionais e marcados como experimentais.',
          'Usar unions literais de status (WAITING_APPROVAL, COMPLETED, FAILED…) no lugar de string. A lista sai do runtime.',
        ],
        acceptance: [
          'Tipos cobrem o shape real devolvido pelo pipeline.ts, campo a campo.',
          'status usa union literal, não string solta.',
        ],
      },
      {
        id: 'A2',
        title: 'PixelRuntimeClient (PR 2)',
        implementation: [
          'Classe nova, separada do PixelPulseClient — auth diferente: atual manda x-pixelpulse-api-key, Missions usa Authorization: Bearer.',
          'Construtor recebe { baseUrl, apiKey, fetch? }. Injetar fetch facilita teste e funciona em Node, edge e browser.',
          'Métodos de missions: create, get, list, tasks, events, artifacts, approve, lesson, remove — os nove batem com as rotas já registradas em apps/tools-service/src/http/express-app.ts (linhas 69–77).',
          'Portar RuntimeError com status e code, incluindo o caso RUNTIME_OFFLINE.',
          'Em approve, aceitar reviewer opcional (vira header X-Cadence-Reviewer) e lesson opcional, como já faz decideApproval.',
          'Fora do escopo: sameSiteMotor e callEmbedded. Sem leitura de process.env dentro do pacote — configuração só pelo construtor.',
        ],
        acceptance: [
          'Os 9 métodos de missions batem 1:1 com as rotas HTTP do tools-service.',
          'Nenhuma leitura de process.env dentro do pacote.',
        ],
      },
      {
        id: 'A3',
        title: 'Tornar o pacote instalável de verdade (PR 3)',
        implementation: [
          'Hoje main/types apontam para ./src/index.ts, o que só funciona dentro do monorepo.',
          'Gerar build em dist com .js e .d.ts, ajustar exports, files e versão.',
          'Decidir com o time: registry privado, GitHub Packages ou tarball.',
          'Smoke test: pnpm pack, instalar o tarball num diretório vazio e compilar um arquivo que importa PixelRuntimeClient.',
        ],
        acceptance: [
          'Pacote publicado ou empacotado.',
          'Instalação funciona fora do monorepo e os tipos compilam no consumidor.',
        ],
      },
      {
        id: 'A4',
        title: 'Testes unitários do cliente',
        implementation: [
          'fetch mockado cobrindo headers, encoding do id, mapeamento de erro e desembrulho de { mission } e { missions }.',
        ],
      },
    ],
    definitionOfDone:
      'O pacote está publicado ou empacotado, a instalação funciona fora do monorepo e os tipos compilam no consumidor.',
  },
  {
    id: 'frente-b',
    dev: 'Pedro',
    frente: 'Frente B',
    objective: 'Provar que o que o SDK promete é o que o runtime entrega hoje.',
    ownership: 'Teste de integração e guia',
    tasks: [
      {
        id: 'B1',
        title: 'Teste de integração em apps/tools-service/test/sdk-missions.integration.test.ts',
        implementation: [
          'Base: http-missions-pipeline.test.ts, que já usa createApp, createCadencePipeline({ github: false }) e setChatCompletionForTests — sem LLM nem GITHUB_TOKEN.',
          'Diferença importante: em vez de supertest, subir createApp(...).listen(0) e usar o próprio PixelRuntimeClient contra http://127.0.0.1:<porta>, testando o caminho HTTP real com Bearer.',
          'Roteiro: create com repository "fictional/padaria" → polling até WAITING_APPROVAL → approve em cada aprovação pendente → conferir COMPLETED → exercitar tasks, events, artifacts e lesson → terminar com remove.',
          'Validar o JSON contra os tipos com type guards escritos à mão (assertMission, assertMissionEvent), exportados de core ou só do teste — recomendado em vez de schema (evita dependência no core).',
          'Mais um teste que falha se o runtime devolver uma chave que o tipo não conhece — é isso que pega divergência futura.',
          'Cobrir também erros: 401 sem Bearer, 404 de Mission inexistente e a decisão REJECTED.',
        ],
        acceptance: [
          'Roteiro completo (create → aprovações → COMPLETED → tasks/events/artifacts/lesson → remove) verde.',
          'Teste falha se o runtime devolver chave que o tipo não conhece.',
          '401, 404 e REJECTED cobertos.',
        ],
      },
      {
        id: 'B2',
        title: 'Guia de consumo em docs/product/missions-sdk.md (pasta ainda não existe)',
        implementation: [
          'Instalação e configuração (baseUrl, apiKey), com aviso de rodar só no servidor, como já diz o comentário do runtime.ts.',
          'Exemplo em TypeScript: criar a Mission, acompanhar os eventos, aprovar e registrar a lição.',
          'Importante: não existe stream, só GET /events. "Escutar events" precisa ser polling, idealmente usando sequence para não reprocessar eventos. Push vira item futuro.',
          'Tabela de status e transições, e o catálogo de códigos de erro.',
          'O exemplo do guia deve ser o mesmo código que roda no teste, ou ser extraído dele, para não ficar desatualizado.',
        ],
      },
    ],
    definitionOfDone: 'O pacote só sai para o LP- com o teste da Frente B verde.',
  },
  {
    id: 'frente-c',
    dev: 'Henrique',
    frente: 'Frente C',
    objective:
      'Melhorar a qualidade da recuperação e revetorizar a Colmeia e o Banco de Ativos com um pipeline versionado.',
    ownership: 'Embeddings, RAG e revetorização',
    tasks: [
      {
        id: 'C1',
        title: 'Confirmar a fonte da Colmeia (bloqueante, dia 1)',
        implementation: [
          'A "Colmeia" não aparece em nenhum lugar do repositório. Antes de começar, confirmar com o time qual é a fonte, o conector e o sourceName canônico dela.',
        ],
      },
      {
        id: 'C2',
        title: 'Baseline de qualidade (antes de mudar qualquer coisa)',
        implementation: [
          'Usar o benchmark já existente (entity-graph-benchmark.ts, página indexed-data/benchmark) mais um conjunto de perguntas reais da Colmeia e do Banco de Ativos.',
          'Medir recall@k, MRR e taxa de resposta correta. Sem esse número, não dá para dizer que a mudança melhorou.',
        ],
      },
      {
        id: 'C3',
        title: 'Corrigir embeddings.ts e indexer.ts',
        implementation: [
          'embedBatch descarta textos inválidos e corta em 2000 sem avisar quem chamou — o array devolvido pode ficar desalinhado com a entrada (embedding pode ir parar no documento errado). Corrigir para devolver os vetores na posição original (ou falhar) e quebrar o batch em lotes, em vez de truncar.',
          'Não há retry nem backoff para 429 e 5xx da API — adicionar.',
          'Há dois defaults de chunking: 1000/200 em um caminho e 500/50 em outro (indexer.ts, perto da linha 986) — virar política única por tipo de fonte.',
          'CohereEmbeddings é um stub e NeonPostgresVectorStore é só um TODO — remover os dois ou marcar claramente, para ninguém achar que funcionam.',
        ],
        acceptance: [
          'embedBatch nunca desalinha vetor com documento de entrada.',
          'Retry/backoff cobre 429 e 5xx.',
          'Uma única política de chunking por tipo de fonte.',
        ],
      },
      {
        id: 'C4',
        title: 'Melhorias de qualidade (cada uma medida contra o baseline)',
        implementation: [
          'Chunking por estrutura (registro e campos semânticos) no lugar de tamanho fixo, nas fontes tabulares.',
          'Envelope de contexto no chunk, com fonte, entidade e campos-chave, aproveitando o applyChunkEnvelope já existente.',
          'Avaliar text-embedding-3-large ou dimensions maiores, olhando custo pelo cost-estimator.ts.',
          'Ajustar o peso do hybrid (lexical + vetorial) e avaliar um reranker.',
        ],
      },
      {
        id: 'C5',
        title: 'Revetorização sem downtime (blue/green)',
        implementation: [
          'Subir PIPELINE_VERSION para catalog-2 e registrar modelo, versão e chunking no ledger (vector-job.ts).',
          'Indexar em um namespace ou índice novo do Upstash, sem mexer no índice atual.',
          'Rodar census, reconcile e coverage no índice novo, comparar com o baseline e só então fazer o cutover. Depois, purgar catalog-1 com vector-catalog-purge.',
          'Ordem sugerida: primeiro o Banco de Ativos (Be180), que já tem projeção e testes, e depois a Colmeia, assim que a fonte estiver confirmada.',
        ],
        acceptance: [
          'Métricas no índice novo iguais ou melhores que o baseline.',
          'Banco de Ativos e Colmeia 100% cobertos em catalog-2.',
          'Índice antigo (catalog-1) purgado.',
        ],
      },
    ],
    definitionOfDone:
      'As métricas no novo índice estão iguais ou melhores que o baseline, as duas fontes estão 100% cobertas em catalog-2 e o índice antigo foi purgado.',
  },
]

export const SDK_SEQUENCE_FLOW = [
  'A: tipos (PR1)',
  'B: teste valida shape',
  'A: cliente (PR2)',
  'A: build e publicação',
  'B: guia final',
]

export const RAG_SEQUENCE_FLOW = [
  'C: baseline',
  'C: correções embedBatch e chunking',
  'C: melhorias medidas',
  'C: revetorização blue/green',
]

export const SYNC_POINTS: { title: string; detail: string }[] = [
  {
    title: 'Dia 1',
    detail:
      'João publica o PR dos tipos em draft e Pedro começa pelo harness do teste. Henrique confirma a fonte da Colmeia e roda o baseline.',
  },
  {
    title: 'Sincronização 1',
    detail: 'Quando os tipos (A1) fecharem, o teste da Frente B já precisa estar validando o shape.',
  },
  {
    title: 'Sincronização 2',
    detail: 'O pacote só sai para o LP- com o teste da Frente B verde.',
  },
  {
    title: 'Sincronização 3',
    detail: 'A Frente C só faz o cutover com as métricas aprovadas.',
  },
]

export const OBSERVATIONS = [
  'Existe uma alteração não commitada em packages/rag/src/agent-search.ts. Henrique precisa saber dela antes de começar, para não haver conflito.',
  'O plano respeita as restrições do escopo: nenhum arquivo do LP- muda e apps/cadence também não muda.',
  'A Frente C não toca em /v1/ask, data.ask nem no crítico de resultado. Também não mexe na duplicação entre packages/rag/src/service/mission.ts e packages/mission-runtime — assim ela não conflita com o SDK.',
]

export const ALTERNATIVE_SPLIT =
  'Se preferirem três devs no SDK e um quarto no RAG, a Frente B se divide fácil em teste (Pedro) e guia (um quarto dev).'
