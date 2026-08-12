import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { describeOpenAiError } from '@/lib/ai/openai-error'
import { getMeetingSource } from '@/lib/meetings/source'

export const dynamic = 'force-dynamic'

interface MeetingBrief {
  summary: string
  actionPlan: string[]
  todos: {
    title: string
    owner: string
    priority: 'Alta' | 'Média' | 'Baixa'
  }[]
}

function isMeetingBrief(value: unknown): value is MeetingBrief {
  if (!value || typeof value !== 'object') return false
  const brief = value as Partial<MeetingBrief>
  return (
    typeof brief.summary === 'string' &&
    Array.isArray(brief.actionPlan) &&
    brief.actionPlan.every(item => typeof item === 'string') &&
    Array.isArray(brief.todos) &&
    brief.todos.every(
      item =>
        item &&
        typeof item.title === 'string' &&
        typeof item.owner === 'string' &&
        ['Alta', 'Média', 'Baixa'].includes(item.priority)
    )
  )
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ clientId: string; meetingId: string }> }
) {
  const { clientId, meetingId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }

  const meeting = client.meetings?.find(item => item.id === meetingId)
  if (!meeting) {
    return NextResponse.json({ ok: false, error: 'Reunião não encontrada' }, { status: 404 })
  }

  const source = getMeetingSource(meeting)?.content
  if (!source) {
    return NextResponse.json(
      { ok: false, error: 'Esta reunião ainda não possui conteúdo para análise.' },
      { status: 400 }
    )
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'OPENAI_API_KEY não configurada no ambiente.' },
      { status: 503 }
    )
  }

  const domainRules =
    client.slug === 'be180-ooh'
      ? `- Se a reunião mapear pilares, frentes ou escopos, cite todos no resumo — inclusive o que ficou fora desta fase.
- Não omita pilares explicitamente citados, como Agentes, Banco de Ativos ou equivalentes.
- Se um pilar estiver explicitamente fora de escopo, registre isso no resumo e no plano de ação.`
      : `- Preserve os nomes das frentes, produtos e integrações exatamente como aparecem no conteúdo-fonte.
- Não introduza pilares, decisões de escopo ou tarefas que não tenham sido explicitamente citados na reunião.`

  const prompt = `Analise o conteúdo da reunião abaixo e devolva um briefing executivo em português do Brasil.

Cliente: ${client.name}
Reunião: ${meeting.title}
Data: ${meeting.date}
Participantes: ${meeting.attendees.join(', ')}

Conteúdo-fonte:
${source}

Retorne somente JSON válido com este formato:
{
  "summary": "resumo objetivo em 1 ou 2 parágrafos, até 120 palavras",
  "actionPlan": ["3 a 5 passos concretos, curtos e em ordem"],
  "todos": [
    {
      "title": "tarefa acionável",
      "owner": "responsável citado; use A definir se não estiver explícito",
      "priority": "Alta | Média | Baixa"
    }
  ]
}

Regras:
- Use apenas fatos presentes no conteúdo-fonte.
- Não invente decisões, responsáveis, datas ou métricas.
${domainRules}
- Separe plano de ação (sequência recomendada) de to-dos (tarefas acordadas).
- Limite a lista de to-dos aos 8 itens mais relevantes.
- Priorize itens que desbloqueiam outras atividades.
- O plano de ação deve refletir tanto o que avançar quanto o que deliberadamente adiar.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Você transforma registros de reuniões em briefings executivos precisos, rastreáveis e acionáveis.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error('[client/meeting-summary] openai', response.status, errorText.slice(0, 300))
      return NextResponse.json(
        { ok: false, error: describeOpenAiError(response.status, errorText) },
        { status: 502 }
      )
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const raw = data.choices?.[0]?.message?.content?.trim()
    if (!raw) {
      return NextResponse.json({ ok: false, error: 'Resposta vazia da OpenAI.' }, { status: 502 })
    }

    let brief: unknown
    try {
      brief = JSON.parse(raw)
    } catch {
      return NextResponse.json({ ok: false, error: 'A IA retornou um formato inválido.' }, { status: 502 })
    }

    if (!isMeetingBrief(brief)) {
      return NextResponse.json(
        { ok: false, error: 'A IA retornou um briefing incompleto.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      brief,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[client/meeting-summary]', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Erro ao gerar briefing.' },
      { status: 500 }
    )
  }
}
