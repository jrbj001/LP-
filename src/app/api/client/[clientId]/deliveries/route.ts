import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getDeliveryReport } from '@/lib/delivery/service'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const client = getClient(clientId)

  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (!client.delivery || client.delivery.repos.length === 0) {
    return NextResponse.json({ ok: false, error: 'Cliente sem repositórios configurados' }, { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const daysParam = searchParams.get('days')
  const days = daysParam === '30' ? 30 : daysParam === '60' ? 60 : 90
  const forceRefresh = searchParams.get('refresh') === '1'

  try {
    const report = await getDeliveryReport(
      client.slug,
      client.delivery.repos,
      days,
      client.delivery.manualEffort,
      { forceRefresh }
    )
    return NextResponse.json(
      { ok: true, ...report },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (e) {
    console.error('[client/deliveries]', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erro ao gerar relatório' },
      { status: 500 }
    )
  }
}
