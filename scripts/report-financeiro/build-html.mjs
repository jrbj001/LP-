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
const person = id => report.people.find(p => p.id === id)?.name ?? id
const PAGES = 12

const milestones = {
  likeme: {
    '2026-01': 'Anamnese e internacionalização do app. 213 commits, o mês de fundação do ano.',
    '2026-02': 'Chat, autenticação e avatar. A experiência autenticada ganha corpo.',
    '2026-03': 'Pico do ano: comunidade, landing e marketplace no mesmo mês.',
    '2026-04': 'Auth no iOS, marketplace e termos do membro da comunidade.',
    '2026-05': 'Pagamentos, release 1.3.2 e busca semântica de assinaturas.',
    '2026-06': 'Comunidade em escala, métricas de pedidos pagos e testes de reconciliação.',
    '2026-07': 'Eventos, notificações e correções tocadas por agentes de IA na API.',
    '2026-08': 'O código da Like:Me desacelera. A dedicação restante é handoff e suporte.',
    '2026-09': 'Frente de produto quase parada no git. O esforço do mês migra para Colmeia.',
  },
  colmeia: {
    '2026-01': 'UX de conclusão e resultados em Meus Roteiros.',
    '2026-02': '68 funções serverless consolidadas em 10 routers.',
    '2026-03': 'Banco de Ativos e importação OOH com persistência de target.',
    '2026-04': 'Módulo de acesso externo para exibidores.',
    '2026-05': 'P1A, endpoint Databricks, media kit e rastreio de login.',
    '2026-06': 'Indoor: storage de resultados e fechamento do fluxo.',
    '2026-07': 'Dashboard de exibidores e Indoor na perspectiva do target.',
    '2026-08': 'Fila gerencial de inventários e sugestão de de-para.',
    '2026-09': 'Impacto indoor, importação de simulado e prioridades de Q4.',
  },
  visibilidade: {
    '2026-01': 'Sem commits no período.',
    '2026-02': 'Sem commits no período.',
    '2026-03': 'Sem commits no período.',
    '2026-04': 'Workers paralelos, heatmap e catálogo de fundos.',
    '2026-05': 'Pico da frente: insights, adapter de vídeo e redesign da página de QA.',
    '2026-06': 'Sem commits no mês.',
    '2026-07': 'Campanhas e desligamento controlado dos insights de IA no upload.',
    '2026-08': 'Estabilização de storage.',
    '2026-09': 'Ajustes de Cloud Run.',
  },
  suporte: {
    '2026-01': 'Base mínima de correção operacional.',
    '2026-02': 'Sequência de deploys da API.',
    '2026-03': 'Migrations e rotina de deploy.',
    '2026-04': 'Correções de teste e infra pontual.',
    '2026-05': 'Reconciliação de pagamento e assinatura.',
    '2026-06': 'Migração de backend (40h sem commit de produto) e e-mail transacional.',
    '2026-07': 'Portal do cliente no ar, com entregas ao vivo, mais 40h da migração.',
    '2026-08': 'Cadence entra na área do cliente, com boards e leitura de GitHub.',
    '2026-09': 'Copiloto em tela cheia. Cadence concentra 24 commits no mês.',
  },
}

function stacked(rows, pick, maxOverride) {
  const colors = Object.fromEntries(report.projects.map(p => [p.id, p.color]))
  const w = 700
  const h = 168
  const padL = 28
  const padB = 18
  const gap = 8
  const innerW = w - padL - 8
  const innerH = h - padB - 8
  const barW = (innerW - gap * (rows.length - 1)) / rows.length
  const totals = rows.map(r => report.projects.reduce((a, p) => a + pick(r, p.id), 0))
  const max = maxOverride ?? Math.max(...totals) * 1.08
  const bars = rows.map((r, i) => {
    let y = padB
    const x = padL + i * (barW + gap)
    const segs = report.projects.map(p => {
      const v = pick(r, p.id)
      const segH = (v / max) * innerH
      const rect = `<rect x="${x.toFixed(1)}" y="${(h - y - segH).toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(segH, 0).toFixed(1)}" fill="${colors[p.id]}"/>`
      y += segH
      return rect
    })
    const label = `<text x="${(x + barW / 2).toFixed(1)}" y="${h - 4}" text-anchor="middle" fill="#8aa8bc" font-size="9" font-family="ui-monospace, monospace">${mes(r.month)}</text>`
    return segs.join('') + label
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

function legend() {
  return `<div class="legend">${report.projects.map(p => `<span><i style="background:${p.color}"></i>${p.label}</span>`).join('')}</div>`
}

function sheet(n, body) {
  return `<section class="sheet">
    <header class="top"><span>PXL · BLUEPRINT FINANCEIRO</span><span>${report.period.label.toUpperCase()}</span><span>${String(n).padStart(2, '0')} / ${String(PAGES).padStart(2, '0')}</span></header>
    ${body}
    <footer class="bot"><span>PixelPulseLab · documento de planejamento</span><span>Valores brutos · hora de referência R$ 180–240</span></footer>
  </section>`
}

const t = report.totals
const roi = report.roi
const kpis = [
  ['Pago no período', brl(t.paid), 'bruto, nove meses'],
  ['Líquido estimado', brl(t.netEstimate), 'bruto menos R$ 9 mil/mês'],
  ['Horas entregues', `${num(t.deliveredHours, 0)} h`, 'dedicação da equipe'],
  ['Banco de horas', `${num(t.bank.at210, 0)} h`, 'acima do retainer, a R$ 210'],
]

const financeRows = report.monthly.map(m => `<tr>
  <td>${mes(m.month)}</td>
  <td>${m.date}</td>
  <td>${m.channel}</td>
  <td>${m.parts.map(p => num(p)).join(' + ')}</td>
  <td>${brl(m.amount)}</td>
  <td>${brl(m.netEstimate)}</td>
  <td>${num(m.paidHours.max, 0)}–${num(m.paidHours.min, 0)}</td>
</tr>`).join('')

const allocRows = report.monthly.map(m => `<tr>
  <td>${mes(m.month)}</td>
  ${report.projects.map(p => `<td>${brl(m.allocation[p.id])}<small>${pct(m.allocationPct[p.id])}</small></td>`).join('')}
  <td>${brl(m.amount)}</td>
</tr>`).join('')

const allocFoot = `<tr class="total"><td>Total</td>${report.projects.map(p => `<td>${brl(p.allocation)}<small>${pct(p.pct)}</small></td>`).join('')}<td>${brl(t.paid)}</td></tr>`

const bankRows = report.monthly.map(m => `<tr>
  <td>${mes(m.month)}</td>
  <td>${num(m.deliveredHours, 0)}</td>
  <td>${num(m.paidHours.max, 0)}</td>
  <td>${num(m.paidHours.mid, 0)}</td>
  <td>${num(m.paidHours.min, 0)}</td>
  <td>${num(m.bank.at180, 0)}</td>
  <td>${num(m.bank.at210, 0)}</td>
  <td>${num(m.bank.at240, 0)}</td>
  <td>${num(m.bankAccumulated.at210, 0)}</td>
</tr>`).join('')

function roadmapBlock(id) {
  const block = report.roadmap.find(r => r.id === id)
  const project = report.projects.find(p => p.id === id)
  const active = block.months.filter(m => m.commits || m.hours >= 1)
  const idle = block.months.filter(m => !m.commits && m.hours < 1).map(m => mes(m.month))
  const rows = active.map(m => `<li>
    <b>${mes(m.month)}</b>
    <div><strong>${milestones[id][m.month]}</strong><em>${m.commits ? `${m.commits} commits · ${m.feats} features · ${m.fixes} correções · ${num(m.hours, 0)} h` : `${num(m.hours, 0)} h rateadas, sem commit no mês`}</em></div>
  </li>`).join('')
  return `<div class="road"><h3><i style="background:${project.color}"></i>${project.label}<small>${pct(project.pct)} do esforço · ${brl(project.allocation)}</small></h3>${idle.length ? `<p class="fine">${idle.join(', ')}: sem hora e sem commit.</p>` : ''}<ol>${rows}</ol></div>`
}

function personCard(p) {
  const short = { likeme: 'Like:me', colmeia: 'Colmeia', visibilidade: 'Visib.', suporte: 'Suporte' }
  const split = report.projects.map(pr => `${short[pr.id]} ${num(p.projects[pr.id], 0)} h`).join(' · ')
  return `<article class="card">
    <span class="kicker">${p.company}</span>
    <h3>${p.name}</h3>
    <p class="role">${p.role}</p>
    <dl>
      <div><dt>Horas</dt><dd>${num(p.hours, 0)} h</dd></div>
      <div><dt>Commits</dt><dd>${p.commits ? num(p.commits) : '—'}</dd></div>
      <div><dt>Dias no git</dt><dd>${p.activeDays ?? '—'}</dd></div>
    </dl>
    <p class="fine">${split}${p.estimated ? ' · cota estimada, sem commit no período' : ''}</p>
  </article>`
}

const scenarioCards = report.budget2027.scenarios.map((s, i) => `<article class="card scenario">
  <span class="kicker">0${i + 1}</span>
  <h3>${s.label}</h3>
  <p class="big">${i === 0 ? brl(80000) : brl(s.monthlyAt210)}<small>/mês a R$ 210</small></p>
  <p>${s.note}</p>
  <p class="fine">Faixa cheia: ${brl(s.monthlyAt180)} a R$ 180 · ${brl(s.monthlyAt240)} a R$ 240${i === 0 ? ' · o contrato de R$ 80 mil cobre cerca de 381 h/mês a R$ 210' : ''}</p>
</article>`).join('')

const gapMonthly = report.budget2027.avgDelivered - report.budget2027.scenarios[0].monthlyHours

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>Blueprint financeiro · Jan–Set 2026</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #d5dde3; }
  body { font-family: "Avenir Next", "Segoe UI", sans-serif; color: #d7e7f2; }
  .sheet {
    position: relative;
    width: 210mm; height: 297mm;
    margin: 0 auto 6mm;
    padding: 13mm 12mm 12mm;
    overflow: hidden;
    background:
      linear-gradient(rgba(143,214,239,.05) 1px, transparent 1px) 0 0 / 8mm 8mm,
      linear-gradient(90deg, rgba(143,214,239,.05) 1px, transparent 1px) 0 0 / 8mm 8mm,
      #071422;
    page-break-after: always;
    break-after: page;
  }
  .sheet::before {
    content: "";
    position: absolute; inset: 6mm;
    border: .4pt solid rgba(143,214,239,.28);
    pointer-events: none;
  }
  .top, .bot {
    position: absolute; left: 12mm; right: 12mm;
    display: flex; justify-content: space-between;
    font-family: ui-monospace, "SF Mono", monospace;
    font-size: 7.5px; letter-spacing: .14em; color: #8fd6ef;
  }
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
  .card dl { display: flex; gap: 4mm; margin: 2mm 0; }
  .card dt { font-family: ui-monospace, monospace; font-size: 7px; letter-spacing: .08em; color: #8aa8bc; }
  .card dd { margin: .4mm 0 0; font-size: 12px; }
  .stake { border-style: dashed; }
  .method { margin: 3mm 0 0; padding: 0; list-style: none; }
  .method li { margin: 0 0 2.2mm; padding-left: 4mm; position: relative; }
  .method li::before { content: ""; position: absolute; left: 0; top: 1.3mm; width: 1.6mm; height: 1.6mm; background: #8fd6ef; }
  .cols { display: grid; grid-template-columns: 1.15fr .85fr; gap: 5mm; margin-top: 4mm; }
  .road h3 { display: flex; align-items: baseline; gap: 2mm; }
  .road h3 small { font-weight: 400; color: #8aa8bc; font-size: 8px; }
  .road ol { list-style: none; margin: 2mm 0 0; padding: 0; }
  .road li { display: grid; grid-template-columns: 10mm 1fr; gap: 2mm; padding: 1.15mm 0; border-top: .3pt solid rgba(143,214,239,.16); }
  .road b { font-family: ui-monospace, monospace; font-size: 8px; color: #8fd6ef; font-weight: 500; }
  .road strong { display: block; font-size: 8.6px; font-weight: 500; }
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
  .bar { height: 3.2mm; background: rgba(143,214,239,.12); }
  .bar span { display: block; height: 100%; }
  ul.clean { margin: 2mm 0 0; padding: 0; list-style: none; }
  ul.clean li { font-size: 9.2px; line-height: 1.4; color: #c5d8e4; padding: 1.5mm 0 1.5mm 4mm; border-top: .3pt solid rgba(143,214,239,.16); position: relative; }
  ul.clean li::before { content: ""; position: absolute; left: 0; top: 2.6mm; width: 1.6mm; height: 1.6mm; background: #e7c27a; }
</style>
</head>
<body>
${sheet(1, `
  <p class="eyebrow">BE180 · LIKE:ME · COLMEIA</p>
  <h1 class="cover-title">Blueprint financeiro e de esforço</h1>
  <p class="lead">Nove meses de retainer lidos pelo que foi pago, pelo que a equipe dedicou e pelo que a automação multiplicou. Base para o orçamento de 2027.</p>
  <div class="kpis">
    ${kpis.map(([l, v, s]) => `<div class="kpi"><em>${l}</em><b>${v}</b><span>${s}</span></div>`).join('')}
  </div>
  <div class="meta-row">
    <div><span class="fine">PREPARADO POR</span><b>PixelPulseLab</b></div>
    <div><span class="fine">PERÍODO</span><b>Jan – Set 2026</b></div>
    <div><span class="fine">HORA BASE</span><b>R$ 180 – R$ 240</b></div>
    <div><span class="fine">REFERÊNCIA</span><b>R$ 210 / hora</b></div>
  </div>
  <div class="projects">
    ${report.projects.map(p => `<article><i style="background:${p.color};height:100%"></i><p><strong style="color:#f3fbff">${p.label}</strong> · ${p.description}</p><b>${pct(p.pct)}</b></article>`).join('')}
  </div>
  <p class="note" style="margin-top:8mm">O valor de cada mês neste documento é o valor cheio do extrato. O líquido fica cerca de R$ 9 mil abaixo, por mês.</p>
`)}
${sheet(2, `
  <p class="eyebrow">01 · LEITURA EXECUTIVA</p>
  <h2>O retainer cobriu uma parte da dedicação. A automação cobriu o resto da entrega.</h2>
  <div class="grid2">
    <div class="card">
      <span class="kicker">BANCO DE HORAS</span>
      <p class="big">${num(t.bank.at210, 0)} h<small>no cenário de R$ 210, acumuladas de janeiro a setembro</small></p>
      <p>A equipe dedicou ${num(t.deliveredHours, 0)} h. O valor pago cobre entre ${num(t.paidHours.min, 0)} h (a R$ 240) e ${num(t.paidHours.max, 0)} h (a R$ 180). Em todos os meses a dedicação ficou acima da faixa. A R$ 210, o saldo vale ${brl(t.bankValue.at210)}.</p>
    </div>
    <div class="card">
      <span class="kicker">ROI DA AUTOMAÇÃO</span>
      <p class="big">${num(roi.roiPct, 0)}%<small>sobre o valor pago, com teto conservador de 3,5×</small></p>
      <p>As ${num(roi.totalAdditions)} linhas entregues equivaleriam a ${num(roi.equivalentHoursRaw, 0)} h de um time tradicional. Aplicado o teto, o esforço vale ${brl(roi.valueGenerated)}. Cada real pago devolveu ${num(roi.valueGenerated / t.paid, 2)} reais de capacidade de mercado.</p>
    </div>
  </div>
  <div class="call">Os dois números não se somam. O banco de horas é dedicação humana acima do contrato. O ROI é o quanto essa mesma dedicação rendeu a mais por causa das automações. Um pede revisão de capacidade em 2027. O outro mostra que a produtividade já está acima do que a hora de mercado compraria.</div>
  <table>
    <thead><tr><th>Frente</th><th>Horas</th><th>Participação</th><th>Valor rateado</th><th>Commits</th><th>Concentração</th></tr></thead>
    <tbody>
      ${report.projects.map(p => `<tr><td>${p.label}</td><td>${num(p.hours, 0)}</td><td>${pct(p.pct)}</td><td>${brl(p.allocation)}</td><td>${num(p.commits)}</td><td>${p.topAuthor ? `${pct(p.busFactorRisk)} ${person(p.topAuthor).split(' ')[0]}` : '—'}</td></tr>`).join('')}
      <tr class="total"><td>Total</td><td>${num(t.deliveredHours, 0)}</td><td>100%</td><td>${brl(t.paid)}</td><td>${num(t.commits)}</td><td>${num(t.prs)} PRs</td></tr>
    </tbody>
  </table>
  <p class="note">Concentração é a parcela do código da frente escrita pela pessoa mais ativa. Acima de 80% é risco de pessoa-chave para 2027.</p>
`)}
${sheet(3, `
  <p class="eyebrow">02 · PREMISSAS</p>
  <h2>Como os números foram montados</h2>
  <ol class="method">
    <li>Os valores vêm do extrato de janeiro a setembro de 2026 e entram cheios. O líquido estimado desconta R$ 9 mil por mês. Total bruto ${brl(t.paid)}. Total líquido ${brl(t.netEstimate)}.</li>
    <li>A hora com o cliente fica entre R$ 180 e R$ 240. A referência do relatório é R$ 210. As horas cobertas pelo pagamento são o valor do mês dividido pela taxa.</li>
    <li>A dedicação é a jornada combinada, não a soma dos commits. Jose Roberto e Eduarda Weber entram com 180 h/mês (Eduarda a 90 h em agosto e setembro, quando o git dela quase para). Henrique Margarido entra em junho com 160 h/mês. Alex, da NTT Data, entra com 32 h/mês estimadas.</li>
    <li>O git decide a divisão. A jornada de cada pessoa é repartida entre as frentes na proporção dos commits daquele mês. Um mês com menos de um dia de código usa o histórico da pessoa, para um commit isolado não distorcer o mês.</li>
    <li>Entram 80 h/mês que não viram commit: ritos, suporte ao usuário, especificação e QA. 55% ficam em Back-end e Suporte. O restante segue o mix de código do mês. Junho e julho recebem mais 40 h cada da migração de backend registrada no workspace, sem commit de produto.</li>
    <li>O banco de horas do mês é a dedicação menos as horas cobertas pelo pagamento. O saldo acumula de janeiro a setembro, nos três preços da faixa.</li>
    <li>O ROI compara o volume entregue com 18 linhas úteis por hora, taxa conservadora de um time sem IA. O multiplicador medido foi ${num(roi.rawMultiplier, 2)}×. O relatório aplica teto de 3,5× para não transformar volume de código em promessa.</li>
  </ol>
  <div class="grid2" style="margin-top:4mm">
    <div class="card">
      <span class="kicker">REPOSITÓRIOS MEDIDOS</span>
      <ul class="clean">
        <li>Like:Me — likeme-back-end, likeme-front-end, LP-LikeMe</li>
        <li>Colmeia e Banco de Ativos — colmeia---meusroteirosdefault</li>
        <li>Teste de Visibilidade — image_brand_processing</li>
        <li>Back-end e Suporte — caminhos de cliente, Cadence, Twilio e dados dentro de LP-, mais correções operacionais dos outros repositórios</li>
      </ul>
    </div>
    <div class="card">
      <span class="kicker">O QUE O GIT MEDE E O QUE ELE NÃO MEDE</span>
      <p>As sessões de código somam cerca de ${num(report.people.reduce((a, p) => a + p.gitHours, 0), 0)} h. A dedicação usada no banco é ${num(t.deliveredHours, 0)} h. A diferença é arquitetura, rito com o cliente, suporte e o trabalho de quem não commita, como o Alex. Lockfiles, imagens e arquivos gerados ficam fora da conta de linhas.</p>
    </div>
  </div>
`)}
${sheet(4, `
  <p class="eyebrow">03 · FINANCEIRO</p>
  <h2>O que entrou, mês a mês</h2>
  <p class="note" style="margin-top:0">Valor cheio do extrato. O líquido é o mesmo lançamento menos R$ 9 mil. As horas cobertas são o valor dividido por R$ 180 e por R$ 240.</p>
  <table>
    <thead><tr><th>Mês</th><th>Data</th><th>Canal</th><th>Lançamentos</th><th>Bruto</th><th>Líquido</th><th>Horas a R$ 180 / 240</th></tr></thead>
    <tbody>
      ${financeRows}
      <tr class="total"><td>Total</td><td></td><td></td><td></td><td>${brl(t.paid)}</td><td>${brl(t.netEstimate)}</td><td>${num(t.paidHours.max, 0)}–${num(t.paidHours.min, 0)}</td></tr>
    </tbody>
  </table>
  <div class="call">A partir de maio o extrato se repete em três lançamentos: R$ 23 mil, R$ 47 mil e R$ 10 mil. Esse desenho do pagamento fica no comprovante. O rateio deste blueprint segue o esforço de cada frente, medido no mês.</div>
  <h2 style="margin-top:6mm">Horas entregues contra horas cobertas</h2>
  ${stacked(report.monthly, (m, id) => m.hoursByProject[id])}
  ${legend()}
  <p class="note">Cada barra é a dedicação do mês, já repartida. De maio em diante o pagamento cobre 381 h a R$ 210. A menor barra do período, em maio, entrega 472 h.</p>
`)}
${sheet(5, `
  <p class="eyebrow">04 · RATEIO</p>
  <h2>Onde o valor fixo foi parar</h2>
  <p class="note" style="margin-top:0">O pagamento do mês é dividido na proporção das horas daquele mês. A soma de cada linha é o valor cheio do mês.</p>
  ${legend()}
  ${stacked(report.monthly, (m, id) => m.allocation[id])}
  <table>
    <thead><tr><th>Mês</th>${report.projects.map(p => `<th>${p.label}</th>`).join('')}<th>Total</th></tr></thead>
    <tbody>${allocRows}${allocFoot}</tbody>
  </table>
  <p class="note">Like:Me lidera até julho. De agosto em diante Colmeia e Banco de Ativos, junto com Suporte, passam a receber a maior parte. Teste de Visibilidade aparece em blocos: abril–maio, julho e uma cauda de estabilização.</p>
`)}
${sheet(6, `
  <p class="eyebrow">05 · QUEM FEZ</p>
  <h2>Profissionais, cota e o stakeholder</h2>
  <div class="grid2">
    ${report.people.map(personCard).join('')}
  </div>
  <article class="card stake" style="margin-top:4mm">
    <span class="kicker">STAKEHOLDER · FORA DO BANCO DE HORAS</span>
    <h3>${report.stakeholders[0].name} · ${report.stakeholders[0].org}</h3>
    <p style="margin-top:1.5mm">${report.stakeholders[0].note}</p>
  </article>
  <div class="call">Eduarda Weber concentra 93,6% do código da Like:Me, e a presença dela no git cai em agosto. Jose Roberto concentra 87,1% do código de Colmeia e Banco de Ativos, além da arquitetura. Henrique Margarido, a partir de junho, é a segunda mão em dados e inventário. Alex segura a cota de arquitetura da NTT Data sem aparecer no git.</div>
`)}
${sheet(7, `
  <p class="eyebrow">06 · ROADMAP REVERSO</p>
  <h2>O que foi construído, lido de trás para frente</h2>
  <p class="note" style="margin-top:0">Cada linha sai dos commits e dos merges do mês. É o roadmap que o código sustenta, não o que estava no slide de janeiro.</p>
  <div class="cols">
    ${roadmapBlock('likeme')}
    ${roadmapBlock('visibilidade')}
  </div>
`)}
${sheet(8, `
  <p class="eyebrow">06 · ROADMAP REVERSO</p>
  <h2>Colmeia, Banco de Ativos e a camada de suporte</h2>
  <div class="cols">
    ${roadmapBlock('colmeia')}
    ${roadmapBlock('suporte')}
  </div>
`)}
${sheet(9, `
  <p class="eyebrow">07 · BANCO DE HORAS</p>
  <h2>Todo mês entregou mais do que o pagamento cobre</h2>
  <p class="note" style="margin-top:0">Saldo do mês = horas entregues − valor ÷ taxa. O acumulado usa R$ 210. O saldo é hora trabalhada além do retainer, a tratar no orçamento de 2027.</p>
  <table>
    <thead><tr><th>Mês</th><th>Entregue</th><th>A R$ 180</th><th>A R$ 210</th><th>A R$ 240</th><th>Saldo 180</th><th>Saldo 210</th><th>Saldo 240</th><th>Acumulado</th></tr></thead>
    <tbody>
      ${bankRows}
      <tr class="total"><td>Acumulado</td><td>${num(t.deliveredHours, 0)}</td><td>${num(t.paidHours.max, 0)}</td><td>${num(t.paidHours.mid, 0)}</td><td>${num(t.paidHours.min, 0)}</td><td>${num(t.bank.at180, 0)}</td><td>${num(t.bank.at210, 0)}</td><td>${num(t.bank.at240, 0)}</td><td>${num(t.bank.at210, 0)}</td></tr>
    </tbody>
  </table>
  ${lineChart()}
  <div class="grid3" style="margin-top:3mm">
    <div class="card"><span class="kicker">A R$ 180</span><p class="big">${num(t.bank.at180, 0)} h<small>${brl(t.bankValue.at180)}</small></p></div>
    <div class="card"><span class="kicker">A R$ 210 · REFERÊNCIA</span><p class="big">${num(t.bank.at210, 0)} h<small>${brl(t.bankValue.at210)}</small></p></div>
    <div class="card"><span class="kicker">A R$ 240</span><p class="big">${num(t.bank.at240, 0)} h<small>${brl(t.bankValue.at240)}</small></p></div>
  </div>
  <p class="note">O menor saldo mensal, no preço mais baixo da faixa, é maio: ${num(report.monthly[4].bank.at180, 0)} h acima do pagamento. Junho e julho, com Henrique no time e a migração de backend, passam de 220 h de saldo cada um.</p>
`)}
${sheet(10, `
  <p class="eyebrow">08 · ROI</p>
  <h2>A automação entregou o trabalho de um time maior</h2>
  <div class="kpis">
    <div class="kpi"><em>Linhas entregues</em><b>${num(roi.totalAdditions)}</b><span>adições de código útil</span></div>
    <div class="kpi"><em>Multiplicador</em><b>${num(roi.multiplier, 1)}×</b><span>teto sobre ${num(roi.rawMultiplier, 2)}× medidos</span></div>
    <div class="kpi"><em>Horas equivalentes</em><b>${num(roi.equivalentHours, 0)}</b><span>time tradicional, já com teto</span></div>
    <div class="kpi"><em>Custo da hora equivalente</em><b>${brl(roi.costPerEquivalentHour)}</b><span>contra R$ 210 de tabela</span></div>
  </div>
  <div class="grid2" style="margin-top:5mm">
    <div class="card">
      <span class="kicker">O QUE ENTROU NA CONTA</span>
      <ul class="clean">
        <li>Agentes de código na API da Like:Me em julho, com 13 commits próprios e PRs de correção crítica.</li>
        <li>Copiloto e Cadence na área do cliente, de agosto a setembro, lendo repositório, board e dados no mesmo fluxo.</li>
        <li>Consolidação de 68 funções em 10 routers no Colmeia, em fevereiro, encolhendo a superfície que o time opera.</li>
        <li>Insights de imagem no Teste de Visibilidade, ligados em maio e desligados de forma controlada em julho.</li>
      </ul>
    </div>
    <div class="card">
      <span class="kicker">COMO LER O RETORNO</span>
      <p>Um time sem esse ferramental entrega em torno de 18 linhas úteis por hora, já com revisão. Nas ${num(t.deliveredHours, 0)} h dedicadas, isso daria cerca de ${num(t.deliveredHours * 18)} linhas. Saíram ${num(roi.totalAdditions)}. A razão é ${num(roi.rawMultiplier, 2)}×. O teto de 3,5× segura o número que vai para a conversa de orçamento: ${brl(roi.valueGenerated)} de capacidade equivalente, contra ${brl(t.paid)} pagos.</p>
      <p style="margin-top:2mm">A hora equivalente ficou em ${brl(roi.costPerEquivalentHour)}. A hora de dedicação, em ${brl(roi.costPerDeliveredHour)}. As duas cabem abaixo do piso de R$ 180.</p>
    </div>
  </div>
  <div class="call">O ROI não pede desconto. Pede o contrário: a produtividade só se sustenta com o time que opera as automações. Tirar capacidade em 2027 reduz o multiplicador junto.</div>
`)}
${sheet(11, `
  <p class="eyebrow">09 · ORÇAMENTO 2027</p>
  <h2>Três envelopes, a partir da dedicação média de ${num(report.budget2027.avgDelivered, 0)} h/mês</h2>
  <div class="grid3">${scenarioCards}</div>
  <p class="note">Manter os R$ 80 mil abre um buraco de cerca de ${num(gapMonthly, 0)} h por mês no ritmo médio de 2026. Em doze meses, o banco de horas receberia mais cerca de ${num(gapMonthly * 12, 0)} h.</p>
  <h2 style="margin-top:5mm">Onde aumentar o time</h2>
  <ul class="clean">
    <li><strong>Like:Me, uma segunda engenharia sênior.</strong> 93,6% do código está em uma pessoa, e agosto–setembro mostram a frente sem essa presença. O backlog já nomeado — programa GLP-1, Memed, teleconsulta, avatar e nota fiscal — não cabe no retainer atual.</li>
    <li><strong>Colmeia e Banco de Ativos, um engenheiro de produto.</strong> Tira de Jose Roberto a execução do dia a dia (indoor, inventário, exibidores) e devolve a hora dele para arquitetura e para os agentes. Henrique segue como a capacidade de dados que a task force de inventário já usa.</li>
    <li><strong>Teste de Visibilidade, uma decisão explícita.</strong> A frente existe e chegou a Cloud Run, heatmap e insights, mas pesa 3,2% do ano. Ou ganha um dono e um teto de horas em 2027, ou permanece spike, sem ser tratada como produto par do Colmeia.</li>
    <li><strong>Alex, NTT Data, se a pauta for plataforma.</strong> As 32 h/mês cobrem arquitetura e governança. Um ano com camada de dados e cloud pede essa cota maior, ainda sem transformá-lo em capacidade de commit.</li>
    <li><strong>Suporte vira fila com dono.</strong> 18,8% do valor foi operação: reconciliação, deploy, migração, Cadence e copiloto. Em 2027 isso merece meta de resposta, separada da entrega de produto.</li>
    <li><strong>Fabrício Guimarães segue como aceite.</strong> Stakeholder da Like:Me, no rito de prioridade e layout. O planejamento de 2027 marca a cadência com ele. A hora dele não entra no banco.</li>
  </ul>
`)}
${sheet(12, `
  <p class="eyebrow">10 · COMO USAR ESTE BLUEPRINT</p>
  <h2>O que levar para a conversa de orçamento</h2>
  <ul class="clean">
    <li>Reconhecer o banco de ${num(t.bank.at210, 0)} h no cenário de R$ 210, equivalente a ${brl(t.bankValue.at210)}. O caminho recomendado é convertê-lo em capacidade de 2027, no envelope Equilibrar ou Crescer, em vez de faturar o saldo de uma vez.</li>
    <li>Travar a hora de referência dentro da faixa de R$ 180 a R$ 240. A R$ 210, equilibrar a dedicação média pede ${brl(report.budget2027.scenarios[1].monthlyAt210)} por mês.</li>
    <li>Separar produto de operação. Like:Me, Colmeia e Banco de Ativos têm roadmap. Suporte tem fila. Visibilidade precisa de uma decisão de escopo antes de receber meta.</li>
    <li>Tratar a concentração de código como risco de orçamento, não como detalhe de equipe. A segunda pessoa na Like:Me é o item que mais reduz esse risco.</li>
    <li>Manter as automações dentro do desenho do time. O multiplicador de 3,5× depende de quem opera agente, copiloto e Cadence. Cortar essa hora corta o ROI junto.</li>
  </ul>
  <div class="grid3" style="margin-top:6mm">
    <div class="card"><span class="kicker">PAGO</span><p class="big">${brl(t.paid)}<small>líquido ${brl(t.netEstimate)}</small></p></div>
    <div class="card"><span class="kicker">DEDICAÇÃO</span><p class="big">${num(t.deliveredHours, 0)} h<small>${brl(t.bankValue.at210)} além do contrato</small></p></div>
    <div class="card"><span class="kicker">EQUIVALENTE</span><p class="big">${brl(roi.valueGenerated)}<small>com teto de 3,5×</small></p></div>
  </div>
  <p class="note">Premissas editáveis em scripts/report-financeiro/config.json: dedicação mensal, cota do Alex, horas não versionadas e o teto do multiplicador. Gerado em ${new Date(report.generatedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.</p>
`)}
</body>
</html>`

const htmlPath = resolve(outDir, 'report-financeiro-2026.html')
const pdfPath = resolve(outDir, 'report-financeiro-2026.pdf')
writeFileSync(htmlPath, html)
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, htmlPath], { stdio: 'inherit' })
console.log(pdfPath)
