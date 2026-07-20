import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getDeliveries } from '@/lib/delivery/service'

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
  const days = searchParams.get('days') === '30' ? 30 : 90

  try {
    const data = await getDeliveries(client.delivery.repos, days)
    return NextResponse.json({ ok: true, ...data })
  } catch (e) {
    console.error('[client/deliveries]', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erro ao buscar entregas' },
      { status: 500 }
    )
  }
}
