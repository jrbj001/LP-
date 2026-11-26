/**
 * Guia das fontes que toda pesquisa de conhecimento pode consultar (Copilot e agente de reunião).
 * O orquestrador (planner) escolhe quais usar pela pergunta. Bancos vêm do registro de fontes
 * e do dicionário de dados; as fontes do workspace ficam aqui.
 */

export type WorkspaceSourceId = 'github' | 'meetings' | 'documents' | 'notion' | 'monday'

export const WORKSPACE_SOURCE_IDS: WorkspaceSourceId[] = ['github', 'meetings', 'documents', 'notion', 'monday']

export interface WorkspaceSourceGuide {
  id: WorkspaceSourceId
  label: string
  /** O que esta fonte responde, em linguagem de negócio. */
  description: string
  /** Pistas da pergunta que pedem esta fonte. Usadas como reforço do planejador. */
  askPattern: RegExp
}

export const WORKSPACE_SOURCES: WorkspaceSourceGuide[] = [
  {
    id: 'github',
    label: 'GitHub',
    description:
      'código, PRs e commits dos repositórios: como algo é implementado, mudanças recentes e trechos de código',
    askPattern: /\b(c[oó]digo|github|reposit[oó]ri\w*|pull requests?|prs?|commits?|branch|implementa\w*|arquivos?|fun[cç][aã]o|bugs?|lp|landing page)\b/i,
  },
  {
    id: 'meetings',
    label: 'Reuniões',
    description:
      'reuniões do cliente e gravadas pelo Cadence, com resumo, decisões, riscos e itens de ação: o que foi decidido, combinado ou discutido, e quando',
    askPattern: /\b(reuni[aã]o|reuni[oõ]es|atas?|decid\w*|decis[aã]o|decis[oõ]es|combinad\w*|combinamos|falamos|discut\w*|aprovad\w*|alinhad\w*|briefing)\b/i,
  },
  {
    id: 'documents',
    label: 'Documentos',
    description:
      'documentos do portal e uploads: especificações, manuais, arquitetura e planos de projeto',
    askPattern: /\b(documento\w*|manual\w*|especifica\w*|arquitetura|prd|requisitos?|regras? de neg[oó]cio|portal)\b/i,
  },
  {
    id: 'notion',
    label: 'Notion',
    description:
      'páginas do Notion do produto: especificações, PRDs, decisões e wikis',
    askPattern: /\b(notion|prd|wiki|especifica\w*|regras? de neg[oó]cio)\b/i,
  },
  {
    id: 'monday',
    label: 'Monday',
    description:
      'itens do quadro Monday da BE180: tarefas, status e atualizações. Só leitura.',
    askPattern: /\bmonday\b/i,
  },
]

const CADENCE_BASE_LINE =
  '- Workspace Cadence (base própria): cards do backlog, entregas e status de execução. Não representa usuários nem registros de produtos de cliente.'

export const WORKSPACE_SOURCE_GUIDE = [
  ...WORKSPACE_SOURCES.map(source => `- ${source.label}: ${source.description}.`),
  CADENCE_BASE_LINE,
].join('\n')

export function workspaceSourceLabel(id: string): string {
  return WORKSPACE_SOURCES.find(source => source.id === id)?.label ?? id
}
