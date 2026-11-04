# Be180 · agente de consulta na Monday

A Monday chama um webhook quando alguém fala com o agente no chat, menciona o agente ou atribui um item a ele. A resposta usa a consulta em linguagem natural que o Cadence já faz no Banco de Ativos e no Colmeia. Não há Slack neste fluxo.

## URL para colar na Monday

```
https://pixelpulselab.dev/api/webhooks/monday/agent
```

Na tela **Conectar agente de qualquer provedor**:

1. Dê um nome ao agente.
2. Em **Este agente pode ser acionado pela monday.com?**, deixe **Sim**.
3. Cole a URL acima.
4. Clique em **Conectar agente**.
5. Copie o signing secret e o API token. A Monday mostra os dois só nessa hora.

Esses dois valores entram na Vercel, não no git:

| Variável | Uso |
|---|---|
| `MONDAY_AGENT_SIGNING_SECRET` | Confere o header `x-monday-signature`. |
| `MONDAY_AGENT_API_TOKEN` | Publica a resposta na menção ou no item atribuído. |

As fontes da Be180 (`BE180_ATIVOS_PG_*`, `BE180_COLMEIA_SQL_*`) e a `OPENAI_API_KEY` já precisam estar no ambiente.

O chat responde na mesma requisição, em até cerca de 30 segundos. Menção e atribuição recebem a confirmação na hora; o texto aparece depois como atualização no item.
