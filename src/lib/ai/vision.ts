import { generateText } from 'ai'
import { toAiError } from './ai-error'
import { aiModel, requireAiCredentials, visionModel } from './gateway'

const SYSTEM = `Você lê imagens de artefatos de produto e engenharia (prints de tela, diagramas, fluxos, planilhas fotografadas, quadros).
Descreva o conteúdo em português do Brasil de forma estruturada e fiel: transcreva todo texto legível, liste elementos de interface, setas e relações do diagrama, e números de tabelas.
Não interprete intenção nem sugira melhorias — apenas registre o que está na imagem. Se algo estiver ilegível, diga "ilegível".`

/**
 * Transcreve uma imagem em texto para alimentar o mesmo pipeline dos demais
 * formatos. A imagem vai inline porque o Blob pode ser privado.
 */
export async function describeImage(buffer: Buffer, mimeType: string): Promise<string> {
  requireAiCredentials()

  let text = ''
  try {
    const result = await generateText({
      model: aiModel(visionModel()),
      system: SYSTEM,
      temperature: 0.1,
      maxOutputTokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Transcreva e descreva esta imagem para uso como fonte de requisitos.' },
            {
              type: 'image',
              image: buffer,
              mediaType: mimeType || 'image/png',
              providerOptions: { openai: { imageDetail: 'high' } },
            },
          ],
        },
      ],
    })
    text = result.text.trim()
  } catch (error) {
    throw toAiError(error)
  }

  if (!text) throw new Error('A leitura da imagem voltou vazia.')
  return text
}
