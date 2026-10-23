import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '../../docs/report-financeiro')
const report = JSON.parse(readFileSync(resolve(outDir, 'data/report-data.json'), 'utf8'))

const MES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set']
const mes = m => MES[Number(m.slice(5)) - 1]
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const num = (n, d = 0) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
const pct = n => `${num(n, 1)}%`
const project = id => report.projects.find(p => p.id === id)
const PAGES = 12

const milestones = {
  likeme: {
    '2026-01': 'Anamnese do usuário e app preparado para outros idiomas.',
    '2026-02': 'Chat, login e avatar: a experiência do membro ganha corpo.',
    '2026-03': 'Pico do ano: comunidade, nova landing e marketplace.',
    '2026-04': 'App no iOS, marketplace e termos da comunidade.',
    '2026-05': 'Pagamentos, nova versão do app e busca inteligente de assinaturas.',
    '2026-06': 'Comunidade em escala e métricas de pedidos pagos.',
    '2026-07': 'Eventos, notificações programadas e compartilhamento.',
    '2026-08': 'Frente em sustentação: correções e acompanhamento.',
    '2026-09': 'Sustentação, com a capacidade direcionada ao Colmeia.',
  },
  colmeia: {
    '2026-01': 'Experiência de conclusão e resultados em Meus Roteiros.',
    '2026-02': 'Arquitetura da plataforma simplificada, base para escalar.',
    '2026-03': 'Banco de Ativos e importação de planos OOH.',
    '2026-04': 'Acesso externo para exibidores.',
    '2026-05': 'Relatório P1A, integração Databricks e media kit.',
    '2026-06': 'Mídia Indoor: cálculo e resultados.',
    '2026-07': 'Painel de exibidores e Indoor na visão do target.',
    '2026-08': 'Fila gerencial de inventários e padronização de praças.',
    '2026-09': 'Impacto Indoor, importação de plano simulado e prioridades de Q4.',
  },
  visibilidade: {
    '2026-02': 'Nova página de resultado da campanha: score, insights e mapa de calor.',
    '2026-03': 'Análise Be180 após o upload, download em PDF e pacote de imagens.',
    '2026-04': 'Processamento em paralelo e catálogo de fundos para simulação.',
    '2026-05': 'Insights de marca, suporte a vídeo e página de qualidade.',
    '2026-07': 'Campanha multi-mídia, link compartilhável e vídeo em 3, 15 e 30 metros.',
    '2026-08': 'Login, histórico e configurações de campanha.',
    '2026-09': 'Estabilização em produção na nuvem.',
  },
  suporte: {
    '2026-01': 'Entendimentos de operação e atendimento aos usuários do Colmeia.',
    '2026-02': 'Estabilização da publicação e da segurança das APIs.',
    '2026-03': 'Desempenho do mapa e apoio às agências.',
    '2026-04': 'Atendimento à operação e aos exibidores.',
    '2026-05': 'Suporte ao lançamento do P1A e às consultas do time.',
    '2026-06': 'Migração para o novo back-end e reconciliação de praças.',
    '2026-07': 'Conclusão da migração de back-end e estabilização.',
    '2026-08': 'Força-tarefa de inventário com relatório diário à operação.',
    '2026-09': 'Suporte à operação e preparação das prioridades de Q4.',
  },
}

function stacked(rows, pick) {
  const w = 700
  const h = 168
  const padL = 28
  const padB = 18
  const gap = 8
  const innerW = w - padL - 8
  const innerH = h - padB - 8
  const barW = (innerW - gap * (rows.length - 1)) / rows.length
  const totals = rows.map(r => report.projects.reduce((a, p) => a + pick(r, p.id), 0))
  const max = Math.max(...totals) * 1.08
  const bars = rows.map((r, i) => {
    let y = padB
    const x = padL + i * (barW + gap)
    const segs = report.projects.map(p => {
      const segH = (pick(r, p.id) / max) * innerH
      const rect = `<rect x="${x.toFixed(1)}" y="${(h - y - segH).toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(segH, 0).toFixed(1)}" fill="${p.color}"/>`
      y += segH
      return rect
    })
    return segs.join('') + `<text x="${(x + barW / 2).toFixed(1)}" y="${h - 4}" text-anchor="middle" fill="#8aa8bc" font-size="9" font-family="ui-monospace, monospace">${mes(r.month)}</text>`
  }).join('')
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="42mm">${bars}</svg>`
}

function lineChart() {
  const w = 700
  const h = 150
  const pad = { l: 36, r: 8, t: 10, b: 20 }
  const values = report.monthly.map(m => m.bankAccumulated.at210)
  const max = Math.max(...values) * 1.1
  const x = i => pad.l + (i * (w - pad.l - pad.r)) / (values.length - 1)
  const y = v => pad.t + (1 - v / max) * (h - pad.t - pad.b)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${d} L${x(values.length - 1).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`
  const dots = values.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.4" fill="#e7c27a"/>`).join('')
  const labels = values.map((v, i) => `<text x="${x(i).toFixed(1)}" y="${h - 4}" text-anchor="middle" fill="#8aa8bc" font-size="9" font-family="ui-monospace, monospace">${MES[i]}</text>`).join('')
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="40mm"><path d="${area}" fill="rgba(231,194,122,.16)"/><path d="${d}" fill="none" stroke="#e7c27a" stroke-width="1.6"/>${dots}${labels}</svg>`
}

const legend = () => `<div class="legend">${report.projects.map(p => `<span><i style="background:${p.color}"></i>${p.label}</span>`).join('')}</div>`

function sheet(n, body) {
  return `<section class="sheet">
    <header class="top"><span>BLUEPRINT FINANCEIRO · BE180</span><span>${report.period.label.toUpperCase()}</span><span>${String(n).padStart(2, '0')} / ${String(PAGES).padStart(2, '0')}</span></header>
    ${body}
    <footer class="bot"><span>Documento de planejamento · uso interno Be180</span><span>Valores brutos · hora de referência R$ 180–240</span></footer>
  </section>`
}

const t = report.totals
const roi = report.roi
const sup = project('suporte')
const vis = project('visibilidade')

const financeRows = report.monthly.map(m => `<tr>
  <td>${mes(m.month)}</td><td>${m.date}</td><td>${m.channel}</td>
  <td>${m.parts.map(p => num(p)).join(' + ')}</td>
  <td>${brl(m.amount)}</td><td>${brl(m.netEstimate)}</td>
  <td>${num(m.paidHours.max, 0)}–${num(m.paidHours.min, 0)}</td>
</tr>`).join('')

const allocRows = report.monthly.map(m => `<tr>
  <td>${mes(m.month)}</td>
  ${report.projects.map(p => `<td>${brl(m.allocation[p.id])}<small>${pct(m.allocationPct[p.id])}</small></td>`).join('')}
  <td>${brl(m.amount)}</td>
</tr>`).join('')
const allocFoot = `<tr class="total"><td>Total</td>${report.projects.map(p => `<td>${brl(p.allocation)}<small>${pct(p.pct)}</small></td>`).join('')}<td>${brl(t.paid)}</td></tr>`

const bankRows = report.monthly.map(m => `<tr>
  <td>${mes(m.month)}</td><td>${num(m.deliveredHours, 0)}</td>
  <td>${num(m.paidHours.max, 0)}</td><td>${num(m.paidHours.mid, 0)}</td><td>${num(m.paidHours.min, 0)}</td>
  <td>${num(m.bank.at180, 0)}</td><td>${num(m.bank.at210, 0)}</td><td>${num(m.bank.at240, 0)}</td>
  <td>${num(m.bankAccumulated.at210, 0)}</td>
</tr>`).join('')

function roadmapBlock(id) {
  const block = report.roadmap.find(r => r.id === id)
  const p = project(id)
  const active = block.months.filter(m => milestones[id][m.month] && (m.commits || m.hours >= 1))
  const rows = active.map(m => `<li>
    <b>${mes(m.month)}</b>
    <div><strong>${milestones[id][m.month]}</strong><em>${num(m.hours, 0)} h · ${brl(report.monthly.find(x => x.month === m.month).allocation[id])}</em></div>
  </li>`).join('')
  return `<div class="road"><h3><i style="background:${p.color}"></i>${p.label}<small>${pct(p.pct)} do esforço · ${brl(p.allocation)}</small></h3><ol>${rows}</ol></div>`
}

const personCard = p => `<article class="card">
  <h3>${p.name}</h3>
  <p class="role">${p.role}</p>
  <dl><div><dt>Horas no período</dt><dd>${num(p.hours, 0)} h</dd></div></dl>
</article>`

const scenarioCards = report.budget2027.scenarios.map((s, i) => `<article class="card scenario">
  <span class="kicker">0${i + 1}</span>
  <h3>${s.label}</h3>
  <p class="big">${i === 0 ? brl(80000) : brl(s.monthlyAt210)}<small>/mês a R$ 210</small></p>
  <p>${s.note}</p>
  <p class="fine">Faixa: ${brl(s.monthlyAt180)} a R$ 180 · ${brl(s.monthlyAt240)} a R$ 240</p>
</article>`).join('')

const gapMonthly = report.budget2027.avgDelivered - report.budget2027.scenarios[0].monthlyHours

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>Blueprint financeiro · Be180 · Jan–Set 2026</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #d5dde3; }
  body { font-family: "Avenir Next", "Segoe UI", sans-serif; color: #d7e7f2; }
  .sheet {
    position: relative; width: 210mm; height: 297mm; margin: 0 auto 6mm; padding: 13mm 12mm 12mm; overflow: hidden;
    background:
      linear-gradient(rgba(143,214,239,.05) 1px, transparent 1px) 0 0 / 8mm 8mm,
      linear-gradient(90deg, rgba(143,214,239,.05) 1px, transparent 1px) 0 0 / 8mm 8mm,
      #071422;
    page-break-after: always; break-after: page;
  }
  .sheet::before { content: ""; position: absolute; inset: 6mm; border: .4pt solid rgba(143,214,239,.28); pointer-events: none; }
  .top, .bot { position: absolute; left: 12mm; right: 12mm; display: flex; justify-content: space-between; font-family: ui-monospace, "SF Mono", monospace; font-size: 7.5px; letter-spacing: .14em; color: #8fd6ef; }
  .top { top: 7.5mm; }
  .bot { bottom: 7.2mm; color: #7f9aab; }
  h1 { margin: 0; font-weight: 600; letter-spacing: -.02em; }
  h2 { margin: 0 0 3mm; font-size: 16px; font-weight: 600; letter-spacing: -.01em; }
  h3 { margin: 0; font-size: 12px; font-weight: 600; }
  p { margin: 0; }
  .eyebrow { font-family: ui-monospace, monospace; font-size: 9px; letter-spacing: .18em; color: #e7c27a; }
  .lead { margin-top: 4mm; max-width: 150mm; font-size: 12.5px; line-height: 1.45; color: #c5d8e4; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin-top: 8mm; }
  .kpi { border: .4pt solid rgba(143,214,239,.35); padding: 3.5mm 3mm; background: rgba(8,28,46,.72); }
  .kpi b { display: block; margin: 1.5mm 0 .8mm; font-size: 16px; font-weight: 600; color: #f3fbff; }
  .kpi span, .fine, small { color: #8aa8bc; font-size: 8px; line-height: 1.35; }
  .kpi em { font-style: normal; font-family: ui-monospace, monospace; font-size: 8px; letter-spacing: .12em; color: #8fd6ef; }
  table { width: 100%; border-collapse: collapse; margin-top: 3mm; }
  th { font-family: ui-monospace, monospace; font-size: 7px; letter-spacing: .06em; text-transform: uppercase; color: #8fd6ef; font-weight: 500; text-align: right; padding: 1.4mm 1.2mm; border-bottom: .6pt solid rgba(143,214,239,.45); }
  td { font-variant-numeric: tabular-nums; font-size: 8.5px; text-align: right; padding: 1.35mm 1.2mm; border-bottom: .3pt solid rgba(143,214,239,.16); }
  th:first-child, td:first-child { text-align: left; }
  td small { display: block; }
  tr.total td { color: #f3fbff; border-bottom: none; border-top: .6pt solid rgba(143,214,239,.5); font-weight: 600; }
  .note { margin-top: 3mm; font-size: 9px; line-height: 1.4; color: #b7c9d4; }
  .legend { display: flex; gap: 4mm; margin: 2mm 0 1mm; }
  .legend span { display: flex; align-items: center; gap: 1.4mm; font-size: 8px; color: #c5d8e4; }
  .legend i, h3 i { width: 2.4mm; height: 2.4mm; display: inline-block; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; }
  .card { border: .4pt solid rgba(143,214,239,.3); background: rgba(8,28,46,.66); padding: 3.2mm; }
  .card .kicker { font-family: ui-monospace, monospace; font-size: 7.5px; letter-spacing: .14em; color: #8fd6ef; }
  .card h3 { margin: 1mm 0; }
  .card p, .method li { font-size: 9px; line-height: 1.4; color: #c5d8e4; }
  .role { color: #e7c27a !important; }
  .card dl { display: flex; gap: 4mm; margin: 2mm 0 0; }
  .card dt { font-family: ui-monospace, monospace; font-size: 7px; letter-spacing: .08em; color: #8aa8bc; }
  .card dd { margin: .4mm 0 0; font-size: 12px; }
  .stake { border-style: dashed; }
  .method { margin: 3mm 0 0; padding: 0; list-style: none; }
  .method li { margin: 0 0 2.4mm; padding-left: 4mm; position: relative; }
  .method li::before { content: ""; position: absolute; left: 0; top: 1.3mm; width: 1.6mm; height: 1.6mm; background: #8fd6ef; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 4mm; }
  .road h3 { display: flex; align-items: baseline; gap: 2mm; }
  .road h3 small { font-weight: 400; color: #8aa8bc; font-size: 8px; }
  .road ol { list-style: none; margin: 2mm 0 0; padding: 0; }
  .road li { display: grid; grid-template-columns: 10mm 1fr; gap: 2mm; padding: 1.3mm 0; border-top: .3pt solid rgba(143,214,239,.16); }
  .road b { font-family: ui-monospace, monospace; font-size: 8px; color: #8fd6ef; font-weight: 500; }
  .road strong { display: block; font-size: 8.8px; font-weight: 500; }
  .road em { display: block; margin-top: .4mm; font-style: normal; font-size: 7.4px; color: #8aa8bc; }
  .big { margin: 1.5mm 0; font-size: 16px; color: #f3fbff; }
  .big small { display: block; letter-spacing: 0; }
  .call { margin-top: 3mm; padding: 3mm; border-left: 1.2pt solid #e7c27a; background: rgba(231,194,122,.07); font-size: 9.5px; line-height: 1.45; }
  .cover-title { margin-top: 18mm; font-size: 34px; line-height: .95; max-width: 160mm; }
  .meta-row { display: flex; gap: 8mm; margin-top: 10mm; }
  .meta-row div { min-width: 40mm; }
  .meta-row b { display: block; margin-top: 1mm; font-size: 13px; font-weight: 500; }
  .projects { margin-top: 8mm; display: grid; gap: 2.4mm; }
  .projects article { display: grid; grid-template-columns: 3mm 1fr auto; gap: 3mm; align-items: center; }
  .projects p { font-size: 9px; color: #b7c9d4; }
  ul.clean { margin: 2mm 0 0; padding: 0; list-style: none; }
  ul.clean li { font-size: 9.2px; line-height: 1.4; color: #c5d8e4; padding: 1.6mm 0 1.6mm 4mm; border-top: .3pt solid rgba(143,214,239,.16); position: relative; }
  ul.clean li::before { content: ""; position: absolute; left: 0; top: 2.7mm; width: 1.6mm; height: 1.6mm; background: #e7c27a; }
</style>
</head>
<body>
${sheet(1, `
  <p class="eyebrow">BE180 · LIKE:ME · COLMEIA</p>
  <h1 class="cover-title">Blueprint financeiro e de esforço</h1>
  <p class="lead">Nove meses de investimento lidos pelo que foi pago, pelo que o time dedicou e pelo que a automação multiplicou. Base para o orçamento de 2027.</p>
  <div class="kpis">
    <div class="kpi"><em>Investido</em><b>${brl(t.paid)}</b><span>bruto, nove meses</span></div>
    <div class="kpi"><em>Líquido estimado</em><b>${brl(t.netEstimate)}</b><span>bruto menos R$ 9 mil/mês</span></div>
    <div class="kpi"><em>Horas dedicadas</em><b>${num(t.deliveredHours, 0)} h</b><span>time completo</span></div>
    <div class="kpi"><em>Banco de horas</em><b>${num(t.bank.at210, 0)} h</b><span>além do contratado, a R$ 210</span></div>
  </div>
  <div class="meta-row">
    <div><span class="fine">PERÍODO</span><b>Jan – Set 2026</b></div>
    <div><span class="fine">HORA BASE</span><b>R$ 180 – R$ 240</b></div>
    <div><span class="fine">REFERÊNCIA</span><b>R$ 210 / hora</b></div>
  </div>
  <div class="projects">
    ${report.projects.map(p => `<article><i style="background:${p.color};height:100%"></i><p><strong style="color:#f3fbff">${p.label}</strong> · ${p.description}</p><b>${pct(p.pct)}</b></article>`).join('')}
  </div>
  <p class="note" style="margin-top:8mm">Os valores mensais deste documento são o valor cheio do extrato. O líquido fica cerca de R$ 9 mil abaixo, por mês.</p>
`)}
${sheet(2, `
  <p class="eyebrow">01 · LEITURA EXECUTIVA</p>
  <h2>O contrato cobriu parte da dedicação. A automação ampliou a entrega.</h2>
  <div class="grid2">
    <div class="card">
      <span class="kicker">BANCO DE HORAS</span>
      <p class="big">${num(t.bank.at210, 0)} h<small>acumuladas de janeiro a setembro, a R$ 210</small></p>
      <p>O time dedicou ${num(t.deliveredHours, 0)} h. O valor pago cobre entre ${num(t.paidHours.min, 0)} h (a R$ 240) e ${num(t.paidHours.max, 0)} h (a R$ 180). Em todos os meses a dedicação ficou acima do contratado. O saldo vale ${brl(t.bankValue.at210)}.</p>
    </div>
    <div class="card">
      <span class="kicker">ROI DA AUTOMAÇÃO</span>
      <p class="big">${num(roi.roiPct, 0)}%<small>sobre o valor investido, com premissa conservadora</small></p>
      <p>Com automação e agentes de IA, o time entregou o volume de uma equipe tradicional ${num(roi.multiplier, 1)} vezes maior. Esse esforço equivale a ${brl(roi.valueGenerated)} a preço de mercado. Cada real investido devolveu ${num(roi.valueGenerated / t.paid, 2)} reais em capacidade.</p>
    </div>
  </div>
  <div class="call">São leituras complementares. O banco de horas mostra a dedicação acima do contrato e pede revisão de capacidade para 2027. O ROI mostra que essa dedicação rendeu muito além do que a hora de mercado compraria.</div>
  <table>
    <thead><tr><th>Frente</th><th>Horas</th><th>Participação</th><th>Valor rateado</th></tr></thead>
    <tbody>
      ${report.projects.map(p => `<tr><td>${p.label}</td><td>${num(p.hours, 0)}</td><td>${pct(p.pct)}</td><td>${brl(p.allocation)}</td></tr>`).join('')}
      <tr class="total"><td>Total</td><td>${num(t.deliveredHours, 0)}</td><td>100%</td><td>${brl(t.paid)}</td></tr>
    </tbody>
  </table>
  <p class="note">Back-end e Suporte à Operação está ligado ao Colmeia e ao Banco de Ativos. Somadas, as duas linhas concentram ${pct(project('colmeia').pct + sup.pct)} do esforço e ${brl(project('colmeia').allocation + sup.allocation)} do investimento.</p>
`)}
${sheet(3, `
  <p class="eyebrow">02 · PREMISSAS</p>
  <h2>Como os números foram montados</h2>
  <ol class="method">
    <li><strong>Valores.</strong> Extrato de janeiro a setembro de 2026, considerado cheio. O líquido estimado desconta R$ 9 mil por mês: ${brl(t.paid)} brutos e ${brl(t.netEstimate)} líquidos.</li>
    <li><strong>Hora de referência.</strong> Faixa de R$ 180 a R$ 240, com referência de R$ 210. As horas cobertas são o valor do mês dividido pela taxa.</li>
    <li><strong>Dedicação.</strong> Jornada mensal do time: liderança técnica e engenharia full-stack em tempo integral, engenharia de dados a partir de junho e uma cota fixa de arquitetura sênior. A engenharia full-stack passa a meio período em agosto e setembro.</li>
    <li><strong>Divisão por frente.</strong> A jornada de cada profissional é dividida pelas frentes em que ele trabalhou no mês, conforme o histórico dos repositórios.</li>
    <li><strong>Suporte à operação.</strong> ${report.supportFloorNote} Também entra aqui a migração do back-end do Colmeia, em junho e julho.</li>
    <li><strong>Banco de horas.</strong> A cada mês, as horas dedicadas menos as horas cobertas pelo pagamento. O saldo acumula de janeiro a setembro, nos três preços da faixa.</li>
    <li><strong>ROI.</strong> Compara o volume entregue com a produtividade de uma equipe tradicional, sem IA. O ganho medido foi de ${num(roi.rawMultiplier, 1)} vezes. O relatório usa 3,5 vezes, por prudência.</li>
  </ol>
  <div class="card" style="margin-top:4mm">
    <span class="kicker">ESCOPO DE CADA FRENTE</span>
    <ul class="clean">
      ${report.projects.map(p => `<li><strong>${p.label}.</strong> ${p.description}</li>`).join('')}
    </ul>
  </div>
`)}
${sheet(4, `
  <p class="eyebrow">03 · FINANCEIRO</p>
  <h2>O que foi investido, mês a mês</h2>
  <p class="note" style="margin-top:0">Valor cheio do extrato. O líquido é o mesmo lançamento menos R$ 9 mil. As horas cobertas são o valor dividido por R$ 180 e por R$ 240.</p>
  <table>
    <thead><tr><th>Mês</th><th>Data</th><th>Canal</th><th>Lançamentos</th><th>Bruto</th><th>Líquido</th><th>Horas a R$ 180 / 240</th></tr></thead>
    <tbody>
      ${financeRows}
      <tr class="total"><td>Total</td><td></td><td></td><td></td><td>${brl(t.paid)}</td><td>${brl(t.netEstimate)}</td><td>${num(t.paidHours.max, 0)}–${num(t.paidHours.min, 0)}</td></tr>
    </tbody>
  </table>
  <h2 style="margin-top:6mm">Horas dedicadas por frente</h2>
  ${stacked(report.monthly, (m, id) => m.hoursByProject[id])}
  ${legend()}
  <p class="note">De maio em diante o pagamento cobre 381 h por mês a R$ 210. A dedicação mensal nunca ficou abaixo de 472 h. Junho e julho têm o pico, com a entrada da engenharia de dados e a migração do back-end do Colmeia.</p>
`)}
${sheet(5, `
  <p class="eyebrow">04 · RATEIO</p>
  <h2>Como o valor fixo se dividiu entre os projetos</h2>
  <p class="note" style="margin-top:0">O pagamento de cada mês é dividido na proporção das horas dedicadas a cada frente naquele mês. A soma de cada linha é o valor cheio do mês.</p>
  ${legend()}
  ${stacked(report.monthly, (m, id) => m.allocation[id])}
  <table>
    <thead><tr><th>Mês</th>${report.projects.map(p => `<th>${p.label}</th>`).join('')}<th>Total</th></tr></thead>
    <tbody>${allocRows}${allocFoot}</tbody>
  </table>
  <p class="note">A Like:me lidera até julho. De agosto em diante o Colmeia e o Banco de Ativos recebem a maior parte. Back-end e Suporte à Operação fica em pelo menos 20% todo mês. O Teste de Visibilidade soma ${brl(vis.allocation)}, com picos em abril, julho e agosto.</p>
`)}
${sheet(6, `
  <p class="eyebrow">05 · TIME</p>
  <h2>Profissionais envolvidos</h2>
  <div class="grid2">${report.people.map(personCard).join('')}</div>
  <article class="card stake" style="margin-top:4mm">
    <span class="kicker">STAKEHOLDER · FORA DO BANCO DE HORAS</span>
    <h3>${report.stakeholders[0].name} · ${report.stakeholders[0].org}</h3>
    <p style="margin-top:1.5mm">${report.stakeholders[0].note}</p>
  </article>
  <div class="call">O time trabalha de forma integrada entre as quatro frentes. A capacidade migra conforme a prioridade do mês: em 2026 ela saiu da Like:me para o Colmeia e o Banco de Ativos a partir de agosto.</div>
`)}
${sheet(7, `
  <p class="eyebrow">06 · ROADMAP REVERSO</p>
  <h2>O que foi construído, mês a mês</h2>
  <p class="note" style="margin-top:0">Reconstruído a partir das entregas registradas. Cada linha mostra as horas e o valor rateado da frente no mês.</p>
  <div class="cols">${roadmapBlock('likeme')}${roadmapBlock('visibilidade')}</div>
`)}
${sheet(8, `
  <p class="eyebrow">06 · ROADMAP REVERSO</p>
  <h2>Colmeia, Banco de Ativos e o suporte à operação</h2>
  <div class="cols">${roadmapBlock('colmeia')}${roadmapBlock('suporte')}</div>
`)}
${sheet(9, `
  <p class="eyebrow">07 · BANCO DE HORAS</p>
  <h2>Todo mês o time entregou mais do que o contratado</h2>
  <p class="note" style="margin-top:0">Saldo do mês = horas dedicadas − valor ÷ taxa. O acumulado usa R$ 210. O saldo são horas trabalhadas além do contrato, a tratar no orçamento de 2027.</p>
  <table>
    <thead><tr><th>Mês</th><th>Dedicado</th><th>A R$ 180</th><th>A R$ 210</th><th>A R$ 240</th><th>Saldo 180</th><th>Saldo 210</th><th>Saldo 240</th><th>Acumulado</th></tr></thead>
    <tbody>
      ${bankRows}
      <tr class="total"><td>Total</td><td>${num(t.deliveredHours, 0)}</td><td>${num(t.paidHours.max, 0)}</td><td>${num(t.paidHours.mid, 0)}</td><td>${num(t.paidHours.min, 0)}</td><td>${num(t.bank.at180, 0)}</td><td>${num(t.bank.at210, 0)}</td><td>${num(t.bank.at240, 0)}</td><td>${num(t.bank.at210, 0)}</td></tr>
    </tbody>
  </table>
  ${lineChart()}
  <div class="grid3" style="margin-top:3mm">
    <div class="card"><span class="kicker">A R$ 180</span><p class="big">${num(t.bank.at180, 0)} h<small>${brl(t.bankValue.at180)}</small></p></div>
    <div class="card"><span class="kicker">A R$ 210 · REFERÊNCIA</span><p class="big">${num(t.bank.at210, 0)} h<small>${brl(t.bankValue.at210)}</small></p></div>
    <div class="card"><span class="kicker">A R$ 240</span><p class="big">${num(t.bank.at240, 0)} h<small>${brl(t.bankValue.at240)}</small></p></div>
  </div>
  <p class="note">Mesmo no preço mais baixo da faixa, todos os meses fecham com saldo positivo. Junho e julho passam de 220 h de saldo cada um.</p>
`)}
${sheet(10, `
  <p class="eyebrow">08 · ROI</p>
  <h2>A automação entregou o trabalho de uma equipe maior</h2>
  <div class="kpis">
    <div class="kpi"><em>Ganho de produtividade</em><b>${num(roi.multiplier, 1)}×</b><span>premissa conservadora</span></div>
    <div class="kpi"><em>Horas equivalentes</em><b>${num(roi.equivalentHours, 0)}</b><span>de uma equipe tradicional</span></div>
    <div class="kpi"><em>Valor equivalente</em><b>${brl(roi.valueGenerated)}</b><span>a R$ 210 por hora</span></div>
    <div class="kpi"><em>Custo por hora</em><b>${brl(roi.costPerEquivalentHour)}</b><span>contra R$ 210 de mercado</span></div>
  </div>
  <div class="grid2" style="margin-top:5mm">
    <div class="card">
      <span class="kicker">ONDE A AUTOMAÇÃO PESOU</span>
      <ul class="clean">
        <li>Agentes de IA em correções e testes da Like:me.</li>
        <li>Arquitetura do Colmeia simplificada em fevereiro, com menos custo para operar e evoluir.</li>
        <li>Processamento automático de imagem e vídeo no Teste de Visibilidade, com mapa de calor e insights de marca.</li>
        <li>Rotinas automáticas de reconciliação e importação no Banco de Ativos.</li>
      </ul>
    </div>
    <div class="card">
      <span class="kicker">COMO LER O RETORNO</span>
      <p>As ${num(t.deliveredHours, 0)} h dedicadas produziram o equivalente a ${num(roi.equivalentHours, 0)} h de uma equipe tradicional. A preço de mercado, isso vale ${brl(roi.valueGenerated)}, contra ${brl(t.paid)} investidos.</p>
      <p style="margin-top:2mm">Na prática, cada hora equivalente custou ${brl(roi.costPerEquivalentHour)}, menos de um quarto do piso de R$ 180.</p>
    </div>
  </div>
  <div class="call">O ROI depende do time que opera as automações. Reduzir capacidade em 2027 reduz o ganho junto.</div>
`)}
${sheet(11, `
  <p class="eyebrow">09 · ORÇAMENTO 2027</p>
  <h2>Três cenários, a partir da dedicação média de ${num(report.budget2027.avgDelivered, 0)} h/mês</h2>
  <div class="grid3">${scenarioCards}</div>
  <p class="note">Manter R$ 80 mil por mês deixa cerca de ${num(gapMonthly, 0)} h mensais fora do contrato no ritmo de 2026. Em doze meses, o banco de horas cresceria mais cerca de ${num(gapMonthly * 12, 0)} h.</p>
  <h2 style="margin-top:5mm">Insights de IA: onde aumentar o time</h2>
  <ul class="clean">
    <li><strong>Like:me, reforço de engenharia.</strong> A frente ficou em sustentação a partir de agosto. O backlog já mapeado (programa GLP-1, integração Memed, teleconsulta, avatar e nota fiscal) pede uma segunda posição sênior dedicada.</li>
    <li><strong>Colmeia e Banco de Ativos, engenharia de produto.</strong> É hoje a maior frente e a que mais cresceu no segundo semestre: Indoor, inventário, exibidores e prioridades de Q4. Uma posição de produto libera a liderança técnica para arquitetura e agentes.</li>
    <li><strong>Suporte à operação como linha própria.</strong> Pelo menos 20% das horas já vão para entendimentos e suporte à operação e ao cliente do Colmeia. Em 2027, a recomendação é orçar essa linha separadamente, com meta de resposta.</li>
    <li><strong>Teste de Visibilidade, de piloto a produto.</strong> A frente tem front-end e motor de processamento em produção, com campanha multi-mídia, vídeo, login e histórico. Recebeu ${brl(vis.allocation)} em 2026. Com dono e roadmap próprios, pode virar oferta comercial ao mercado.</li>
    <li><strong>Arquitetura sênior.</strong> A cota atual de 32 h/mês cobre governança. Se 2027 incluir camada de dados e nuvem para os quatro produtos, essa cota deve crescer.</li>
  </ul>
`)}
${sheet(12, `
  <p class="eyebrow">10 · PRÓXIMOS PASSOS</p>
  <h2>O que levar para a conversa de orçamento</h2>
  <ul class="clean">
    <li>Reconhecer o banco de ${num(t.bank.at210, 0)} h, equivalente a ${brl(t.bankValue.at210)} a R$ 210. A recomendação é convertê-lo em capacidade de 2027, nos cenários Equilibrar ou Crescer.</li>
    <li>Fixar a hora de referência dentro da faixa de R$ 180 a R$ 240. A R$ 210, cobrir a dedicação média de 2026 pede ${brl(report.budget2027.scenarios[1].monthlyAt210)} por mês.</li>
    <li>Separar produto de operação no orçamento: Like:me, Colmeia e Banco de Ativos, e Teste de Visibilidade com roadmap; Back-end e Suporte à Operação com meta de atendimento.</li>
    <li>Priorizar o reforço na Like:me e no Colmeia, as duas frentes com maior backlog e maior impacto no negócio.</li>
    <li>Preservar as automações no desenho do time. O ganho de 3,5 vezes depende de quem as opera.</li>
  </ul>
  <div class="grid3" style="margin-top:6mm">
    <div class="card"><span class="kicker">INVESTIDO</span><p class="big">${brl(t.paid)}<small>líquido ${brl(t.netEstimate)}</small></p></div>
    <div class="card"><span class="kicker">DEDICAÇÃO</span><p class="big">${num(t.deliveredHours, 0)} h<small>${brl(t.bankValue.at210)} além do contrato</small></p></div>
    <div class="card"><span class="kicker">VALOR EQUIVALENTE</span><p class="big">${brl(roi.valueGenerated)}<small>com ganho de 3,5 vezes</small></p></div>
  </div>
  <p class="note">Gerado em ${new Date(report.generatedAt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.</p>
`)}
</body>
</html>`

const htmlPath = resolve(outDir, 'report-financeiro-2026.html')
const pdfPath = resolve(outDir, 'report-financeiro-2026.pdf')
writeFileSync(htmlPath, html)
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, htmlPath], { stdio: 'ignore' })
console.log(pdfPath)
