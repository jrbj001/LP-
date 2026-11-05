import { generateText, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { chatModel } from '@/lib/backlog/llm'
import { loadBe180McpTools } from './mcp-client'

const SYSTEM = `Você é o bot de consulta da Be180 no Slack, ligado ao Cadence.
Responda em português do Brasil, de forma curta e verificável.
Use as ferramentas MCP para consultar o Banco de Ativos e o Colmeia. Não invente números, nomes de tabela ou status.
Se a pergunta não disser a fonte, escolha a mais adequada. Se couber nos dois sistemas, consulte os dois e diga de qual veio cada número.
Se uma ferramenta falhar ou a fonte estiver indisponível, diga isso com clareza.
Formato Slack mrkdwn: use *negrito* com um asterisco de cada lado. Não use tabelas markdown.
Não cole SQL longo nem listas enormes de linhas; resuma o que a ferramenta devolveu.`

export async function answerSlackQuestion(question: string): Promise<string> {
  const loaded = await loadBe180McpTools()
  try {
    const result = await generateText({
      model: openai(chatModel()),
      system: SYSTEM,
      prompt: question,
      tools: loaded.tools,
      stopWhen: stepCountIs(4),
    })
    const text = result.text.trim()
    return text || 'Não consegui formular uma resposta com as fontes disponíveis.'
  } finally {
    await loaded.close()
  }
}
