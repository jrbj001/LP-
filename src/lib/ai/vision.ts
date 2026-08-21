import { describeOpenAiError } from './openai-error'

function visionModel(): string {
  return process.env.OPENAI_VISION_MODEL || process.env.OPENAI_CODING_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1'
}

const SYSTEM = `Você lê imagens de artefatos de produto e engenharia (prints de tela, diagramas, fluxos, planilhas fotografadas, quadros).
Descreva o conteúdo em português do Brasil de forma estruturada e fiel: transcreva todo texto legível, liste elementos de interface, setas e relações do diagrama, e números de tabelas.
Não interprete intenção nem sugira melhorias — apenas registre o que está na imagem. Se algo estiver ilegível, diga "ilegível".`

/**
 * Transcreve uma imagem em texto para alimentar o mesmo pipeline dos demais
 * formatos. A imagem vai como data URL porque o Blob pode ser privado.
 */
export async function describeImage(buffer: Buffer, mimeType: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada no ambiente.')

  const dataUrl = `data:${mimeType || 'image/png'};base64,${buffer.toString('base64')}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: visionModel(),
      temperature: 0.1,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Transcreva e descreva esta imagem para uso como fonte de requisitos.' },
            { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(describeOpenAiError(res.status, errText))
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('A leitura da imagem voltou vazia.')
  return text
}
