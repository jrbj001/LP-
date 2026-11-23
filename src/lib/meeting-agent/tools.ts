import 'server-only'

import { jsonSchema, tool, type Tool } from 'ai'
import { formatGithubContextForPrompt, gatherGithubContextForQuery } from '@/lib/backlog/github-context'
import { runNaturalLanguageQuery } from '@/lib/cadence/nl-sql'
import { hasCadenceDatabase } from '@/lib/cadence/db'
import type { ClientWorkspace } from '@/lib/client/types'
import { hasGitHubToken, listCommitsSince, listMergedPulls } from '@/lib/delivery/github'
import { hasNotionAccess, searchNotionPages } from '@/lib/notion/search'
import { formatTranscript } from './meetings'
import { listRecentSegments } from './store'
import type { AgentSource } from './types'

export interface ToolRunLog {
  tools: string[]
  sources: AgentSource[]
}

function errorText(error: unknown): string {
  return `Falha na ferramenta: ${error instanceof Error ? error.message : String(error)}`
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? Math.round(value) : Number.NaN
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

function addSource(log: ToolRunLog, source: AgentSource): void {
  const key = `${source.kind}:${source.url ?? source.label}`
  if (log.sources.some(item => `${item.kind}:${item.url ?? item.label}` === key)) return
  log.sources.push(source)
}

/** Todas as ferramentas são somente leitura: o agente nunca escreve no GitHub, Notion ou banco. */
export function buildMeetingAgentTools(input: {
  client: ClientWorkspace
  botId: string
  log: ToolRunLog
}): Record<string, Tool> {
  const { client, botId, log } = input
  const repos = client.delivery?.repos ?? []
  const tools: Record<string, Tool> = {}

  const track = (name: string) => {
    if (!log.tools.includes(name)) log.tools.push(name)
  }

  tools.transcricao_atual = tool({
    description:
      'Lê a transcrição recente da reunião em andamento. Use para entender o contexto da pergunta ou retomar o que foi dito.',
    inputSchema: jsonSchema<{ minutos?: number }>({
      type: 'object',
      properties: { minutos: { type: 'number', description: 'Janela em minutos (1 a 60). Padrão 10.' } },
      additionalProperties: false,
    }),
    execute: async ({ minutos }) => {
      track('transcricao_atual')
      try {
        const segments = await listRecentSegments(botId, clampInt(minutos, 1, 60, 10))
        addSource(log, { kind: 'transcript', label: 'Transcrição da reunião' })
        return formatTranscript(segments, 8000) || 'Nada transcrito ainda nesta janela.'
      } catch (error) {
        return errorText(error)
      }
    },
  })

  if (repos.length > 0) {
    tools.buscar_codigo = tool({
      description:
        'Busca no código dos repositórios do produto (GitHub): arquivos relevantes, trechos e histórico recente. Use para perguntas sobre como algo funciona, onde está implementado ou se já existe.',
      inputSchema: jsonSchema<{ consulta: string }>({
        type: 'object',
        properties: { consulta: { type: 'string', description: 'Termos técnicos ou funcionalidade a procurar.' } },
        required: ['consulta'],
        additionalProperties: false,
      }),
      execute: async ({ consulta }) => {
        track('buscar_codigo')
        try {
          const bundle = await gatherGithubContextForQuery({ clientId: client.slug, query: consulta }, repos, {
            allRepos: true,
          })
          for (const snippet of bundle.snippets.slice(0, 6)) {
            addSource(log, { kind: 'github', label: `${snippet.repo}:${snippet.path}`, url: snippet.url })
          }
          return formatGithubContextForPrompt(bundle).slice(0, 12_000)
        } catch (error) {
          return errorText(error)
        }
      },
    })

    tools.listar_prs_commits = tool({
      description:
        'Lista PRs mescladas e commits recentes dos repositórios do produto. Use para perguntas sobre o que foi entregue, status de uma feature ou o que mudou recentemente.',
      inputSchema: jsonSchema<{ dias?: number }>({
        type: 'object',
        properties: { dias: { type: 'number', description: 'Janela em dias (1 a 60). Padrão 14.' } },
        additionalProperties: false,
      }),
      execute: async ({ dias }) => {
        track('listar_prs_commits')
        if (!hasGitHubToken()) return 'GITHUB_TOKEN ausente: não consigo ler PRs e commits.'
        const days = clampInt(dias, 1, 60, 14)
        const since = new Date(Date.now() - days * 86_400_000)
        const commitSince = new Date(Date.now() - Math.min(days, 7) * 86_400_000)
        const parts = await Promise.all(
          repos.slice(0, 6).map(async repo => {
            const full = `${repo.owner}/${repo.repo}`
            try {
              const [pulls, commits] = await Promise.all([
                listMergedPulls(repo.owner, repo.repo, since),
                listCommitsSince(repo.owner, repo.repo, commitSince),
              ])
              for (const pr of pulls.slice(0, 5)) {
                addSource(log, {
                  kind: 'github',
                  label: `${full}#${pr.number}`,
                  url: `https://github.com/${full}/pull/${pr.number}`,
                })
              }
              const prLines = pulls
                .slice(0, 15)
                .map(pr => `#${pr.number} ${pr.title} (${pr.merged_at?.slice(0, 10) ?? 'sem data'}, ${pr.head.ref})`)
              const commitLines = commits
                .slice(0, 15)
                .map(c => `${c.sha.slice(0, 7)} ${c.commit.message.split('\n')[0]} (${(c.commit.author?.date ?? '').slice(0, 10)})`)
              return `Repositório ${full}\nPRs mescladas (${days} dias):\n${prLines.join('\n') || '—'}\nCommits (${Math.min(days, 7)} dias):\n${commitLines.join('\n') || '—'}`
            } catch (error) {
              return `Repositório ${full}: ${errorText(error)}`
            }
          })
        )
        return parts.join('\n---\n')
      },
    })
  }

  if (hasCadenceDatabase()) {
    tools.consultar_cadence = tool({
      description:
        'Consulta a base do Cadence (backlog de cards, entregas, PRs indexadas, reuniões e documentos anteriores) com uma pergunta em linguagem natural. Use para status de cards, prioridades, histórico de decisões e números.',
      inputSchema: jsonSchema<{ pergunta: string }>({
        type: 'object',
        properties: { pergunta: { type: 'string', description: 'Pergunta objetiva em português.' } },
        required: ['pergunta'],
        additionalProperties: false,
      }),
      execute: async ({ pergunta }) => {
        track('consultar_cadence')
        try {
          const result = await runNaturalLanguageQuery(client.slug, pergunta)
          addSource(log, { kind: 'cadence', label: 'Base do Cadence' })
          const rows = result.rows.slice(0, 15)
          return `Resposta: ${result.answer}\nLinhas (${result.rows.length}): ${JSON.stringify(rows).slice(0, 4000)}`
        } catch (error) {
          return errorText(error)
        }
      },
    })
  }

  if (hasNotionAccess()) {
    tools.buscar_notion = tool({
      description:
        'Busca páginas no Notion do produto (specs, PRDs, decisões, wikis) por título e devolve o conteúdo. Use para requisitos, regras de negócio e documentação.',
      inputSchema: jsonSchema<{ consulta: string }>({
        type: 'object',
        properties: { consulta: { type: 'string', description: 'Palavras-chave do título da página.' } },
        required: ['consulta'],
        additionalProperties: false,
      }),
      execute: async ({ consulta }) => {
        track('buscar_notion')
        try {
          const pages = await searchNotionPages(consulta)
          if (pages.length === 0) return 'Nenhuma página encontrada no Notion para esta busca.'
          for (const page of pages) addSource(log, { kind: 'notion', label: page.title, url: page.url })
          return pages
            .map(page => `Página: ${page.title}\nURL: ${page.url}\nEditada: ${page.lastEditedAt.slice(0, 10)}\n${page.text || '(sem texto)'}`)
            .join('\n---\n')
        } catch (error) {
          return errorText(error)
        }
      },
    })
  }

  return tools
}
