export const MISSIONS_ROADMAP_META = {
  id: 'pixel-missions-architecture-roadmap',
  title: 'Pixel — Missions Architecture & Execution Roadmap',
  status: 'Execution Plan',
  phase: 'Mission Runtime — Phase 1',
  team: ['José', 'João', 'Pedro', 'Henrique Marga'],
  target: 'First end-to-end Mission',
  sprint: '2 semanas',
  updatedAt: '25/09/2026',
  path: '/missions-architecture-roadmap',
}

export const PRODUCT_SHIFT = [
  ['Question', 'Objective'],
  ['Chat', 'Mission'],
  ['Answer', 'Result'],
  ['Prompt', 'Planning'],
  ['RAG', 'Context Engine'],
  ['Copilot', 'Agents'],
  ['Tools isoladas', 'Tool Runtime'],
  ['User Stories', 'Mission Tasks'],
  ['Automação pontual', 'Continuous Execution'],
  ['Usuário operando IA', 'Humans + Agents'],
  ['AI SDK', 'Pixel Runtime'],
] as const

export const QUESTION_FLOW = ['Question', 'Context', 'Retrieval', 'LLM', 'Answer']
export const MISSION_FLOW = [
  'Objective',
  'Mission',
  'Context',
  'Plan',
  'Tasks',
  'Humans + Agents',
  'Tools',
  'Execution',
  'Evaluation',
  'Approval',
  'Artifacts / Actions',
  'Result',
]

export const PLATFORM_LAYERS = [
  {
    title: 'Presence',
    detail: 'Voice · Meetings · Conversation · Intent Capture',
  },
  {
    title: 'Cadence',
    detail: 'Objectives · Missions · Humans · Agents · Tasks · Approvals · Artifacts',
  },
  {
    title: 'Pixel Runtime',
    detail:
      'Mission Engine · Agent Runtime · Context Engine · Tool Runtime · Memory · Policies · Evaluation · Events / Audit',
  },
  {
    title: 'Model Providers',
    detail: 'Gemini · Claude · GPT',
  },
] as const

export const RUNTIME_CAPABILITIES = [
  'RAG',
  'hybrid retrieval',
  'entity graph',
  'memory',
  'conversation',
  'NL → SQL',
  'database access',
  'GitHub/code context',
  'MCP',
  'tools-service',
  'authentication',
  'tenancy',
  'policies',
  'quotas',
  'usage',
  'observability',
]

export const RUNTIME_TREE = [
  {
    title: 'Mission Runtime',
    items: ['Mission', 'MissionRunner', 'MissionPlanner', 'TaskScheduler', 'Execution', 'Events'],
  },
  {
    title: 'Agent Runtime',
    items: ['Agent', 'AgentRegistry', 'AgentExecutor', 'Capabilities'],
  },
  {
    title: 'Context Engine',
    items: ['ContextResolver', 'RAG', 'Memory', 'Entity Graph', 'NL-SQL', 'Sources'],
  },
  {
    title: 'Tool Runtime',
    items: ['ToolRegistry', 'ToolExecutor', 'MCP', 'Permissions'],
  },
  {
    title: 'Platform Controls',
    items: ['Evaluation', 'Approval', 'Policy', 'Identity / Tenant', 'Observability / Audit'],
  },
] as const

export const MISSION_LIFECYCLE = [
  'CREATED',
  'CONTEXT_RESOLVING',
  'PLANNING',
  'READY',
  'RUNNING',
  'WAITING_APPROVAL',
  'RUNNING',
  'EVALUATING',
  'COMPLETED',
]

export const ALTERNATE_STATES = ['FAILED', 'CANCELLED', 'BLOCKED']

export const CORE_CONTRACTS = [
  {
    name: 'Mission',
    code: `interface Mission {
  id: string;
  tenantId: string;
  objective: string;
  status: MissionStatus;
  context: ContextReference[];
  plan?: MissionPlan;
  tasks: MissionTask[];
  artifacts: Artifact[];
  createdBy: Actor;
  createdAt: Date;
  updatedAt: Date;
  traceId: string;
}`,
  },
  {
    name: 'MissionTask',
    code: `interface MissionTask {
  id: string;
  missionId: string;
  objective: string;
  assignedTo?: Actor;
  requiredTools: ToolReference[];
  dependencies: string[];
  status: TaskStatus;
  result?: TaskResult;
}`,
  },
  {
    name: 'Agent',
    code: `interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities: Capability[];
  allowedTools: ToolReference[];
  execute(
    task: MissionTask,
    context: MissionContext
  ): Promise<AgentResult>;
}`,
  },
  {
    name: 'Artifact',
    code: `interface Artifact {
  id: string;
  missionId: string;
  taskId?: string;
  type: string;
  title: string;
  content?: unknown;
  uri?: string;
  createdBy: Actor;
  createdAt: Date;
}`,
  },
] as const

export const FIRST_MISSION = {
  objective: 'Implement a simple feature in an existing repository.',
  flow: [
    'Create Mission',
    'Resolve Context',
    'Analyze Repository',
    'Create Plan',
    'Create Tasks',
    'Assign Engineer Agent',
    'Read Code',
    'Modify Code',
    'Run Tests',
    'Generate Artifact',
    'Request Human Approval',
    'Human Approves',
    'Create/Open PR',
    'Mission Completed',
  ],
}

export type RoadmapTask = {
  id: string
  title: string
  implementation: string[]
  acceptance?: string[]
  note?: string
}

export type RoadmapOwner = {
  id: 'marga' | 'joao' | 'pedro'
  name: string
  ownership: string
  objective: string
  definitionOfDone: string
  tasks: RoadmapTask[]
}

export const ROADMAP_OWNERS: RoadmapOwner[] = [
  {
    id: 'marga',
    name: 'Henrique Marga',
    ownership: 'Mission Runtime / Execution Engine',
    objective:
      'Uma Mission deve conseguir existir, mudar de estado, criar Tasks, executar Agents/Tools, produzir Events e terminar com um resultado auditável.',
    definitionOfDone:
      'Mission Runtime capaz de executar uma Mission com state machine, Tasks, Agent invocation, Tool invocation, Events, Artifacts e Approval Gate.',
    tasks: [
      {
        id: 'MARGA-01',
        title: 'Mission Domain Model',
        implementation: [
          'Criar modelos/interfaces: Mission, MissionStatus, MissionPlan, MissionTask, TaskStatus, Execution, ExecutionStatus, Actor, AgentReference, ToolReference, Artifact, Approval, MissionEvent e ContextReference.',
        ],
        acceptance: ['É possível criar uma Mission válida através do domínio sem depender do Cadence.'],
      },
      {
        id: 'MARGA-02',
        title: 'Mission Persistence',
        implementation: [
          'Criar persistência para Missions, Tasks, executions, artifacts, approvals e events.',
          'Operações mínimas: createMission(), getMission(), updateMission(), listMissions(), createTask(), updateTask(), appendEvent(), createArtifact(), createApproval() e resolveApproval().',
        ],
        acceptance: ['Reiniciar o serviço não perde o estado da Mission.'],
      },
      {
        id: 'MARGA-03',
        title: 'Mission State Machine',
        implementation: [
          'Implementar transições válidas entre CREATED, CONTEXT_RESOLVING, PLANNING, READY, RUNNING, WAITING_APPROVAL, EVALUATING, COMPLETED, FAILED, BLOCKED e CANCELLED.',
          'Não permitir transições inválidas.',
        ],
        acceptance: [
          'Toda mudança de estado é validada.',
          'Toda mudança de estado é persistida.',
          'Toda mudança de estado produz MissionEvent.',
        ],
      },
      {
        id: 'MARGA-04',
        title: 'Mission Runner',
        implementation: [
          'Criar MissionRunner.run(missionId).',
          'Fluxo inicial: load Mission → resolve Context → request Plan → create Tasks → execute ready Tasks → collect results → persist Artifacts → evaluate → request Approval if required → continue → complete Mission.',
        ],
        acceptance: ['Uma Mission simples consegue atravessar todo o lifecycle automaticamente.'],
      },
      {
        id: 'MARGA-05',
        title: 'Task Scheduler',
        implementation: [
          'Implementar dependências entre Tasks.',
          'Fluxo de referência: Analyze repository → Create implementation plan → Modify backend → Run tests.',
          'Tasks sem dependências pendentes podem ser executadas.',
        ],
        acceptance: ['Uma Task não pode executar antes de suas dependências terminarem.'],
      },
      {
        id: 'MARGA-06',
        title: 'Event System',
        implementation: [
          'Eventos mínimos: mission.created, mission.context_resolved, mission.planned, mission.started, mission.completed, mission.failed.',
          'Eventos de task: task.created, task.started, task.completed, task.failed.',
          'Eventos de agent: agent.started, agent.completed, agent.failed.',
          'Eventos de tool: tool.called, tool.completed, tool.failed.',
          'Eventos finais: artifact.created, approval.requested, approval.approved, approval.rejected.',
        ],
        acceptance: ['É possível reconstruir o histórico da Mission através dos Events.'],
      },
      {
        id: 'MARGA-07',
        title: 'Approval Gate',
        implementation: [
          'Criar mecanismo para interromper a execução.',
          'Fluxo: Agent Action → requiresApproval? → Mission em WAITING_APPROVAL → Human approves → Execution continues.',
        ],
        acceptance: ['Nenhuma Tool marcada como approval-required executa antes da aprovação humana.'],
      },
    ],
  },
  {
    id: 'joao',
    name: 'João',
    ownership: 'Context Engine',
    objective:
      'Dada uma Mission, produzir automaticamente o contexto necessário para os Agents executarem o trabalho.',
    definitionOfDone:
      'ContextResolver capaz de receber uma Mission e produzir um MissionContext estruturado usando o patrimônio existente de RAG, GitHub/code context, database, memory e Entity Graph.',
    tasks: [
      {
        id: 'JOAO-01',
        title: 'MissionContext Contract',
        implementation: [
          'Criar MissionContext com: mission, company, product, project, repository, requirements, decisions, meetings, databaseFacts, documents, memories, previousMissions, policies e sources.',
        ],
      },
      {
        id: 'JOAO-02',
        title: 'Context Resolver',
        implementation: [
          'Criar context.resolve({ tenantId, missionId, objective, actor }).',
          'O resolver deve descobrir quais fontes são relevantes.',
        ],
      },
      {
        id: 'JOAO-03',
        title: 'Adapt Existing RAG',
        implementation: [
          'Não reescrever RAG.',
          'Criar Adapter para utilizar o RAG existente como fonte do Context Engine.',
          'Fluxo: Context Engine → RAG Adapter → Existing Hybrid Retrieval.',
        ],
      },
      {
        id: 'JOAO-04',
        title: 'GitHub / Repository Context',
        implementation: [
          'Criar Repository Context Provider.',
          'Dado repository + objective, retornar: repository architecture, relevant directories, relevant files, dependencies, related code, existing implementation e potential entry points.',
        ],
      },
      {
        id: 'JOAO-05',
        title: 'Database Context',
        implementation: [
          'Utilizar NL→SQL e mecanismos existentes para fornecer fatos relevantes.',
          'O Agent não deve receber simplesmente acesso irrestrito ao banco.',
          'O Context Engine deve fornecer informações estruturadas quando possível.',
        ],
      },
      {
        id: 'JOAO-06',
        title: 'Memory Context',
        implementation: [
          'Conectar memória existente ao MissionContext.',
          'Incluir previous decisions, previous implementation choices, previous Mission results, known constraints e important organizational context.',
        ],
      },
      {
        id: 'JOAO-07',
        title: 'Entity Graph',
        implementation: [
          'Usar Entity Graph para conectar People, Projects, Repositories, Products, Customers, Meetings, Documents, Missions e Decisions.',
          'O objetivo não é apenas semantic search. O objetivo é contextualização.',
        ],
      },
      {
        id: 'JOAO-08',
        title: 'Provenance',
        implementation: [
          'Cada item importante de contexto deve carregar source, sourceType, retrievedAt, confidence?, uri? e entityId?.',
        ],
        acceptance: [
          'Um Agent consegue explicar de onde veio uma informação usada durante a Mission.',
        ],
      },
      {
        id: 'JOAO-09',
        title: 'Context Budget',
        implementation: [
          'Criar estratégia inicial para evitar enviar contexto ilimitado ao modelo.',
          'Prioridades: Mission objective → explicit constraints → direct repository context → related decisions → relevant memory → semantic context → peripheral context.',
        ],
      },
    ],
  },
  {
    id: 'pedro',
    name: 'Pedro',
    ownership: 'Cadence Integration + Agent Runtime',
    objective:
      'Permitir que um usuário crie uma Mission no Cadence, acompanhe sua execução e veja Agents trabalhando.',
    definitionOfDone:
      'Usuário consegue criar uma Mission no Cadence, acompanhar Tasks e Agents, aprovar uma ação e visualizar os Artifacts produzidos.',
    tasks: [
      {
        id: 'PEDRO-01',
        title: 'Mission API',
        implementation: [
          'Implementar POST /missions, GET /missions/:id, GET /missions/:id/tasks, GET /missions/:id/events e GET /missions/:id/artifacts.',
          'Cadence deve criar uma Mission com objective, projectId, repository e constraints.',
        ],
      },
      {
        id: 'PEDRO-02',
        title: 'Mission Creation UI',
        implementation: [
          'Criar interface inicial com Objective, Project, Repository, Constraints e ação CREATE MISSION.',
        ],
      },
      {
        id: 'PEDRO-03',
        title: 'Mission Detail',
        implementation: [
          'Criar página MISSION #001 com Objective, Status, Progress, Plan, Tasks, Agents, Approvals, Artifacts e Events.',
        ],
      },
      {
        id: 'PEDRO-04',
        title: 'Mission Timeline',
        implementation: [
          'Mostrar execução visualmente.',
          'Exemplo: Mission created → Context resolution started → Repository analyzed → Plan generated → Task created → Engineer Agent started → Tool repository.read → Artifact created → Approval requested.',
        ],
      },
      {
        id: 'PEDRO-05',
        title: 'Agent Contract',
        implementation: [
          'Implementar runtime/interface Agent com id, role, capabilities, allowedTools e execute(task: MissionTask, context: MissionContext): Promise<AgentResult>.',
        ],
      },
      {
        id: 'PEDRO-06',
        title: 'Agent Registry',
        implementation: [
          'Criar registro inicial: ProductAgent, EngineerAgent e QAAgent.',
          'Por enquanto somente EngineerAgent precisa executar uma Mission real. Os outros podem existir apenas como contratos/placeholders.',
        ],
      },
      {
        id: 'PEDRO-07',
        title: 'Engineer Agent v0',
        implementation: [
          'Capabilities: inspect repository, search code, read files, understand architecture, propose implementation, modify allowed files, run tests, generate diff e produce implementation artifact.',
        ],
      },
      {
        id: 'PEDRO-08',
        title: 'Tool Integration',
        implementation: [
          'Conectar Engineer Agent ao Tool Runtime existente.',
          'Primeiras Tools: repository.search, repository.read, repository.write, repository.diff, test.run, github.create_branch e github.create_pr.',
          'As Tools destrutivas devem exigir Approval.',
        ],
      },
      {
        id: 'PEDRO-09',
        title: 'Approval UI',
        implementation: [
          'Cadence mostra APPROVAL REQUIRED com ação desejada, arquivos, motivo e Mission.',
          'Exemplo: Engineer Agent quer modificar src/auth/google.ts para implementar OAuth callback.',
          'Ações: APPROVE e REJECT.',
        ],
      },
      {
        id: 'PEDRO-10',
        title: 'Artifacts UI',
        implementation: [
          'Artifacts devem aparecer dentro da Mission.',
          'Primeiros tipos: Analysis, Plan, Code Diff, Test Result, Pull Request e Agent Report.',
        ],
      },
    ],
  },
]

export const SHARED_VERTICAL = [
  'Cadence',
  'Pedro · Create Mission',
  'Marga · Mission Runtime',
  'João · Context Engine',
  'Marga · MissionRunner',
  'Pedro · Engineer Agent',
  'Tools',
  'Human Approval',
  'Result',
]

export const SPRINT_PLAN = [
  {
    window: 'Days 1–2',
    people: [
      { name: 'Marga', items: ['Mission contracts', 'state machine', 'persistence'] },
      { name: 'João', items: ['MissionContext', 'ContextResolver contract', 'adapters architecture'] },
      { name: 'Pedro', items: ['Mission API', 'Mission creation UI', 'Agent contract'] },
    ],
  },
  {
    window: 'Days 3–5',
    people: [
      { name: 'Marga', items: ['MissionRunner', 'TaskScheduler', 'Events'] },
      { name: 'João', items: ['RAG Adapter', 'Repository Context Provider', 'Memory Adapter'] },
      { name: 'Pedro', items: ['Mission Detail UI', 'Agent Registry', 'Engineer Agent v0'] },
    ],
  },
  {
    window: 'Days 6–8',
    people: [
      { name: 'Marga', items: ['Approval Gate', 'Artifact lifecycle', 'execution resilience'] },
      { name: 'João', items: ['Entity Graph context', 'database context', 'provenance', 'context budget'] },
      { name: 'Pedro', items: ['Tool integration', 'approval UI', 'artifacts UI', 'Mission Timeline'] },
    ],
  },
  {
    window: 'Days 9–10',
    people: [
      {
        name: 'Integration only',
        items: [
          'Nenhuma feature nova.',
          'Cadence → Mission → Context → Plan → Task → Agent → Tool → Artifact → Approval → PR → Completed.',
        ],
      },
    ],
  },
]

export const SPRINT_DEFINITION_OF_DONE = [
  'Abrir Cadence.',
  'Criar Mission: Implement feature X in repository Y.',
  'Mission muda para CONTEXT_RESOLVING.',
  'Context Engine identifica automaticamente informações relevantes do codebase.',
  'Mission passa para PLANNING.',
  'Sistema gera plano.',
  'Plano vira Tasks.',
  'Engineer Agent recebe uma Task.',
  'Agent utiliza Tools para entender o código.',
  'Agent produz uma alteração.',
  'Testes são executados.',
  'Cadence mostra APPROVAL REQUIRED.',
  'Humano aprova.',
  'PR é criado.',
  'Mission passa para COMPLETED.',
  'Cadence apresenta Objective, Plan, Tasks executed, Agents involved, Tools used, Approvals, Artifacts, PR, Execution timeline e Final result.',
]

export const OUT_OF_SCOPE = [
  'novo chatbot',
  'redesign completo',
  'avatar do Presence',
  'voice',
  'dezenas de Agents',
  'dezenas de Tools',
  'novo RAG',
  'novo vector database',
  'reescrita do SDK',
  'otimizações prematuras',
  'multi-agent orchestration complexa',
  'autonomous long-running Missions',
  'marketplace de Agents',
  'novo model provider sem necessidade direta',
]

export const NEXT_PHASES = [
  {
    title: 'Phase 2',
    detail:
      'Adicionar Product Agent, QA Agent, Research Agent e Data Agent. Missions passam a ter múltiplos Agents.',
  },
  {
    title: 'Phase 3',
    detail:
      'Generalizar Missions além de software: customer churn, sales pipeline, board meeting, competitor research, customer proposal e production incident. O Runtime permanece; mudam Context, Agents, Tools e Policies.',
  },
]

export const PRESENCE_FLOW = [
  'Meeting',
  'Presence understands conversation',
  'Identifica um problema importante',
  'Sugere criar uma Mission',
  'POST /missions',
  'Cadence',
  'Agents execute',
]

export const NORTH_STAR_FLOW = [
  'Mission Created',
  'Mission Understood',
  'Mission Planned',
  'Mission Executed',
  'Mission Evaluated',
  'Mission Completed',
]

export const CLOSING_STATEMENTS = [
  ['North Star Statement', 'Where humans and AI agents work together to accomplish missions.'],
  ['Engineering Statement', 'Our unit of execution is a Mission.'],
  ['Product Statement', 'Our unit of value is a completed Mission.'],
] as const
