/**
 * A área do cliente não tem autenticação: qualquer visitante que descubra a URL
 * alcança as rotas. Enquanto isso não muda, a inteligência de documentos (que
 * grava arquivos e consome LLM) fica restrita aos clientes desta allowlist.
 */
const DOCUMENT_AI_ENABLED_CLIENTS = new Set(['be180-ooh', 'likeme'])

export function isDocumentIntelligenceEnabled(clientId: string): boolean {
  return DOCUMENT_AI_ENABLED_CLIENTS.has(clientId)
}
