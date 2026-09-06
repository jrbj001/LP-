import { NextResponse } from 'next/server'
import { chatModel, callOpenAiText } from '@/lib/backlog/llm'
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
      bugToFeatureRatio:
        report.kpis.bugToFeatureRatio >= 9.9 ? 'n/d (sem features)' : report.kpis.bugToFeatureRatio,
      evolutionToFeatureRatio:
        report.kpis.evolutionToFeatureRatio >= 9.9 ? 'n/d (sem features)' : report.kpis.evolutionToFeatureRatio,
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
3. Saúde da entrega — relação feat/fix, distinção bug vs evolução (dentro dos fixes), riscos ou sinais de retrabalho
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

  let days = 90
  try {
    const body = await req.json().catch(() => ({}))
    if (body?.days === 30 || body?.days === 60 || body?.days === 90) days = body.days
  } catch {
    /* ignore */
  }

  try {
    const report = await getDeliveryReport(
      client.slug,
      client.delivery.repos,
      days,
      client.delivery.manualEffort
    )

    if (report.prs.length === 0 && report.modules.every(m => !m.manualHours)) {
      return NextResponse.json(
        { ok: false, error: 'Sem entregas no período para analisar. Verifique GITHUB_TOKEN / GITHUB_PAT e o filtro de dias.' },
        { status: 400 }
      )
    }

    const prompt = buildPrompt(client.name, report)
    const analysis = await callOpenAiText(
      'Você analisa portfólios de entrega de software para líderes de negócio. Seja preciso, direto e útil.',
      prompt,
      { temperature: 0.4, maxTokens: 900, model: chatModel() }
    )

    return NextResponse.json({
      ok: true,
      analysis,
      model: chatModel(),
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
