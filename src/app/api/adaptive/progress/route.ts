import { NextResponse } from 'next/server'
import { jsonError } from '@/lib/adaptive/api'
import { getOnboardingProgress } from '@/lib/adaptive/progress'
import { CLIENT } from '@/components/adaptive/data'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const clientId = url.searchParams.get('clientId') || CLIENT.id
    const data = await getOnboardingProgress(clientId)
    return NextResponse.json(data)
  } catch (e) {
    console.error('[adaptive/progress]', e)
    const message = e instanceof Error ? e.message : 'Erro ao carregar progresso'
    const status = message.includes('não configurado') ? 503 : 500
    return jsonError(message, status)
  }
}
