import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { jsonSchema, tool, type Tool } from 'ai'

function mcpEndpoint(): URL {
  const base = process.env.MCP_SERVER_URL?.trim()
  if (!base) throw new Error('MCP_SERVER_URL não configurado.')
  return new URL('/api/mcp', base.endsWith('/') ? base : `${base}/`)
}

function toolText(result: unknown): string {
  if (!result || typeof result !== 'object' || !('content' in result)) {
    return 'A ferramenta não devolveu texto.'
  }
  const content = (result as { content?: unknown }).content
  if (!Array.isArray(content)) return 'A ferramenta não devolveu texto.'
  return content
    .map(part => {
      if (!part || typeof part !== 'object') return ''
      const record = part as { type?: string; text?: string }
      return record.type === 'text' && typeof record.text === 'string' ? record.text : ''
    })
    .filter(Boolean)
    .join('\n')
}

export async function loadBe180McpTools(): Promise<{
  tools: Record<string, Tool>
  close: () => Promise<void>
}> {
  const token = process.env.BE180_MCP_TOKEN?.trim()
  if (!token) throw new Error('BE180_MCP_TOKEN não configurado.')

  const client = new Client({ name: 'be180-slack-bot', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(mcpEndpoint(), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  })
  await client.connect(transport)

  const listed = await client.listTools()
  const tools: Record<string, Tool> = {}
  for (const item of listed.tools) {
    tools[item.name] = tool({
      description: item.description || item.name,
      inputSchema: jsonSchema(item.inputSchema),
      execute: async (args: unknown) => {
        const result = await client.callTool({
          name: item.name,
          arguments: (args ?? {}) as Record<string, unknown>,
        })
        return toolText(result)
      },
    })
  }

  return {
    tools,
    close: async () => {
      await client.close()
    },
  }
}
