export const DEVS = {
  eyebrow: 'Devs',
  headline: 'Construa sobre o OS.',
  lede:
    'SDK, API e MCP para times internos e fornecedores falarem com a Adaptive Layer™ — a mesma porta, a mesma permissão, a mesma trilha. O contexto da operação vira contrato de engenharia.',
  install: {
    title: 'terminal',
    lines: [
      { prompt: true, text: 'npm install @adaptive-layer/sdk' },
      { prompt: false, text: '+ @adaptive-layer/sdk@1.4.2' },
      { prompt: true, text: 'layer auth login --tenant cafe-orfeu' },
      { prompt: false, text: '✓ credencial de sandbox emitida · acl herdada do perfil' },
    ],
  },

  quickstart: {
    eyebrow: 'Quickstart',
    headline: 'Três caminhos para a mesma Layer.',
    body: 'REST para qualquer stack, SDK tipado para produto, MCP para plugar o modelo direto. Todos batem na mesma porta — com ACL e audit.',
    tabs: [
      {
        id: 'rest',
        label: 'REST',
        file: 'query.sh',
        code: [
          'curl -X POST https://layer.suaempresa.com/v1/query \\',
          '  -H "Authorization: Bearer $LAYER_KEY" \\',
          '  -d \'{ "question": "Por que o pedido #4821 pode atrasar?" }\'',
          '',
          '{',
          '  "answer": "Separação do lote L-19 pendente no WMS…",',
          '  "facts": [',
          '    { "node": "pedido:4821", "value": "entrega sexta", "source": "erp" }',
          '  ],',
          '  "sources": [',
          '    { "doc": "politica-sla-cliente-x.pdf", "clause": "4.2" }',
          '  ],',
          '  "audit_id": "aud_8f2k1"',
          '}',
        ],
      },
      {
        id: 'sdk',
        label: 'SDK TypeScript',
        file: 'app.ts',
        code: [
          "import { AdaptiveLayer } from '@adaptive-layer/sdk'",
          '',
          'const layer = new AdaptiveLayer({ apiKey: process.env.LAYER_KEY })',
          '',
          'const res = await layer.query(',
          "  'Por que o pedido #4821 pode atrasar?'",
          ')',
          '',
          'res.facts    // fatos do grafo, com origem e timestamp',
          'res.sources  // trechos de documento, com cláusula',
          'res.auditId  // registro na trilha — sempre',
        ],
      },
      {
        id: 'mcp',
        label: 'MCP',
        file: 'mcp.json',
        code: [
          '{',
          '  "mcpServers": {',
          '    "adaptive-layer": {',
          '      "url": "https://layer.suaempresa.com/mcp",',
          '      "headers": { "Authorization": "Bearer ${LAYER_KEY}" }',
          '    }',
          '  }',
          '}',
          '',
          '// Claude, ChatGPT ou Copilot consultam a Layer',
          '// direto — troque o modelo, o contexto fica.',
        ],
      },
    ],
  },

  reference: {
    eyebrow: 'Referência',
    headline: 'A API em quatro recursos.',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/query',
        title: 'GraphRAG',
        detail: 'Pergunta em linguagem natural. Resposta com fato do grafo + trecho de documento, com fonte.',
        example: '{ "question": "…" } → { facts[], sources[] }',
      },
      {
        method: 'GET',
        path: '/v1/graph/nodes/:id',
        title: 'Knowledge graph',
        detail: 'Nós e relações: pedido, lote, cliente, política. Navegue as conexões da operação.',
        example: 'pedido:4821 → { edges: [reserva → lote:l-19] }',
      },
      {
        method: 'POST',
        path: '/v1/events',
        title: 'Ingestão',
        detail: 'Webhook para conectores próprios: o fornecedor emite o evento, a Layer resolve a identidade.',
        example: '{ "type": "pedido.criado", "payload": {…} }',
      },
      {
        method: 'GET',
        path: '/v1/audit',
        title: 'Trilha',
        detail: 'Quem consultou o quê, com qual permissão. Pessoa, agente e sistema no mesmo log.',
        example: '?actor=agente-comercial&since=24h',
      },
    ],
  },

  governance: {
    eyebrow: 'Governança para devs',
    headline: 'Credencial com escopo. Sempre.',
    items: [
      {
        title: 'API keys com ACL herdada',
        detail: 'A chave carrega o perfil de acesso. O fornecedor vê o que o contrato permite — nada além.',
      },
      {
        title: 'Escopo por agente e fornecedor',
        detail: 'Cada integração tem dono, escopo e expiração. Revogar é um comando, não um chamado.',
      },
      {
        title: 'Sandbox e produção',
        detail: 'Sandbox com dados sintéticos do tenant. Promova para produção com o mesmo contrato.',
      },
      {
        title: 'Rate limits e versionamento',
        detail: 'Limites por chave, versões estáveis (/v1) e depreciação anunciada no changelog.',
      },
    ],
  },

  cta: {
    headline: 'Pronto para integrar?',
    body: 'Pedimos o escopo, emitimos a credencial de sandbox e o seu time faz a primeira query no mesmo dia.',
    label: 'Pedir credenciais de sandbox',
    href: 'mailto:ze@pixelpulselab.dev?subject=Credenciais%20de%20sandbox%20—%20Adaptive%20Layer',
  },
}
