import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client/registry'
import { getDeliveryReport } from '@/lib/delivery/service'
import type { DeliveryReport } from '@/lib/delivery/types'

export const dynamic = 'force-dynamic'

function buildPrompt(clientName: string, report: DeliveryReport): string {
  const payload = {
    cliente: clientName,
    periodoDias: report.periodDays,
    stats: report.stats,
    estimate: report.estimate,
    kpis: {
      ...report.kpis,
      fixToFeatureRatio:
        report.kpis.fixToFeatureRatio >= 9.9 ? 'n/d (sem features)' : report.kpis.fixToFeatureRatio,
    },
    produtos: report.byProduct,
    modulos: report.modules.slice(0, 12).map(m => ({
      nome: m.name,
      tipo: m.type,
      produto: m.product,
      horas: m.estimatedHours,
      commits: m.commitCount,
      prs: m.prNumbers,
    })),
    semanas: report.weekly,
  }

  return `Você é um advisor de engenharia e negócio da PixelPulseLab.
Escreva uma análise executiva em português do Brasil sobre as entregas do cliente abaixo.
Público: sponsor / diretor de produto — linguagem clara, sem jargão de código.

Dados (JSON):
${JSON.stringify(payload, null, 2)}

Estruture a resposta em 4 blocos curtos, com títulos em negrito na primeira linha de cada bloco:
1. Visão geral — o que foi entregue e o valor percebido
2. Ritmo e capacidade — velocidade, horas, pessoa-mês, concentração por produto
3. Saúde da entrega — relação feat/fix, riscos ou sinais de retrabalho
4. Recomendações — 2 a 4 ações concretas para o próximo ciclo

Regras: máximo ~350 palavras; não invente números fora do JSON; não cite paths, diffs ou código; não use markdown de código; parágrafos separados por linha em branco.`
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const client = getClient(clientId)
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Cliente não encontrado' }, { status: 404 })
  }
  if (!client.delivery?.repos.length) {
    return NextResponse.json({ ok: false, error: 'Cliente sem repositórios' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'OPENAI_API_KEY não configurada no ambiente.' },
      { status: 503 }
    )
  }

  let days = 90
  try {
    const body = await req.json().catch(() => ({}))
    if (body?.days === 30 || body?.days === 60 || body?.days === 90) days = body.days
  } catch {
    /* ignore */
  }

  try {
    const report = await getDeliveryReport(client.delivery.repos, days, client.delivery.manualEffort)

    if (report.prs.length === 0 && report.modules.every(m => !m.manualHours)) {
      return NextResponse.json(
        { ok: false, error: 'Sem entregas no período para analisar. Verifique GITHUB_TOKEN e o filtro de dias.' },
        { status: 400 }
      )
    }

    const prompt = buildPrompt(client.name, report)
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 900,
        messages: [
          {
            role: 'system',
            content:
              'Você analisa portfólios de entrega de software para líderes de negócio. Seja preciso, direto e útil.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('[client/analysis] openai', res.status, errText.slice(0, 300))
      return NextResponse.json(
        { ok: false, error: `OpenAI retornou ${res.status}. Verifique a chave e a cota.` },
        { status: 502 }
      )
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const analysis = data.choices?.[0]?.message?.content?.trim()
    if (!analysis) {
      return NextResponse.json({ ok: false, error: 'Resposta vazia da OpenAI' }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      analysis,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      generatedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.error('[client/analysis]', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erro ao gerar análise' },
      { status: 500 }
    )
  }
}
