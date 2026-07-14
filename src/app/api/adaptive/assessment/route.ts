import { NextResponse } from 'next/server'
import { jsonError, requireNotion } from '@/lib/adaptive/api'
import { createAssessment } from '@/lib/adaptive/notion'
import { CLIENT, DISCOVERY_QUESTIONS } from '@/components/adaptive/data'

export async function POST(req: Request) {
  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const body = await req.json()
    const clientId = String(body.clientId || CLIENT.id)
    const stakeholder = String(body.stakeholder || '').trim()
    const whatsapp = String(body.whatsapp || '').trim()
    const answers = (body.answers || {}) as Record<number, string>

    if (!stakeholder || !whatsapp) return jsonError('Identidade incompleta')
    if (Object.keys(answers).length === 0) return jsonError('Respostas vazias')

    const pageId = await createAssessment({
      clientId,
      stakeholder,
      whatsapp,
      answers,
      questions: DISCOVERY_QUESTIONS.map(q => ({ id: q.id, question: q.question })),
    })

    return NextResponse.json({ ok: true, pageId })
  } catch (e) {
    console.error('[adaptive/assessment]', e)
    return jsonError(e instanceof Error ? e.message : 'Erro ao salvar assessment', 500)
  }
}
