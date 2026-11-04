# Be180 · consulta em linguagem natural no Slack

Bot do Slack que responde perguntas sobre o **Banco de Ativos** e o **Colmeia** para qualquer pessoa do workspace. A consulta é a mesma do Cadence: a pergunta vira um único `SELECT` somente leitura. O bot não acessa o banco direto; ele chama o servidor MCP deste projeto.

O Teste de Visibilidade ainda não entra. Não há fonte conectada para ele no Cadence.

## O que sobe nesta branch

- `POST /api/mcp` — servidor MCP (Streamable HTTP, sem sessão). Ferramentas: `consultar_banco_de_ativos`, `consultar_colmeia`, `listar_fontes_be180`.
- `POST /api/webhooks/slack/events` — eventos do Slack. Responde na hora e publica a resposta no fio da mensagem.

## Variáveis

Além das que o Cadence já usa para a Be180 (`BE180_ATIVOS_PG_*`, `BE180_COLMEIA_SQL_*`, `OPENAI_API_KEY`, `DATA_SOURCE_ENCRYPTION_KEY`, `DATABASE_URL`):

| Variável | Uso |
|---|---|
| `BE180_MCP_TOKEN` | Segredo do header `Authorization: Bearer`. Sem ele o MCP recusa a chamada. |
| `MCP_SERVER_URL` | Origem deste app, sem barra no final. O bot chama `${MCP_SERVER_URL}/api/mcp`. |
| `SLACK_SIGNING_SECRET` | Signing secret do app Slack. |
| `SLACK_BOT_TOKEN` | Bot token `xoxb-…`, com `chat:write`. |

## App Slack

1. Em [api.slack.com/apps](https://api.slack.com/apps), crie um app no workspace da Be180.
2. **OAuth & Permissions**, escopos de bot: `app_mentions:read`, `chat:write`, `im:history`, `im:read`, `im:write`. Instale o app e copie o bot token.
3. **Event Subscriptions**: URL `https://<sua-url>/api/webhooks/slack/events`. Eventos de bot: `app_mention` e `message.im`.
4. **App Home**: ligue a aba Messages, para as pessoas poderem abrir DM com o bot.
5. Convide o bot para os canais em que ele deve responder. Em canal, a pergunta precisa mencionar o bot. Na DM, qualquer mensagem vale.

O Slack exige URL pública com HTTPS. Em desenvolvimento use `vercel dev` e um túnel, e aponte `MCP_SERVER_URL` para essa mesma origem.

## Como usar

- No canal: `@bot quantos pontos ativos existem em São Paulo?`
- Na DM: `quantos roteiros foram liberados para agência neste mês?`

A resposta chega no fio da mensagem. Se a fonte estiver desligada ou a consulta falhar, o bot diz isso em vez de inventar um número.
