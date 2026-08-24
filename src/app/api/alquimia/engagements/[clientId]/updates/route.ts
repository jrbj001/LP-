import { NextResponse } from 'next/server'
import { canAccessEngagement, getAlquimiaSession } from '@/lib/alquimia/auth'
import { alquimiaDb, hasAlquimiaDatabase } from '@/lib/alquimia/db'

const ALLOWED_KINDS = new Set([
  'update',
  'initiative',
  'assessment',
  'ritual',
  'measurement',
])

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const session = await getAlquimiaSession()
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Sessão expirada.' }, { status: 401 })
  }
  if (!canAccessEngagement(session, clientId)) {
    return NextResponse.json({ ok: false, error: 'Acesso negado.' }, { status: 403 })
  }
  if (!hasAlquimiaDatabase()) return NextResponse.json({ ok: true, updates: [] })

  try {
    const sql = alquimiaDb()
    const updates = await sql<
      Array<{
        id: string
        title: string
        kind: string
        notes: string
        createdBy: string
        createdAt: string
      }>
    >`
      select
        id::text,
        title,
        kind,
        notes,
        created_by as "createdBy",
        created_at::text as "createdAt"
      from alquimia_evidence
      where engagement_id = ${clientId}
      order by created_at desc
      limit 12
    `
    return NextResponse.json({ ok: true, updates })
  } catch (error) {
    console.error('[alquimia/updates GET]', error)
    return NextResponse.json({ ok: true, updates: [] })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const session = await getAlquimiaSession()
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Sessão expirada.' }, { status: 401 })
  }
  if (!canAccessEngagement(session, clientId)) {
    return NextResponse.json({ ok: false, error: 'Acesso negado.' }, { status: 403 })
  }
  if (!hasAlquimiaDatabase()) {
    return NextResponse.json(
      { ok: false, error: 'Banco do space não configurado.' },
      { status: 503 }
    )
  }

  try {
    const body = (await request.json()) as {
      kind?: string
      title?: string
      notes?: string
    }
    const kind = ALLOWED_KINDS.has(String(body.kind)) ? String(body.kind) : 'update'
    const title = String(body.title || '').trim().slice(0, 160)
    const notes = String(body.notes || '').trim().slice(0, 2000)
    if (!title) {
      return NextResponse.json({ ok: false, error: 'Título obrigatório.' }, { status: 400 })
    }

    const sql = alquimiaDb()
    const [evidence] = await sql<{ id: string }[]>`
      insert into alquimia_evidence (
        engagement_id, title, kind, notes, created_by
      ) values (
        ${clientId}, ${title}, ${kind}, ${notes}, ${session.sub}
      )
      returning id::text
    `
    await sql`
      insert into alquimia_audit_log (
        engagement_id, subject, action, entity_type, entity_id, metadata
      ) values (
        ${clientId},
        ${session.sub},
        'created',
        'evidence',
        ${evidence.id},
        ${sql.json({ kind, title })}
      )
    `

    return NextResponse.json({ ok: true, id: evidence.id })
  } catch (error) {
    console.error('[alquimia/updates]', error)
    return NextResponse.json(
      { ok: false, error: 'Não foi possível registrar a atualização.' },
      { status: 500 }
    )
  }
}
