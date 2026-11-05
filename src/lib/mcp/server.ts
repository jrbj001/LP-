import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { BANCO_DE_ATIVOS_SOURCE, COLMEIA_SOURCE } from './be180-sources'
import { consultBe180Source, formatBe180SourceList, listBe180Sources } from './be180-tools'

function textResult(text: string, isError = false) {
  return {
    content: [{ type: 'text' as const, text }],
    isError,
  }
}

export function createBe180McpServer(): McpServer {
  const server = new McpServer({
    name: 'be180-cadence',
    version: '1.0.0',
  })

  const pergunta = {
    pergunta: z.string().describe('Pergunta em português sobre os dados da Be180.'),
  }

  server.registerTool(
    'consultar_banco_de_ativos',
    {
      title: 'Consultar Banco de Ativos',
      description:
        'Consulta o inventário de pontos de mídia da Be180 (PostgreSQL legado do Banco de Ativos) em linguagem natural. Somente leitura.',
      inputSchema: pergunta,
    },
    async ({ pergunta: question }) => {
      try {
        return textResult(await consultBe180Source(BANCO_DE_ATIVOS_SOURCE, question))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao consultar o Banco de Ativos.'
        return textResult(message, true)
      }
    }
  )

  server.registerTool(
    'consultar_colmeia',
    {
      title: 'Consultar Colmeia',
      description:
        'Consulta roteiros, planos e resultados do Colmeia (SQL Server) em linguagem natural. Somente leitura.',
      inputSchema: pergunta,
    },
    async ({ pergunta: question }) => {
      try {
        return textResult(await consultBe180Source(COLMEIA_SOURCE, question))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao consultar o Colmeia.'
        return textResult(message, true)
      }
    }
  )

  server.registerTool(
    'listar_fontes_be180',
    {
      title: 'Listar fontes Be180',
      description: 'Lista as fontes de dados da Be180 habilitadas para consulta (Banco de Ativos e Colmeia).',
    },
    async () => {
      try {
        return textResult(formatBe180SourceList(await listBe180Sources()))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao listar as fontes.'
        return textResult(message, true)
      }
    }
  )

  return server
}
