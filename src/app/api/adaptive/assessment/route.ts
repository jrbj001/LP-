import { NextResponse } from 'next/server'
import { jsonError, requireNotion } from '@/lib/adaptive/api'
import { backfillAssessmentAnswers, createAssessment, listAssessments } from '@/lib/adaptive/notion'
import { CLIENT, DISCOVERY_QUESTIONS } from '@/components/adaptive/data'

function normalizeAnswers(raw: Record<string, string | number>): Record<number, string> {
  const out: Record<number, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    const id = parseInt(key, 10)
    if (id >= 1 && id <= 11 && value != null) out[id] = String(value).trim()
  }
  return out
}

export async function GET(req: Request) {
  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId') || CLIENT.id
    if (searchParams.get('sync') === '1') {
      const synced = await backfillAssessmentAnswers(clientId)
      const assessments = await listAssessments(clientId)
      return NextResponse.json({ ok: true, synced, assessments })
    }
    const assessments = await listAssessments(clientId)
    return NextResponse.json({ ok: true, assessments })
  } catch (e) {
    console.error('[adaptive/assessment GET]', e)
    return jsonError(e instanceof Error ? e.message : 'Erro ao listar assessments', 500)
  }
}

export async function POST(req: Request) {
  const blocked = requireNotion()
  if (blocked) return blocked

  try {
    const body = await req.json()
    const clientId = String(body.clientId || CLIENT.id)
    const stakeholder = String(body.stakeholder || '').trim()
    const whatsapp = String(body.whatsapp || '').trim()
    const answers = normalizeAnswers((body.answers || {}) as Record<string, string | number>)

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
