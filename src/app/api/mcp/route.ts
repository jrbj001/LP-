import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { isAuthorizedMcpRequest } from '@/lib/mcp/auth'
import { createBe180McpServer } from '@/lib/mcp/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function unauthorized(): Response {
  return Response.json({ error: 'Não autorizado.' }, { status: 401 })
}

async function handle(request: Request): Promise<Response> {
  if (!isAuthorizedMcpRequest(request.headers.get('authorization'))) return unauthorized()

  const server = createBe180McpServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}

export function GET(request: Request): Promise<Response> {
  return handle(request)
}

export function POST(request: Request): Promise<Response> {
  return handle(request)
}

export function DELETE(request: Request): Promise<Response> {
  return handle(request)
}
