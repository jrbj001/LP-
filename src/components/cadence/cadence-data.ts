// Cadence by PixelPulseLab — product & project management com contexto e agentes

export const CADENCE_META = {
  product: 'Cadence',
  trademark: 'Agent-ready Delivery™',
  company: 'PixelPulseLab',
  tagline: 'O product management que entende seu código — e inclui agentes nas tasks.',
  contactEmail: 'ze@pixelpulselab.dev',
}

/* ─── Problema ─────────────────────────────────────────────────────────────── */

export const PROBLEM = {
  eyebrow: 'O ritmo quebrado',
  headline: 'O contexto do produto vive espalhado. O trabalho chega pela metade.',
  body: 'Requisitos nas calls, stories no board, código no GitHub, agentes sem spec. O PM vira a integração humana — e a entrega perde o ritmo.',
  pains: [
    {
      title: 'Fontes desconectadas',
      detail: 'Documento estratégico, reunião e código não conversam. Cada story começa do zero.',
    },
    {
      title: 'Specs que não executam',
      detail: 'O board guarda títulos. Falta contexto, arquivos, plano de teste e critérios que um agente (ou um dev) consiga seguir.',
    },
    {
      title: 'IA sem chão',
      detail: 'Sem GitHub e sem histórico, a LLM inventa. O enrichment vira ruído, não aceleração.',
    },
    {
      title: 'Agentes de fora do fluxo',
      detail: 'Ferramentas de PM tratam agentes como futuro. Cadence coloca a coluna “pronta p/ agent” no caminho crítico.',
    },
  ],
}

/* ─── O que é ──────────────────────────────────────────────────────────────── */

export const WHAT_IS = {
  eyebrow: 'O produto',
  headline: 'Cadence é o ritmo de entrega do produto — com contexto vivo e agentes no board.',
  body: 'Não é mais um kanban. É o workspace onde documentos, reuniões, copiloto e código viram user stories e specs agent-ready — com o PM no loop de revisão.',
  pillars: [
    {
      code: '01',
      title: 'Contexto unificado',
      detail: 'Docs, reuniões, inserção manual e copiloto alimentam o mesmo board. O GitHub fecha o círculo.',
    },
    {
      code: '02',
      title: 'Pipeline requisito → story → agent-ready',
      detail: 'Dois degraus de enrichment com LLM: user story estruturada, depois spec executável. O PM revisa antes de mover.',
    },
    {
      code: '03',
      title: 'Agentes como membros da task',
      detail: 'A coluna Pronta p/ agent e o badge Agent-ready preparam o handoff para agentes de desenvolvimento — no mesmo fluxo.',
    },
  ],
}

/* ─── Como funciona ────────────────────────────────────────────────────────── */

export const HOW_IT_WORKS = {
  eyebrow: 'Na prática',
  headline: 'Fontes → board → enrichment → agent-ready → entrega',
  steps: [
    {
      label: 'Capturar',
      title: 'Tudo que vira trabalho',
      detail: 'Documentos estratégicos, export de reuniões, copiloto em linguagem natural ou requisito manual.',
    },
    {
      label: 'Orquestrar',
      title: 'Um board por frente',
      detail: 'Kanban com colunas Requisito → User Story → Pronta p/ agent → Em desenvolvimento → Done.',
    },
    {
      label: 'Enriquecer',
      title: 'IA + GitHub',
      detail: 'A LLM lê o código do projeto e propõe persona, acceptance, diagramas, filesLikely, testPlan e riscos.',
    },
    {
      label: 'Despachar',
      title: 'Humano ou agente',
      detail: 'Spec agent-ready segue para o time ou para um agente de desenvolvimento — com o contexto que falta nos boards clássicos.',
    },
  ],
}

export const SOURCES = [
  { label: 'Documentos', detail: 'Roadmaps e arquitetura viram cards seed' },
  { label: 'Reuniões', detail: 'Briefing IA → requisitos ou stories revisáveis' },
  { label: 'Copiloto', detail: 'Linguagem natural + diagrama + apply no board' },
  { label: 'Manual', detail: 'PM cria o requisito e enriquece depois' },
]

export const PIPELINE = [
  { id: 'req', label: 'Requisito', tone: 'raw' as const },
  { id: 'story', label: 'User Story', tone: 'story' as const },
  { id: 'ready', label: 'Agent-ready', tone: 'ready' as const },
  { id: 'dev', label: 'Dev / Agente', tone: 'dev' as const },
  { id: 'done', label: 'Done', tone: 'done' as const },
]

/* ─── GitHub gateway ───────────────────────────────────────────────────────── */

export const GITHUB = {
  eyebrow: 'Gateway',
  headline: 'Conecte o projeto. O código passa a fazer parte do contexto.',
  body: 'Cadence reutiliza os repositórios do workspace: README, busca por keywords e trechos reais alimentam o copiloto e o enrichment. Sem token, a IA segue — com menos precisão. Com GitHub, ela trabalha no seu chão.',
  points: [
    {
      title: 'Repos mapeados por frente',
      detail: 'Cada board aponta para o repositório certo — landing, app, backend ou produto.',
    },
    {
      title: 'Snippets no enrichment',
      detail: 'A spec agent-ready cita arquivos prováveis e trechos relevantes, não só texto genérico.',
    },
    {
      title: 'Copiloto com citações',
      detail: 'Pergunte em linguagem natural; a resposta traz diagrama, draft da story e referências do código.',
    },
  ],
}

/* ─── Agentes ──────────────────────────────────────────────────────────────── */

export const AGENTS_SECTION = {
  eyebrow: 'Agentes nas tasks',
  headline: 'O primeiro product tool que coloca agentes no caminho crítico.',
  body: 'Cadence não trata agentes como demo. A coluna Pronta p/ agent e o nível Agent-ready existem para o handoff — humano ou máquina — com a mesma especificação.',
  now: [
    {
      title: 'Coluna Pronta p/ agent',
      detail: 'Depois do enrichment spec, o card sai da fila de escrita e entra na fila de execução.',
    },
    {
      title: 'Badge Agent-ready',
      detail: 'Context, implementation notes, filesLikely, testPlan, risks e githubRefs — o mínimo para um agente trabalhar.',
    },
    {
      title: 'PM no loop',
      detail: 'Enrichment sugere. O product manager revisa, ajusta e só então move. Human-in-the-loop de verdade.',
    },
  ],
  future: [
    {
      title: 'Squad de agentes de desenvolvimento',
      detail: 'Agentes especializados puxam cards agent-ready, abrem PRs e reportam status de volta ao board.',
    },
    {
      title: 'Agentes como assignees',
      detail: 'Incluir o agente na task — não só como automação lateral, mas como membro do fluxo.',
    },
  ],
}

/* ─── Product UX ───────────────────────────────────────────────────────────── */

export const PRODUCT_UX = {
  eyebrow: 'O produto por dentro',
  headline: 'Menos dashboard. Mais trabalho fluindo.',
  body: 'Uma experiência lean para o PM manter contexto, conversar com a LLM e despachar trabalho para pessoas e agentes — sem sair do mesmo workspace.',
  screens: [
    {
      label: 'Board',
      title: 'O ritmo inteiro numa tela',
      detail: 'Requisito, story, agent-ready, desenvolvimento e done — por frente de produto ou repositório.',
    },
    {
      label: 'Copiloto',
      title: 'Enrichment em conversa',
      detail: 'A LLM lê o GitHub, faz perguntas, desenha o fluxo e propõe a user story para aplicar no board.',
    },
    {
      label: 'Spec',
      title: 'A task que já sabe ser executada',
      detail: 'Acceptance, arquivos prováveis, contexto técnico, plano de teste e riscos num card agent-ready.',
    },
    {
      label: 'Agentes & conexões',
      title: 'Chaves protegidas. Agentes visíveis.',
      detail: 'GitHub e modelos conectados por credenciais protegidas; agentes entram no fluxo como executores.',
    },
  ],
}

/* ─── Para quem ────────────────────────────────────────────────────────────── */

export const AUDIENCE = {
  eyebrow: 'Para quem',
  headline: 'Feito para quem precisa manter o produto em movimento.',
  roles: [
    {
      title: 'Product managers',
      detail: 'Do briefing à story agent-ready sem perder o fio do código e das decisões.',
    },
    {
      title: 'Engenharia',
      detail: 'Specs com arquivos, riscos e plano de teste — menos ida e volta, mais execução.',
    },
    {
      title: 'Startups',
      detail: 'Um board que escala do zero: copiloto, GitHub e enrichment sem montar um PMO.',
    },
    {
      title: 'Analistas',
      detail: 'Reuniões e documentos viram backlog revisável, com rastreio da origem em cada card.',
    },
  ],
}

/* ─── CTA ──────────────────────────────────────────────────────────────────── */

export const CADENCE_CTA = {
  eyebrow: 'Próximo passo',
  headline: 'Quer ver Cadence no ritmo do seu produto?',
  body: 'Falamos com product managers, founders e times de engenharia que querem contexto vivo e agentes no fluxo — não mais um board vazio.',
  primary: 'Falar com a PixelPulseLab',
  secondary: 'Conhecer a PixelPulseLab',
}
